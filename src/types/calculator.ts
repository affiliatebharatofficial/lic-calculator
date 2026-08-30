/**
 * Generic Deterministic Financial Calculator Interfaces
 */

export type CalculatorType =
  | 'premium'
  | 'maturity'
  | 'bonus'
  | 'surrender-value'
  | 'surrender-loss'
  | 'loan'
  | 'term-insurance'
  | 'pension'
  | 'annuity'
  | 'death-benefit';

export type PremiumPaymentFrequency = 'yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'single';

export interface BaseCalculatorInput {
  planId?: string;
  planTableNo?: string | number;
  policyCommencementDate?: string; // YYYY-MM-DD
  age?: number;
  policyTerm?: number; // In years
  premiumPayingTerm?: number; // In years (PPT)
  sumAssured?: number; // In INR
  premiumFrequency?: PremiumPaymentFrequency;
  annualPremium?: number; // In INR
  premiumsPaidCount?: number;
  totalPremiumsPaid?: number; // In INR
  accidentalBenefitRider?: boolean;
  criticalIllnessRider?: boolean;
  [key: string]: unknown;
}

export interface CalculationBreakdownItem {
  id: string;
  label: string;
  amount: number;
  percentage?: number;
  isCredit?: boolean; // true = added benefit, false = deduction/cost
  notes?: string;
}

export interface CalculationYearlyProjection {
  policyYear: number;
  age: number;
  cumulativePremiumsPaid: number;
  guaranteedSurrenderValue?: number;
  specialSurrenderValue?: number;
  estimatedSurrenderValue?: number;
  estimatedSurrenderLoss?: number;
  surrenderLossPercentage?: number;
  deathBenefit?: number;
  accruedBonus?: number;
  loanAvailable?: number;
  isMaturityYear?: boolean;
}

export interface CalculatorSummaryStat {
  key: string;
  label: string;
  value: number | string;
  formattedValue: string;
  tooltip?: string;
  badgeType?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export interface BaseCalculatorResult {
  calculatorType: CalculatorType;
  calculatedAt: string; // ISO 8601 string
  ruleVersionApplied: string;
  effectiveDateUsed: string;
  primaryResult: {
    label: string;
    amount: number;
    formattedAmount: string;
    secondaryNote?: string;
  };
  summaryStats: CalculatorSummaryStat[];
  breakdown: CalculationBreakdownItem[];
  yearlyProjections?: CalculationYearlyProjection[];
  assumptions: string[];
  disclaimers: string[];
  notes?: string[];
}

export interface CalculatorFieldDefinition {
  name: string;
  label: string;
  description?: string;
  type: 'number' | 'text' | 'select' | 'date' | 'boolean';
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: string | number }>;
  unit?: string;
  placeholder?: string;
  helpText?: string;
}

export interface CalculatorDefinition {
  id: CalculatorType;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  category: 'general' | 'surrender' | 'retirement' | 'protection';
  fields: CalculatorFieldDefinition[];
  isAvailable: boolean;
}

export interface RuleSelectorCriteria {
  planTableNo: string | number;
  ruleType: CalculatorType;
  effectiveDate: string; // YYYY-MM-DD
  version?: string;
}

export interface BaseCalculatorRule {
  id: string;
  planTableNo: string | number;
  ruleType: CalculatorType;
  version: string;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD or null
  status: 'active' | 'deprecated' | 'draft';
  sourceReference: string;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
