import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminStore, getAdminSession } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request , locals }) => {
  const session = await getAdminSession(request, locals);
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  const stats = AdminStore.getDashboardStats();
  return createSuccessResponse(stats);
};
