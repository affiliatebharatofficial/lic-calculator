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

  const { id } = params;
  if (!id) return createErrorResponse('BAD_REQUEST', 'Rule ID required.', 400);

  const existingRule = AdminStore.getRuleById(id);
  if (!existingRule) {
    return createErrorResponse('NOT_FOUND', 'Rule not found.', 404);
  }

  // Separation of duties check
  if (!PermissionManager.canVerifyRule(session.role, existingRule.createdBy, session.email)) {
    return createErrorResponse(
      'FORBIDDEN',
      'Separation of Duties: Rule creators cannot verify their own rules. A distinct reviewer or super admin is required.',
      403
    );
  }

  const result = AdminStore.verifyRule(id, session.email);
  if (!result.success || !result.rule) {
    return createErrorResponse('VALIDATION_ERROR', result.error || 'Failed to verify rule.', 422);
  }

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'RULE_VERIFIED',
    targetEntity: 'managed_rule_sets',
    targetId: id,
    newState: result.rule as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(result.rule);
};
