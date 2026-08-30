import { describe, it, expect } from 'vitest';
import {
  MockD1Database,
  D1RuleProvider,
  type LicPlanRow,
  type CalculatorTypeRow,
  type RuleSetRow
} from '@/lib/db';
import {
  ENGINES,
  executeCalculatorApi,
  formatMoneyINR
} from '@/lib/calculators';

describe('Phase 4 End-to-End D1 Integration Pipeline', () => {
  it('executes full pipeline: D1 Database -> D1RuleProvider -> PremiumCalculator -> Structured Result', async () => {
    // 1. Setup D1 Database with verified synthetic plan and rules
    const db = new MockD1Database();

    const plan: LicPlanRow = {
      id: 'plan_e2e_914',
      plan_code: '914',
      table_no: 914,
      plan_name: 'LIC New Endowment Plan',
      slug: 'lic-new-endowment-914',
      plan_type: 'endowment',
      status: 'active',
      is_with_profits: 1,
      source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
      source_title: 'Synthetic Test Document',
      source_type: 'test_fixture',
      verification_status: 'verified',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('lic_plans', plan);

    const calcType: CalculatorTypeRow = {
      id: 'calc_premium',
      calculator_code: 'premium',
      name: 'LIC Premium Calculator',
      category: 'general',
      status: 'active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('calculator_types', calcType);

    const ruleSet: RuleSetRow = {
      id: 'ruleset_e2e_premium_914',
      plan_id: 'plan_e2e_914',
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
    };
    db.insertRow('rule_sets', ruleSet);

    // 2. Initialize D1-backed RuleProvider
    const provider = new D1RuleProvider(db);

    // 3. Execute through API pipeline
    const apiResponse = await executeCalculatorApi(
      ENGINES.premium,
      provider,
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly',
        includeAccidentalRider: false
      },
      {
        planCode: '914',
        ruleType: 'premium_rules',
        asOfDate: '2024-06-15'
      }
    );

    // 4. Assert calculation executed authoritatively and deterministically
    expect(apiResponse.success).toBe(true);
    expect(apiResponse.data).toBeDefined();
    expect(apiResponse.data?.calculatorId).toBe('lic-premium-calculator');
    expect(formatMoneyINR(apiResponse.data!.primaryAmount)).toBe('₹24,681');
    expect(apiResponse.data?.breakdown.items.length).toBeGreaterThan(2);
    expect(apiResponse.data?.ruleVersion.version).toBe('SYNTHETIC_2024.1');
  });

  it('executes full pipeline: D1 Database -> D1RuleProvider -> SurrenderCalculator -> Structured Result', async () => {
    const db = new MockD1Database();

    const plan: LicPlanRow = {
      id: 'plan_e2e_914',
      plan_code: '914',
      table_no: 914,
      plan_name: 'LIC New Endowment Plan',
      slug: 'lic-new-endowment-914',
      plan_type: 'endowment',
      status: 'active',
      is_with_profits: 1,
      source_reference: 'TEST FIXTURE — NOT REAL LIC DATA',
      source_title: 'Synthetic Test Document',
      source_type: 'test_fixture',
      verification_status: 'verified',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('lic_plans', plan);

    const calcType: CalculatorTypeRow = {
      id: 'calc_surrender',
      calculator_code: 'surrender',
      name: 'LIC Surrender Value Calculator',
      category: 'surrender',
      status: 'active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('calculator_types', calcType);

    const ruleSet: RuleSetRow = {
      id: 'ruleset_e2e_surrender_914',
      plan_id: 'plan_e2e_914',
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
        gsvFactors: [{ completedYears: 5, policyTerm: 20, factor: 0.50 }],
        gsvBonusFactors: [{ completedYears: 5, policyTerm: 20, factor: 0.17 }],
        ssvFactors: [{ completedYears: 5, policyTerm: 20, factor: 0.55 }],
        ssvBonusFactor: 1.0
      }),
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('rule_sets', ruleSet);

    const provider = new D1RuleProvider(db);

    const apiResponse = await executeCalculatorApi(
      ENGINES.surrender,
      provider,
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        accruedBonus: 0
      },
      {
        planCode: '914',
        ruleType: 'surrender_rules',
        asOfDate: '2024-06-15'
      }
    );

    expect(apiResponse.success).toBe(true);
    expect(apiResponse.data?.calculatorId).toBe('lic-surrender-value-calculator');
    expect(formatMoneyINR(apiResponse.data!.primaryAmount)).toBe('₹68,750');
  });
});
