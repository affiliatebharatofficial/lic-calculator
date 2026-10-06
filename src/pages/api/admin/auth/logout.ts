import type { APIRoute } from 'astro';
import { createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AuditLogger, getAdminSession } from '@/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const session = await getAdminSession(request, locals);
  if (session) {
    AuditLogger.recordEvent({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      eventType: 'LOGOUT',
      targetEntity: 'admin_sessions',
      targetId: session.id,
      ipAddress: clientAddress || '127.0.0.1'
    });
  }

  // Sessions are stateless signed tokens; clearing the cookie ends the session.
  const response = createSuccessResponse({ message: 'Successfully logged out.' });
  response.headers.set('Set-Cookie', AdminAuth.createClearSessionCookie());
  return response;
};
