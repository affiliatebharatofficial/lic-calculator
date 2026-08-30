import { describe, it, expect, beforeEach } from 'vitest';
import {
  MockD1Database,
  D1RuleProvider,
  type LicPlanRow,
  type CalculatorTypeRow,
  type RuleSetRow
} from '@/lib/db';

describe('D1RuleProvider Architecture & Lookups', () => {
  let db: MockD1Database;
  let provider: D1RuleProvider;

  beforeEach(() => {
    db = new MockD1Database();
    provider = new D1RuleProvider(db);

    // Seed mock data
    const plan: LicPlanRow = {
      id: 'plan_test_914',
      plan_code: 'TEST_914',
      table_no: 99914,
      plan_name: 'Synthetic Endowment Test Plan',
      slug: 'synthetic-endowment-914',
      plan_type: 'endowment',
      status: 'active',
      is_with_profits: 1,
      source_reference: 'TEST FIXTURE 001',
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
      id: 'ruleset_test_premium',
      plan_id: 'plan_test_914',
      calculator_type_id: 'calc_premium',
      version: 'SYNTHETIC_2024.1',
      status: 'active',
      effective_from: '2020-01-01',
      effective_to: '2099-12-31',
      policy_year_from: 1,
      policy_year_to: null,
      source_reference: 'TEST DATA — NOT REAL LIC POLICY DATA',
      source_title: 'Synthetic Premium Rule Document',
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
        gstRateRenewal: 2.25
      }),
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('rule_sets', ruleSet);
  });

  it('retrieves active verified rule from D1 and maps to RuleEntry', async () => {
    const entry = await provider.getRule<{ baseRatePerThousand: number }>({
      planCode: 'TEST_914',
      ruleType: 'premium_rules',
      asOfDate: '2024-06-15'
    });

    expect(entry).not.toBeNull();
    expect(entry?.version.planCode).toBe('TEST_914');
    expect(entry?.version.version).toBe('SYNTHETIC_2024.1');
    expect(entry?.version.status).toBe('active');
    expect(entry?.data.baseRatePerThousand).toBe(49.70);
  });

  it('returns null when rule is not found in D1', async () => {
    const entry = await provider.getRule({
      planCode: 'UNKNOWN_PLAN',
      ruleType: 'premium_rules',
      asOfDate: '2024-06-15'
    });

    expect(entry).toBeNull();
  });
});
