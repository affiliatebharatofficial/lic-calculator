import type {
  BaseCalculatorInput,
  BaseCalculatorResult,
  BaseCalculatorRule,
  CalculatorType
} from '@/types/calculator';
import type { ValidationResult } from '@/lib/validation';

/**
 * Pure Deterministic Calculator Engine Interface
 * Separation of concerns: UI <-> Validation <-> Engine <-> Rule Provider
 */
export interface ICalculatorEngine<
  TInput extends BaseCalculatorInput = BaseCalculatorInput,
  TResult extends BaseCalculatorResult = BaseCalculatorResult,
  TRule extends BaseCalculatorRule = BaseCalculatorRule
> {
  readonly type: CalculatorType;
  validate(input: TInput): ValidationResult;
  calculate(input: TInput, rule: TRule): Promise<TResult> | TResult;
}

/**
 * Base Abstract Calculator Engine
 */
export abstract class BaseCalculatorEngine<
  TInput extends BaseCalculatorInput = BaseCalculatorInput,
  TResult extends BaseCalculatorResult = BaseCalculatorResult,
  TRule extends BaseCalculatorRule = BaseCalculatorRule
> implements ICalculatorEngine<TInput, TResult, TRule> {
  abstract readonly type: CalculatorType;

  abstract validate(input: TInput): ValidationResult;

  abstract calculate(input: TInput, rule: TRule): Promise<TResult> | TResult;

  protected createBaseResultMeta(rule: TRule) {
    return {
      calculatorType: this.type,
      calculatedAt: new Date().toISOString(),
      ruleVersionApplied: rule.version,
      effectiveDateUsed: rule.effectiveFrom,
      disclaimers: [
        'lic-calculators.com is an independent platform and is NOT affiliated with Life Insurance Corporation of India (LIC).',
        'All calculation results are purely estimates for informational and comparison purposes.',
        'Official values must be confirmed directly with an authorized LIC branch or the official LIC website.'
      ]
    };
  }
}
