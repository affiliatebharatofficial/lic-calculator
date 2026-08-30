/**
 * Deterministic Surrender Loss & Difference Calculator Engine
 */

import type { Money, Percentage } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticSurrenderRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, subtractMoney } from '../core/money';
import { calculatePercentageRatio, toPercentageNumber } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { CalculatorExecutionError } from '../core/errors';
import { SurrenderCalculator, type SurrenderInput } from './surrender';

export interface SurrenderLossInput extends SurrenderInput {}

export interface SurrenderLossResultData {
  readonly planCode: string;
  readonly totalPremiumsPaid: Money;
  readonly estimatedSurrenderValue: Money;
  readonly estimatedLossAmount: Money;
  readonly lossPercentage: Percentage;
  readonly lossPercentageNumber: number;
  readonly isLoss: boolean;
}

export class SurrenderLossCalculator
  implements ICalculator<SurrenderLossInput, RuleEntry<SyntheticSurrenderRuleData>, SurrenderLossResultData>
{
  public readonly calculatorId = 'lic-surrender-loss-calculator';
  public readonly name = 'LIC Surrender Loss Calculator Engine';
  public readonly description = 'Deterministic quantification of monetary capital difference and loss percentage upon policy surrender.';
  public readonly requiredRuleTypes = Object.freeze(['surrender_rules']);

  private readonly surrenderCalculator = new SurrenderCalculator();

  public validate(input: unknown) {
    return this.surrenderCalculator.validate(input);
  }

  public calculate(
    input: SurrenderLossInput,
    ruleEntry: RuleEntry<SyntheticSurrenderRuleData>,
    context?: Partial<CalculatorContext>
  ): CalculatorResult<SurrenderLossResultData> {
    const startTime = performance.now();
    const validation = this.validate(input);
    if (!validation.isValid) {
      const firstErr = validation.errors[0];
      if (firstErr) {
        throw new CalculatorExecutionError(firstErr.code as any, firstErr.message, firstErr.field);
      }
      throw new CalculatorExecutionError('INVALID_INPUT', 'Validation failed');
    }

    const surrenderResult = this.surrenderCalculator.calculate(input, ruleEntry, context);
    const totalPaidMoney = moneyFromRupees(input.totalPremiumsPaid);
    const surrenderValue = surrenderResult.primaryAmount;
    const warnings = new WarningCollector();

    // Copy warnings from surrender calculator
    for (const w of surrenderResult.warnings) {
      warnings.addWarning(w);
    }

    // Difference = Total Paid - Surrender Value
    const estimatedLossAmount = subtractMoney(totalPaidMoney, surrenderValue);
    const isLoss = estimatedLossAmount.paise > 0;

    // Loss Percentage
    let lossPercentage: Percentage = { basisPoints: 0 };
    if (totalPaidMoney.paise > 0 && isLoss) {
      lossPercentage = calculatePercentageRatio(estimatedLossAmount, totalPaidMoney);
    }

    const lossPercentageNumber = toPercentageNumber(lossPercentage);

    if (lossPercentageNumber >= 50) {
      warnings.add(
        'HIGH_CAPITAL_LOSS',
        `Surrendering at year ${input.completedYears} results in a severe financial difference (${lossPercentageNumber.toFixed(1)}% of total paid capital). Consider the Paid-Up alternative.`,
        undefined,
        'warning'
      );
    }

    const breakdown = new BreakdownBuilder('Surrender Loss & Difference Breakdown')
      .addLine('total_paid', 'Total Premiums Paid into Policy', totalPaidMoney, true, 'base')
      .addLine('surrender_proceeds', 'Estimated Cash Surrender Payout', surrenderValue, false, 'deduction');

    const resultData: SurrenderLossResultData = {
      planCode: String(input.planTableNo),
      totalPremiumsPaid: totalPaidMoney,
      estimatedSurrenderValue: surrenderValue,
      estimatedLossAmount,
      lossPercentage,
      lossPercentageNumber,
      isLoss
    };

    return createCalculatorResult<SurrenderLossResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: estimatedLossAmount,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
