import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AuditLogger, resolveAdminEnv } from '@/lib/admin';
import type { AdminUser } from '@/lib/admin';

export const prerender = false;

interface AdminUserRow {
  id: string;
  email: string;
  password_hash: string;
  salt: string | null;
  name: string;
  role: AdminUser['role'];
  status: string;
}

/**
 * Looks up an active admin user in D1 (admin_users_v2).
 * Returns null when D1 is unavailable or no matching user exists.
 */
async function findD1AdminUser(db: unknown, email: string): Promise<AdminUserRow | null> {
  const database = db as { prepare?: (sql: string) => any } | null;
  if (!database || typeof database.prepare !== 'function') return null;

  try {
    const row = await database
      .prepare('SELECT id, email, password_hash, salt, name, role, status FROM admin_users_v2 WHERE lower(email) = lower(?) LIMIT 1')
      .bind(email)
      .first();
    if (!row || row.status !== 'active') return null;
    return row as AdminUserRow;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  try {
    const env = resolveAdminEnv(locals);
    const sessionSecret = env.ADMIN_SESSION_SECRET;
    if (!sessionSecret) {
      return createErrorResponse(
        'SERVICE_UNAVAILABLE',
        'Admin authentication is not configured. Set the ADMIN_SESSION_SECRET secret to enable admin login.',
        503
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    const { email, password } = body ?? {};
    if (!email || !password) {
      return createErrorResponse('VALIDATION_ERROR', 'Email and password are required.', 422);
    }

    let user: AdminUser | null = null;

    // Path 1: D1-backed admin users (admin_users_v2), PBKDF2 password hashes.
    const dbUser = await findD1AdminUser(env.DB, String(email));
    if (dbUser) {
      const ok = await AdminAuth.verifyPassword(String(password), dbUser.password_hash, dbUser.salt || undefined);
      if (ok) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }

    // Path 2: bootstrap admin from environment secrets (used until D1 users exist).
    if (!user && env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH) {
      if (String(email).toLowerCase() === env.ADMIN_EMAIL.toLowerCase()) {
        const ok = await AdminAuth.verifyPassword(String(password), env.ADMIN_PASSWORD_HASH);
        if (ok) {
          user = {
            id: 'env_admin',
            email: env.ADMIN_EMAIL,
            name: env.ADMIN_NAME || 'Administrator',
            role: 'super_admin',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }
    }

    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Invalid administrator credentials.', 401);
    }

    const ip = clientAddress || '127.0.0.1';
    const { token, session } = await AdminAuth.createSession(user, sessionSecret, ip);

    AuditLogger.recordEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      eventType: 'LOGIN_SUCCESS',
      targetEntity: 'admin_users',
      targetId: user.id,
      ipAddress: ip
    });

    const response = createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expiresAt: session.expiresAt
    });

    response.headers.set('Set-Cookie', AdminAuth.createSessionCookie(token));
    return response;
  } catch (err: any) {
    return createErrorResponse('INTERNAL_SERVER_ERROR', `Login failed: ${err?.message || err}`, 500);
  }
};
