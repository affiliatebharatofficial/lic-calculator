import { describe, it, expect, beforeEach } from 'vitest';
import {
  MockD1Database,
  D1RuleProvider,
  type LicPlanRow,
  type CalculatorTypeRow,
  type RuleSetRow
} from '@/lib/db';

describe('D1 Deterministic Rule Selection & Verification Filters', () => {
  let db: MockD1Database;
  let provider: D1RuleProvider;

  beforeEach(() => {
    db = new MockD1Database();
    provider = new D1RuleProvider(db);

    const plan: LicPlanRow = {
      id: 'plan_914',
      plan_code: 'TEST_914',
      table_no: 99914,
      plan_name: 'Test Plan',
      slug: 'test-plan-914',
      plan_type: 'endowment',
      status: 'active',
      is_with_profits: 1,
      verification_status: 'verified',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('lic_plans', plan);

    const calcType: CalculatorTypeRow = {
      id: 'calc_premium',
      calculator_code: 'premium',
      name: 'Premium Calculator',
      category: 'general',
      status: 'active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    };
    db.insertRow('calculator_types', calcType);

    // Old Historical Rule (2015 - 2019)
    const rule2015: RuleSetRow = {
      id: 'rule_2015',
      plan_id: 'plan_914',
      calculator_type_id: 'calc_premium',
      version: 'SYNTHETIC_2015',
      status: 'active',
      effective_from: '2015-01-01',
      effective_to: '2019-12-31',
      policy_year_from: 1,
      policy_year_to: null,
      source_reference: 'TEST DATA — NOT REAL LIC POLICY DATA',
      source_title: 'Historical 2015 Circular',
      source_type: 'test_fixture',
      verification_status: 'verified',
      rule_payload_json: JSON.stringify({ baseRatePerThousand: 45.0 }),
      created_at: '2015-01-01',
      updated_at: '2015-01-01'
    };
    db.insertRow('rule_sets', rule2015);

    // Modern Rule (2020 - 2099)
    const rule2020: RuleSetRow = {
      id: 'rule_2020',
      plan_id: 'plan_914',
      calculator_type_id: 'calc_premium',
      version: 'SYNTHETIC_2020',
      status: 'active',
      effective_from: '2020-01-01',
      effective_to: '2099-12-31',
      policy_year_from: 1,
      policy_year_to: null,
      source_reference: 'TEST DATA — NOT REAL LIC POLICY DATA',
      source_title: 'Modern 2020 Circular',
      source_type: 'test_fixture',
      verification_status: 'verified',
      rule_payload_json: JSON.stringify({ baseRatePerThousand: 50.0 }),
      created_at: '2020-01-01',
      updated_at: '2020-01-01'
    };
    db.insertRow('rule_sets', rule2020);

    // Unverified Pending Rule (Should NEVER be selected in production)
    const unverifiedRule: RuleSetRow = {
      id: 'rule_unverified',
      plan_id: 'plan_914',
      calculator_type_id: 'calc_premium',
      version: 'UNVERIFIED_2025',
      status: 'draft',
      effective_from: '2025-01-01',
      effective_to: null,
      policy_year_from: 1,
      policy_year_to: null,
      source_reference: 'TEST DATA — NOT REAL LIC POLICY DATA',
      source_title: 'Unverified Leak Sheet',
      source_type: 'test_fixture',
      verification_status: 'pending',
      rule_payload_json: JSON.stringify({ baseRatePerThousand: 99.0 }),
      created_at: '2025-01-01',
      updated_at: '2025-01-01'
    };
    db.insertRow('rule_sets', unverifiedRule);
  });

  it('selects historical rule for calculations on older policy dates', async () => {
    const entry = await provider.getRule<{ baseRatePerThousand: number }>({
      planCode: 'TEST_914',
      ruleType: 'premium_rules',
      asOfDate: '2018-05-20'
    });

    expect(entry?.version.version).toBe('SYNTHETIC_2015');
    expect(entry?.data.baseRatePerThousand).toBe(45.0);
  });

  it('selects modern rule for calculations on current dates', async () => {
    const entry = await provider.getRule<{ baseRatePerThousand: number }>({
      planCode: 'TEST_914',
      ruleType: 'premium_rules',
      asOfDate: '2024-05-20'
    });

    expect(entry?.version.version).toBe('SYNTHETIC_2020');
    expect(entry?.data.baseRatePerThousand).toBe(50.0);
  });

  it('strictly rejects unverified or draft rules', async () => {
    const entry = await provider.getRule<{ baseRatePerThousand: number }>({
      planCode: 'TEST_914',
      ruleType: 'premium_rules',
      asOfDate: '2025-06-01',
      version: 'UNVERIFIED_2025'
    });

    // Should return null (not verified/active)
    expect(entry).toBeNull();
  });
});
