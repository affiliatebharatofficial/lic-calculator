/**
 * Deterministic Maturity Calculation Engine
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

export interface MaturityInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly age?: number;
}

export interface MaturityResultData {
  readonly planCode: string;
  readonly sumAssured: Money;
  readonly simpleReversionaryBonus: Money;
  readonly finalAdditionalBonus: Money;
  readonly totalMaturityProceeds: Money;
}

export class MaturityCalculator
  implements ICalculator<MaturityInput, RuleEntry<SyntheticMaturityRuleData>, MaturityResultData>
{
  public readonly calculatorId = 'lic-maturity-calculator';
  public readonly name = 'LIC Maturity Calculator Engine';
  public readonly description = 'Deterministic calculation of total lump-sum maturity proceeds (Sum Assured + Accrued Bonuses + FAB).';
  public readonly requiredRuleTypes = Object.freeze(['maturity_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<MaturityInput>;
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
    input: MaturityInput,
    ruleEntry: RuleEntry<SyntheticMaturityRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<MaturityResultData> {
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

    const sumAssuredMoney = moneyFromRupees(input.sumAssured);
    const thousandsOfSA = input.sumAssured / 1000;

    // 1. Accrued Simple Reversionary Bonus
    const annualBonusRupees = thousandsOfSA * rules.simpleReversionaryBonusPerThousand;
    const simpleReversionaryBonus = multiplyMoney(moneyFromRupees(annualBonusRupees), input.policyTerm);

    // 2. Final Additional Bonus (FAB)
    let finalAdditionalBonus = moneyFromRupees(0);
    if (input.policyTerm >= rules.minFabTerm && rules.fabPerThousand > 0) {
      const fabRupees = thousandsOfSA * rules.fabPerThousand;
      finalAdditionalBonus = moneyFromRupees(fabRupees);
    }

    // 3. Total Maturity Amount
    const totalMaturityProceeds = addMoney(
      addMoney(sumAssuredMoney, simpleReversionaryBonus),
      finalAdditionalBonus
    );

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic bonus valuation factors for testing purposes.',
        undefined,
        'info'
      );
    }

    const breakdown = new BreakdownBuilder('Maturity Proceeds Breakdown')
      .addLine('sum_assured', 'Basic Sum Assured (Guaranteed)', sumAssuredMoney, true, 'base')
      .addLine(
        'reversionary_bonus',
        `Simple Reversionary Bonus (${input.policyTerm} Yrs @ ₹${rules.simpleReversionaryBonusPerThousand}/th)`,
        simpleReversionaryBonus,
        true,
        'bonus'
      );

    if (input.policyTerm >= rules.minFabTerm) {
      breakdown.addLine(
        'fab',
        `Final Additional Bonus (FAB @ ₹${rules.fabPerThousand}/th)`,
        finalAdditionalBonus,
        true,
        'bonus'
      );
    }

    const resultData: MaturityResultData = {
      planCode: String(input.planTableNo),
      sumAssured: sumAssuredMoney,
      simpleReversionaryBonus,
      finalAdditionalBonus,
      totalMaturityProceeds
    };

    return createCalculatorResult<MaturityResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: totalMaturityProceeds,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
