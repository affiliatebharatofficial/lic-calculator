/**
 * Deterministic Pension & Annuity Calculation Engine
 */

import type { Money, Percentage } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticPensionRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, divideMoney } from '../core/money';
import { fromPercentage, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface PensionInput {
  readonly planTableNo: number | string;
  readonly purchasePrice: number;
  readonly age: number;
}

export interface PensionResultData {
  readonly purchasePrice: Money;
  readonly annuitantAge: number;
  readonly applicableAnnuityRate: Percentage;
  readonly annualPension: Money;
  readonly monthlyPension: Money;
  readonly quarterlyPension: Money;
  readonly halfYearlyPension: Money;
}

export class PensionCalculator
  implements ICalculator<PensionInput, RuleEntry<SyntheticPensionRuleData>, PensionResultData>
{
  public readonly calculatorId = 'lic-pension-calculator';
  public readonly name = 'LIC Pension & Annuity Calculator Engine';
  public readonly description = 'Deterministic calculation of lifelong pension annuity payouts from one-time purchase price.';
  public readonly requiredRuleTypes = Object.freeze(['pension_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<PensionInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('purchasePrice', raw.purchasePrice)
      .number('purchasePrice', raw.purchasePrice)
      .positiveNumber('purchasePrice', raw.purchasePrice)
      .require('age', raw.age)
      .range('age', raw.age, 30, 85);

    return builder.build();
  }

  public calculate(
    input: PensionInput,
    ruleEntry: RuleEntry<SyntheticPensionRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<PensionResultData> {
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

    // Match annuity rate for age tier
    let matchedRate = rules.defaultAnnuityRatePercent;
    const sortedTiers = [...rules.annuityRatesByAge].sort((a, b) => b.age - a.age);
    for (const tier of sortedTiers) {
      if (input.age >= tier.age) {
        matchedRate = tier.ratePercent;
        break;
      }
    }

    const applicableAnnuityRate = fromPercentage(matchedRate);
    const purchasePriceMoney = moneyFromRupees(input.purchasePrice);

    // Annual Pension = Purchase Price × Annuity Rate %
    const annualPension = applyPercentageToMoney(purchasePriceMoney, applicableAnnuityRate);
    const halfYearlyPension = divideMoney(annualPension, 2);
    const quarterlyPension = divideMoney(annualPension, 4);
    const monthlyPension = divideMoney(annualPension, 12);

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic annuity rates for testing purposes.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Lifelong Pension Annuity Breakdown')
      .addLine('purchase_price', 'One-Time Purchase Price / Corpus', purchasePriceMoney, true, 'base')
      .addLine(
        'annuity_payout',
        `Annual Guaranteed Pension (Annuity Rate: ${matchedRate.toFixed(2)}% p.a. for Age ${input.age})`,
        annualPension,
        true,
        'base'
      );

    const resultData: PensionResultData = {
      purchasePrice: purchasePriceMoney,
      annuitantAge: input.age,
      applicableAnnuityRate,
      annualPension,
      monthlyPension,
      quarterlyPension,
      halfYearlyPension
    };

    return createCalculatorResult<PensionResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: monthlyPension,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
