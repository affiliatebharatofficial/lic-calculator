/**
 * Number and Precision Utilities for Financial Calculations
 */

/**
 * Rounds a number to a specified number of decimal places safely
 */
export function safeRound(value: number, decimals: number = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Performs safe addition of currency amounts avoiding floating-point imprecision
 */
export function safeAdd(...amounts: number[]): number {
  const sum = amounts.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
  return safeRound(sum, 2);
}

/**
 * Performs safe subtraction of currency amounts
 */
export function safeSubtract(a: number, b: number): number {
  return safeRound((isNaN(a) ? 0 : a) - (isNaN(b) ? 0 : b), 2);
}

/**
 * Performs safe multiplication
 */
export function safeMultiply(a: number, b: number): number {
  return safeRound((isNaN(a) ? 0 : a) * (isNaN(b) ? 0 : b), 4);
}

/**
 * Formats a decimal/percentage to readable string (e.g., 8.5%)
 */
export function formatPercentage(
  rate: number | null | undefined,
  options: { decimals?: number; includeSymbol?: boolean } = {}
): string {
  if (rate === null || rate === undefined || isNaN(rate)) return '0%';
  const { decimals = 2, includeSymbol = true } = options;
  const rounded = safeRound(rate, decimals);
  return `${rounded}${includeSymbol ? '%' : ''}`;
}

/**
 * Formats years into a readable duration string (e.g., "15 Years", "1 Year")
 */
export function formatYears(years: number): string {
  if (isNaN(years) || years < 0) return '0 Years';
  return years === 1 ? '1 Year' : `${years} Years`;
}
