/**
 * Admin request guard — resolves runtime env and verifies the signed
 * admin session cookie. Use in every /api/admin/* endpoint and in the
 * frontmatter of server-rendered /admin/* pages.
 */

import { AdminAuth } from './auth';
import type { AdminSession } from './types';

export type AdminEnv = Record<string, string | undefined> & {
  DB?: unknown;
  ENVIRONMENT?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_NAME?: string;
};

/**
 * Merges Cloudflare runtime env (locals.runtime.env) with process.env
 * so endpoints also work in Vitest and local dev.
 */
export function resolveAdminEnv(locals?: unknown): AdminEnv {
  const runtimeEnv = (locals as any)?.runtime?.env as Record<string, unknown> | undefined;
  const env: Record<string, unknown> = { ...(typeof process !== 'undefined' ? process.env : {}) };
  if (runtimeEnv) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value !== undefined) env[key] = value;
    }
  }
  return env as AdminEnv;
}

/**
 * Returns the verified admin session for a request, or null.
 * Sessions are signed stateless tokens, so this works across
 * Cloudflare Worker isolates without shared memory.
 */
export async function getAdminSession(request: Request, locals?: unknown): Promise<AdminSession | null> {
  const env = resolveAdminEnv(locals);
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const token = AdminAuth.extractTokenFromRequest(request);
  if (!token) return null;

  return AdminAuth.verifySessionToken(token, secret);
}
