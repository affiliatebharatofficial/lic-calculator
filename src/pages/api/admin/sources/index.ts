import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, AuditLogger, PermissionManager } from '@/lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  const sources = AdminStore.listSources();
  return createSuccessResponse(sources);
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  if (!PermissionManager.hasPermission(session.role, 'sources:create')) {
    return createErrorResponse('FORBIDDEN', 'Your role lacks permission to create sources.', 403);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
  }

  if (!body.sourceTitle || !body.sourceType || !body.publisher || !body.sourceReference) {
    return createErrorResponse('VALIDATION_ERROR', 'Missing required source metadata fields.', 422);
  }

  const source = AdminStore.createSource({
    sourceTitle: String(body.sourceTitle),
    sourceType: body.sourceType,
    publisher: String(body.publisher),
    publicationDate: body.publicationDate ? String(body.publicationDate) : undefined,
    effectiveDate: body.effectiveDate ? String(body.effectiveDate) : undefined,
    sourceReference: String(body.sourceReference),
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
    documentRef: body.documentRef ? String(body.documentRef) : undefined,
    verificationStatus: 'pending',
    notes: body.notes ? String(body.notes) : undefined,
    createdBy: session.email
  });

  AuditLogger.recordEvent({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    eventType: 'SOURCE_CREATED',
    targetEntity: 'rule_sources',
    targetId: source.id,
    newState: source as any,
    ipAddress: clientAddress || '127.0.0.1'
  });

  return createSuccessResponse(source, 201);
};
