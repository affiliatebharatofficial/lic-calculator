/**
 * Deterministic Annuity Options & Income Calculation Engine
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

export interface AnnuityInput {
  readonly planTableNo: number | string;
  readonly purchasePrice: number;
  readonly age: number;
  readonly annuityOption?: 'life_only' | 'return_of_purchase_price' | 'joint_life_ropp';
}

export interface AnnuityResultData {
  readonly purchasePrice: Money;
  readonly annuitantAge: number;
  readonly optionChosen: string;
  readonly applicableAnnuityRate: Percentage;
  readonly annualAnnuity: Money;
  readonly monthlyAnnuity: Money;
  readonly quarterlyAnnuity: Money;
  readonly halfYearlyAnnuity: Money;
  readonly returnOfPurchasePriceAmount: Money;
}

export class AnnuityCalculator
  implements ICalculator<AnnuityInput, RuleEntry<SyntheticPensionRuleData>, AnnuityResultData>
{
  public readonly calculatorId = 'lic-annuity-calculator';
  public readonly name = 'LIC Annuity Calculator Engine';
  public readonly description = 'Calculates guaranteed annuity income across Life Annuity, Return of Premium, and Joint Life options.';
  public readonly requiredRuleTypes = Object.freeze(['pension_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<AnnuityInput>;
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
    input: AnnuityInput,
    ruleEntry: RuleEntry<SyntheticPensionRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<AnnuityResultData> {
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
    const option = input.annuityOption || 'return_of_purchase_price';

    // Base rate tier for age
    let baseRate = rules.defaultAnnuityRatePercent;
    const sortedTiers = [...rules.annuityRatesByAge].sort((a, b) => b.age - a.age);
    for (const tier of sortedTiers) {
      if (input.age >= tier.age) {
        baseRate = tier.ratePercent;
        break;
      }
    }

    // Rate adjustment by option (Option A: Life only is higher ~105%, Option F: ROPP is baseline 100%, Option J: Joint Life is ~95%)
    let rateMultiplier = 1.0;
    let optionName = 'Life Annuity with Return of Purchase Price (ROPP)';
    if (option === 'life_only') {
      rateMultiplier = 1.06;
      optionName = 'Life Annuity without Return of Corpus';
    } else if (option === 'joint_life_ropp') {
      rateMultiplier = 0.96;
      optionName = 'Joint Life Annuity (100% to spouse) with Return of Purchase Price';
    }

    const finalRatePercent = baseRate * rateMultiplier;
    const applicableAnnuityRate = fromPercentage(finalRatePercent);
    const purchasePriceMoney = moneyFromRupees(input.purchasePrice);

    // Annual Annuity = Purchase Price × Final Annuity Rate %
    const annualAnnuity = applyPercentageToMoney(purchasePriceMoney, applicableAnnuityRate);
    const halfYearlyAnnuity = divideMoney(annualAnnuity, 2);
    const quarterlyAnnuity = divideMoney(annualAnnuity, 4);
    const monthlyAnnuity = divideMoney(annualAnnuity, 12);
    const returnOfPurchasePriceAmount = option === 'life_only' ? moneyFromRupees(0) : purchasePriceMoney;

    const breakdown = new BreakdownBuilder('Lifelong Annuity Plan Breakdown')
      .addLine('purchase_price', 'One-Time Purchase Price / Corpus', purchasePriceMoney, true, 'base')
      .addLine(
        'annuity_payout',
        `Annual Annuity Payout (${finalRatePercent.toFixed(2)}% p.a. for Age ${input.age})`,
        annualAnnuity,
        true,
        'base'
      )
      .addLine(
        'return_of_corpus',
        option === 'life_only' ? 'No Return of Corpus on Death' : '100% Return of Purchase Price on Death',
        returnOfPurchasePriceAmount,
        true,
        'benefit'
      );

    const resultData: AnnuityResultData = {
      purchasePrice: purchasePriceMoney,
      annuitantAge: input.age,
      optionChosen: optionName,
      applicableAnnuityRate,
      annualAnnuity,
      monthlyAnnuity,
      quarterlyAnnuity,
      halfYearlyAnnuity,
      returnOfPurchasePriceAmount
    };

    return createCalculatorResult<AnnuityResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: monthlyAnnuity,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
