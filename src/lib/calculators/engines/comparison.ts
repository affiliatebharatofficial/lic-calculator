/**
 * 3-Way Decision Comparison Engine: Surrender vs. Paid-Up vs. Continue
 * Deterministic quantitative comparison of financial paths.
 */

import type { Money, Percentage } from '../types/money';
import type { CalculatorResult } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type {
  SyntheticSurrenderRuleData,
  SyntheticMaturityRuleData
} from '../rules/fixtures/synthetic-rules';
import {
  moneyFromRupees,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney
} from '../core/money';
import { calculatePercentageRatio } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { SurrenderCalculator } from './surrender';

export interface ComparisonInput {
  readonly planTableNo: number | string;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly completedYears: number;
  readonly totalPremiumsPaid: number;
  readonly annualPremium: number;
  readonly accruedBonus?: number;
}

export interface OptionSurrenderMetrics {
  readonly immediateCashPayout: Money;
  readonly capitalLossAmount: Money;
  readonly lossPercentage: Percentage;
  readonly remainingLifeCover: Money;
  readonly futurePremiumsPayable: Money;
  readonly maturityPayout: Money;
}

export interface OptionPaidUpMetrics {
  readonly immediateCashPayout: Money;
  readonly reducedLifeCover: Money;
  readonly futurePremiumsPayable: Money;
  readonly estimatedMaturityPayout: Money;
}

export interface OptionContinueMetrics {
  readonly immediateCashPayout: Money;
  readonly fullLifeCover: Money;
  readonly futurePremiumsPayable: Money;
  readonly totalProjectedMaturity: Money;
  readonly totalInvestmentOverLife: Money;
}

export interface PolicyComparisonResultData {
  readonly planCode: string;
  readonly surrender: OptionSurrenderMetrics;
  readonly paidUp: OptionPaidUpMetrics;
  readonly continuePolicy: OptionContinueMetrics;
  readonly recommendationNotice: string;
}

export class PolicyComparisonEngine {
  public readonly calculatorId = 'lic-policy-comparison';
  public readonly name = 'LIC Policy Path Comparison Engine';

  private readonly surrenderCalculator = new SurrenderCalculator();

  public compare(
    input: ComparisonInput,
    surrenderRules: RuleEntry<SyntheticSurrenderRuleData>,
    maturityRules: RuleEntry<SyntheticMaturityRuleData>
  ): CalculatorResult<PolicyComparisonResultData> {
    const startTime = performance.now();
    const warnings = new WarningCollector();

    // 1. Calculate Surrender Option
    const surrenderResult = this.surrenderCalculator.calculate(input, surrenderRules);
    const surrenderPayout = surrenderResult.primaryAmount;
    const totalPaidMoney = moneyFromRupees(input.totalPremiumsPaid);
    const lossMoney = subtractMoney(totalPaidMoney, surrenderPayout);
    const lossPct = calculatePercentageRatio(lossMoney, totalPaidMoney);

    const surrenderOption: OptionSurrenderMetrics = {
      immediateCashPayout: surrenderPayout,
      capitalLossAmount: lossMoney,
      lossPercentage: lossPct,
      remainingLifeCover: moneyFromRupees(0),
      futurePremiumsPayable: moneyFromRupees(0),
      maturityPayout: moneyFromRupees(0)
    };

    // 2. Calculate Paid-Up Option
    const remainingYears = Math.max(0, input.policyTerm - input.completedYears);
    const sumAssuredMoney = moneyFromRupees(input.sumAssured);
    const paidUpSumAssured = divideMoney(
      multiplyMoney(sumAssuredMoney, input.completedYears),
      input.policyTerm
    );
    const accruedBonusMoney = moneyFromRupees(input.accruedBonus || 0);
    const paidUpMaturity = addMoney(paidUpSumAssured, accruedBonusMoney);

    const paidUpOption: OptionPaidUpMetrics = {
      immediateCashPayout: moneyFromRupees(0),
      reducedLifeCover: paidUpSumAssured,
      futurePremiumsPayable: moneyFromRupees(0),
      estimatedMaturityPayout: paidUpMaturity
    };

    // 3. Calculate Continue Option
    const annualPremiumMoney = moneyFromRupees(input.annualPremium);
    const futurePremiumsPayable = multiplyMoney(annualPremiumMoney, remainingYears);
    const totalInvestmentOverLife = addMoney(totalPaidMoney, futurePremiumsPayable);

    const thousandsOfSA = input.sumAssured / 1000;
    const totalTermBonusRupees =
      thousandsOfSA * maturityRules.data.simpleReversionaryBonusPerThousand * input.policyTerm;
    const fabRupees =
      input.policyTerm >= maturityRules.data.minFabTerm
        ? thousandsOfSA * maturityRules.data.fabPerThousand
        : 0;
    const totalMaturityProceeds = addMoney(
      sumAssuredMoney,
      moneyFromRupees(totalTermBonusRupees + fabRupees)
    );

    const continueOption: OptionContinueMetrics = {
      immediateCashPayout: moneyFromRupees(0),
      fullLifeCover: sumAssuredMoney,
      futurePremiumsPayable,
      totalProjectedMaturity: totalMaturityProceeds,
      totalInvestmentOverLife
    };

    warnings.add(
      'INFORMATIONAL_COMPARISON_ONLY',
      'This 3-way projection is an informational mathematical comparison and does not constitute financial advice.',
      undefined,
      'info'
    );

    const breakdown = new BreakdownBuilder('3-Way Policy Decision Comparison')
      .addLine('surrender_cash', 'Option 1: Surrender Cash Payout', surrenderPayout, true, 'base')
      .addLine('paid_up_maturity', 'Option 2: Paid-Up Maturity Payout', paidUpMaturity, true, 'bonus')
      .addLine('continue_maturity', 'Option 3: Full Term Maturity Payout', totalMaturityProceeds, true, 'base');

    const resultData: PolicyComparisonResultData = {
      planCode: String(input.planTableNo),
      surrender: surrenderOption,
      paidUp: paidUpOption,
      continuePolicy: continueOption,
      recommendationNotice:
        'Compare immediate liquidity against future guaranteed maturity values before submitting surrender paperwork.'
    };

    return createCalculatorResult<PolicyComparisonResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: surrenderPayout,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: surrenderRules.version,
      startTime
    });
  }
}
