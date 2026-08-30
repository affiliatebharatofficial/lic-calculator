/**
 * Deterministic Policy Loan Calculation Engine
 */

import type { Money, Percentage } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticLoanRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, divideMoney } from '../core/money';
import { fromPercentage, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface LoanInput {
  readonly surrenderValue: number;
  readonly isPolicyInForce?: boolean; // default true (90%), false = paid-up (80%)
}

export interface LoanResultData {
  readonly surrenderValue: Money;
  readonly maxLoanAmount: Money;
  readonly eligiblePercentage: Percentage;
  readonly annualInterestRate: Percentage;
  readonly annualInterestAmount: Money;
  readonly semiAnnualInterestAmount: Money;
  readonly isPolicyInForce: boolean;
}

export class LoanCalculator
  implements ICalculator<LoanInput, RuleEntry<SyntheticLoanRuleData>, LoanResultData>
{
  public readonly calculatorId = 'lic-loan-calculator';
  public readonly name = 'LIC Policy Loan Calculator Engine';
  public readonly description = 'Deterministic calculation of eligible borrowing amount against policy surrender value and interest costs.';
  public readonly requiredRuleTypes = Object.freeze(['loan_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<LoanInput>;
    const builder = new ValidationBuilder();

    builder
      .require('surrenderValue', raw.surrenderValue)
      .number('surrenderValue', raw.surrenderValue)
      .positiveNumber('surrenderValue', raw.surrenderValue);

    return builder.build();
  }

  public calculate(
    input: LoanInput,
    ruleEntry: RuleEntry<SyntheticLoanRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<LoanResultData> {
    const startTime = performance.now();
    const validation = this.validate(input);
    if (!validation.isValid) {
      const firstErr = validation.errors[0];
      if (firstErr) {
        throw new CalculatorExecutionError(firstErr.code as any, firstErr.message, firstErr.field);
      }
      throw new CalculatorExecutionError('INVALID_INPUT', 'Validation failed');
    }

    const rules = ruleEntry.data;
    const warnings = new WarningCollector();
    const isPolicyInForce = input.isPolicyInForce !== false;

    const surrenderValueMoney = moneyFromRupees(input.surrenderValue);
    const loanPercentVal = isPolicyInForce ? rules.maxLoanPercentInForce : rules.maxLoanPercentPaidUp;
    const eligiblePercentage = fromPercentage(loanPercentVal);

    // Max Loan Amount = Surrender Value × (eligiblePercentage / 100)
    const maxLoanAmount = applyPercentageToMoney(surrenderValueMoney, eligiblePercentage);

    // Interest computation
    const interestPercentage = fromPercentage(rules.annualInterestRate);
    const annualInterestAmount = applyPercentageToMoney(maxLoanAmount, interestPercentage);
    const semiAnnualInterestAmount = divideMoney(annualInterestAmount, 2);

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic loan interest parameters for testing purposes.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Policy Loan Eligibility Breakdown')
      .addLine('surrender_value', 'Current Policy Surrender Value', surrenderValueMoney, true, 'base')
      .addLine(
        'loan_eligibility',
        `Max Eligible Loan (${loanPercentVal}% of Surrender Value for ${isPolicyInForce ? 'In-Force' : 'Paid-Up'})`,
        maxLoanAmount,
        true,
        'base'
      );

    const resultData: LoanResultData = {
      surrenderValue: surrenderValueMoney,
      maxLoanAmount,
      eligiblePercentage,
      annualInterestRate: interestPercentage,
      annualInterestAmount,
      semiAnnualInterestAmount,
      isPolicyInForce
    };

    return createCalculatorResult<LoanResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: maxLoanAmount,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
