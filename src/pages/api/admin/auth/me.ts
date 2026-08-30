import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, ROLE_PERMISSIONS } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  if (!token) {
    return createErrorResponse('UNAUTHORIZED', 'No active admin session found.', 401);
  }

  const session = AdminStore.getSession(token);
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session expired or invalid.', 401);
  }

  return createSuccessResponse({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role
    },
    permissions: ROLE_PERMISSIONS[session.role],
    expiresAt: session.expiresAt
  });
};
