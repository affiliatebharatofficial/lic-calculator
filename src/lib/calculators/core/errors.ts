/**
 * Financial Calculation Typed Error System
 */

import type { CalculationError } from '../types/calculator';

export type CalculationErrorCode =
  | 'INVALID_INPUT'
  | 'MISSING_INPUT'
  | 'INVALID_DATE'
  | 'INVALID_RANGE'
  | 'RULE_NOT_FOUND'
  | 'RULE_EXPIRED'
  | 'UNSUPPORTED_PLAN'
  | 'UNSUPPORTED_FREQUENCY'
  | 'CALCULATION_ERROR'
  | 'INTERNAL_ERROR';

export class CalculatorExecutionError extends Error {
  public readonly code: CalculationErrorCode;
  public readonly field?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: CalculationErrorCode,
    message: string,
    field?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CalculatorExecutionError';
    this.code = code;
    this.field = field;
    this.details = details;
    Object.setPrototypeOf(this, CalculatorExecutionError.prototype);
  }

  public toCalculationError(): CalculationError {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      details: this.details
    };
  }
}

export function createCalculationError(
  code: CalculationErrorCode,
  message: string,
  field?: string,
  details?: Record<string, unknown>
): CalculationError {
  return {
    code,
    message,
    field,
    details
  };
}
