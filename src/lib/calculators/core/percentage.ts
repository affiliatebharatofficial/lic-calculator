/**
 * Deterministic Percentage Engine
 * Stored internally as basis points (1% = 100 basis points).
 * Prevents 5 vs 0.05 bugs and provides exact integer/scaled percentage arithmetic.
 */

import type { Money, Percentage, RoundMode } from '../types/money';
import { roundNumber } from './rounding';

/**
 * Creates a Percentage from standard whole percentage value (e.g. 5 -> 500 bps).
 */
export function fromPercentage(val: number): Percentage {
  if (!Number.isFinite(val)) {
    throw new TypeError(`Invalid percentage: ${val}`);
  }
  // Convert to basis points (5% = 500 bps, 4.5% = 450 bps, 0.25% = 25 bps)
  const bps = roundNumber(val * 100, 2, 'half-up');
  return {
    basisPoints: Math.trunc(bps)
  };
}

/**
 * Creates a Percentage directly from integer basis points.
 */
export function fromBasisPoints(basisPoints: number): Percentage {
  if (!Number.isFinite(basisPoints)) {
    throw new TypeError(`Invalid basis points: ${basisPoints}`);
  }
  return {
    basisPoints: Math.trunc(basisPoints)
  };
}

/**
 * Creates a Percentage from a decimal fraction (e.g. 0.05 -> 500 bps).
 */
export function fromFraction(fraction: number): Percentage {
  if (!Number.isFinite(fraction)) {
    throw new TypeError(`Invalid fraction: ${fraction}`);
  }
  const bps = roundNumber(fraction * 10000, 2, 'half-up');
  return {
    basisPoints: Math.trunc(bps)
  };
}

/**
 * Converts a Percentage object to a decimal fraction (e.g. 500 bps -> 0.05).
 */
export function toFraction(percentage: Percentage): number {
  return percentage.basisPoints / 10000;
}

/**
 * Converts a Percentage object to whole percentage number (e.g. 500 bps -> 5.0).
 */
export function toPercentageNumber(percentage: Percentage): number {
  return percentage.basisPoints / 100;
}

/**
 * Multiplies a Money object by a Percentage safely and deterministically.
 * @param money The Money amount
 * @param percentage The Percentage
 * @param mode Rounding mode for the resulting minor units (default 'half-up')
 */
export function applyPercentageToMoney(
  money: Money,
  percentage: Percentage,
  mode: RoundMode = 'half-up'
): Money {
  // paise * (basisPoints / 10000)
  const calculatedPaise = (money.paise * percentage.basisPoints) / 10000;
  const roundedPaise = roundNumber(calculatedPaise, 0, mode);
  return {
    paise: Math.trunc(roundedPaise),
    currency: 'INR'
  };
}

/**
 * Calculates the percentage ratio of a part to a total Money object.
 * Returns Percentage in basis points.
 * Returns 0 if total is 0.
 */
export function calculatePercentageRatio(
  part: Money,
  total: Money,
  mode: RoundMode = 'half-up'
): Percentage {
  if (total.paise === 0) {
    return { basisPoints: 0 };
  }
  const ratio = (part.paise / total.paise) * 10000;
  const roundedBps = roundNumber(ratio, 0, mode);
  return {
    basisPoints: Math.trunc(roundedBps)
  };
}

/**
 * Formats a Percentage object into a display string (e.g. 500 bps -> "5.00%" or "5%").
 */
export function formatPercentage(percentage: Percentage, decimals: number = 2): string {
  const val = percentage.basisPoints / 100;
  return `${val.toFixed(decimals)}%`;
}
