/**
 * Centralized Financial Rounding Engine
 * All financial calculators must use this module instead of Math.round/Math.floor
 */

import type { RoundMode } from '../types/money';

/**
 * Deterministically rounds a number or decimal value based on the specified mode.
 * @param value The value to round
 * @param decimals Number of decimal places to preserve (default 0)
 * @param mode Rounding mode ('half-up' | 'half-even' | 'floor' | 'ceil' | 'truncate')
 */
export function roundNumber(
  value: number,
  decimals: number = 0,
  mode: RoundMode = 'half-up'
): number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Cannot round non-finite value: ${value}`);
  }

  const factor = Math.pow(10, decimals);
  const shifted = value * factor;

  // Handle tiny floating point noise (e.g. 1.0000000000000002)
  const epsilon = 1e-12;
  const normalized = Math.abs(shifted - Math.round(shifted)) < epsilon ? Math.round(shifted) : shifted;

  let rounded: number;

  switch (mode) {
    case 'half-up': {
      // Standard commercial rounding: >= 0.5 away from zero
      const sign = normalized >= 0 ? 1 : -1;
      rounded = sign * Math.floor(Math.abs(normalized) + 0.5);
      break;
    }

    case 'half-even': {
      // Banker's rounding
      const floorVal = Math.floor(normalized);
      const diff = normalized - floorVal;
      if (Math.abs(diff - 0.5) < epsilon) {
        rounded = floorVal % 2 === 0 ? floorVal : floorVal + 1;
      } else {
        rounded = Math.round(normalized);
      }
      break;
    }

    case 'floor': {
      rounded = Math.floor(normalized);
      break;
    }

    case 'ceil': {
      rounded = Math.ceil(normalized);
      break;
    }

    case 'truncate': {
      rounded = Math.trunc(normalized);
      break;
    }

    default: {
      const exhaustiveCheck: never = mode;
      throw new Error(`Unsupported round mode: ${exhaustiveCheck}`);
    }
  }

  return rounded / factor;
}

/**
 * Rounds a paise integer to the nearest whole rupee (100 paise).
 * Useful for consumer-facing policy quotes where nearest rupee rounding is mandated.
 */
export function roundPaiseToRupee(paise: number, mode: RoundMode = 'half-up'): number {
  const rupees = paise / 100;
  const roundedRupees = roundNumber(rupees, 0, mode);
  return Math.round(roundedRupees * 100);
}
