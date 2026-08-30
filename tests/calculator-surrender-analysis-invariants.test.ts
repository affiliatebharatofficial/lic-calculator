import { describe, it, expect } from 'vitest';
import { SurrenderAnalysisCalculator } from '@/lib/calculators/engines/surrender-analysis';
import { SYNTHETIC_SURRENDER_RULE_914, SYNTHETIC_MATURITY_RULE_914 } from '@/lib/calculators/rules/fixtures/synthetic-rules';

describe('SurrenderAnalysisCalculator Invariants & Bounds', () => {
  const engine = new SurrenderAnalysisCalculator();

  it('guarantees non-negative monetary values across all outputs', () => {
    const res = engine.calculate(
      {
        planTableNo: 914,
        sumAssured: 1000000,
        policyTerm: 25,
        completedYears: 10,
        totalPremiumsPaid: 300000,
        annualPremium: 30000
      },
      {
        surrenderRules: SYNTHETIC_SURRENDER_RULE_914.data,
        maturityRules: SYNTHETIC_MATURITY_RULE_914.data
      }
    );

    expect(res.result.surrenderCalculation.payableSurrenderValue.paise).toBeGreaterThanOrEqual(0);
    expect(res.result.lossAnalysis.differenceAmount.paise).toBeGreaterThanOrEqual(0);
    expect(res.result.decisionComparison.surrenderNow.immediatePayout.paise).toBeGreaterThanOrEqual(0);
    expect(res.result.decisionComparison.makePaidUp.reducedLifeCover.paise).toBeGreaterThanOrEqual(0);
    expect(res.result.decisionComparison.continuePolicy.projectedMaturityBenefit.paise).toBeGreaterThanOrEqual(0);
  });

  it('guarantees paid-up life cover never exceeds original sum assured', () => {
    const sumAssured = 1000000;
    const res = engine.calculate(
      {
        planTableNo: 914,
        sumAssured,
        policyTerm: 20,
        completedYears: 15,
        totalPremiumsPaid: 450000,
        annualPremium: 30000
      },
      {
        surrenderRules: SYNTHETIC_SURRENDER_RULE_914.data
      }
    );

    const paidUpPaise = res.result.decisionComparison.makePaidUp.reducedLifeCover.paise;
    expect(paidUpPaise).toBeLessThanOrEqual(sumAssured * 100);
  });

  it('guarantees shortfall percentage is bounded between 0% and 100%', () => {
    const res = engine.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000
      },
      {
        surrenderRules: SYNTHETIC_SURRENDER_RULE_914.data
      }
    );

    const lossPct = res.result.lossAnalysis.lossPercentageNumber;
    expect(lossPct).toBeGreaterThanOrEqual(0);
    expect(lossPct).toBeLessThanOrEqual(100);
  });
});
