import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAIProvider, RateLimiter } from '@/lib/ai';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    // 1. Rate Limiting
    const ip = clientAddress || '127.0.0.1';
    const rateLimit = RateLimiter.check(ip, { maxRequests: 20, windowMs: 60 * 1000 });
    if (!rateLimit.isAllowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        `AI chat rate limit reached. Please wait ${Math.ceil(rateLimit.resetInMs / 1000)} seconds.`,
        429
      );
    }

    // 2. Parse & Validate
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    if (!body?.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return createErrorResponse('VALIDATION_ERROR', 'Message content is required.', 422);
    }

    if (body.message.length > 2000) {
      return createErrorResponse('VALIDATION_ERROR', 'Message exceeds maximum length of 2,000 characters.', 422);
    }

    // 3. Resolve Provider
    const env = (locals as any)?.runtime?.env || (process as any).env;
    const provider = getAIProvider(env);

    // 4. Generate Answer
    const aiResponse = await provider.answerQuestion({
      message: body.message,
      currentCalculatorId: body.currentCalculatorId ? String(body.currentCalculatorId) : undefined,
      currentPlanCode: body.currentPlanCode ? String(body.currentPlanCode) : undefined,
      currentResultContext: body.currentResultContext ? String(body.currentResultContext) : undefined,
      language: body.language ? String(body.language) : 'en'
    });

    if (!aiResponse.success || !aiResponse.data) {
      return createErrorResponse(
        'INTERNAL_SERVER_ERROR',
        aiResponse.error?.message || 'AI assistant is temporarily unavailable.',
        503
      );
    }

    return createSuccessResponse(aiResponse.data);
  } catch (err: any) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      `Unexpected error in AI chat: ${err?.message || err}`,
      500
    );
  }
};
