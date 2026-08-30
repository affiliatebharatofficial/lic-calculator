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

  const planCode = url.searchParams.get('planCode') || undefined;
  const calculatorCode = url.searchParams.get('calculatorCode') || undefined;
  const status = url.searchParams.get('status') || undefined;

  const rules = AdminStore.listRules({ planCode, calculatorCode, status });
  return createSuccessResponse(rules);
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  if (!PermissionManager.canCreateRule(session.role)) {
    return createErrorResponse('FORBIDDEN', 'Your role lacks permission to create rules.', 403);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
  }

  const result = AdminStore.createRule({
    planCode: String(body.planCode),
    tableNo: Number(body.tableNo),
    calculatorCode: String(body.calculatorCode),
    version: String(body.version),
    calculationStrategy: String(body.calculationStrategy),
    effectiveFrom: String(body.effectiveFrom),
    effectiveTo: body.effectiveTo ? String(body.effectiveTo) : undefined,
    sourceId: body.sourceId ? String(body.sourceId) : undefined,
    sourceTitle: body.sourceTitle ? String(body.sourceTitle) : undefined,
    rulePayload: body.rulePayload || {},
    notes: body.notes ? String(body.notes) : undefined,
    createdBy: session.email
  });

  if (!result.success || !result.rule) {
    return createErrorResponse('VALIDATION_ERROR', result.error || 'Failed to create rule.', 422);
  }

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'RULE_CREATED',
    targetEntity: 'managed_rule_sets',
    targetId: result.rule.id,
    newState: result.rule as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(result.rule, 201);
};
