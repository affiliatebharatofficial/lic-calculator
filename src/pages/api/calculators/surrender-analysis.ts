import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { ENGINES } from '@/lib/calculators';
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

    // 1. Fetch Surrender Rules
    const surrenderRuleEntry = await provider.getRule<any>({
      planCode,
      ruleType: 'surrender_rules',
      asOfDate: calculationDate
    });

    if (!surrenderRuleEntry || !surrenderRuleEntry.data) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        "We don't currently have a verified rule set for this policy calculation.",
        404,
        [{ field: 'planTableNo', message: 'No verified active surrender rule available for this plan.' }]
      );
    }

    // 2. Fetch Maturity Rules (optional for future continue projection)
    const maturityRuleEntry = await provider.getRule<any>({
      planCode,
      ruleType: 'maturity_rules',
      asOfDate: calculationDate
    });

    // 3. Validation
    const engine = ENGINES.surrenderAnalysis;
    const validation = engine.validate(body);
    if (!validation.isValid) {
      const fieldErrors = validation.errors.map((e: any) => ({
        field: e.field || 'general',
        message: e.message
      }));
      return createErrorResponse('VALIDATION_ERROR', 'Validation failed for surrender analysis parameters.', 422, fieldErrors);
    }

    // 4. Calculate
    const calcResult = engine.calculate(body, {
      surrenderRules: surrenderRuleEntry.data,
      maturityRules: maturityRuleEntry?.data || undefined
    });

    return createSuccessResponse({
      ...calcResult,
      ruleVersion: surrenderRuleEntry.version
    });
  } catch (err: any) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      `An unexpected server error occurred: ${err?.message || err}`,
      500
    );
  }
};
