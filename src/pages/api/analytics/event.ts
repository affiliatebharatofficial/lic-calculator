import type { APIRoute } from 'astro';
import { PrivacyPreservingTracker } from '@/lib/analytics';
import { GlobalRateLimiter, RequestInputValidator, getSecurityHeaders } from '@/lib/security';

export const POST: APIRoute = async ({ request }) => {
  const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';
  const rateLimit = GlobalRateLimiter.check('calculator', clientIp);

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many analytics events' }), {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(rateLimit.resetSeconds),
        ...getSecurityHeaders()
      }
    });
  }

  const { data, error } = await RequestInputValidator.parseJsonBody<Record<string, unknown>>(request);
  if (error || !data) {
    return new Response(JSON.stringify({ error: error || 'Invalid payload' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...getSecurityHeaders() }
    });
  }

  const sanitized = PrivacyPreservingTracker.sanitizeEvent(data);
  if (!sanitized) {
    return new Response(JSON.stringify({ error: 'Invalid event format' }), {
      status: 422,
      headers: { 'content-type': 'application/json', ...getSecurityHeaders() }
    });
  }

  PrivacyPreservingTracker.record(sanitized);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', ...getSecurityHeaders() }
  });
};
