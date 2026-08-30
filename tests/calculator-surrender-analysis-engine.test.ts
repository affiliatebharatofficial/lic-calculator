import { describe, it, expect } from 'vitest';
import { SurrenderAnalysisCalculator } from '@/lib/calculators/engines/surrender-analysis';
import { SYNTHETIC_SURRENDER_RULE_914, SYNTHETIC_MATURITY_RULE_914 } from '@/lib/calculators/rules/fixtures/synthetic-rules';

describe('SurrenderAnalysisCalculator Engine', () => {
  const engine = new SurrenderAnalysisCalculator();

  it('calculates comprehensive surrender analysis for eligible policy (5 yrs / 20 term)', () => {
    const input = {
      planTableNo: 914,
      sumAssured: 500000,
      policyTerm: 20,
      completedYears: 5,
      totalPremiumsPaid: 125000,
      annualPremium: 25000,
      accruedBonus: 0
    };

    const res = engine.calculate(input, {
      surrenderRules: SYNTHETIC_SURRENDER_RULE_914.data,
      maturityRules: SYNTHETIC_MATURITY_RULE_914.data
    });

    expect(res.calculatorId).toBe('lic-surrender-analysis');
    expect(res.result.eligibility.isEligible).toBe(true);
    expect(res.result.surrenderCalculation.payableSurrenderValue.paise).toBe(6875000); // ₹68,750 (SSV)
    expect(res.result.surrenderCalculation.applicableMethod).toBe('SSV');
    expect(res.result.lossAnalysis.differenceAmount.paise).toBe(5625000); // ₹56,250
    expect(res.result.lossAnalysis.lossPercentageNumber).toBe(45); // 45.0%

    // 3-Way Decision Comparison
    const comp = res.result.decisionComparison;
    expect(comp.surrenderNow.immediatePayout.paise).toBe(6875000);
    expect(comp.makePaidUp.reducedLifeCover.paise).toBe(12500000); // ₹1,25,000
    expect(comp.continuePolicy.fullLifeCover.paise).toBe(50000000); // ₹5,00,000
    expect(comp.continuePolicy.projectedMaturityBenefit.paise).toBe(95500000); // ₹9,55,000
  });

  it('correctly reports ineligibility for policy under 2 completed years', () => {
    const input = {
      planTableNo: 914,
      sumAssured: 500000,
      policyTerm: 20,
      completedYears: 1, // < 2 years
      totalPremiumsPaid: 25000,
      annualPremium: 25000
    };

    const res = engine.calculate(input, {
      surrenderRules: SYNTHETIC_SURRENDER_RULE_914.data
    });

    expect(res.result.eligibility.isEligible).toBe(false);
    expect(res.result.surrenderCalculation.payableSurrenderValue.paise).toBe(0);
    expect(res.warnings.some((w) => w.code === 'INSUFFICIENT_DURATION')).toBe(true);
  });
});
