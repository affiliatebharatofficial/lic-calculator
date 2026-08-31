/**
 * Deterministic LIC Paid-Up Policy Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticBonusRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney, subtractMoney } from '../core/money';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface PaidUpInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly premiumPayingTerm?: number;
  readonly premiumsPaidCount: number;
  readonly totalPremiumsPaidSoFar?: number;
}

export interface PaidUpResultData {
  readonly originalSumAssured: Money;
  readonly reducedPaidUpSumAssured: Money;
  readonly vestedBonus: Money;
  readonly paidUpMaturityPayout: Money;
  readonly paidUpDeathCover: Money;
  readonly premiumsPaidFraction: string;
}

export class PaidUpCalculator
  implements ICalculator<PaidUpInput, RuleEntry<SyntheticBonusRuleData>, PaidUpResultData>
{
  public readonly calculatorId = 'lic-paid-up-calculator';
  public readonly name = 'LIC Paid-Up Value Calculator Engine';
  public readonly description = 'Calculates Reduced Paid-Up Sum Assured, vested bonuses, and paid-up maturity/death benefits when premium payment is discontinued.';
  public readonly requiredRuleTypes = Object.freeze(['bonus_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<PaidUpInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('sumAssured', raw.sumAssured)
      .number('sumAssured', raw.sumAssured)
      .range('sumAssured', raw.sumAssured, 50000, 100000000)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 40)
      .require('premiumsPaidCount', raw.premiumsPaidCount)
      .range('premiumsPaidCount', raw.premiumsPaidCount, 2, 40);

    return builder.build();
  }

  public calculate(
    input: PaidUpInput,
    ruleEntry: RuleEntry<SyntheticBonusRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<PaidUpResultData> {
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

    const ppt = input.premiumPayingTerm || input.policyTerm;
    const paidYears = Math.min(input.premiumsPaidCount, ppt);
    const paidRatio = paidYears / ppt;

    // Reduced Paid-Up Sum Assured = Basic SA × (Premiums Paid / PPT)
    const reducedSaRupees = Math.round(input.sumAssured * paidRatio);
    const reducedPaidUpSumAssured = moneyFromRupees(reducedSaRupees);
    const originalSumAssured = moneyFromRupees(input.sumAssured);

    // Calculate Vested Simple Reversionary Bonuses (accrued only for the years premiums were paid)
    let bonusRatePerThousand = 46;
    if (rules && typeof rules.defaultBonusRatePerThousand === 'number') {
      bonusRatePerThousand = rules.defaultBonusRatePerThousand;
    } else if (rules && typeof (rules as any).simpleReversionaryBonusPerThousand === 'number') {
      bonusRatePerThousand = (rules as any).simpleReversionaryBonusPerThousand;
    }
    if (rules && Array.isArray(rules.bonusRatesByTerm)) {
      for (const tier of rules.bonusRatesByTerm) {
        if (input.policyTerm >= tier.minTerm && input.policyTerm <= tier.maxTerm) {
          bonusRatePerThousand = tier.ratePerThousand;
          break;
        }
      }
    }

    const annualBonusRupees = (input.sumAssured / 1000) * bonusRatePerThousand;
    const vestedBonusRupees = Math.round(annualBonusRupees * paidYears);
    const vestedBonus = moneyFromRupees(vestedBonusRupees);

    // Total Paid-Up Maturity Benefit = Reduced Paid-Up SA + Vested Bonuses
    const paidUpMaturityPayout = addMoney(reducedPaidUpSumAssured, vestedBonus);
    const paidUpDeathCover = paidUpMaturityPayout;

    if (paidYears < 3) {
      warnings.add(
        'EARLY_PAID_UP_NOTICE',
        'Policy has acquired reduced paid-up status after completing 2 full years. No future bonuses will be added.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Paid-Up Policy Value Breakdown')
      .addLine('original_sa', 'Original Life Cover (Basic Sum Assured)', originalSumAssured, true, 'base')
      .addLine(
        'reduced_sa',
        `Reduced Paid-Up Sum Assured (${paidYears}/${ppt} PPT Paid)`,
        reducedPaidUpSumAssured,
        true,
        'benefit'
      )
      .addLine(
        'vested_bonus',
        `Vested Reversionary Bonuses (${paidYears} active premium years)`,
        vestedBonus,
        true,
        'bonus'
      )
      .addLine('paid_up_maturity', 'Total Guaranteed Paid-Up Maturity Payout', paidUpMaturityPayout, true, 'total');

    const resultData: PaidUpResultData = {
      originalSumAssured,
      reducedPaidUpSumAssured,
      vestedBonus,
      paidUpMaturityPayout,
      paidUpDeathCover,
      premiumsPaidFraction: `${paidYears} / ${ppt} Years`
    };

    return createCalculatorResult<PaidUpResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: paidUpMaturityPayout,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
