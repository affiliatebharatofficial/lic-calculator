/**
 * Deterministic Bonus Calculation Engine
 */

import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticMaturityRuleData } from '../rules/fixtures/synthetic-rules';
import { moneyFromRupees, addMoney, multiplyMoney } from '../core/money';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface BonusInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
}

export interface BonusResultData {
  readonly planCode: string;
  readonly sumAssured: Money;
  readonly annualBonusRatePerThousand: number;
  readonly annualBonusAmount: Money;
  readonly totalReversionaryBonus: Money;
  readonly finalAdditionalBonus: Money;
  readonly totalBonusAccrued: Money;
}

export class BonusCalculator
  implements ICalculator<BonusInput, RuleEntry<SyntheticMaturityRuleData>, BonusResultData>
{
  public readonly calculatorId = 'lic-bonus-calculator';
  public readonly name = 'LIC Bonus Calculator Engine';
  public readonly description = 'Deterministic calculation of Simple Reversionary Bonus and Final Additional Bonus.';
  public readonly requiredRuleTypes = Object.freeze(['maturity_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<BonusInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('sumAssured', raw.sumAssured)
      .number('sumAssured', raw.sumAssured)
      .positiveNumber('sumAssured', raw.sumAssured)
      .require('policyTerm', raw.policyTerm)
      .number('policyTerm', raw.policyTerm)
      .integer('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 40);

    return builder.build();
  }

  public calculate(
    input: BonusInput,
    ruleEntry: RuleEntry<SyntheticMaturityRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<BonusResultData> {
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

    const thousandsOfSA = input.sumAssured / 1000;
    const annualBonusRupees = thousandsOfSA * rules.simpleReversionaryBonusPerThousand;
    const annualBonusAmount = moneyFromRupees(annualBonusRupees);

    // Total Simple Reversionary Bonus over full term
    const totalReversionaryBonus = multiplyMoney(annualBonusAmount, input.policyTerm);

    // Final Additional Bonus (FAB) if term >= minFabTerm
    let finalAdditionalBonus = moneyFromRupees(0);
    if (input.policyTerm >= rules.minFabTerm && rules.fabPerThousand > 0) {
      const fabRupees = thousandsOfSA * rules.fabPerThousand;
      finalAdditionalBonus = moneyFromRupees(fabRupees);
    }

    const totalBonusAccrued = addMoney(totalReversionaryBonus, finalAdditionalBonus);

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic bonus rates for testing. Real bonus is declared annually by LIC valuation circulars.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Bonus Accrual Breakdown')
      .addLine(
        'annual_bonus',
        `Simple Reversionary Bonus (₹${rules.simpleReversionaryBonusPerThousand}/th × ${input.policyTerm} Yrs)`,
        totalReversionaryBonus,
        true,
        'bonus'
      );

    if (input.policyTerm >= rules.minFabTerm) {
      breakdown.addLine(
        'fab',
        `Final Additional Bonus (₹${rules.fabPerThousand}/th SA for ${input.policyTerm} Yrs)`,
        finalAdditionalBonus,
        true,
        'bonus'
      );
    }

    const resultData: BonusResultData = {
      planCode: String(input.planTableNo),
      sumAssured: moneyFromRupees(input.sumAssured),
      annualBonusRatePerThousand: rules.simpleReversionaryBonusPerThousand,
      annualBonusAmount,
      totalReversionaryBonus,
      finalAdditionalBonus,
      totalBonusAccrued
    };

    return createCalculatorResult<BonusResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: totalBonusAccrued,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
