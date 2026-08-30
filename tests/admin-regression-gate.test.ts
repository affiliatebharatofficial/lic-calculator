import { describe, it, expect } from 'vitest';
import { RegressionGate, type ManagedRuleSet, type RegressionFixture } from '@/lib/admin';

describe('Admin Automated Regression Test Gate', () => {
  const sampleRule: ManagedRuleSet = {
    id: 'rule_test_gate_1',
    planCode: '914',
    tableNo: 914,
    calculatorCode: 'surrender',
    version: 'v1',
    status: 'review',
    isPublished: false,
    calculationStrategy: 'surrender_special_v1',
    effectiveFrom: '2026-01-01',
    rulePayload: {},
    createdBy: 'admin@lic-calculators.com',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  };

  it('passes standard regression benchmarks for compliant rules', () => {
    const fixtures: RegressionFixture[] = [
      {
        id: 'fix_1',
        ruleSetId: 'rule_test_gate_1',
        calculatorCode: 'surrender',
        fixtureName: 'Standard 5-Year Surrender Verification',
        testInput: {
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 5,
          totalPremiumsPaid: 125000
        },
        expectedOutput: { payableSurrenderValue: 68750 },
        lastTestStatus: 'pending'
      }
    ];

    const result = RegressionGate.runTests(sampleRule, fixtures);
    expect(result.passed).toBe(true);
    expect(result.failedFixtures).toBe(0);
  });
});
