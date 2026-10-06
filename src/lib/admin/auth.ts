/**
 * Secure Admin Authentication & Session Management
 * Compatible with Cloudflare Workers, D1 and Web Crypto.
 *
 * Passwords: PBKDF2-HMAC-SHA256 (100k iterations, random salt).
 * Sessions: stateless signed tokens (HMAC-SHA256) so they survive
 * across Cloudflare Worker isolates — no in-memory session store.
 */

import type { AdminSession, AdminUser } from './types';

const SESSION_COOKIE_NAME = 'lic_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const PBKDF2_ITERATIONS = 100_000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export class AdminAuth {
  /**
   * Hashes a password with PBKDF2-HMAC-SHA256 and a random salt.
   * Returns a self-describing hash: pbkdf2$<iterations>$<saltB64url>$<hashB64url>
   */
  public static async hashPassword(password: string, customSalt?: string): Promise<{ hash: string; salt: string }> {
    const saltBytes = customSalt ? fromBase64Url(customSalt) : crypto.getRandomValues(new Uint8Array(16));
    const salt = toBase64Url(saltBytes);

    const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes as BufferSource, iterations: PBKDF2_ITERATIONS },
      keyMaterial,
      256
    );

    const hash = `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${toBase64Url(new Uint8Array(derived))}`;
    return { hash, salt };
  }

  /**
   * Constant-time password verification.
   * Supports the current PBKDF2 format and the legacy single-round
   * SHA-256 format (64 hex chars) so previously stored hashes keep working.
   */
  public static async verifyPassword(password: string, storedHash: string, salt?: string): Promise<boolean> {
    if (!storedHash) return false;

    if (storedHash.startsWith('pbkdf2$')) {
      const parts = storedHash.split('$');
      if (parts.length !== 4) return false;
      const iterations = Number(parts[1]);
      const storedSalt = parts[2] ?? '';
      const expected = parts[3] ?? '';
      if (!iterations || !storedSalt || !expected) return false;

      const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
      const derived = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64Url(storedSalt) as BufferSource, iterations },
        keyMaterial,
        256
      );
      return constantTimeEqual(toBase64Url(new Uint8Array(derived)), expected);
    }

    // Legacy format: hex SHA-256(password + salt + pepper), pre-2026-10 hashes.
    const legacySalt = salt || '';
    const data = new TextEncoder().encode(password + legacySalt + 'LIC_CALCULATOR_SECRET_PEPPER');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const legacyHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
    return constantTimeEqual(legacyHash, storedHash);
  }

  private static async hmacKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  }

  /**
   * Creates a signed, stateless session token.
   * Token = base64url(JSON payload) + '.' + base64url(HMAC-SHA256(payload, secret))
   * Requires ADMIN_SESSION_SECRET; throws when not configured (fail closed).
   */
  public static async createSession(
    user: AdminUser,
    sessionSecret: string,
    ipAddress?: string
  ): Promise<{ token: string; session: AdminSession }> {
    if (!sessionSecret) {
      throw new Error('ADMIN_SESSION_SECRET is not configured');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();

    const session: AdminSession = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      expiresAt,
      createdAt: now.toISOString(),
      ipAddress
    };

    const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(session)));
    const key = await AdminAuth.hmacKey(sessionSecret);
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const token = `${payload}.${toBase64Url(new Uint8Array(signature))}`;

    return { token, session };
  }

  /**
   * Verifies a signed session token. Returns the session or null.
   */
  public static async verifySessionToken(token: string, sessionSecret: string): Promise<AdminSession | null> {
    if (!token || !sessionSecret) return null;

    const dot = token.lastIndexOf('.');
    if (dot <= 0) return null;
    const payload = token.slice(0, dot);
    const signature = token.slice(dot + 1);

    try {
      const key = await AdminAuth.hmacKey(sessionSecret);
      const valid = await crypto.subtle.verify(
        'HMAC',
        key,
        fromBase64Url(signature) as BufferSource,
        new TextEncoder().encode(payload)
      );
      if (!valid) return null;

      const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as AdminSession;
      if (!session || !session.userId || !session.email || !session.role) return null;
      if (!AdminAuth.isSessionValid(session)) return null;
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Generates Set-Cookie header string for secure session cookie.
   */
  public static createSessionCookie(token: string, maxAgeSeconds: number = 86400): string {
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';
    return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAgeSeconds}${secureFlag}`;
  }

  /**
   * Generates Set-Cookie header string to clear the session cookie upon logout.
   */
  public static createClearSessionCookie(): string {
    return `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * Extracts session token from incoming Request cookie header.
   */
  public static extractTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('Cookie') || request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';');
    for (const c of cookies) {
      const [name, val] = c.trim().split('=');
      if (name === SESSION_COOKIE_NAME && val) {
        return val;
      }
    }
    return null;
  }

  /**
   * Checks whether a session is valid and unexpired.
   */
  public static isSessionValid(session: AdminSession | null | undefined): boolean {
    if (!session || !session.expiresAt) return false;
    const expiryTime = new Date(session.expiresAt).getTime();
    return expiryTime > Date.now();
  }
}
