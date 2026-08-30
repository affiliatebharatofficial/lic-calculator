/**
 * Centralized Validation Engine
 * Validates user & API inputs deterministically and returns structured errors.
 */

import type { ValidationError, ValidationResult } from './errors';
import { isValidISODate, compareISODates } from '../core/dates';

export class ValidationBuilder {
  private readonly errors: ValidationError[] = [];

  public require(field: string, value: unknown, customMessage?: string): this {
    if (value === undefined || value === null || value === '') {
      this.errors.push({
        code: 'MISSING_INPUT',
        field,
        message: customMessage || `Field '${field}' is required.`,
        value
      });
    }
    return this;
  }

  public number(field: string, value: unknown, customMessage?: string): this {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!Number.isFinite(num) || isNaN(num)) {
        this.errors.push({
          code: 'INVALID_INPUT',
          field,
          message: customMessage || `Field '${field}' must be a valid number.`,
          value
        });
      }
    }
    return this;
  }

  public integer(field: string, value: unknown, customMessage?: string): this {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!Number.isInteger(num)) {
        this.errors.push({
          code: 'INVALID_INPUT',
          field,
          message: customMessage || `Field '${field}' must be a whole integer.`,
          value
        });
      }
    }
    return this;
  }

  public positiveNumber(field: string, value: unknown, customMessage?: string): this {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!Number.isFinite(num) || num <= 0) {
        this.errors.push({
          code: 'INVALID_RANGE',
          field,
          message: customMessage || `Field '${field}' must be greater than zero.`,
          value
        });
      }
    }
    return this;
  }

  public nonNegativeNumber(field: string, value: unknown, customMessage?: string): this {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!Number.isFinite(num) || num < 0) {
        this.errors.push({
          code: 'INVALID_RANGE',
          field,
          message: customMessage || `Field '${field}' must not be negative.`,
          value
        });
      }
    }
    return this;
  }

  public range(
    field: string,
    value: unknown,
    min: number,
    max: number,
    customMessage?: string
  ): this {
    if (value !== undefined && value !== null && value !== '') {
      const num = Number(value);
      if (!Number.isFinite(num) || num < min || num > max) {
        this.errors.push({
          code: 'INVALID_RANGE',
          field,
          message: customMessage || `Field '${field}' must be between ${min} and ${max}.`,
          value,
          details: { min, max }
        });
      }
    }
    return this;
  }

  public enum<T extends string | number>(
    field: string,
    value: unknown,
    allowedValues: readonly T[],
    customMessage?: string
  ): this {
    if (value !== undefined && value !== null && value !== '') {
      if (!allowedValues.includes(value as T)) {
        this.errors.push({
          code: 'INVALID_INPUT',
          field,
          message:
            customMessage ||
            `Field '${field}' contains invalid value. Allowed options: ${allowedValues.join(', ')}.`,
          value,
          details: { allowed: allowedValues }
        });
      }
    }
    return this;
  }

  public isoDate(field: string, value: unknown, customMessage?: string): this {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value !== 'string' || !isValidISODate(value)) {
        this.errors.push({
          code: 'INVALID_DATE',
          field,
          message: customMessage || `Field '${field}' must be a valid date in YYYY-MM-DD format.`,
          value
        });
      }
    }
    return this;
  }

  public dateSequence(
    startField: string,
    startDate: unknown,
    endField: string,
    endDate: unknown,
    customMessage?: string
  ): this {
    if (
      typeof startDate === 'string' &&
      isValidISODate(startDate) &&
      typeof endDate === 'string' &&
      isValidISODate(endDate)
    ) {
      if (compareISODates(endDate, startDate) < 0) {
        this.errors.push({
          code: 'INVALID_DATE',
          field: endField,
          message:
            customMessage ||
            `Date '${endField}' (${endDate}) cannot be earlier than '${startField}' (${startDate}).`,
          details: { startDate, endDate }
        });
      }
    }
    return this;
  }

  public custom(
    isValid: boolean,
    field: string,
    message: string,
    code: ValidationError['code'] = 'INVALID_INPUT',
    value?: unknown
  ): this {
    if (!isValid) {
      this.errors.push({
        code,
        field,
        message,
        value
      });
    }
    return this;
  }

  public build(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: Object.freeze([...this.errors])
    };
  }
}
