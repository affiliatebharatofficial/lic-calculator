/**
 * Deterministic Money Utility Engine
 * Stored internally as integer minor units (paise).
 * 1 INR = 100 paise.
 */

import type { Money } from '../types/money';
import { roundNumber } from './rounding';

/**
 * Creates a Money object from Rupees (e.g. 50000.50 -> 5000050 paise).
 */
export function moneyFromRupees(rupees: number): Money {
  if (!Number.isFinite(rupees)) {
    throw new TypeError(`Invalid rupee amount: ${rupees}`);
  }
  // Convert to exact integer paise with roundNumber to avoid float representation quirks
  const paise = roundNumber(rupees * 100, 0, 'half-up');
  return {
    paise: Math.trunc(paise),
    currency: 'INR'
  };
}

/**
 * Creates a Money object directly from integer paise.
 */
export function moneyFromPaise(paise: number): Money {
  if (!Number.isFinite(paise) || !Number.isInteger(paise)) {
    throw new TypeError(`Paise must be a finite integer, received: ${paise}`);
  }
  return {
    paise: Math.trunc(paise),
    currency: 'INR'
  };
}

/**
 * Zero money constant helper.
 */
export const ZERO_MONEY: Money = Object.freeze({
  paise: 0,
  currency: 'INR'
});

/**
 * Converts a Money object to standard Rupee floating number.
 */
export function moneyToRupees(money: Money): number {
  return money.paise / 100;
}

/**
 * Safe immutable addition of two Money objects.
 */
export function addMoney(a: Money, b: Money): Money {
  return {
    paise: a.paise + b.paise,
    currency: 'INR'
  };
}

/**
 * Safe immutable subtraction of two Money objects (a - b).
 */
export function subtractMoney(a: Money, b: Money): Money {
  return {
    paise: a.paise - b.paise,
    currency: 'INR'
  };
}

/**
 * Safe immutable multiplication of Money by a scalar factor.
 */
export function multiplyMoney(money: Money, scalar: number): Money {
  if (!Number.isFinite(scalar)) {
    throw new TypeError(`Scalar must be finite, received: ${scalar}`);
  }
  const multiplied = roundNumber(money.paise * scalar, 0, 'half-up');
  return {
    paise: Math.trunc(multiplied),
    currency: 'INR'
  };
}

/**
 * Safe immutable division of Money by a divisor.
 */
export function divideMoney(money: Money, divisor: number): Money {
  if (!Number.isFinite(divisor) || divisor === 0) {
    throw new TypeError(`Divisor must be a non-zero finite number, received: ${divisor}`);
  }
  const divided = roundNumber(money.paise / divisor, 0, 'half-up');
  return {
    paise: Math.trunc(divided),
    currency: 'INR'
  };
}

/**
 * Sums an array of Money objects safely.
 */
export function sumMoney(items: readonly Money[]): Money {
  let totalPaise = 0;
  for (const item of items) {
    totalPaise += item.paise;
  }
  return {
    paise: totalPaise,
    currency: 'INR'
  };
}

/**
 * Checks if a Money object is strictly equal to zero.
 */
export function isZeroMoney(money: Money): boolean {
  return money.paise === 0;
}

/**
 * Checks if a Money object is strictly negative.
 */
export function isNegativeMoney(money: Money): boolean {
  return money.paise < 0;
}

/**
 * Checks if a Money object is strictly positive.
 */
export function isPositiveMoney(money: Money): boolean {
  return money.paise > 0;
}

/**
 * Compares two Money objects.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareMoney(a: Money, b: Money): number {
  if (a.paise < b.paise) return -1;
  if (a.paise > b.paise) return 1;
  return 0;
}

/**
 * Returns the maximum of two or more Money objects.
 */
export function maxMoney(...items: Money[]): Money {
  const first = items[0];
  if (!first) return ZERO_MONEY;
  return items.reduce((max, curr) => (curr.paise > max.paise ? curr : max), first);
}

/**
 * Returns the minimum of two or more Money objects.
 */
export function minMoney(...items: Money[]): Money {
  const first = items[0];
  if (!first) return ZERO_MONEY;
  return items.reduce((min, curr) => (curr.paise < min.paise ? curr : min), first);
}

/**
 * Formats a Money object into standard Indian Rupees notation.
 * e.g. 50000000 paise -> "₹5,00,000"
 */
export function formatMoneyINR(money: Money, includeDecimals: boolean = false): string {
  const rupees = money.paise / 100;
  const isNeg = rupees < 0;
  const absRupees = Math.abs(rupees);

  let formatted: string;
  if (includeDecimals) {
    formatted = absRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    formatted = Math.round(absRupees).toLocaleString('en-IN');
  }

  return `${isNeg ? '-' : ''}₹${formatted}`;
}
