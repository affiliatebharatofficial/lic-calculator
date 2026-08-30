/**
 * Safe API Adapter for Cloudflare Worker & Endpoint Integration
 * Decouples HTTP request parsing from deterministic calculator engines.
 */

import type { ICalculator, CalculatorResult, CalculationError } from '../types/calculator';
import type { IRuleProvider } from '../rules/provider';
import type { RuleQuery } from '../types/rules';
import { CalculatorExecutionError } from '../core/errors';

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: CalculatorResult<T>;
  readonly errors?: readonly CalculationError[];
}

export async function executeCalculatorApi<TInput, TRules, TData>(
  calculator: ICalculator<TInput, TRules, TData>,
  ruleProvider: IRuleProvider,
  rawInput: unknown,
  ruleQuery: RuleQuery
): Promise<ApiResponse<TData>> {
  // 1. Validation step
  const validation = calculator.validate(rawInput);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }

  // 2. Rule lookup step
  const ruleEntry = await ruleProvider.getRule<TRules>(ruleQuery);
  if (!ruleEntry) {
    return {
      success: false,
      errors: [
        {
          code: 'RULE_NOT_FOUND',
          message: `Active calculation rules not found for plan ${ruleQuery.planCode} (${ruleQuery.ruleType}).`
        }
      ]
    };
  }

  // 3. Deterministic calculation step
  try {
    const result = calculator.calculate(rawInput as TInput, ruleEntry as any);
    return {
      success: true,
      data: result
    };
  } catch (err) {
    if (err instanceof CalculatorExecutionError) {
      return {
        success: false,
        errors: [err.toCalculationError()]
      };
    }
    return {
      success: false,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during calculation processing.'
        }
      ]
    };
  }
}
