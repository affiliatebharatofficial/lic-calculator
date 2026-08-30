/**
 * Deterministic Premium Calculation Engine
 */

import type { Money } from '../types/money';
import type { PremiumFrequency } from '../types/frequency';
import { FREQUENCY_INSTALLMENTS } from '../types/frequency';
import type { ICalculator, CalculatorResult, CalculatorContext } from '../types/calculator';
import type { RuleEntry } from '../rules/provider';
import type { SyntheticPremiumRuleData } from '../rules/fixtures/synthetic-rules';
import {
  moneyFromRupees,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney
} from '../core/money';
import { fromPercentage, applyPercentageToMoney } from '../core/percentage';
import { BreakdownBuilder, createCalculatorResult } from '../core/result';
import { WarningCollector } from '../core/warnings';
import { ValidationBuilder } from '../validation/validator';
import { CalculatorExecutionError } from '../core/errors';

export interface PremiumInput {
  readonly planTableNo: number | string;
  readonly age: number;
  readonly policyTerm: number;
  readonly sumAssured: number;
  readonly premiumFrequency: PremiumFrequency;
  readonly includeAccidentalRider?: boolean;
}

export interface PremiumResultData {
  readonly planCode: string;
  readonly sumAssured: Money;
  readonly basicAnnualPremium: Money;
  readonly highSaDiscount: Money;
  readonly modeDiscount: Money;
  readonly netAnnualPremium: Money;
  readonly riderPremium: Money;
  readonly firstYearGst: Money;
  readonly renewalGst: Money;
  readonly firstYearInstallment: Money;
  readonly renewalInstallment: Money;
  readonly installmentsPerYear: number;
  readonly mode: PremiumFrequency;
}

export class PremiumCalculator
  implements ICalculator<PremiumInput, RuleEntry<SyntheticPremiumRuleData>, PremiumResultData>
{
  public readonly calculatorId = 'lic-premium-calculator';
  public readonly name = 'LIC Premium Calculator Engine';
  public readonly description = 'Deterministic calculation of policy premium installments, rebates, riders, and GST.';
  public readonly requiredRuleTypes = Object.freeze(['premium_rules']);

  public validate(input: unknown) {
    const raw = input as Partial<PremiumInput>;
    const builder = new ValidationBuilder();

    builder
      .require('planTableNo', raw.planTableNo)
      .require('age', raw.age)
      .number('age', raw.age)
      .integer('age', raw.age)
      .require('policyTerm', raw.policyTerm)
      .number('policyTerm', raw.policyTerm)
      .integer('policyTerm', raw.policyTerm)
      .require('sumAssured', raw.sumAssured)
      .number('sumAssured', raw.sumAssured)
      .positiveNumber('sumAssured', raw.sumAssured)
      .require('premiumFrequency', raw.premiumFrequency)
      .enum('premiumFrequency', raw.premiumFrequency, [
        'yearly',
        'half-yearly',
        'quarterly',
        'monthly',
        'single'
      ]);

    return builder.build();
  }

  public calculate(
    input: PremiumInput,
    ruleEntry: RuleEntry<SyntheticPremiumRuleData>,
    _context?: Partial<CalculatorContext>
  ): CalculatorResult<PremiumResultData> {
    const startTime = performance.now();
    const validation = this.validate(input);
    if (!validation.isValid) {
      const firstErr = validation.errors[0];
      if (firstErr) {
        throw new CalculatorExecutionError(
          firstErr.code as any,
          firstErr.message,
          firstErr.field
        );
      }
      throw new CalculatorExecutionError('INVALID_INPUT', 'Validation failed');
    }

    const rules = ruleEntry.data;
    const warnings = new WarningCollector();

    // 1. Boundary & Eligibility Checks against rules
    if (input.age < rules.minAge || input.age > rules.maxAge) {
      throw new CalculatorExecutionError(
        'INVALID_RANGE',
        `Age ${input.age} is outside the allowed entry age range (${rules.minAge} to ${rules.maxAge} years).`,
        'age'
      );
    }

    if (input.policyTerm < rules.minTerm || input.policyTerm > rules.maxTerm) {
      throw new CalculatorExecutionError(
        'INVALID_RANGE',
        `Policy term ${input.policyTerm} is outside allowed term range (${rules.minTerm} to ${rules.maxTerm} years).`,
        'policyTerm'
      );
    }

    if (input.sumAssured < rules.minSumAssured) {
      throw new CalculatorExecutionError(
        'INVALID_RANGE',
        `Sum assured ₹${input.sumAssured.toLocaleString('en-IN')} is below minimum required sum assured of ₹${rules.minSumAssured.toLocaleString('en-IN')}.`,
        'sumAssured'
      );
    }

    // 2. Base Premium Calculation
    const thousandsOfSA = input.sumAssured / 1000;
    const rawBaseRupees = thousandsOfSA * rules.baseRatePerThousand;
    const basicAnnualPremium = moneyFromRupees(rawBaseRupees);

    // 3. High Sum Assured Rebate
    let highSaRebateRate = 0;
    for (const tier of rules.highSaRebates) {
      if (input.sumAssured >= tier.minSa && (tier.maxSa === undefined || input.sumAssured <= tier.maxSa)) {
        highSaRebateRate = tier.rebatePerThousand;
      }
    }
    const highSaDiscount = moneyFromRupees(thousandsOfSA * highSaRebateRate);

    // 4. Modal Rebate
    const modeRebatePercentVal = rules.modeRebates[input.premiumFrequency] ?? 0;
    const modeRebatePercent = fromPercentage(modeRebatePercentVal);
    const premiumAfterHighSa = subtractMoney(basicAnnualPremium, highSaDiscount);
    const modeDiscount = applyPercentageToMoney(premiumAfterHighSa, modeRebatePercent);

    // Net Annual Premium before riders & GST
    const netAnnualPremium = subtractMoney(premiumAfterHighSa, modeDiscount);

    // 5. Modal Installment Frequency Division
    const installments = FREQUENCY_INSTALLMENTS[input.premiumFrequency] ?? 1;
    const installmentBase = divideMoney(netAnnualPremium, installments);

    // 6. Optional Rider Premium (e.g. ADDB)
    let riderInstallment = moneyFromRupees(0);
    if (input.includeAccidentalRider && rules.riderRatePerThousand) {
      const annualRiderRupees = thousandsOfSA * rules.riderRatePerThousand;
      riderInstallment = divideMoney(moneyFromRupees(annualRiderRupees), installments);
    }

    // 7. GST Computation (Year 1 vs Renewal)
    const taxableInstallment = addMoney(installmentBase, riderInstallment);
    const firstYearGst = applyPercentageToMoney(
      taxableInstallment,
      fromPercentage(rules.gstRateFirstYear)
    );
    const renewalGst = applyPercentageToMoney(
      taxableInstallment,
      fromPercentage(rules.gstRateRenewal)
    );

    const firstYearInstallment = addMoney(taxableInstallment, firstYearGst);
    const renewalInstallment = addMoney(taxableInstallment, renewalGst);

    if (ruleEntry.version.sourceReference.includes('TEST FIXTURE')) {
      warnings.add(
        'TEST_FIXTURE_NOTICE',
        'Calculated using synthetic rule fixtures for testing purposes. Not official LIC figures.',
        undefined,
        'info'
      );
    }

    // 8. Breakdown Builder
    const breakdown = new BreakdownBuilder('Premium Calculation Breakdown')
      .addLine('base', 'Basic Tabular Premium', basicAnnualPremium, true, 'base')
      .addLine('high_sa_rebate', 'High Sum Assured Discount', highSaDiscount, false, 'rebate')
      .addLine('mode_rebate', `${input.premiumFrequency.toUpperCase()} Mode Discount`, modeDiscount, false, 'rebate');

    if (input.includeAccidentalRider) {
      const annualRiderMoney = multiplyMoney(riderInstallment, installments);
      breakdown.addLine('rider', 'Accidental Death & Disability Rider', annualRiderMoney, true, 'rider');
    }

    breakdown.addLine('gst_y1', `First Year GST (${rules.gstRateFirstYear}%)`, multiplyMoney(firstYearGst, installments), true, 'tax');

    const resultData: PremiumResultData = {
      planCode: String(input.planTableNo),
      sumAssured: moneyFromRupees(input.sumAssured),
      basicAnnualPremium,
      highSaDiscount,
      modeDiscount,
      netAnnualPremium,
      riderPremium: multiplyMoney(riderInstallment, installments),
      firstYearGst,
      renewalGst,
      firstYearInstallment,
      renewalInstallment,
      installmentsPerYear: installments,
      mode: input.premiumFrequency
    };

    return createCalculatorResult<PremiumResultData>({
      calculatorId: this.calculatorId,
      result: resultData,
      primaryAmount: firstYearInstallment,
      breakdown: breakdown.build(),
      warnings: warnings.getWarnings(),
      ruleVersion: ruleEntry.version,
      startTime
    });
  }
}
