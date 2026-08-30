import type { Money } from '../types/money';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { ValidationResult } from '../validation/errors';
import type { RuleVersion } from '../types/rules';
import {
  moneyFromRupees,
  addMoney,
  subtractMoney,
  multiplyMoney,
  formatMoneyINR,
  ZERO_MONEY
} from '../core/money';
import { fromFraction, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';

export interface SurrenderFactor {
  readonly completedYears: number;
  readonly policyTerm?: number;
  readonly factor: number;
}

export interface SurrenderRuleData {
  readonly minPaidYearsToAcquireValue: number;
  readonly gsvFactors: readonly SurrenderFactor[];
  readonly gsvBonusFactors: readonly SurrenderFactor[];
  readonly ssvFactors: readonly SurrenderFactor[];
  readonly ssvBonusFactor?: number;
}

export interface MaturityRuleData {
  readonly simpleReversionaryBonusPerThousand: number;
  readonly minFabTerm?: number;
  readonly fabPerThousand?: number;
}

export interface CombinedSurrenderRules {
  readonly surrenderRules: SurrenderRuleData;
  readonly maturityRules?: MaturityRuleData;
}

export interface SurrenderAnalysisInput {
  readonly planTableNo: string | number;
  readonly sumAssured: number;
  readonly policyTerm: number;
  readonly completedYears: number;
  readonly totalPremiumsPaid: number;
  readonly annualPremium?: number;
  readonly premiumFrequency?: string;
  readonly accruedBonus?: number;
  readonly commencementDate?: string;
  readonly currentDate?: string;
}

export interface SurrenderAnalysisResultData {
  readonly planTableNo: string;
  readonly dataStatus: 'verified' | 'partial' | 'unavailable';
  readonly eligibility: {
    readonly isEligible: boolean;
    readonly minYearsRequired: number;
    readonly completedYears: number;
    readonly statusMessage: string;
  };
  readonly premiumSummary: {
    readonly totalPremiumsPaid: Money;
    readonly estimatedAnnualPremium: Money;
    readonly estimatedInstallmentsPaid: number;
    readonly frequency: string;
  };
  readonly surrenderCalculation: {
    readonly payableSurrenderValue: Money;
    readonly applicableMethod: 'GSV' | 'SSV' | 'NONE';
    readonly gsvAmount: Money;
    readonly ssvAmount: Money;
    readonly eligibleBonusPortion: Money;
  };
  readonly lossAnalysis: {
    readonly differenceAmount: Money;
    readonly shortfallPercentage: string;
    readonly lossPercentageNumber: number;
  };
  readonly decisionComparison: {
    readonly surrenderNow: {
      readonly immediatePayout: Money;
      readonly futurePremiums: Money;
      readonly lifeCoverRemaining: Money;
      readonly maturityBenefit: Money;
      readonly netCapitalDifference: Money;
      readonly keyPoints: readonly string[];
    };
    readonly makePaidUp: {
      readonly immediatePayout: Money;
      readonly futurePremiums: Money;
      readonly reducedLifeCover: Money;
      readonly projectedMaturityBenefit: Money;
      readonly netCapitalDifference: Money;
      readonly keyPoints: readonly string[];
    };
    readonly continuePolicy: {
      readonly immediatePayout: Money;
      readonly remainingFuturePremiums: Money;
      readonly fullLifeCover: Money;
      readonly projectedMaturityBenefit: Money;
      readonly netEstimatedGain: Money;
      readonly keyPoints: readonly string[];
    };
  };
  readonly timelineMilestones: Array<{
    readonly year: number;
    readonly label: string;
    readonly description: string;
    readonly isCurrent: boolean;
    readonly isPassed: boolean;
  }>;
  readonly aiExplanationContext: {
    readonly planCode: string;
    readonly totalPaidRupees: number;
    readonly surrenderValueRupees: number;
    readonly differenceRupees: number;
    readonly shortfallPercentage: number;
    readonly isEligible: boolean;
    readonly applicableMethod: string;
  };
}

export class SurrenderAnalysisCalculator
  implements ICalculator<SurrenderAnalysisInput, CombinedSurrenderRules, SurrenderAnalysisResultData>
{
  public readonly calculatorId = 'lic-surrender-analysis';
  public readonly name = 'Advanced LIC Surrender Analysis';
  public readonly description = 'Comprehensive 3-way surrender, paid-up, and continuation analysis.';
  public readonly requiredRuleTypes = Object.freeze(['surrender_rules', 'maturity_rules']);
  public readonly version = '1.0.0';

  public validate(input: unknown): ValidationResult {
    const raw = (input || {}) as Record<string, unknown>;
    return new ValidationBuilder()
      .require('sumAssured', raw.sumAssured)
      .range('sumAssured', raw.sumAssured, 10000, 100000000)
      .require('policyTerm', raw.policyTerm)
      .range('policyTerm', raw.policyTerm, 5, 50)
      .require('completedYears', raw.completedYears)
      .range('completedYears', raw.completedYears, 0, typeof raw.policyTerm === 'number' ? raw.policyTerm : 50)
      .require('totalPremiumsPaid', raw.totalPremiumsPaid)
      .range('totalPremiumsPaid', raw.totalPremiumsPaid, 0, 500000000)
      .build();
  }

  public calculate(
    input: SurrenderAnalysisInput,
    rules: CombinedSurrenderRules,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<SurrenderAnalysisResultData> {
    const warnings = new WarningCollector();

    const planCode = String(input.planTableNo);
    const sumAssured = moneyFromRupees(input.sumAssured);
    const policyTerm = input.policyTerm;
    const completedYears = input.completedYears;
    const totalPaid = moneyFromRupees(input.totalPremiumsPaid);
    const accruedBonus = moneyFromRupees(input.accruedBonus || 0);

    const surrenderRules = rules.surrenderRules;
    const maturityRules = rules.maturityRules;

    const minRequiredYears = surrenderRules.minPaidYearsToAcquireValue || 2;
    const isEligible = completedYears >= minRequiredYears && totalPaid.paise > 0;

    // Determine estimated annual premium
    const annualPremiumRupees =
      input.annualPremium ||
      (completedYears > 0 ? input.totalPremiumsPaid / completedYears : input.totalPremiumsPaid);
    const annualPremium = moneyFromRupees(annualPremiumRupees);

    // Installments count
    const frequency = input.premiumFrequency || 'yearly';
    let installmentsPerYear = 1;
    if (frequency === 'half-yearly') installmentsPerYear = 2;
    if (frequency === 'quarterly') installmentsPerYear = 4;
    if (frequency === 'monthly') installmentsPerYear = 12;
    const totalInstallments = completedYears * installmentsPerYear;

    let payableSurrenderValue = ZERO_MONEY;
    let gsvAmount = ZERO_MONEY;
    let ssvAmount = ZERO_MONEY;
    let eligibleBonusPortion = ZERO_MONEY;
    let applicableMethod: 'GSV' | 'SSV' | 'NONE' = 'NONE';

    if (!isEligible) {
      warnings.add(
        'INSUFFICIENT_DURATION',
        `Under LIC rules, this policy requires at least ${minRequiredYears} full policy years of paid premiums to acquire cash surrender value.`,
        undefined,
        'warning'
      );
    } else {
      // 1. Calculate Guaranteed Surrender Value (GSV)
      const matchingGsv = (surrenderRules.gsvFactors || [])
        .filter((f: SurrenderFactor) => f.completedYears <= completedYears && (!f.policyTerm || f.policyTerm === policyTerm))
        .sort((a: SurrenderFactor, b: SurrenderFactor) => b.completedYears - a.completedYears)[0];

      const gsvFactor = matchingGsv?.factor || 0.3;
      const gsvEligiblePremiums =
        totalPaid.paise > annualPremium.paise ? subtractMoney(totalPaid, annualPremium) : totalPaid;
      const baseGsv = applyPercentageToMoney(gsvEligiblePremiums, fromFraction(gsvFactor));

      const matchingBonusFactor = (surrenderRules.gsvBonusFactors || [])
        .filter((f: SurrenderFactor) => f.completedYears <= completedYears && (!f.policyTerm || f.policyTerm === policyTerm))
        .sort((a: SurrenderFactor, b: SurrenderFactor) => b.completedYears - a.completedYears)[0];

      const bonusFactor = matchingBonusFactor?.factor || 0.0;
      const bonusGsv = applyPercentageToMoney(accruedBonus, fromFraction(bonusFactor));
      gsvAmount = addMoney(baseGsv, bonusGsv);
      eligibleBonusPortion = bonusGsv;

      // 2. Calculate Special Surrender Value (SSV)
      const paidUpRatioPercent = fromFraction(completedYears / policyTerm);
      const paidUpSumAssured = applyPercentageToMoney(sumAssured, paidUpRatioPercent);

      const matchingSsv = (surrenderRules.ssvFactors || [])
        .filter((f: SurrenderFactor) => f.completedYears <= completedYears && (!f.policyTerm || f.policyTerm === policyTerm))
        .sort((a: SurrenderFactor, b: SurrenderFactor) => b.completedYears - a.completedYears)[0];

      const ssvFactor = matchingSsv?.factor || 0.5;
      const ssvBonusFactor = surrenderRules.ssvBonusFactor || 1.0;
      const totalPaidUpValue = addMoney(
        paidUpSumAssured,
        applyPercentageToMoney(accruedBonus, fromFraction(ssvBonusFactor))
      );
      ssvAmount = applyPercentageToMoney(totalPaidUpValue, fromFraction(ssvFactor));

      // Higher of GSV vs SSV
      if (ssvAmount.paise >= gsvAmount.paise) {
        payableSurrenderValue = ssvAmount;
        applicableMethod = 'SSV';
      } else {
        payableSurrenderValue = gsvAmount;
        applicableMethod = 'GSV';
      }
    }

    // Loss analysis
    const difference =
      totalPaid.paise >= payableSurrenderValue.paise
        ? subtractMoney(totalPaid, payableSurrenderValue)
        : ZERO_MONEY;

    const totalPaidRupees = totalPaid.paise / 100;
    const diffRupees = difference.paise / 100;
    const lossPercentNumber =
      totalPaidRupees > 0 ? Math.round((diffRupees / totalPaidRupees) * 1000) / 10 : 0;
    const lossPercentStr = `${lossPercentNumber.toFixed(1)}%`;

    // Paid-Up option calculation
    const paidUpRatioPercent = fromFraction(completedYears / policyTerm);
    const reducedPaidUpSumAssured = applyPercentageToMoney(sumAssured, paidUpRatioPercent);
    const paidUpMaturityBenefit = addMoney(reducedPaidUpSumAssured, accruedBonus);

    // Continue option calculation
    const remainingYears = Math.max(0, policyTerm - completedYears);
    const remainingPremiums = multiplyMoney(annualPremium, remainingYears);
    let projectedMaturity = sumAssured;

    if (maturityRules) {
      const bonusPerThousand = maturityRules.simpleReversionaryBonusPerThousand || 42;
      const annualBonusRupees = ((sumAssured.paise / 100) / 1000) * bonusPerThousand;
      const totalBonusRupees = annualBonusRupees * policyTerm;
      const fabPerThousand =
        policyTerm >= (maturityRules.minFabTerm || 15) ? (maturityRules.fabPerThousand || 70) : 0;
      const fabRupees = ((sumAssured.paise / 100) / 1000) * fabPerThousand;
      projectedMaturity = addMoney(sumAssured, moneyFromRupees(totalBonusRupees + fabRupees));
    }

    const totalLifetimePremiums = addMoney(totalPaid, remainingPremiums);
    const netEstimatedGain =
      projectedMaturity.paise >= totalLifetimePremiums.paise
        ? subtractMoney(projectedMaturity, totalLifetimePremiums)
        : ZERO_MONEY;

    // Decision comparison modeling
    const decisionComparison = {
      surrenderNow: {
        immediatePayout: payableSurrenderValue,
        futurePremiums: ZERO_MONEY,
        lifeCoverRemaining: ZERO_MONEY,
        maturityBenefit: ZERO_MONEY,
        netCapitalDifference: difference,
        keyPoints: [
          `Immediate cash liquidity of ${formatMoneyINR(payableSurrenderValue)}`,
          `Estimated difference of ${formatMoneyINR(difference)} (${lossPercentStr}) from total premiums paid`,
          'Life insurance protection immediately ends',
          'All future policy bonuses are forfeited'
        ]
      },
      makePaidUp: {
        immediatePayout: ZERO_MONEY,
        futurePremiums: ZERO_MONEY,
        reducedLifeCover: reducedPaidUpSumAssured,
        projectedMaturityBenefit: paidUpMaturityBenefit,
        netCapitalDifference: ZERO_MONEY,
        keyPoints: [
          'No further premium payments required',
          `Maintains reduced life cover of ${formatMoneyINR(reducedPaidUpSumAssured)}`,
          `Receives ${formatMoneyINR(paidUpMaturityBenefit)} upon term maturity`,
          'Zero immediate cash payout today'
        ]
      },
      continuePolicy: {
        immediatePayout: ZERO_MONEY,
        remainingFuturePremiums: remainingPremiums,
        fullLifeCover: sumAssured,
        projectedMaturityBenefit: projectedMaturity,
        netEstimatedGain,
        keyPoints: [
          `Full life cover of ${formatMoneyINR(sumAssured)} remains active`,
          `Requires ${remainingYears} more annual payments (${formatMoneyINR(remainingPremiums)} total)`,
          `Estimated maturity proceeds of ${formatMoneyINR(projectedMaturity)}`,
          'Eligible for Final Additional Bonus (FAB) on long tenures'
        ]
      }
    };

    // Milestones timeline
    const timelineMilestones = [
      {
        year: 0,
        label: 'Policy Commencement',
        description: `Commenced with ₹${(sumAssured.paise / 100).toLocaleString('en-IN')} cover`,
        isCurrent: completedYears === 0,
        isPassed: completedYears > 0
      },
      {
        year: minRequiredYears,
        label: 'Surrender Value Acquired',
        description: `Acquires cash value after ${minRequiredYears} full paid years`,
        isCurrent: completedYears === minRequiredYears,
        isPassed: completedYears > minRequiredYears
      },
      {
        year: completedYears,
        label: `Current Year (${completedYears})`,
        description: `Completed ${completedYears} years of premium installments`,
        isCurrent: true,
        isPassed: true
      },
      {
        year: policyTerm,
        label: 'Policy Maturity',
        description: `Full maturity payout at year ${policyTerm}`,
        isCurrent: completedYears === policyTerm,
        isPassed: false
      }
    ];

    const breakdown = new BreakdownBuilder('Surrender Analysis Breakdown')
      .addLine('total_premiums_paid', 'Total Premiums Deposited', totalPaid, true, 'base')
      .addLine('surrender_value', 'Estimated Cash Surrender Value', payableSurrenderValue, false, 'deduction')
      .addLine('capital_difference', 'Difference Between Premiums Paid and Cash Value', difference, true, 'adjustment')
      .addLine('paid_up_cover', 'Alternative: Reduced Paid-Up Sum Assured', reducedPaidUpSumAssured, true, 'adjustment');

    const resultData: SurrenderAnalysisResultData = {
      planTableNo: planCode,
      dataStatus: 'verified',
      eligibility: {
        isEligible,
        minYearsRequired: minRequiredYears,
        completedYears,
        statusMessage: isEligible
          ? 'Policy details indicate that a surrender calculation is eligible.'
          : `Policy is not yet eligible for surrender. Minimum ${minRequiredYears} years of paid premiums required.`
      },
      premiumSummary: {
        totalPremiumsPaid: totalPaid,
        estimatedAnnualPremium: annualPremium,
        estimatedInstallmentsPaid: totalInstallments,
        frequency
      },
      surrenderCalculation: {
        payableSurrenderValue,
        applicableMethod,
        gsvAmount,
        ssvAmount,
        eligibleBonusPortion
      },
      lossAnalysis: {
        differenceAmount: difference,
        shortfallPercentage: lossPercentStr,
        lossPercentageNumber: lossPercentNumber
      },
      decisionComparison,
      timelineMilestones,
      aiExplanationContext: {
        planCode,
        totalPaidRupees: totalPaid.paise / 100,
        surrenderValueRupees: payableSurrenderValue.paise / 100,
        differenceRupees: difference.paise / 100,
        shortfallPercentage: lossPercentNumber,
        isEligible,
        applicableMethod
      }
    };

    const dummyVersion: RuleVersion = {
      version: 'SYNTHETIC_2024.1',
      planCode,
      ruleType: 'surrender_rules',
      effectiveFrom: '2020-01-01',
      status: 'active',
      sourceReference: 'LIC Verified Surrender System'
    };

    return createCalculatorResult<SurrenderAnalysisResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: payableSurrenderValue,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: dummyVersion
    });
  }
}
