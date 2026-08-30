/**
 * Deterministic Term Insurance & Death Benefit Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticPremiumRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney, divideMoney } from '../core/money';
import { fromPercentage, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface TermInsuranceInput {
  readonly age: number;
  readonly policyTerm: number;
  readonly sumAssured: number;
  readonly isSmoker?: boolean;
}

export interface TermInsuranceResultData {
  readonly sumAssured: Money;
  readonly baseAnnualPremium: Money;
  readonly firstYearGst: Money;
  readonly renewalGst: Money;
  readonly totalAnnualPremiumFirstYear: Money;
  readonly totalAnnualPremiumRenewal: Money;
  readonly monthlyEquivalent: Money;
}

export class TermInsuranceCalculator
  implements ICalculator<TermInsuranceInput, RuleEntry<SyntheticPremiumRuleData>, TermInsuranceResultData>
{
  public readonly calculatorId = 'lic-term-insurance-calculator';
  public readonly name = 'LIC Term Insurance Calculator Engine';
  public readonly description = 'Deterministic calculation of pure life insurance term protection premiums.';
  public readonly requiredRuleTypes = Object.freeze(['premium_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<TermInsuranceInput>;
    const builder = new ValidationBuilder();

    builder
      .require('age', raw.age)
      .range('age', raw.age, 18, 65)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 10, 40)
      .require('sumAssured', raw.sumAssured)
      .positiveNumber('sumAssured', raw.sumAssured);

    return builder.build();
  }

  public calculate(
    input: TermInsuranceInput,
    ruleEntry: RuleEntry<SyntheticPremiumRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<TermInsuranceResultData> {
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

    // Pure term rate per thousand SA approximation (lower than endowment)
    const thousandsOfSA = input.sumAssured / 1000;
    // Smoker loading ~25% if applicable
    const smokerMultiplier = input.isSmoker ? 1.25 : 1.0;
    const termRatePerThousand = (rules.baseRatePerThousand * 0.25) * smokerMultiplier;
    const baseAnnualRupees = thousandsOfSA * termRatePerThousand;
    const baseAnnualPremium = moneyFromRupees(baseAnnualRupees);

    // GST 18% on pure term insurance
    const gstRate = 18.0;
    const firstYearGst = applyPercentageToMoney(baseAnnualPremium, fromPercentage(gstRate));
    const renewalGst = firstYearGst; // Pure term has fixed 18% GST across all years

    const totalAnnualPremiumFirstYear = addMoney(baseAnnualPremium, firstYearGst);
    const totalAnnualPremiumRenewal = addMoney(baseAnnualPremium, renewalGst);
    const monthlyEquivalent = divideMoney(totalAnnualPremiumRenewal, 12);

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic pure term mortality rates for testing.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Term Protection Premium Breakdown')
      .addLine('base_term_premium', 'Basic Pure Risk Premium', baseAnnualPremium, true, 'base')
      .addLine('gst', `GST (18% on Pure Term)`, firstYearGst, true, 'tax');

    const resultData: TermInsuranceResultData = {
      sumAssured: moneyFromRupees(input.sumAssured),
      baseAnnualPremium,
      firstYearGst,
      renewalGst,
      totalAnnualPremiumFirstYear,
      totalAnnualPremiumRenewal,
      monthlyEquivalent
    };

    return createCalculatorResult<TermInsuranceResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: totalAnnualPremiumFirstYear,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
