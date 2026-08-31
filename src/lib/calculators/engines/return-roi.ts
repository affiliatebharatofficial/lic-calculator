/**
 * Deterministic LIC Policy Return & IRR (Internal Rate of Return / ROI) Calculator Engine
 */

import type { Money, Percentage } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticBonusRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney, subtractMoney } from '../core/money';
import { fromPercentage } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface ReturnRoiInput {
  readonly annualPremium: number;
  readonly policyTerm: number;
  readonly premiumPayingTerm?: number;
  readonly expectedMaturityAmount: number;
  readonly survivalBenefitsPerYear?: number;
}

export interface ReturnRoiResultData {
  readonly totalPremiumsPaid: Money;
  readonly totalEstimatedReturns: Money;
  readonly netMonetaryGain: Money;
  readonly internalRateOfReturnPercent: number;
  readonly nominalCagrPercent: number;
  readonly realReturnPercentAfterInflation: number;
}

export class ReturnRoiCalculator
  implements ICalculator<ReturnRoiInput, RuleEntry<SyntheticBonusRuleData>, ReturnRoiResultData>
{
  public readonly calculatorId = 'lic-return-calculator';
  public readonly name = 'LIC Policy Return & IRR Calculator Engine';
  public readonly description = 'Computes the exact Internal Rate of Return (IRR / CAGR) on policy premium cash flows versus total maturity benefits.';
  public readonly requiredRuleTypes = Object.freeze(['bonus_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<ReturnRoiInput>;
    const builder = new ValidationBuilder();

    builder
      .require('annualPremium', raw.annualPremium)
      .number('annualPremium', raw.annualPremium)
      .positiveNumber('annualPremium', raw.annualPremium)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 40)
      .require('expectedMaturityAmount', raw.expectedMaturityAmount)
      .number('expectedMaturityAmount', raw.expectedMaturityAmount)
      .positiveNumber('expectedMaturityAmount', raw.expectedMaturityAmount);

    return builder.build();
  }

  /**
   * High-precision Newton-Raphson IRR Solver for periodic annual cash flows
   */
  private computeIrr(cashFlows: number[], initialGuess = 0.06): number {
    let rate = initialGuess;
    const maxIterations = 100;
    const tolerance = 1e-7;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dNpv = 0;

      for (let t = 0; t < cashFlows.length; t++) {
        const cf = cashFlows[t];
        if (cf === undefined) continue;
        const discountFactor = Math.pow(1 + rate, t);
        npv += cf / discountFactor;
        if (t > 0) {
          dNpv -= (t * cf) / (discountFactor * (1 + rate));
        }
      }

      if (Math.abs(npv) < tolerance) {
        return rate;
      }

      if (Math.abs(dNpv) < 1e-12) {
        break;
      }

      const nextRate = rate - npv / dNpv;
      if (Math.abs(nextRate - rate) < tolerance) {
        return nextRate;
      }
      rate = nextRate;
    }

    return rate;
  }

  public calculate(
    input: ReturnRoiInput,
    ruleEntry: RuleEntry<SyntheticBonusRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<ReturnRoiResultData> {
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
    const ppt = input.premiumPayingTerm || input.policyTerm;
    const term = input.policyTerm;

    // Construct Annual Cash Flows array: Year 0 to Year `term`
    // Year 0 to PPT-1: Outflow of `annualPremium` (-ve)
    // Year term: Inflow of `expectedMaturityAmount` (+ve)
    const cashFlows: number[] = new Array(term + 1).fill(0);
    for (let t = 0; t < ppt; t++) {
      cashFlows[t] = -input.annualPremium;
    }

    // Add maturity payout at year `term`
    const currentTermPayout = cashFlows[term] ?? 0;
    cashFlows[term] = currentTermPayout + input.expectedMaturityAmount;

    // Solve for IRR
    const rawIrr = this.computeIrr(cashFlows);
    const irrPercent = Number((rawIrr * 100).toFixed(2));

    const totalPremiumsRupees = input.annualPremium * ppt;
    const totalReturnsRupees = input.expectedMaturityAmount;
    const netGainRupees = totalReturnsRupees - totalPremiumsRupees;

    // Nominal CAGR = (Total Returns / Total Premiums)^(1 / Term) - 1
    const rawCagr = Math.pow(totalReturnsRupees / totalPremiumsRupees, 1 / term) - 1;
    const cagrPercent = Number((rawCagr * 100).toFixed(2));

    // Real return assuming 5.0% standard inflation benchmark
    const inflationRate = 0.05;
    const realReturnPercent = Number((((1 + rawIrr) / (1 + inflationRate) - 1) * 100).toFixed(2));

    const totalPremiumsPaid = moneyFromRupees(totalPremiumsRupees);
    const totalEstimatedReturns = moneyFromRupees(totalReturnsRupees);
    const netMonetaryGain = moneyFromRupees(Math.max(0, netGainRupees));

    const breakdown = new BreakdownBuilder('Policy Return & Yield Breakdown')
      .addLine('total_invested', `Total Premiums Invested (${ppt} Years × ₹${input.annualPremium.toLocaleString('en-IN')})`, totalPremiumsPaid, false, 'base')
      .addLine('maturity_returns', 'Total Expected Maturity Payout', totalEstimatedReturns, true, 'benefit')
      .addLine('net_gain', 'Net Monetary Profit / Wealth Addition', netMonetaryGain, true, 'total');

    const resultData: ReturnRoiResultData = {
      totalPremiumsPaid,
      totalEstimatedReturns,
      netMonetaryGain,
      internalRateOfReturnPercent: irrPercent,
      nominalCagrPercent: cagrPercent,
      realReturnPercentAfterInflation: realReturnPercent
    };

    return createCalculatorResult<ReturnRoiResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: netMonetaryGain,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
