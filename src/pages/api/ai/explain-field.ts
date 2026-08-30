import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAIProvider } from '@/lib/ai';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    if (!body?.fieldName || typeof body.fieldName !== 'string') {
      return createErrorResponse('VALIDATION_ERROR', 'Field name is required.', 422);
    }

    const env = (locals as any)?.runtime?.env || (process as any).env;
    const provider = getAIProvider(env);

    const response = await provider.explainField({
      fieldName: body.fieldName,
      calculatorId: body.calculatorId ? String(body.calculatorId) : undefined,
      planCode: body.planCode ? String(body.planCode) : undefined,
      language: body.language ? String(body.language) : 'en'
    });

    if (!response.success || !response.data) {
      return createErrorResponse(
        'INTERNAL_SERVER_ERROR',
        response.error?.message || 'Field explanation is temporarily unavailable.',
        503
      );
    }

    return createSuccessResponse({ explanation: response.data });
  } catch (err: any) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      `Unexpected error: ${err?.message || err}`,
      500
    );
  }
};
