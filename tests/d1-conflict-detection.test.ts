import { describe, it, expect, beforeEach } from 'vitest';
import {
  MockD1Database,
  RuleService,
  validateRuleSetConflict,
  type RuleSetRow
} from '@/lib/db';

describe('D1 Rule Conflict Detection & Lifecycle Workflow', () => {
  let db: MockD1Database;
  let ruleService: RuleService;

  beforeEach(() => {
    db = new MockD1Database();
    ruleService = new RuleService(db);
  });

  it('detects overlapping active date ranges for same plan and calculator', () => {
    const existing: RuleSetRow[] = [
      {
        id: 'rule_1',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_premium',
        version: '2020.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2024-12-31',
        policy_year_from: 1,
        policy_year_to: null,
        source_reference: 'TEST SOURCE 1',
        source_title: 'Title 1',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: '{}',
        created_at: '2020-01-01',
        updated_at: '2020-01-01'
      }
    ];

    const candidate: Partial<RuleSetRow> = {
      id: 'rule_2',
      plan_id: 'plan_914',
      calculator_type_id: 'calc_premium',
      version: '2022.1',
      status: 'active',
      effective_from: '2023-01-01', // Overlaps with 2020-2024
      effective_to: '2026-12-31',
      policy_year_from: 1,
      policy_year_to: null,
      source_reference: 'TEST SOURCE 2',
      rule_payload_json: '{}'
    };

    const errors = validateRuleSetConflict(candidate, existing);
    expect(errors.some((e) => e.code === 'OVERLAPPING_EFFECTIVE_DATES')).toBe(true);
  });

  it('detects duplicate version string for same plan', () => {
    const existing: RuleSetRow[] = [
      {
        id: 'rule_1',
        plan_id: 'plan_914',
        calculator_type_id: 'calc_premium',
        version: '2020.1',
        status: 'active',
        effective_from: '2020-01-01',
        effective_to: '2022-12-31',
        source_reference: 'TEST SOURCE 1',
        source_title: 'Title 1',
        source_type: 'test_fixture',
        verification_status: 'verified',
        rule_payload_json: '{}',
        created_at: '2020-01-01',
        updated_at: '2020-01-01'
      }
    ];

    const candidate: Partial<RuleSetRow> = {
      id: 'rule_duplicate',
      plan_id: 'plan_914',
      calculator_type_id: 'calc_premium',
      version: '2020.1', // Duplicate version
      status: 'draft',
      effective_from: '2023-01-01',
      source_reference: 'TEST SOURCE 2',
      rule_payload_json: '{}'
    };

    const errors = validateRuleSetConflict(candidate, existing);
    expect(errors.some((e) => e.code === 'DUPLICATE_VERSION')).toBe(true);
  });

  it('manages full lifecycle: Draft -> Verify -> Activate with audit logging', async () => {
    // 1. Create Draft
    const createRes = await ruleService.createRuleDraft({
      planId: 'plan_914',
      calculatorTypeId: 'calc_premium',
      version: '2024.1',
      effectiveFrom: '2024-01-01',
      effectiveTo: '2099-12-31',
      sourceReference: 'LIC Circular Ref 2024/01',
      sourceTitle: 'New Endowment Official Rule Sheet',
      sourceType: 'circular',
      rulePayload: { baseRatePerThousand: 49.70 },
      actor: 'actuary_admin'
    });

    expect(createRes.errors).toHaveLength(0);
    expect(createRes.ruleId).toBeDefined();

    // 2. Verify
    await ruleService.verifyRule({
      ruleId: createRes.ruleId,
      verifiedBy: 'senior_actuary',
      verificationNotes: 'Verified against LIC Gazette circular 2024/01',
      status: 'verified'
    });

    // 3. Activate
    const activateRes = await ruleService.activateRule({
      ruleId: createRes.ruleId,
      actor: 'system_admin'
    });

    expect(activateRes.success).toBe(true);
    expect(activateRes.errors).toHaveLength(0);
  });
});
