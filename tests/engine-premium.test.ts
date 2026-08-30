import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  SYNTHETIC_PREMIUM_RULE_914
} from '@/lib/calculators';

describe('Deterministic Premium Calculator Engine', () => {
  const calc = ENGINES.premium;

  it('calculates yearly premium with high SA rebate and 1st year GST', () => {
    // 500k SA on 914:
    // Base: 500 × 49.70 = 24,850
    // High SA Rebate: 500 × 1.50 = 750 -> Net SA Base: 24,100
    // Yearly Mode Rebate (2% of 24,100): 482 -> Net Base: 23,618 (2,361,800 paise)
    // GST (4.5% of 2,361,800 paise): 106,281 paise (₹1,062.81)
    // Total Year 1 Installment: 2,361,800 + 106,281 = 2,468,081 paise
    const result = calc.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly',
        includeAccidentalRider: false
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.calculatorId).toBe('lic-premium-calculator');
    expect(result.result.basicAnnualPremium.paise).toBe(2485000);
    expect(result.result.highSaDiscount.paise).toBe(75000);
    expect(result.result.modeDiscount.paise).toBe(48200);
    expect(result.result.netAnnualPremium.paise).toBe(2361800);
    expect(result.result.firstYearGst.paise).toBe(106281);
    expect(result.result.firstYearInstallment.paise).toBe(2468081);
    expect(result.breakdown.items.length).toBeGreaterThan(2);
  });

  it('calculates monthly installment and includes optional rider', () => {
    const result = calc.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'monthly',
        includeAccidentalRider: true
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.result.installmentsPerYear).toBe(12);
    expect(result.result.riderPremium.paise).toBeGreaterThan(0);
  });

  it('rejects input outside rule age boundaries', () => {
    expect(() =>
      calc.calculate(
        {
          planTableNo: 914,
          age: 70, // max is 55
          policyTerm: 20,
          sumAssured: 500000,
          premiumFrequency: 'yearly'
        },
        SYNTHETIC_PREMIUM_RULE_914
      )
    ).toThrowError(/outside the allowed entry age range/);
  });

  it('rejects sum assured below minimum required', () => {
    expect(() =>
      calc.calculate(
        {
          planTableNo: 914,
          age: 30,
          policyTerm: 20,
          sumAssured: 50000, // min is 100,000
          premiumFrequency: 'yearly'
        },
        SYNTHETIC_PREMIUM_RULE_914
      )
    ).toThrowError(/below minimum required/);
  });
});
