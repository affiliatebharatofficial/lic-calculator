import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminStore, AuditLogger, PermissionManager, getAdminSession } from '@/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, clientAddress , locals }) => {
  const session = await getAdminSession(request, locals);
  if (!session) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  if (!PermissionManager.hasPermission(session.role, 'sources:verify')) {
    return createErrorResponse('FORBIDDEN', 'Your role lacks permission to verify sources.', 403);
  }

  const { id } = params;
  if (!id) return createErrorResponse('BAD_REQUEST', 'Source ID required.', 400);

  const source = AdminStore.verifySource(id, session.email);
  if (!source) {
    return createErrorResponse('NOT_FOUND', 'Source not found.', 404);
  }

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'SOURCE_VERIFIED',
    targetEntity: 'rule_sources',
    targetId: id,
    newState: source as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(source);
};
