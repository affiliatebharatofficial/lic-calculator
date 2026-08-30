import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, AuditLogger, PermissionManager } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  if (!PermissionManager.canViewAudit(session.role)) {
    return createErrorResponse('FORBIDDEN', 'Your role lacks permission to view audit logs.', 403);
  }

  const entityType = url.searchParams.get('entityType') || undefined;
  const actorId = url.searchParams.get('actorId') || undefined;
  const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 50;

  const logs = AuditLogger.getLogs({ entityType, actorId, limit });
  return createSuccessResponse(logs);
};
