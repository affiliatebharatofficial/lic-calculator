/**
 * Validation Error Types
 */

import type { CalculationError } from '../types/calculator';

export interface ValidationError extends CalculationError {
  readonly field: string;
  readonly value?: unknown;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
}
