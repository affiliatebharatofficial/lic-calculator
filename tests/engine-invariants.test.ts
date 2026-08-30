import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  SYNTHETIC_PREMIUM_RULE_914,
  SYNTHETIC_SURRENDER_RULE_914,
  SYNTHETIC_MATURITY_RULE_914
} from '@/lib/calculators';

describe('Mathematical Invariant & Property Tests', () => {
  it('guarantees pure determinism: identical inputs & rules produce identical outputs', () => {
    const input = {
      planTableNo: 914,
      age: 30,
      policyTerm: 20,
      sumAssured: 500000,
      premiumFrequency: 'yearly' as const
    };

    const out1 = ENGINES.premium.calculate(input, SYNTHETIC_PREMIUM_RULE_914);
    const out2 = ENGINES.premium.calculate(input, SYNTHETIC_PREMIUM_RULE_914);

    expect(out1.primaryAmount.paise).toBe(out2.primaryAmount.paise);
    expect(out1.result.firstYearInstallment.paise).toBe(out2.result.firstYearInstallment.paise);
    expect(out1.breakdown.items.length).toBe(out2.breakdown.items.length);
  });

  it('guarantees monotonicity: increasing Sum Assured strictly increases premium', () => {
    const premium5L = ENGINES.premium.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    const premium10L = ENGINES.premium.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 1000000,
        premiumFrequency: 'yearly'
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    expect(premium10L.primaryAmount.paise).toBeGreaterThan(premium5L.primaryAmount.paise);
  });

  it('guarantees bounded surrender loss percentage (0% to 100%)', () => {
    const testCases = [
      { years: 2, paid: 50000 },
      { years: 5, paid: 125000 },
      { years: 10, paid: 250000 },
      { years: 15, paid: 375000 },
      { years: 20, paid: 500000 }
    ];

    for (const tc of testCases) {
      const result = ENGINES.surrenderLoss.calculate(
        {
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: tc.years,
          totalPremiumsPaid: tc.paid
        },
        SYNTHETIC_SURRENDER_RULE_914
      );

      expect(result.result.lossPercentageNumber).toBeGreaterThanOrEqual(0);
      expect(result.result.lossPercentageNumber).toBeLessThanOrEqual(100);
    }
  });

  it('guarantees non-negative maturity payout', () => {
    const result = ENGINES.maturity.calculate(
      {
        planTableNo: 914,
        sumAssured: 200000,
        policyTerm: 15
      },
      SYNTHETIC_MATURITY_RULE_914
    );

    expect(result.result.totalMaturityProceeds.paise).toBeGreaterThan(0);
    expect(result.result.totalMaturityProceeds.paise).toBeGreaterThanOrEqual(
      result.result.sumAssured.paise
    );
  });
});
