/**
 * Financial and Policy Input Validation Utilities
 * Can be run in both browser/client for snappy UX and on server-side for API security.
 */

import type { PremiumPaymentFrequency } from '@/types/calculator';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRequired(value: unknown, fieldName: string = 'Field'): string | null {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateNumericRange(
  value: unknown,
  min: number,
  max: number,
  fieldName: string = 'Value'
): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < min) {
    return `${fieldName} cannot be less than ${min.toLocaleString('en-IN')}`;
  }
  if (num > max) {
    return `${fieldName} cannot exceed ${max.toLocaleString('en-IN')}`;
  }
  return null;
}

export function validateAge(age: unknown, min: number = 0, max: number = 75): string | null {
  const err = validateNumericRange(age, min, max, 'Age');
  if (err) return err;
  const num = Number(age);
  if (!Number.isInteger(num)) {
    return 'Age must be a whole number in completed years';
  }
  return null;
}

export function validateSumAssured(
  sumAssured: unknown,
  min: number = 10000,
  max: number = 1000000000
): string | null {
  const err = validateNumericRange(sumAssured, min, max, 'Sum Assured');
  if (err) return err;
  const num = Number(sumAssured);
  if (num <= 0) {
    return 'Sum Assured must be greater than zero';
  }
  return null;
}

export function validatePolicyTerm(term: unknown, min: number = 5, max: number = 40): string | null {
  const err = validateNumericRange(term, min, max, 'Policy Term');
  if (err) return err;
  const num = Number(term);
  if (!Number.isInteger(num)) {
    return 'Policy Term must be a whole number of years';
  }
  return null;
}

export function validatePPT(ppt: unknown, policyTerm: unknown): string | null {
  const err = validateNumericRange(ppt, 1, 40, 'Premium Paying Term (PPT)');
  if (err) return err;
  const numPpt = Number(ppt);
  const numTerm = Number(policyTerm);
  if (policyTerm !== undefined && !isNaN(numTerm) && numPpt > numTerm) {
    return 'Premium Paying Term cannot exceed the total Policy Term';
  }
  return null;
}

export function validatePremiumFrequency(frequency: unknown): string | null {
  const validFrequencies: PremiumPaymentFrequency[] = ['yearly', 'half-yearly', 'quarterly', 'monthly', 'single'];
  if (!frequency || typeof frequency !== 'string' || !validFrequencies.includes(frequency as PremiumPaymentFrequency)) {
    return 'Please select a valid premium payment frequency';
  }
  return null;
}

export function validateDate(dateStr: unknown, fieldName: string = 'Date'): string | null {
  if (!dateStr || typeof dateStr !== 'string') {
    return `${fieldName} is required`;
  }
  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) {
    return `${fieldName} must be a valid date (YYYY-MM-DD)`;
  }
  return null;
}

/**
 * Validates a map of fields using validator functions
 */
export function runValidation(rules: Record<string, () => string | null>): ValidationResult {
  const errors: Record<string, string> = {};
  for (const [field, validateFn] of Object.entries(rules)) {
    const error = validateFn();
    if (error) {
      errors[field] = error;
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
