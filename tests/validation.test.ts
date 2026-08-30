import { describe, it, expect } from 'vitest';
import {
  validateAge,
  validateSumAssured,
  validatePolicyTerm,
  validatePPT,
  validatePremiumFrequency,
  validateDate,
  runValidation
} from '../src/lib/validation';

describe('Validation Utilities', () => {
  it('validates age correctly', () => {
    expect(validateAge(30, 18, 65)).toBeNull();
    expect(validateAge(15, 18, 65)).toContain('cannot be less than 18');
    expect(validateAge(70, 18, 65)).toContain('cannot exceed 65');
    expect(validateAge(25.5)).toContain('whole number');
  });

  it('validates sum assured correctly', () => {
    expect(validateSumAssured(500000)).toBeNull();
    expect(validateSumAssured(5000, 10000, 100000000)).toContain('cannot be less than');
    expect(validateSumAssured(-100)).toContain('cannot be less than');
  });

  it('validates policy term and PPT', () => {
    expect(validatePolicyTerm(20)).toBeNull();
    expect(validatePolicyTerm(2)).toContain('cannot be less than 5');
    expect(validatePPT(15, 20)).toBeNull();
    expect(validatePPT(25, 20)).toBe('Premium Paying Term cannot exceed the total Policy Term');
  });

  it('validates payment frequency', () => {
    expect(validatePremiumFrequency('yearly')).toBeNull();
    expect(validatePremiumFrequency('monthly')).toBeNull();
    expect(validatePremiumFrequency('invalid_mode')).toBe('Please select a valid premium payment frequency');
  });

  it('validates dates', () => {
    expect(validateDate('2024-05-15')).toBeNull();
    expect(validateDate('not-a-date')).toContain('must be a valid date');
    expect(validateDate('')).toContain('is required');
  });

  it('runs compound validation cleanly', () => {
    const valid = runValidation({
      age: () => validateAge(30),
      sumAssured: () => validateSumAssured(500000)
    });
    expect(valid.isValid).toBe(true);
    expect(Object.keys(valid.errors)).toHaveLength(0);

    const invalid = runValidation({
      age: () => validateAge(100, 0, 75),
      sumAssured: () => validateSumAssured(100)
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.age).toBeDefined();
    expect(invalid.errors.sumAssured).toBeDefined();
  });
});
