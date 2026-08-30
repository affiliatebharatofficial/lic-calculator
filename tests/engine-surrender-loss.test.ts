import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  SYNTHETIC_SURRENDER_RULE_914,
  SYNTHETIC_MATURITY_RULE_914
} from '@/lib/calculators';

describe('Deterministic Surrender Value & Loss Engines', () => {
  const surrenderCalc = ENGINES.surrender;
  const lossCalc = ENGINES.surrenderLoss;
  const comparisonEngine = ENGINES.comparison;

  it('returns 0 surrender value and warning if policy is less than 2 years old', () => {
    const result = surrenderCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 1, // < 2
        totalPremiumsPaid: 25000
      },
      SYNTHETIC_SURRENDER_RULE_914
    );

    expect(result.result.isAcquired).toBe(false);
    expect(result.result.payableSurrenderValue.paise).toBe(0);
    expect(result.warnings.some((w) => w.code === 'INSUFFICIENT_DURATION')).toBe(true);
  });

  it('calculates GSV and SSV and selects the higher payable value', () => {
    // 5 years paid into 20 yr policy, Total Paid: ₹1,25,000
    // GSV: (125,000 - 25,000) × 0.50 = 50,000
    // SSV: PaidUp SA (500k × 5 / 20 = 125,000) × SSV factor (0.55) = 68,750
    // Payable: max(50,000, 68,750) = 68,750 (SSV)
    const result = surrenderCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        accruedBonus: 0
      },
      SYNTHETIC_SURRENDER_RULE_914
    );

    expect(result.result.isAcquired).toBe(true);
    expect(result.result.gsvAmount.paise).toBe(5000000); // 50k
    expect(result.result.ssvAmount.paise).toBe(6875000); // 68.75k
    expect(result.result.payableSurrenderValue.paise).toBe(6875000);
    expect(result.result.applicableRuleType).toBe('SSV');
  });

  it('calculates surrender loss difference and percentage accurately', () => {
    // Total Paid: 125,000; Surrender Value: 68,750
    // Loss: 125,000 - 68,750 = 56,250
    // Loss %: 56,250 / 125,000 = 45.00%
    const result = lossCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000
      },
      SYNTHETIC_SURRENDER_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.result.estimatedLossAmount.paise).toBe(5625000);
    expect(result.result.lossPercentageNumber).toBe(45);
    expect(result.result.isLoss).toBe(true);
  });

  it('computes 3-way quantitative decision comparison', () => {
    const comparison = comparisonEngine.compare(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        annualPremium: 25000,
        accruedBonus: 0
      },
      SYNTHETIC_SURRENDER_RULE_914,
      SYNTHETIC_MATURITY_RULE_914
    );

    expect(comparison.success).toBe(true);
    expect(comparison.result.surrender.immediateCashPayout.paise).toBe(6875000);
    expect(comparison.result.paidUp.reducedLifeCover.paise).toBe(12500000); // 1.25 Lakh
    expect(comparison.result.continuePolicy.fullLifeCover.paise).toBe(50000000); // 5.00 Lakh
    expect(comparison.result.continuePolicy.totalProjectedMaturity.paise).toBe(95500000); // 9.55 Lakh
  });
});
