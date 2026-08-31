/**
 * Deterministic Human Life Value (HLV) & Ideal Life Cover Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticTermRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney, subtractMoney } from '../core/money';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface HlvInput {
  readonly currentAge: number;
  readonly retirementAge?: number;
  readonly annualIncome: number;
  readonly personalExpensesPercent?: number; // Default 30%
  readonly outstandingLiabilities?: number; // Home/Personal/Auto Loans
  readonly existingLifeCover?: number;
  readonly existingLiquidSavings?: number;
}

export interface HlvResultData {
  readonly idealLifeCover: Money;
  readonly incomeReplacementNeed: Money;
  readonly liabilitiesNeed: Money;
  readonly existingAssetsCredit: Money;
  readonly workingYearsRemaining: number;
  readonly netLifeCoverGap: Money;
}

export class HlvCalculator
  implements ICalculator<HlvInput, RuleEntry<SyntheticTermRuleData>, HlvResultData>
{
  public readonly calculatorId = 'lic-hlv-calculator';
  public readonly name = 'LIC Human Life Value (HLV) Engine';
  public readonly description = 'Estimates total actuarial life insurance cover needed based on Income Replacement, remaining working years, liabilities, and current savings.';
  public readonly requiredRuleTypes = Object.freeze(['term_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<HlvInput>;
    const builder = new ValidationBuilder();

    builder
      .require('currentAge', raw.currentAge)
      .range('currentAge', raw.currentAge, 18, 65)
      .require('annualIncome', raw.annualIncome)
      .number('annualIncome', raw.annualIncome)
      .range('annualIncome', raw.annualIncome, 100000, 100000000);

    return builder.build();
  }

  public calculate(
    input: HlvInput,
    ruleEntry: RuleEntry<SyntheticTermRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<HlvResultData> {
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
    const retirementAge = input.retirementAge || 60;
    const workingYearsRemaining = Math.max(1, retirementAge - input.currentAge);

    const personalExpenseRatio = (input.personalExpensesPercent ?? 30) / 100;
    const familyContributionAnnual = input.annualIncome * (1 - personalExpenseRatio);

    // Income Replacement Need (discounted PV approximation)
    const incomeReplacementRupees = Math.round(familyContributionAnnual * workingYearsRemaining);
    const liabilitiesRupees = input.outstandingLiabilities ?? 0;
    const existingAssetsRupees = (input.existingLifeCover ?? 0) + (input.existingLiquidSavings ?? 0);

    const idealCoverRupees = incomeReplacementRupees + liabilitiesRupees;
    const netGapRupees = Math.max(0, idealCoverRupees - existingAssetsRupees);

    const idealLifeCover = moneyFromRupees(idealCoverRupees);
    const incomeReplacementNeed = moneyFromRupees(incomeReplacementRupees);
    const liabilitiesNeed = moneyFromRupees(liabilitiesRupees);
    const existingAssetsCredit = moneyFromRupees(existingAssetsRupees);
    const netLifeCoverGap = moneyFromRupees(netGapRupees);

    if (netGapRupees <= 0) {
      warnings.add(
        'ADEQUATELY_COVERED',
        'Your existing life insurance coverage and liquid assets adequately protect your familys financial future!',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Human Life Value & Need Analysis')
      .addLine('income_replacement', `Family Income Replacement (${workingYearsRemaining} Years to Retirement)`, incomeReplacementNeed, true, 'benefit')
      .addLine('debt_protection', 'Outstanding Debt & Mortgage Clearance', liabilitiesNeed, true, 'base')
      .addLine('less_existing', 'Less: Existing Life Cover & Liquid Assets', existingAssetsCredit, false, 'fee')
      .addLine('net_gap', 'Recommended Additional Life Insurance Cover', netLifeCoverGap, true, 'total');

    const resultData: HlvResultData = {
      idealLifeCover,
      incomeReplacementNeed,
      liabilitiesNeed,
      existingAssetsCredit,
      workingYearsRemaining,
      netLifeCoverGap
    };

    return createCalculatorResult<HlvResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: netLifeCoverGap,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
