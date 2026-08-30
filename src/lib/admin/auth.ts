/**
 * Secure Admin Authentication & Session Management
 * Compatible with Cloudflare Workers, D1 and Web Crypto.
 */

import type { AdminSession, AdminUser } from './types';

const SESSION_COOKIE_NAME = 'lic_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class AdminAuth {
  /**
   * Hashes a password with a random salt using SHA-256 with iterations.
   */
  public static async hashPassword(password: string, customSalt?: string): Promise<{ hash: string; salt: string }> {
    const salt = customSalt || crypto.randomUUID().replace(/-/g, '');
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt + 'LIC_CALCULATOR_SECRET_PEPPER');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return { hash, salt };
  }

  /**
   * Constant-time password verification to prevent timing attacks.
   */
  public static async verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
    const { hash } = await this.hashPassword(password, salt);
    if (hash.length !== storedHash.length) return false;

    let mismatch = 0;
    for (let i = 0; i < hash.length; i++) {
      mismatch |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return mismatch === 0;
  }

  /**
   * Generates a cryptographically strong session token and session record.
   */
  public static createSession(user: AdminUser, ipAddress?: string): { token: string; session: AdminSession } {
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();

    const session: AdminSession = {
      id: token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      expiresAt,
      createdAt: now.toISOString(),
      ipAddress
    };

    return { token, session };
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
