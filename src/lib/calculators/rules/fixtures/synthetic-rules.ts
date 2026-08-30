/**
 * ============================================================================
 * SYNTHETIC TEST FIXTURES — NOT REAL LIC DATA
 * ============================================================================
 * IMPORTANT: These rule sets contain synthetic mathematical values created
 * exclusively for automated engine unit tests, verification of boundary conditions,
 * and property testing. They DO NOT represent real official LIC rates or circulars.
 * Real verified data will be provided via Cloudflare D1 in Phase 4.
 * ============================================================================
 */

import type { RuleEntry } from '../provider';
import type { PremiumFrequency } from '../../types/frequency';

export interface SyntheticPremiumRuleData {
  readonly baseRatePerThousand: number; // e.g. 48.50 per 1,000 SA
  readonly minAge: number;
  readonly maxAge: number;
  readonly minTerm: number;
  readonly maxTerm: number;
  readonly minSumAssured: number;
  readonly modeRebates: Record<PremiumFrequency, number>; // percentage rebate
  readonly highSaRebates: readonly { minSa: number; maxSa?: number; rebatePerThousand: number }[];
  readonly gstRateFirstYear: number;   // e.g. 4.5%
  readonly gstRateRenewal: number;     // e.g. 2.25%
  readonly riderRatePerThousand?: number; // e.g. 1.0 per 1,000 SA
}

export const SYNTHETIC_PREMIUM_RULE_914: RuleEntry<SyntheticPremiumRuleData> = {
  version: {
    version: 'SYNTHETIC_2024.1',
    planCode: '914',
    ruleType: 'premium_rules',
    effectiveFrom: '2020-01-01',
    effectiveTo: '2099-12-31',
    status: 'active',
    sourceReference: 'TEST FIXTURE — NOT REAL LIC DATA'
  },
  data: {
    baseRatePerThousand: 49.70,
    minAge: 8,
    maxAge: 55,
    minTerm: 12,
    maxTerm: 35,
    minSumAssured: 100000,
    modeRebates: {
      'yearly': 2.0,
      'half-yearly': 1.0,
      'quarterly': 0.0,
      'monthly': 0.0,
      'single': 0.0
    },
    highSaRebates: [
      { minSa: 200000, maxSa: 499999, rebatePerThousand: 1.0 },
      { minSa: 500000, rebatePerThousand: 1.5 }
    ],
    gstRateFirstYear: 4.5,
    gstRateRenewal: 2.25,
    riderRatePerThousand: 1.0
  }
};

export interface SyntheticSurrenderRuleData {
  readonly minPaidYearsToAcquireValue: number; // e.g. 2 years
  readonly gsvFactors: readonly { completedYears: number; policyTerm: number; factor: number }[];
  readonly gsvBonusFactors: readonly { completedYears: number; policyTerm: number; factor: number }[];
  readonly ssvFactors: readonly { completedYears: number; policyTerm: number; factor: number }[];
  readonly ssvBonusFactor: number;
}

export const SYNTHETIC_SURRENDER_RULE_914: RuleEntry<SyntheticSurrenderRuleData> = {
  version: {
    version: 'SYNTHETIC_2024.1',
    planCode: '914',
    ruleType: 'surrender_rules',
    effectiveFrom: '2020-01-01',
    effectiveTo: '2099-12-31',
    status: 'active',
    sourceReference: 'TEST FIXTURE — NOT REAL LIC DATA'
  },
  data: {
    minPaidYearsToAcquireValue: 2,
    gsvFactors: [
      { completedYears: 2, policyTerm: 20, factor: 0.30 },
      { completedYears: 3, policyTerm: 20, factor: 0.35 },
      { completedYears: 4, policyTerm: 20, factor: 0.50 },
      { completedYears: 5, policyTerm: 20, factor: 0.50 },
      { completedYears: 6, policyTerm: 20, factor: 0.50 },
      { completedYears: 7, policyTerm: 20, factor: 0.50 },
      { completedYears: 10, policyTerm: 20, factor: 0.55 },
      { completedYears: 15, policyTerm: 20, factor: 0.65 },
      { completedYears: 20, policyTerm: 20, factor: 0.90 }
    ],
    gsvBonusFactors: [
      { completedYears: 2, policyTerm: 20, factor: 0.00 },
      { completedYears: 3, policyTerm: 20, factor: 0.15 },
      { completedYears: 5, policyTerm: 20, factor: 0.17 },
      { completedYears: 10, policyTerm: 20, factor: 0.20 },
      { completedYears: 15, policyTerm: 20, factor: 0.25 },
      { completedYears: 20, policyTerm: 20, factor: 0.30 }
    ],
    ssvFactors: [
      { completedYears: 2, policyTerm: 20, factor: 0.40 },
      { completedYears: 3, policyTerm: 20, factor: 0.45 },
      { completedYears: 5, policyTerm: 20, factor: 0.55 },
      { completedYears: 10, policyTerm: 20, factor: 0.70 },
      { completedYears: 15, policyTerm: 20, factor: 0.85 },
      { completedYears: 20, policyTerm: 20, factor: 1.00 }
    ],
    ssvBonusFactor: 1.0
  }
};

export interface SyntheticMaturityRuleData {
  readonly simpleReversionaryBonusPerThousand: number; // e.g. 42 per 1000 SA
  readonly minFabTerm: number; // e.g. 15 years
  readonly fabPerThousand: number; // e.g. 100 per 1000 SA for 20 yrs
}

export const SYNTHETIC_MATURITY_RULE_914: RuleEntry<SyntheticMaturityRuleData> = {
  version: {
    version: 'SYNTHETIC_2024.1',
    planCode: '914',
    ruleType: 'maturity_rules',
    effectiveFrom: '2020-01-01',
    effectiveTo: '2099-12-31',
    status: 'active',
    sourceReference: 'TEST FIXTURE — NOT REAL LIC DATA'
  },
  data: {
    simpleReversionaryBonusPerThousand: 42.0,
    minFabTerm: 15,
    fabPerThousand: 70.0
  }
};

export interface SyntheticLoanRuleData {
  readonly maxLoanPercentInForce: number; // e.g. 90%
  readonly maxLoanPercentPaidUp: number;  // e.g. 80%
  readonly annualInterestRate: number;    // e.g. 9.5%
}

export const SYNTHETIC_LOAN_RULE_GENERAL: RuleEntry<SyntheticLoanRuleData> = {
  version: {
    version: 'SYNTHETIC_2024.1',
    planCode: 'GENERAL',
    ruleType: 'loan_rules',
    effectiveFrom: '2020-01-01',
    effectiveTo: '2099-12-31',
    status: 'active',
    sourceReference: 'TEST FIXTURE — NOT REAL LIC DATA'
  },
  data: {
    maxLoanPercentInForce: 90.0,
    maxLoanPercentPaidUp: 80.0,
    annualInterestRate: 9.5
  }
};

export interface SyntheticPensionRuleData {
  readonly annuityRatesByAge: readonly { age: number; ratePercent: number }[];
  readonly defaultAnnuityRatePercent: number;
}

export const SYNTHETIC_PENSION_RULE_857: RuleEntry<SyntheticPensionRuleData> = {
  version: {
    version: 'SYNTHETIC_2024.1',
    planCode: '857',
    ruleType: 'pension_rules',
    effectiveFrom: '2020-01-01',
    effectiveTo: '2099-12-31',
    status: 'active',
    sourceReference: 'TEST FIXTURE — NOT REAL LIC DATA'
  },
  data: {
    annuityRatesByAge: [
      { age: 40, ratePercent: 5.60 },
      { age: 50, ratePercent: 6.10 },
      { age: 60, ratePercent: 6.95 },
      { age: 70, ratePercent: 8.20 },
      { age: 80, ratePercent: 10.50 }
    ],
    defaultAnnuityRatePercent: 6.95
  }
};
