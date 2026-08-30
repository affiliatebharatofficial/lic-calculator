import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, AuditLogger } from '@/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, clientAddress }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  const { id } = params;
  if (!id) return createErrorResponse('BAD_REQUEST', 'Rule ID required.', 400);

  const rule = AdminStore.submitForReview(id, session.email);
  if (!rule) {
    return createErrorResponse('BAD_REQUEST', 'Rule not found or not in draft status.', 400);
  }

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'RULE_SUBMITTED_FOR_REVIEW',
    targetEntity: 'managed_rule_sets',
    targetId: id,
    newState: rule as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(rule);
};
