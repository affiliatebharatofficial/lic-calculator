import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { AdminAuth, AdminStore } from '@/lib/admin';
import { ENGINES, executeCalculatorApi } from '@/lib/calculators';
import { D1RuleProvider } from '@/lib/db';
import { getOrCreateDatabase } from '@/pages/api/plans';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const token = AdminAuth.extractTokenFromRequest(request);
  const session = token ? AdminStore.getSession(token) : null;
  if (!session || !AdminAuth.isSessionValid(session)) {
    return createErrorResponse('UNAUTHORIZED', 'Admin session required.', 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
  }

  const { calculatorCode, input } = body;
  if (!calculatorCode || !input) {
    return createErrorResponse('VALIDATION_ERROR', 'calculatorCode and input are required for preview.', 422);
  }

  try {
    const envDb = (locals as any)?.runtime?.env?.DB;
    const db = getOrCreateDatabase(envDb);
    const provider = new D1RuleProvider(db);

    const calcKey = (calculatorCode as keyof typeof ENGINES) || 'surrender';
    const engine = ENGINES[calcKey];
    if (!engine) {
      return createErrorResponse('BAD_REQUEST', `Unsupported preview calculator code '${calculatorCode}'.`, 400);
    }

    const ruleType = calcKey === 'premium' ? 'premium_rules' : calcKey === 'maturity' ? 'maturity_rules' : calcKey === 'loan' ? 'loan_rules' : 'surrender_rules';

    const normalizedInput = {
      planTableNo: Number(input.planTableNo || 914),
      sumAssured: Number(input.sumAssured || 500000),
      policyTerm: Number(input.policyTerm || 20),
      completedYears: Number(input.completedYears || 5),
      totalPremiumsPaid: Number(input.totalPremiumsPaid || 125000),
      accruedBonus: Number(input.accruedBonus || 0),
      age: Number(input.age || 30),
      surrenderValue: Number(input.surrenderValue || 200000),
      paymentFrequency: input.paymentFrequency || 'yearly',
      policyStatus: input.policyStatus || 'in_force'
    };

    const apiResult = await executeCalculatorApi(
      engine as any,
      provider,
      normalizedInput,
      {
        planCode: String(normalizedInput.planTableNo),
        ruleType,
        asOfDate: new Date().toISOString().split('T')[0]
      }
    );

    if (!apiResult.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Preview validation failed', 422, apiResult.errors as any);
    }

    return createSuccessResponse({
      previewStatus: 'success',
      calculationResult: apiResult.data
    });
  } catch (err: any) {
    return createErrorResponse('INTERNAL_SERVER_ERROR', `Preview calculation failed: ${err?.message || err}`, 500);
  }
};
