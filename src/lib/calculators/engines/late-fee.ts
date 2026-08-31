/**
 * Deterministic LIC Late Fee & Policy Revival Interest Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticLoanRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney } from '../core/money';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface LateFeeInput {
  readonly unpaidPremiumAmount: number;
  readonly overdueDays: number;
  readonly premiumFrequency?: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly';
  readonly annualInterestRatePercent?: number; // Standard default: 9.5%
}

export interface LateFeeResultData {
  readonly overduePremium: Money;
  readonly lateFeeInterest: Money;
  readonly gstOnLateFee: Money;
  readonly totalRevivalArrears: Money;
  readonly isWithinGracePeriod: boolean;
  readonly graceDaysAllowed: number;
}

export class LateFeeCalculator
  implements ICalculator<LateFeeInput, RuleEntry<SyntheticLoanRuleData>, LateFeeResultData>
{
  public readonly calculatorId = 'lic-late-fee-calculator';
  public readonly name = 'LIC Late Fee & Policy Revival Interest Engine';
  public readonly description = 'Calculates late fee interest compounded half-yearly at standard 9.5% p.a. and total arrears to revive a lapsed policy.';
  public readonly requiredRuleTypes = Object.freeze(['loan_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<LateFeeInput>;
    const builder = new ValidationBuilder();

    builder
      .require('unpaidPremiumAmount', raw.unpaidPremiumAmount)
      .number('unpaidPremiumAmount', raw.unpaidPremiumAmount)
      .positiveNumber('unpaidPremiumAmount', raw.unpaidPremiumAmount)
      .require('overdueDays', raw.overdueDays)
      .range('overdueDays', raw.overdueDays, 1, 1825); // Up to 5 years (1825 days)

    return builder.build();
  }

  public calculate(
    input: LateFeeInput,
    ruleEntry: RuleEntry<SyntheticLoanRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<LateFeeResultData> {
    const startTime = performance.now();
    const validation = this.validate(input);
    if (!validation.isValid) {
      const firstErr = validation.errors[0];
      if (firstErr) {
        throw new CalculatorExecutionError(firstErr.code as any, firstErr.message, firstErr.field);
      }
      throw new CalculatorExecutionError('INVALID_INPUT', 'Validation failed');
    }

    const warnings = new WarningCollector();
    const isMonthly = input.premiumFrequency === 'monthly';
    const graceDaysAllowed = isMonthly ? 15 : 30;
    const isWithinGracePeriod = input.overdueDays <= graceDaysAllowed;

    const rate = input.annualInterestRatePercent || 9.5; // 9.5% p.a. standard LIC revival interest
    const principal = input.unpaidPremiumAmount;

    let interestRupees = 0;
    if (!isWithinGracePeriod) {
      // Interest is calculated from the original due date (all overdue days)
      const years = input.overdueDays / 365;
      // Compounded half-yearly: A = P * (1 + r/2)^(2*t) - P
      const compoundAmount = principal * Math.pow(1 + rate / 200, 2 * years);
      interestRupees = Math.round(compoundAmount - principal);
      // Minimum late fee is ₹5 under LIC circular
      interestRupees = Math.max(5, interestRupees);
    } else {
      warnings.add(
        'WITHIN_GRACE_PERIOD',
        `Payment is within the statutory ${graceDaysAllowed}-day grace period. Zero late fee penalty applies!`,
        undefined,
        'info'
      );
    }

    // 18% GST applies on late fee interest component only
    const gstOnLateFeeRupees = Math.round(interestRupees * 0.18);
    const totalArrearsRupees = principal + interestRupees + gstOnLateFeeRupees;

    const overduePremium = moneyFromRupees(principal);
    const lateFeeInterest = moneyFromRupees(interestRupees);
    const gstOnLateFee = moneyFromRupees(gstOnLateFeeRupees);
    const totalRevivalArrears = moneyFromRupees(totalArrearsRupees);

    if (input.overdueDays > 1095) {
      warnings.add(
        'REVIVAL_MEDICAL_REQUIREMENT',
        'Policy is overdue for more than 3 years. Medical examiner report (DGH) and Declaration of Good Health will be mandatory for revival.',
        undefined,
        'warning'
      );
    }

    const breakdown = new BreakdownBuilder('Policy Revival Arrears Breakdown')
      .addLine('unpaid_premium', 'Unpaid Installment Premium', overduePremium, false, 'base')
      .addLine(`late_fee_interest`, `Late Fee Penalty (${rate}% p.a. Compounded Half-Yearly)`, lateFeeInterest, false, 'fee')
      .addLine('gst_late_fee', 'GST on Late Fee (18%)', gstOnLateFee, false, 'tax')
      .addLine('total_revival', 'Total Net Payment to Restore Life Cover', totalRevivalArrears, false, 'total');

    const resultData: LateFeeResultData = {
      overduePremium,
      lateFeeInterest,
      gstOnLateFee,
      totalRevivalArrears,
      isWithinGracePeriod,
      graceDaysAllowed
    };

    return createCalculatorResult<LateFeeResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: totalRevivalArrears,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
