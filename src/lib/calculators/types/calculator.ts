/**
 * Core Calculator Contract Types
 */

import type { Money, Percentage } from './money';
import type { RuleVersion } from './rules';

export interface CalculatorContext {
  readonly calculationDate: string; // ISO date "YYYY-MM-DD"
  readonly locale?: string;
  readonly roundToRupee?: boolean; // default true for consumer display
}

export interface CalculationLineItem {
  readonly id: string;
  readonly label: string;
  readonly amount: Money;
  readonly isAddition: boolean; // true = +, false = -
  readonly percentage?: Percentage;
  readonly notes?: string;
  readonly category?: 'base' | 'rebate' | 'tax' | 'rider' | 'bonus' | 'deduction' | 'adjustment';
}

export interface CalculationBreakdown {
  readonly title: string;
  readonly items: readonly CalculationLineItem[];
  readonly subtotal: Money;
  readonly netTotal: Money;
}

export interface CalculationWarning {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly severity: 'info' | 'warning';
}

export interface CalculationError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly details?: Record<string, unknown>;
}

export interface CalculatorResult<TData = Record<string, unknown>> {
  readonly calculatorId: string;
  readonly success: boolean;
  readonly currency: 'INR';
  readonly result: TData;
  readonly primaryAmount: Money;
  readonly breakdown: CalculationBreakdown;
  readonly warnings: readonly CalculationWarning[];
  readonly ruleVersion: RuleVersion;
  readonly calculatedAt: string; // ISO 8601 timestamp
  readonly executionTimeMs: number;
}

export interface ICalculator<TInput, TRules, TData = Record<string, unknown>> {
  readonly calculatorId: string;
  readonly name: string;
  readonly description: string;
  readonly requiredRuleTypes: readonly string[];

  validate(input: unknown): { isValid: boolean; errors: readonly CalculationError[] };
  calculate(input: TInput, rules: TRules, context?: Partial<CalculatorContext>): CalculatorResult<TData>;
}
