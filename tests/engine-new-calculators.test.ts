import { describe, it, expect } from 'vitest';
import { PaidUpCalculator } from '../src/lib/calculators/engines/paid-up';
import { ReturnRoiCalculator } from '../src/lib/calculators/engines/return-roi';
import { PremiumFrequencyCalculator } from '../src/lib/calculators/engines/premium-frequency';
import { LateFeeCalculator } from '../src/lib/calculators/engines/late-fee';
import { HlvCalculator } from '../src/lib/calculators/engines/hlv';
import { moneyToRupees } from '../src/lib/calculators/core/money';
import { SYNTHETIC_BONUS_RULES, SYNTHETIC_PREMIUM_RULES, SYNTHETIC_LOAN_RULES, SYNTHETIC_TERM_RULES } from '../src/lib/calculators/rules/fixtures/synthetic-rules';
import type { RuleEntry } from '../src/lib/calculators/rules/provider';

describe('New Financial Calculator Engines Suite', () => {
  const bonusRuleEntry: RuleEntry<any> = {
    id: 'test_bonus',
    type: 'bonus_rules',
    planId: '914',
    effectiveFrom: '2020-01-01',
    version: '1.0.0',
    source: 'LIC Official Circular',
    status: 'ACTIVE',
    data: SYNTHETIC_BONUS_RULES
  };

  const premiumRuleEntry: RuleEntry<any> = {
    id: 'test_premium',
    type: 'premium_rules',
    planId: '914',
    effectiveFrom: '2020-01-01',
    version: '1.0.0',
    source: 'LIC Official Circular',
    status: 'ACTIVE',
    data: SYNTHETIC_PREMIUM_RULES
  };

  const loanRuleEntry: RuleEntry<any> = {
    id: 'test_loan',
    type: 'loan_rules',
    planId: '914',
    effectiveFrom: '2020-01-01',
    version: '1.0.0',
    source: 'LIC Official Circular',
    status: 'ACTIVE',
    data: SYNTHETIC_LOAN_RULES
  };

  const termRuleEntry: RuleEntry<any> = {
    id: 'test_term',
    type: 'term_rules',
    planId: '855',
    effectiveFrom: '2020-01-01',
    version: '1.0.0',
    source: 'LIC Official Circular',
    status: 'ACTIVE',
    data: SYNTHETIC_TERM_RULES
  };

  it('PaidUpCalculator should accurately calculate reduced SA and vested bonuses', () => {
    const calc = new PaidUpCalculator();
    const result = calc.calculate(
      {
        planTableNo: 914,
        sumAssured: 1000000,
        policyTerm: 20,
        premiumsPaidCount: 5
      },
      bonusRuleEntry
    );

    // Reduced SA = 10,00,000 * (5 / 20) = 2,50,000
    expect(moneyToRupees(result.result.reducedPaidUpSumAssured)).toBe(250000);
    // Vested Bonus = (1000000/1000) * 46 * 5 = 230,000
    expect(moneyToRupees(result.result.vestedBonus)).toBe(230000);
    // Total Paid-Up Maturity = 250000 + 230000 = 480000
    expect(moneyToRupees(result.result.paidUpMaturityPayout)).toBe(480000);
  });

  it('ReturnRoiCalculator should calculate exact Newton-Raphson IRR on cash flows', () => {
    const calc = new ReturnRoiCalculator();
    const result = calc.calculate(
      {
        annualPremium: 50000,
        policyTerm: 20,
        expectedMaturityAmount: 2100000
      },
      bonusRuleEntry
    );

    expect(moneyToRupees(result.result.totalPremiumsPaid)).toBe(1000000);
    expect(moneyToRupees(result.result.totalEstimatedReturns)).toBe(2100000);
    expect(result.result.internalRateOfReturnPercent).toBeGreaterThan(4.0);
    expect(result.result.internalRateOfReturnPercent).toBeLessThan(8.0);
  });

  it('PremiumFrequencyCalculator should compute modal rebates and GST rates', () => {
    const calc = new PremiumFrequencyCalculator();
    const result = calc.calculate(
      {
        annualBasePremium: 50000
      },
      premiumRuleEntry
    );

    // Yearly 2% rebate => 50000 * 0.98 = 49000
    expect(moneyToRupees(result.result.yearlyMode.netInstallment)).toBe(49000);
    // Half yearly 1% rebate => 25000 * 0.99 = 24750
    expect(moneyToRupees(result.result.halfYearlyMode.netInstallment)).toBe(24750);
    // Monthly mode => 50000 / 12 = 4167
    expect(moneyToRupees(result.result.monthlyNachMode.netInstallment)).toBe(4167);
    expect(moneyToRupees(result.result.yearlySavingsVsMonthly)).toBeGreaterThan(0);
  });

  it('LateFeeCalculator should calculate 9.5% compounded half-yearly late fee on arrears', () => {
    const calc = new LateFeeCalculator();
    const result = calc.calculate(
      {
        unpaidPremiumAmount: 25000,
        overdueDays: 180
      },
      loanRuleEntry
    );

    expect(moneyToRupees(result.result.overduePremium)).toBe(25000);
    expect(moneyToRupees(result.result.lateFeeInterest)).toBeGreaterThan(1000);
    expect(result.result.isWithinGracePeriod).toBe(false);
  });

  it('HlvCalculator should calculate income replacement and debt protection gap', () => {
    const calc = new HlvCalculator();
    const result = calc.calculate(
      {
        currentAge: 35,
        annualIncome: 1000000,
        outstandingLiabilities: 3500000,
        existingLifeCover: 2000000
      },
      termRuleEntry
    );

    expect(result.result.workingYearsRemaining).toBe(25);
    expect(moneyToRupees(result.result.idealLifeCover)).toBe(21000000); // 1.75 Cr + 35L
    expect(moneyToRupees(result.result.netLifeCoverGap)).toBe(19000000); // 2.10 Cr - 20L
  });
});
