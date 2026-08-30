import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAIProvider, RateLimiter } from '@/lib/ai';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    // 1. Rate Limiting Check
    const ip = clientAddress || '127.0.0.1';
    const rateLimit = RateLimiter.check(ip, { maxRequests: 25, windowMs: 60 * 1000 });
    if (!rateLimit.isAllowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        `AI request rate limit reached. Please wait ${Math.ceil(rateLimit.resetInMs / 1000)} seconds.`,
        429
      );
    }

    // 2. Parse & Validate Payload
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    if (!body?.calculatorId || !body?.primaryResult) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Missing required calculation fields: calculatorId and primaryResult are required.',
        422
      );
    }

    // 3. Resolve Provider from Cloudflare Runtime Secrets
    const env = (locals as any)?.runtime?.env || (process as any).env;
    const provider = getAIProvider(env);

    // 4. Generate Explanation
    const aiResponse = await provider.generateExplanation({
      calculatorId: String(body.calculatorId),
      planName: body.planName ? String(body.planName) : undefined,
      planCode: body.planCode ? String(body.planCode) : undefined,
      primaryResult: String(body.primaryResult),
      breakdownItems: Array.isArray(body.breakdownItems) ? body.breakdownItems : [],
      assumptions: Array.isArray(body.assumptions) ? body.assumptions : [],
      warnings: Array.isArray(body.warnings) ? body.warnings : [],
      ruleVersion: body.ruleVersion ? String(body.ruleVersion) : undefined,
      sourceReference: body.sourceReference ? String(body.sourceReference) : undefined,
      userQuestion: body.userQuestion ? String(body.userQuestion) : undefined,
      language: body.language ? String(body.language) : 'en'
    });

    if (!aiResponse.success || !aiResponse.data) {
      return createErrorResponse(
        'INTERNAL_SERVER_ERROR',
        aiResponse.error?.message || 'AI explanation is temporarily unavailable.',
        503
      );
    }

    return createSuccessResponse(aiResponse.data);
  } catch (err: any) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      `Unexpected error while generating AI explanation: ${err?.message || err}`,
      500
    );
  }
};
