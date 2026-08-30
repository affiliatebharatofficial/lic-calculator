import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, AuditLogger, PermissionManager } from '@/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, clientAddress }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  if (!PermissionManager.canPublishRule(session.role)) {
    return createErrorResponse('FORBIDDEN', 'Your role lacks permission to publish rules to production.', 403);
  }

  const { id } = params;
  if (!id) return createErrorResponse('BAD_REQUEST', 'Rule ID required.', 400);

  const result = AdminStore.publishRule(id, session.email);
  if (!result.success || !result.rule) {
    return createErrorResponse('VALIDATION_ERROR', result.error || 'Failed to publish rule.', 422);
  }

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'RULE_PUBLISHED_TO_PRODUCTION',
    targetEntity: 'managed_rule_sets',
    targetId: id,
    newState: result.rule as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(result.rule);
};
