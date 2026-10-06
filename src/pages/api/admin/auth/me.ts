import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAdminSession, ROLE_PERMISSIONS } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const session = await getAdminSession(request, locals);
  if (!session) {
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
