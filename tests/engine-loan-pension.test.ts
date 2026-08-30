import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  SYNTHETIC_LOAN_RULE_GENERAL,
  SYNTHETIC_PENSION_RULE_857,
  SYNTHETIC_PREMIUM_RULE_914
} from '@/lib/calculators';

describe('Deterministic Loan, Pension & Term Insurance Engines', () => {
  const loanCalc = ENGINES.loan;
  const pensionCalc = ENGINES.pension;
  const termCalc = ENGINES.termInsurance;

  it('calculates policy loan for in-force vs paid-up policies', () => {
    // 200,000 Surrender Value:
    // In-Force (90%): ₹1,80,000; Interest @ 9.5%: ₹17,100 / yr
    const inForceResult = loanCalc.calculate(
      {
        surrenderValue: 200000,
        isPolicyInForce: true
      },
      SYNTHETIC_LOAN_RULE_GENERAL
    );

    expect(inForceResult.result.maxLoanAmount.paise).toBe(18000000);
    expect(inForceResult.result.annualInterestAmount.paise).toBe(1710000);
    expect(inForceResult.result.semiAnnualInterestAmount.paise).toBe(855000);

    // Paid-Up (80%): ₹1,60,000
    const paidUpResult = loanCalc.calculate(
      {
        surrenderValue: 200000,
        isPolicyInForce: false
      },
      SYNTHETIC_LOAN_RULE_GENERAL
    );

    expect(paidUpResult.result.maxLoanAmount.paise).toBe(16000000);
  });

  it('calculates lifelong pension and monthly installments', () => {
    // ₹25,00,000 corpus at Age 60 (Rate: 6.95% p.a.)
    // Annual: ₹1,73,750; Monthly: ₹14,479
    const result = pensionCalc.calculate(
      {
        planTableNo: 857,
        purchasePrice: 2500000,
        age: 60
      },
      SYNTHETIC_PENSION_RULE_857
    );

    expect(result.success).toBe(true);
    expect(result.result.annualPension.paise).toBe(17375000);
    expect(result.result.monthlyPension.paise).toBe(1447917);
  });

  it('calculates pure term insurance with 18% GST', () => {
    // ₹1.00 Crore term cover for 35 yrs age 28
    const result = termCalc.calculate(
      {
        age: 28,
        policyTerm: 35,
        sumAssured: 10000000,
        isSmoker: false
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    expect(result.success).toBe(true);
    expect(result.result.sumAssured.paise).toBe(1000000000);
    expect(result.result.totalAnnualPremiumFirstYear.paise).toBeGreaterThan(0);
  });
});
