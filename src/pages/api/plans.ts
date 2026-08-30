import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';
import {
  MockD1Database,
  type LicPlanRow,
  type CalculatorTypeRow,
  type RuleSetRow
} from '@/lib/db';

export const prerender = false;

// Default pre-seeded database instance for serverless runtime when local mock is needed
let globalDb: MockD1Database | null = null;

export function getOrCreateDatabase(envDb?: any): any {
  if (envDb) {
    return envDb;
  }
  if (!globalDb) {
    globalDb = new MockD1Database();

    // Baseline Plan Records
    const plans: LicPlanRow[] = [
      {
        id: 'plan_914',
        plan_code: '914',
        table_no: 914,
        uin: '512N277V02',
        plan_name: 'LIC New Endowment Plan',
        slug: 'lic-new-endowment-914',
        plan_type: 'endowment',
        status: 'active',
        is_with_profits: 1,
        source_reference: 'LIC Circular Table 914',
        source_title: 'LIC New Endowment Plan Document',
        source_type: 'official_brochure',
        verification_status: 'verified',
        created_at: '2020-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'plan_915',
        plan_code: '915',
        table_no: 915,
        uin: '512N278V02',
        plan_name: 'LIC New Jeevan Anand',
        slug: 'lic-new-jeevan-anand-915',
        plan_type: 'whole-life',
        status: 'active',
        is_with_profits: 1,
        source_reference: 'LIC Circular Table 915',
        source_title: 'LIC New Jeevan Anand Document',
        source_type: 'official_brochure',
        verification_status: 'pending',
        created_at: '2020-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'plan_936',
        plan_code: '936',
        table_no: 936,
        uin: '512N304V02',
        plan_name: 'LIC Jeevan Labh',
        slug: 'lic-jeevan-labh-936',
        plan_type: 'endowment',
        status: 'active',
        is_with_profits: 1,
        source_reference: 'LIC Circular Table 936',
        source_title: 'LIC Jeevan Labh Document',
        source_type: 'official_brochure',
        verification_status: 'pending',
        created_at: '2020-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'plan_945',
        plan_code: '945',
        table_no: 945,
        uin: '512N312V02',
        plan_name: 'LIC Jeevan Umang',
        slug: 'lic-jeevan-umang-945',
        plan_type: 'whole-life',
        status: 'active',
        is_with_profits: 1,
        source_reference: 'LIC Circular Table 945',
        source_title: 'LIC Jeevan Umang Document',
        source_type: 'official_brochure',
        verification_status: 'pending',
        created_at: '2020-01-01',
        updated_at: '2024-01-01'
      }
    ];

    for (const p of plans) {
      globalDb.insertRow('lic_plans', p);
    }

    // Calculator Types
    const calcTypes: CalculatorTypeRow[] = [
      { id: 'calc_premium', calculator_code: 'premium', name: 'Premium Calculator', category: 'general', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'calc_maturity', calculator_code: 'maturity', name: 'Maturity Calculator', category: 'general', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'calc_bonus', calculator_code: 'bonus', name: 'Bonus Calculator', category: 'general', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'calc_surrender', calculator_code: 'surrender', name: 'Surrender Value Calculator', category: 'surrender', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'calc_surrender_loss', calculator_code: 'surrender-loss', name: 'Surrender Loss Calculator', category: 'surrender', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'calc_loan', calculator_code: 'loan', name: 'Policy Loan Calculator', category: 'general', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' }
    ];

    for (const c of calcTypes) {
      globalDb.insertRow('calculator_types', c);
    }

    // Verified Rule Sets for Table 914 (Demonstration & Verified Fixtures)
    const ruleSets: RuleSetRow[] = [
      {
        id: 'ruleset_914_premium',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_premium',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Premium Rates',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          baseRatePerThousand: 49.70,
          minAge: 8,
          maxAge: 55,
          minTerm: 12,
          maxTerm: 35,
          minSumAssured: 100000,
          modeRebates: { yearly: 2.0, 'half-yearly': 1.0, quarterly: 0.0, monthly: 0.0, single: 0.0 },
          highSaRebates: [{ minSa: 500000, rebatePerThousand: 1.5 }],
          gstRateFirstYear: 4.5,
          gstRateRenewal: 2.25,
          riderRatePerThousand: 1.0
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'ruleset_914_maturity',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_maturity',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Maturity & Bonus Rates',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          simpleReversionaryBonusPerThousand: 42.0,
          fabPerThousand: 70.0,
          minFabTerm: 15,
          loyaltyAdditionPerThousand: 0.0,
          guaranteedAdditionPerThousand: 0.0
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'ruleset_914_bonus',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_bonus',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Bonus Rates',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          simpleReversionaryBonusPerThousand: 42.0,
          fabPerThousand: 70.0,
          minFabTerm: 15,
          loyaltyAdditionPerThousand: 0.0,
          guaranteedAdditionPerThousand: 0.0
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'ruleset_914_surrender',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_surrender',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Surrender Factors',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          minPaidYearsToAcquireValue: 2,
          gsvFactors: [
            { completedYears: 2, policyTerm: 20, factor: 0.30 },
            { completedYears: 3, policyTerm: 20, factor: 0.35 },
            { completedYears: 5, policyTerm: 20, factor: 0.50 },
            { completedYears: 10, policyTerm: 20, factor: 0.55 },
            { completedYears: 20, policyTerm: 20, factor: 0.90 }
          ],
          gsvBonusFactors: [
            { completedYears: 2, policyTerm: 20, factor: 0.00 },
            { completedYears: 3, policyTerm: 20, factor: 0.15 },
            { completedYears: 5, policyTerm: 20, factor: 0.17 },
            { completedYears: 20, policyTerm: 20, factor: 0.30 }
          ],
          ssvFactors: [
            { completedYears: 2, policyTerm: 20, factor: 0.40 },
            { completedYears: 3, policyTerm: 20, factor: 0.45 },
            { completedYears: 5, policyTerm: 20, factor: 0.55 },
            { completedYears: 10, policyTerm: 20, factor: 0.70 },
            { completedYears: 20, policyTerm: 20, factor: 1.00 }
          ],
          ssvBonusFactor: 1.0
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'ruleset_914_surrender_loss',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_surrender_loss',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Surrender Loss Rules',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          minPaidYearsToAcquireValue: 2,
          gsvFactors: [
            { completedYears: 5, policyTerm: 20, factor: 0.50 }
          ],
          gsvBonusFactors: [
            { completedYears: 5, policyTerm: 20, factor: 0.17 }
          ],
          ssvFactors: [
            { completedYears: 5, policyTerm: 20, factor: 0.55 }
          ],
          ssvBonusFactor: 1.0
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'ruleset_914_loan',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_loan',
        version: 'SYNTHETIC_2024.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2099-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
        source_title: 'Synthetic Test Loan Rules',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: JSON.stringify({
          maxLoanPercentInForce: 90,
          maxLoanPercentPaidUp: 80,
          annualInterestRate: 9.50,
          minLoanAmount: 5000,
          interestCompounding: 'semi-annual'
        }),
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ];

    for (const r of ruleSets) {
      globalDb.insertRow('rule_sets', r);
    }
  }

  return globalDb;
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const envDb = (locals as any)?.runtime?.env?.DB;
    const db = getOrCreateDatabase(envDb);

    const plansStmt = db.prepare(`SELECT * FROM lic_plans WHERE status = 'active' ORDER BY table_no ASC`);
    const plansRes = await plansStmt.all();
    const plans = plansRes.results || [];

    const ruleSetsStmt = db.prepare(`
      SELECT rs.plan_id, ct.calculator_code, rs.verification_status
      FROM rule_sets rs
      JOIN calculator_types ct ON rs.calculator_type_id = ct.id
      WHERE rs.status = 'active'
    `);
    const ruleSetsRes = await ruleSetsStmt.all();
    const ruleSets = ruleSetsRes.results || [];

    const enrichedPlans = plans.map((p: any) => {
      const verifiedCalculators = ruleSets
        .filter((rs: any) => (rs.plan_id === p.id || rs.plan_id === p.plan_code) && rs.verification_status === 'verified')
        .map((rs: any) => rs.calculator_code);

      return {
        id: p.id,
        planCode: p.plan_code,
        tableNo: p.table_no,
        planName: p.plan_name,
        planType: p.plan_type,
        verificationStatus: p.verification_status,
        hasVerifiedRules: verifiedCalculators.length > 0,
        supportedCalculators: Array.from(new Set(verifiedCalculators))
      };
    });

    return createSuccessResponse(enrichedPlans);
  } catch {
    return createErrorResponse('INTERNAL_SERVER_ERROR', 'Failed to retrieve plans', 500);
  }
};
