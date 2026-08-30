/**
 * Money & Financial Types for Deterministic Calculator Engine
 */

export type CurrencyCode = 'INR' | 'USD';

export type RoundMode =
  | 'half-up'    // Standard financial rounding: >= 0.5 rounds up away from zero
  | 'half-even'  // Banker's rounding: round to nearest even integer
  | 'floor'      // Round toward negative infinity
  | 'ceil'       // Round toward positive infinity
  | 'truncate';  // Round toward zero

export interface Money {
  /**
   * Internal representation in minor units (paise for INR).
   * 1 INR = 100 paise. Stored as integer.
   */
  readonly paise: number;
  readonly currency: CurrencyCode;
}

export interface Percentage {
  /**
   * Internal representation in basis points (1% = 100 bps, 0.01% = 1 bps).
   * Stored as integer or exact scaled integer to avoid floating point ambiguity.
   */
  readonly basisPoints: number;
}
