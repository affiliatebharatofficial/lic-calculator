import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  SYNTHETIC_MATURITY_RULE_914,
  moneyToRupees
} from '@/lib/calculators';

describe('Deterministic Maturity & Bonus Calculation Engines', () => {
  const bonusCalc = ENGINES.bonus;
  const maturityCalc = ENGINES.maturity;

  it('calculates simple reversionary bonus and FAB accruals', () => {
    // 500k SA for 20 years @ 42/th = 500 × 42 × 20 = 420,000
    // FAB (term 20 >= 15): 500 × 70 = 35,000
    // Total Bonus: 455,000
    const result = bonusCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20
      },
      SYNTHETIC_MATURITY_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.result.totalReversionaryBonus.paise).toBe(42000000);
    expect(result.result.finalAdditionalBonus.paise).toBe(3500000);
    expect(result.result.totalBonusAccrued.paise).toBe(45500000);
  });

  it('calculates total maturity lump sum proceeds', () => {
    // SA (500,000) + Reversionary (420,000) + FAB (35,000) = 955,000
    const result = maturityCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20
      },
      SYNTHETIC_MATURITY_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.result.sumAssured.paise).toBe(50000000);
    expect(result.result.totalMaturityProceeds.paise).toBe(95500000);
    expect(moneyToRupees(result.result.totalMaturityProceeds)).toBe(955000);
  });

  it('omits FAB for terms shorter than minFabTerm (15 years)', () => {
    const result = maturityCalc.calculate(
      {
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 12 // < 15
      },
      SYNTHETIC_MATURITY_RULE_914
    );

    expect(result.result.finalAdditionalBonus.paise).toBe(0);
    // SA (500,000) + Bonus (500 × 42 × 12 = 252,000) = 752,000
    expect(result.result.totalMaturityProceeds.paise).toBe(75200000);
  });
});
