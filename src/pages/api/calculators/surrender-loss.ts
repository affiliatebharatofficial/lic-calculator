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

    // 1. Calculate Surrender Loss
    const apiResult = await executeCalculatorApi(
      ENGINES.surrenderLoss,
      provider,
      body,
      {
        planCode,
        ruleType: 'surrender_rules',
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

    // 2. Compute 3-way quantitative decision comparison if annualPremium is provided
    let comparison = null;
    const surrenderRule = await provider.getRule<any>({
      planCode,
      ruleType: 'surrender_rules',
      asOfDate: calculationDate
    });
    const maturityRule = await provider.getRule<any>({
      planCode,
      ruleType: 'maturity_rules',
      asOfDate: calculationDate
    });

    if (surrenderRule && maturityRule && body.totalPremiumsPaid && body.policyTerm && body.completedYears) {
      const annualPremium = Number(body.annualPremium || (Number(body.totalPremiumsPaid) / Math.max(1, Number(body.completedYears))));
      const compResult = ENGINES.comparison.compare(
        {
          planTableNo: planCode,
          sumAssured: Number(body.sumAssured || 500000),
          policyTerm: Number(body.policyTerm),
          completedYears: Number(body.completedYears),
          totalPremiumsPaid: Number(body.totalPremiumsPaid),
          annualPremium,
          accruedBonus: Number(body.accruedBonus || 0)
        },
        surrenderRule,
        maturityRule
      );
      comparison = compResult.result;
    }

    return createSuccessResponse({
      ...apiResult.data,
      comparison
    });
  } catch {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected server error occurred during surrender loss calculation',
      500
    );
  }
};
