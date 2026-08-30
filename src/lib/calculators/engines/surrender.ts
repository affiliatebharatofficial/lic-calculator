/**
 * Deterministic Surrender Value Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticSurrenderRuleData } from '../rules/fixtures/synthetic-rules';
import {
  moneyFromRupees,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney,
  maxMoney,
  ZERO_MONEY
} from '../core/money';
import { fromFraction, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface SurrenderInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly completedYears: number;
  readonly totalPremiumsPaid: number;
  readonly accruedBonus?: number;
}

export interface SurrenderResultData {
  readonly planCode: string;
  readonly totalPremiumsPaid: Money;
  readonly completedYears: number;
  readonly gsvAmount: Money;
  readonly gsvPremiumPortion: Money;
  readonly gsvBonusPortion: Money;
  readonly ssvAmount: Money;
  readonly paidUpSumAssured: Money;
  readonly payableSurrenderValue: Money;
  readonly applicableRuleType: 'SSV' | 'GSV';
  readonly isAcquired: boolean;
}

export class SurrenderCalculator
  implements ICalculator<SurrenderInput, RuleEntry<SyntheticSurrenderRuleData>, SurrenderResultData>
{
  public readonly calculatorId = 'lic-surrender-value-calculator';
  public readonly name = 'LIC Surrender Value Calculator Engine';
  public readonly description = 'Deterministic calculation of Guaranteed Surrender Value (GSV) and Special Surrender Value (SSV).';
  public readonly requiredRuleTypes = Object.freeze(['surrender_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<SurrenderInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('sumAssured', raw.sumAssured)
      .positiveNumber('sumAssured', raw.sumAssured)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 40)
      .require('completedYears', raw.completedYears)
      .range('completedYears', raw.completedYears, 0, 40)
      .require('totalPremiumsPaid', raw.totalPremiumsPaid)
      .nonNegativeNumber('totalPremiumsPaid', raw.totalPremiumsPaid);

    if (raw.completedYears !== undefined && raw.policyTerm !== undefined) {
      builder.custom(
        Number(raw.completedYears) <= Number(raw.policyTerm),
        'completedYears',
        'Completed policy years cannot exceed policy term.'
      );
    }

    return builder.build();
  }

  public calculate(
    input: SurrenderInput,
    ruleEntry: RuleEntry<SyntheticSurrenderRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<SurrenderResultData> {
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
    const totalPaidMoney = moneyFromRupees(input.totalPremiumsPaid);

    // 1. Check if policy has completed minimum years to acquire surrender value
    if (input.completedYears < rules.minPaidYearsToAcquireValue) {
      warnings.add(
        'INSUFFICIENT_DURATION',
        `Policy has not acquired cash surrender value. Minimum ${rules.minPaidYearsToAcquireValue} completed premium years required.`,
        'completedYears',
        'warning'
      );

      const zeroResult: SurrenderResultData = {
        planCode: String(input.planTableNo),
        totalPremiumsPaid: totalPaidMoney,
        completedYears: input.completedYears,
        gsvAmount: ZERO_MONEY,
        gsvPremiumPortion: ZERO_MONEY,
        gsvBonusPortion: ZERO_MONEY,
        ssvAmount: ZERO_MONEY,
        paidUpSumAssured: ZERO_MONEY,
        payableSurrenderValue: ZERO_MONEY,
        applicableRuleType: 'GSV',
        isAcquired: false
      };

      const breakdown = new BreakdownBuilder('Surrender Value Breakdown')
        .addLine('total_paid', 'Total Premiums Paid', totalPaidMoney, true, 'base')
        .addLine('ineligible', `Unacquired Surrender Value (< ${rules.minPaidYearsToAcquireValue} Years Completed)`, totalPaidMoney, false, 'deduction');

      return createCalculatorResult<SurrenderResultData>({
        calculatorId: this.calculatorId,
        result: zeroResult,
        primaryAmount: ZERO_MONEY,
        breakdown: breakdown.build(),
        warnings: warnings.getWarnings(),
        ruleVersion: ruleEntry.version,
        startTime
      });
    }

    // 2. Lookup GSV Factors
    const gsvEntry =
      rules.gsvFactors
        .filter((f) => f.completedYears <= input.completedYears && f.policyTerm === input.policyTerm)
        .sort((a, b) => b.completedYears - a.completedYears)[0] || { factor: 0.30 };

    const gsvBonusEntry =
      rules.gsvBonusFactors
        .filter((f) => f.completedYears <= input.completedYears && f.policyTerm === input.policyTerm)
        .sort((a, b) => b.completedYears - a.completedYears)[0] || { factor: 0.0 };

    // GSV Premium Portion = (Total Premiums Paid - 1st Year Premium approx) × GSV Factor
    // For general approximation, 1st year premium = totalPaid / completedYears
    const annualPremiumEquiv = divideMoney(totalPaidMoney, Math.max(1, input.completedYears));
    const eligibleGsvPremiums = subtractMoney(totalPaidMoney, annualPremiumEquiv);
    const gsvPremiumPortion = applyPercentageToMoney(
      eligibleGsvPremiums,
      fromFraction(gsvEntry.factor)
    );

    const accruedBonusMoney = moneyFromRupees(input.accruedBonus || 0);
    const gsvBonusPortion = applyPercentageToMoney(
      accruedBonusMoney,
      fromFraction(gsvBonusEntry.factor)
    );

    const gsvAmount = addMoney(gsvPremiumPortion, gsvBonusPortion);

    // 3. Lookup SSV Factors
    const ssvEntry =
      rules.ssvFactors
        .filter((f) => f.completedYears <= input.completedYears && f.policyTerm === input.policyTerm)
        .sort((a, b) => b.completedYears - a.completedYears)[0] || { factor: 0.40 };

    // Paid-Up SA = (Sum Assured × completedYears) / policyTerm
    const sumAssuredMoney = moneyFromRupees(input.sumAssured);
    const paidUpSumAssured = divideMoney(
      multiplyMoney(sumAssuredMoney, input.completedYears),
      input.policyTerm
    );

    // SSV = (Paid-Up SA + Accrued Bonus) × SSV Factor
    const ssvBase = addMoney(paidUpSumAssured, accruedBonusMoney);
    const ssvAmount = applyPercentageToMoney(ssvBase, fromFraction(ssvEntry.factor));

    // 4. Higher of GSV and SSV is payable
    const payableSurrenderValue = maxMoney(gsvAmount, ssvAmount);
    const applicableRuleType: 'SSV' | 'GSV' = ssvAmount.paise >= gsvAmount.paise ? 'SSV' : 'GSV';

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic surrender factor tables for testing purposes.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Surrender Value Breakdown')
      .addLine('total_paid', 'Total Premiums Paid So Far', totalPaidMoney, true, 'base')
      .addLine('gsv', `Guaranteed Surrender Value (GSV Factor: ${(gsvEntry.factor * 100).toFixed(0)}%)`, gsvAmount, true, 'base')
      .addLine('ssv', `Special Surrender Value (SSV Factor: ${(ssvEntry.factor * 100).toFixed(0)}%)`, ssvAmount, true, 'base');

    const resultData: SurrenderResultData = {
      planCode: String(input.planTableNo),
      totalPremiumsPaid: totalPaidMoney,
      completedYears: input.completedYears,
      gsvAmount,
      gsvPremiumPortion,
      gsvBonusPortion,
      ssvAmount,
      paidUpSumAssured,
      payableSurrenderValue,
      applicableRuleType,
      isAcquired: true
    };

    return createCalculatorResult<SurrenderResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: payableSurrenderValue,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
