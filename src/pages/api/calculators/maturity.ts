import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { ENGINES, executeCalculatorApi } from '@/lib/calculators';
import { D1RuleProvider } from '@/lib/db';
import { getOrCreateDatabase } from '@/pages/api/plans';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    const envDb = (locals as any)?.runtime?.env?.DB;
    const db = getOrCreateDatabase(envDb);
    const provider = new D1RuleProvider(db);

    const planCode = String(body?.planTableNo || '914');
    const calculationDate = String(body?.calculationDate || new Date().toISOString().split('T')[0]);

    const apiResult = await executeCalculatorApi(
      ENGINES.maturity,
      provider,
      body,
      {
        planCode,
        ruleType: 'maturity_rules',
        asOfDate: calculationDate
      }
    );

    if (!apiResult.success) {
      const isMissingRule = apiResult.errors?.some((e) => e.code === 'RULE_NOT_FOUND' || e.code === 'RULE_NOT_VERIFIED');
      const status = isMissingRule ? 404 : 422;
      const message = isMissingRule
        ? "We don't currently have a verified rule set for this policy calculation."
        : 'Validation or calculation failed.';

      const fieldErrors = (apiResult.errors || []).map((err) => ({
        field: err.field || 'general',
        message: err.message
      }));

      return createErrorResponse('VALIDATION_ERROR', message, status, fieldErrors);
    }

    return createSuccessResponse(apiResult.data);
  } catch {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected server error occurred during maturity calculation',
      500
    );
  }
};
