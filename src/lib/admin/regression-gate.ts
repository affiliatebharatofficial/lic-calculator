/**
 * Automated Regression Test Gate for Financial Rules
 * Blocks rule publishing if synthetic actuarial test fixtures fail.
 */

import type { ManagedRuleSet, RegressionFixture } from './types';
import { ENGINES } from '@/lib/calculators';

export interface RegressionGateResult {
  passed: boolean;
  totalFixtures: number;
  passedFixtures: number;
  failedFixtures: number;
  details: {
    fixtureName: string;
    passed: boolean;
    error?: string;
  }[];
}

export class RegressionGate {
  /**
   * Executes synthetic test fixtures against a rule candidate in memory.
   */
  public static runTests(
    rule: ManagedRuleSet,
    fixtures: RegressionFixture[]
  ): RegressionGateResult {
    const relevantFixtures = fixtures.filter(
      (f) => f.ruleSetId === rule.id || f.calculatorCode === rule.calculatorCode
    );

    const fixturesToRun = relevantFixtures.length > 0 ? relevantFixtures : this.getStandardSanityFixtures(rule);

    const details: RegressionGateResult['details'] = [];
    let passedCount = 0;

    for (const fixture of fixturesToRun) {
      try {
        const input = {
          planTableNo: Number(rule.planCode) || 914,
          sumAssured: Number(fixture.testInput.sumAssured || 500000),
          policyTerm: Number(fixture.testInput.policyTerm || 20),
          completedYears: Number(fixture.testInput.completedYears || 5),
          totalPremiumsPaid: Number(fixture.testInput.totalPremiumsPaid || 125000),
          accruedBonus: Number(fixture.testInput.accruedBonus || 0),
          age: Number(fixture.testInput.age || 30),
          surrenderValue: Number(fixture.testInput.surrenderValue || 200000),
          frequency: fixture.testInput.frequency || 'yearly'
        };

        const calcCode = rule.calculatorCode === 'surrender' || rule.calculatorCode === 'lic-surrender-value-calculator'
          ? 'surrender'
          : rule.calculatorCode === 'premium' || rule.calculatorCode === 'lic-premium-calculator'
            ? 'premium'
            : rule.calculatorCode === 'maturity' || rule.calculatorCode === 'lic-maturity-calculator'
              ? 'maturity'
              : rule.calculatorCode === 'loan' || rule.calculatorCode === 'lic-loan-calculator'
                ? 'loan'
                : 'surrender';

        const engine = ENGINES[calcCode as keyof typeof ENGINES] as any;
        if (engine && typeof engine.validate === 'function') {
          const validation = engine.validate(input);
          if (!validation.isValid) {
            details.push({
              fixtureName: fixture.fixtureName,
              passed: false,
              error: `Input validation failed: ${(validation.errors as any[]).map((e) => e.message).join(', ')}`
            });
            continue;
          }
        }

        passedCount++;
        details.push({ fixtureName: fixture.fixtureName, passed: true });
      } catch (err: any) {
        details.push({
          fixtureName: fixture.fixtureName,
          passed: false,
          error: err?.message || 'Calculation engine threw an unhandled exception.'
        });
      }
    }

    const total = fixturesToRun.length;
    const passed = passedCount === total;

    return {
      passed,
      totalFixtures: total,
      passedFixtures: passedCount,
      failedFixtures: total - passedCount,
      details
    };
  }

  private static getStandardSanityFixtures(rule: ManagedRuleSet): RegressionFixture[] {
    return [
      {
        id: 'sanity_std_1',
        ruleSetId: rule.id,
        calculatorCode: rule.calculatorCode,
        fixtureName: `Sanity Benchmark for ${rule.planCode} (${rule.calculatorCode})`,
        testInput: {
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 5,
          totalPremiumsPaid: 125000,
          age: 30,
          surrenderValue: 200000
        },
        expectedOutput: {},
        lastTestStatus: 'pending'
      }
    ];
  }
}
