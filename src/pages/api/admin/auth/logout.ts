import type { APIRoute } from 'astro';
import { createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore, AuditLogger } from '@/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  if (token) {
    const session = AdminStore.getSession(token);
    if (session) {
      AuditLogger.recordEvent({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        eventType: 'LOGOUT',
        targetEntity: 'admin_sessions',
        targetId: token,
        ipAddress: clientAddress || '127.0.0.1'
      });
    }
    AdminStore.deleteSession(token);
  }

  const response = createSuccessResponse({ message: 'Successfully logged out.' });
  response.headers.set('Set-Cookie', AdminAuth.createClearSessionCookie());
  return response;
};
