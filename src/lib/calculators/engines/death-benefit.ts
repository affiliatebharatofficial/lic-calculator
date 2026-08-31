/**
 * Deterministic Death Benefit Claim Calculation Engine
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

export interface DeathBenefitInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly completedYears: number;
  readonly annualPremium?: number;
  readonly outstandingLoan?: number;
  readonly accidentalDeathRider?: boolean;
}

export interface DeathBenefitResultData {
  readonly sumAssured: Money;
  readonly accruedBonus: Money;
  readonly finalAdditionalBonus: Money;
  readonly accidentalRiderBenefit: Money;
  readonly grossClaimPayable: Money;
  readonly outstandingDeductions: Money;
  readonly netPayableClaim: Money;
}

export class DeathBenefitCalculator
  implements ICalculator<DeathBenefitInput, RuleEntry<SyntheticBonusRuleData>, DeathBenefitResultData>
{
  public readonly calculatorId = 'lic-death-benefit-calculator';
  public readonly name = 'LIC Death Benefit Claim Calculator Engine';
  public readonly description = 'Estimates total death claim proceeds including Sum Assured, vested bonuses, FAB, and rider benefits minus deductions.';
  public readonly requiredRuleTypes = Object.freeze(['bonus_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<DeathBenefitInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('sumAssured', raw.sumAssured)
      .number('sumAssured', raw.sumAssured)
      .range('sumAssured', raw.sumAssured, 50000, 100000000)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 40)
      .require('completedYears', raw.completedYears)
      .range('completedYears', raw.completedYears, 1, 40);

    return builder.build();
  }

  public calculate(
    input: DeathBenefitInput,
    ruleEntry: RuleEntry<SyntheticBonusRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<DeathBenefitResultData> {
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
    const completedYears = Math.min(input.completedYears, input.policyTerm);

    // Calculate accrued Simple Reversionary Bonus
    let bonusRatePerThousand = rules.defaultBonusRatePerThousand;
    for (const tier of rules.bonusRatesByTerm) {
      if (input.policyTerm >= tier.minTerm && input.policyTerm <= tier.maxTerm) {
        bonusRatePerThousand = tier.ratePerThousand;
        break;
      }
    }

    const annualBonusRupees = (input.sumAssured / 1000) * bonusRatePerThousand;
    const totalBonusRupees = annualBonusRupees * completedYears;
    const accruedBonusMoney = moneyFromRupees(Math.round(totalBonusRupees));

    // Calculate Final Additional Bonus (FAB) if eligible (>= 15 years completed)
    let fabRupees = 0;
    if (completedYears >= 15 && rules.fabRules) {
      const sortedFab = [...rules.fabRules].sort((a, b) => b.minTerm - a.minTerm);
      for (const tier of sortedFab) {
        if (completedYears >= tier.minTerm) {
          fabRupees = (input.sumAssured / 1000) * tier.fabRatePerThousand;
          break;
        }
      }
    }
    const fabMoney = moneyFromRupees(Math.round(fabRupees));

    // Accidental Death Benefit Rider (equal to base sum assured if opted)
    const accidentalBenefitRupees = input.accidentalDeathRider ? input.sumAssured : 0;
    const accidentalRiderMoney = moneyFromRupees(accidentalBenefitRupees);

    // Outstanding deductions (loan, unpaid interest)
    const loanDeductionRupees = input.outstandingLoan && input.outstandingLoan > 0 ? input.outstandingLoan : 0;
    const deductionsMoney = moneyFromRupees(loanDeductionRupees);

    // Gross Claim = Sum Assured + Accrued Bonus + FAB + Accidental Rider
    const grossClaimMoney = addMoney(
      addMoney(sumAssuredMoney, accruedBonusMoney),
      addMoney(fabMoney, accidentalRiderMoney)
    );

    // Net Claim = Gross Claim - Deductions
    const netClaimMoney = subtractMoney(grossClaimMoney, deductionsMoney);

    const breakdown = new BreakdownBuilder('Death Claim Benefit Breakdown')
      .addLine('base_sum_assured', 'Guaranteed Base Sum Assured on Death', sumAssuredMoney, true, 'benefit')
      .addLine(
        'accrued_bonus',
        `Vested Simple Reversionary Bonus (${completedYears} years accrued)`,
        accruedBonusMoney,
        true,
        'bonus'
      )
      .addLine('fab_bonus', 'Final Additional Bonus (FAB)', fabMoney, true, 'bonus');

    if (input.accidentalDeathRider) {
      breakdown.addLine('accidental_rider', 'Accidental Death Benefit Rider Claim', accidentalRiderMoney, true, 'benefit');
    }

    if (loanDeductionRupees > 0) {
      breakdown.addLine('loan_deduction', 'Less: Outstanding Policy Loan / Deductions', deductionsMoney, false, 'deduction');
    }

    breakdown.addLine('net_claim', 'Net Total Claim Payable to Nominee', netClaimMoney, true, 'total');

    const resultData: DeathBenefitResultData = {
      sumAssured: sumAssuredMoney,
      accruedBonus: accruedBonusMoney,
      finalAdditionalBonus: fabMoney,
      accidentalRiderBenefit: accidentalRiderMoney,
      grossClaimPayable: grossClaimMoney,
      outstandingDeductions: deductionsMoney,
      netPayableClaim: netClaimMoney
    };

    return createCalculatorResult<DeathBenefitResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: netClaimMoney,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
