import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  const stats = AdminStore.getDashboardStats();
  return createSuccessResponse(stats);
};
