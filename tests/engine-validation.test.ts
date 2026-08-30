import { describe, it, expect } from 'vitest';
import { ValidationBuilder } from '@/lib/calculators';

describe('Centralized Validation Engine', () => {
  it('detects missing required fields', () => {
    const v = new ValidationBuilder()
      .require('sumAssured', undefined)
      .require('age', '')
      .build();

    expect(v.isValid).toBe(false);
    expect(v.errors).toHaveLength(2);
    expect(v.errors[0]?.code).toBe('MISSING_INPUT');
    expect(v.errors[0]?.field).toBe('sumAssured');
  });

  it('validates numeric ranges and integer constraints', () => {
    const v = new ValidationBuilder()
      .number('sumAssured', 'not-a-number')
      .integer('age', 30.5)
      .range('policyTerm', 45, 5, 40)
      .build();

    expect(v.isValid).toBe(false);
    expect(v.errors).toHaveLength(3);
    expect(v.errors[0]?.field).toBe('sumAssured');
    expect(v.errors[1]?.field).toBe('age');
    expect(v.errors[2]?.field).toBe('policyTerm');
  });

  it('validates allowed enum values', () => {
    const v = new ValidationBuilder()
      .enum('premiumFrequency', 'bi-weekly', ['yearly', 'half-yearly', 'quarterly', 'monthly', 'single'])
      .build();

    expect(v.isValid).toBe(false);
    expect(v.errors[0]?.code).toBe('INVALID_INPUT');
    expect(v.errors[0]?.field).toBe('premiumFrequency');
  });

  it('validates ISO date format and logical sequence', () => {
    const v = new ValidationBuilder()
      .isoDate('commencementDate', '2020-13-45')
      .dateSequence('commencementDate', '2024-01-01', 'calculationDate', '2020-01-01')
      .build();

    expect(v.isValid).toBe(false);
    expect(v.errors).toHaveLength(2);
    expect(v.errors[0]?.code).toBe('INVALID_DATE');
    expect(v.errors[1]?.code).toBe('INVALID_DATE');
  });

  it('returns isValid true when all rules pass', () => {
    const v = new ValidationBuilder()
      .require('planCode', 914)
      .positiveNumber('sumAssured', 500000)
      .range('age', 30, 8, 55)
      .range('policyTerm', 20, 12, 35)
      .enum('frequency', 'yearly', ['yearly', 'monthly'])
      .isoDate('date', '2024-05-15')
      .build();

    expect(v.isValid).toBe(true);
    expect(v.errors).toHaveLength(0);
  });
});
