/**
 * Deterministic LIC Premium Payment Frequency & Mode Rebate Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticPremiumRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, moneyToRupees } from '../core/money';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface PremiumFrequencyInput {
  readonly annualBasePremium: number;
  readonly sumAssured?: number;
}

export interface FrequencyModeBreakdown {
  readonly baseInstallment: Money;
  readonly modalRebate: Money;
  readonly netInstallment: Money;
  readonly gstYear1: Money;
  readonly totalYear1Installment: Money;
  readonly totalRenewalInstallment: Money;
  readonly annualizedTotalYear1: Money;
  readonly annualizedTotalRenewal: Money;
}

export interface PremiumFrequencyResultData {
  readonly yearlyMode: FrequencyModeBreakdown;
  readonly halfYearlyMode: FrequencyModeBreakdown;
  readonly quarterlyMode: FrequencyModeBreakdown;
  readonly monthlyNachMode: FrequencyModeBreakdown;
  readonly yearlySavingsVsMonthly: Money;
}

export class PremiumFrequencyCalculator
  implements ICalculator<PremiumFrequencyInput, RuleEntry<SyntheticPremiumRuleData>, PremiumFrequencyResultData>
{
  public readonly calculatorId = 'lic-premium-frequency-calculator';
  public readonly name = 'LIC Premium Payment Frequency & Rebate Engine';
  public readonly description = 'Calculates and compares installment amounts across Yearly, Half-Yearly, Quarterly, and Monthly modes with modal rebates and GST rates.';
  public readonly requiredRuleTypes = Object.freeze(['premium_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<PremiumFrequencyInput>;
    const builder = new ValidationBuilder();

    builder
      .require('annualBasePremium', raw.annualBasePremium)
      .number('annualBasePremium', raw.annualBasePremium)
      .positiveNumber('annualBasePremium', raw.annualBasePremium)
      .range('annualBasePremium', raw.annualBasePremium, 1000, 50000000);

    return builder.build();
  }

  private computeMode(baseAmount: number, frequencyDivider: number, modalRebatePercent: number): FrequencyModeBreakdown {
    // 1. Base installment before mode rebate
    const rawInstallment = baseAmount / frequencyDivider;
    const rebateAmount = Math.round(rawInstallment * (modalRebatePercent / 100));
    const netInstallment = Math.round(rawInstallment - rebateAmount);

    // GST: 4.5% in Year 1, 2.25% in renewal years
    const gstY1 = Math.round(netInstallment * 0.045);
    const gstRenewal = Math.round(netInstallment * 0.0225);

    const totalY1 = netInstallment + gstY1;
    const totalRenewal = netInstallment + gstRenewal;

    return {
      baseInstallment: moneyFromRupees(Math.round(rawInstallment)),
      modalRebate: moneyFromRupees(rebateAmount),
      netInstallment: moneyFromRupees(netInstallment),
      gstYear1: moneyFromRupees(gstY1),
      totalYear1Installment: moneyFromRupees(totalY1),
      totalRenewalInstallment: moneyFromRupees(totalRenewal),
      annualizedTotalYear1: moneyFromRupees(totalY1 * frequencyDivider),
      annualizedTotalRenewal: moneyFromRupees(totalRenewal * frequencyDivider)
    };
  }

  public calculate(
    input: PremiumFrequencyInput,
    ruleEntry: RuleEntry<SyntheticPremiumRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<PremiumFrequencyResultData> {
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
    const base = input.annualBasePremium;

    // Standard LIC Modal Rebates: Yearly = 2%, Half-Yearly = 1%, Quarterly = 0%, Monthly = 0%
    const yearlyMode = this.computeMode(base, 1, 2.0);
    const halfYearlyMode = this.computeMode(base, 2, 1.0);
    const quarterlyMode = this.computeMode(base, 4, 0.0);
    const monthlyNachMode = this.computeMode(base, 12, 0.0);

    const annualMonthlyCost = moneyToRupees(monthlyNachMode.totalRenewalInstallment) * 12;
    const annualYearlyCost = moneyToRupees(yearlyMode.totalRenewalInstallment);
    const yearlySavingsAmount = Math.max(0, annualMonthlyCost - annualYearlyCost);
    const yearlySavingsVsMonthly = moneyFromRupees(yearlySavingsAmount);

    const breakdown = new BreakdownBuilder('Mode Frequency & Rebate Summary')
      .addLine('yearly_net', 'Yearly Mode Installment (Includes 2% Modal Rebate)', yearlyMode.totalRenewalInstallment, true, 'benefit')
      .addLine('half_yearly_net', 'Half-Yearly Installment (Includes 1% Modal Rebate)', halfYearlyMode.totalRenewalInstallment, true, 'base')
      .addLine('quarterly_net', 'Quarterly Installment', quarterlyMode.totalRenewalInstallment, true, 'base')
      .addLine('monthly_net', 'Monthly NACH/ECS Installment', monthlyNachMode.totalRenewalInstallment, true, 'base');

    const resultData: PremiumFrequencyResultData = {
      yearlyMode,
      halfYearlyMode,
      quarterlyMode,
      monthlyNachMode,
      yearlySavingsVsMonthly
    };

    return createCalculatorResult<PremiumFrequencyResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: yearlySavingsVsMonthly,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
