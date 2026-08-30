/**
 * LIC Plan and Policy Classification Types
 */

export type PlanCategory =
  | 'endowment'
  | 'money-back'
  | 'whole-life'
  | 'term-assurance'
  | 'pension-annuity'
  | 'unit-linked'
  | 'micro-insurance'
  | 'health';

export interface PlanVariant {
  id: string;
  planId: string;
  variantCode: string;
  name: string;
  minAge: number;
  maxAge: number;
  minTerm: number;
  maxTerm: number;
  minSumAssured: number;
  maxSumAssured?: number;
  status: 'active' | 'withdrawn';
}

export interface LICPlan {
  id: string;
  tableNo: number; // e.g. 914 for New Endowment, 915 for New Jeevan Anand
  uin?: string; // Unique Identification Number from IRDAI
  name: string;
  category: PlanCategory;
  description: string;
  launchDate?: string;
  withdrawalDate?: string;
  status: 'active' | 'withdrawn';
  isWithProfits: boolean; // Eligible for simple reversionary bonus
  minAge: number;
  maxAge: number;
  minTerm: number;
  maxTerm: number;
  minSumAssured: number;
  maxSumAssured?: number;
  allowedFrequencies: ('yearly' | 'half-yearly' | 'quarterly' | 'monthly' | 'single')[];
  variants?: PlanVariant[];
  sourceUrl?: string;
}
