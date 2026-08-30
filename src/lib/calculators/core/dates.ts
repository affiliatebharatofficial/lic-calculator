/**
 * Deterministic Date Utility Engine for Financial Insurance Calculations
 * Uses date-only string ("YYYY-MM-DD") arithmetic to prevent timezone & DST bugs.
 */

export interface DateParts {
  readonly year: number;
  readonly month: number; // 1-12
  readonly day: number;   // 1-31
}

/**
 * Validates whether a string is a valid ISO date "YYYY-MM-DD" with correct calendar days.
 */
export function isValidISODate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const rawParts = dateStr.split('-');
  const year = Number(rawParts[0]);
  const month = Number(rawParts[1]);
  const day = Number(rawParts[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Verify real calendar days
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= daysInMonth;
}

/**
 * Parses an ISO date string into discrete Year, Month, Day parts.
 */
export function parseISODate(dateStr: string): DateParts {
  if (!isValidISODate(dateStr)) {
    throw new Error(`Invalid ISO date format, expected YYYY-MM-DD: "${dateStr}"`);
  }
  const rawParts = dateStr.split('-');
  const year = Number(rawParts[0]);
  const month = Number(rawParts[1]);
  const day = Number(rawParts[2]);

  return { year, month, day };
}

/**
 * Formats discrete Year, Month, Day parts into a standardized "YYYY-MM-DD" string.
 */
export function formatISODate(parts: DateParts): string {
  const y = String(parts.year).padStart(4, '0');
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Compares two ISO date strings.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareISODates(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Computes exact completed policy years between two dates.
 * e.g., 2020-05-15 to 2025-05-14 is 4 completed years; 2020-05-15 to 2025-05-15 is 5 completed years.
 */
export function diffInCompletedYears(startDateStr: string, endDateStr: string): number {
  const start = parseISODate(startDateStr);
  const end = parseISODate(endDateStr);

  if (compareISODates(endDateStr, startDateStr) < 0) {
    return 0;
  }

  let years = end.year - start.year;

  // If anniversary in end.year hasn't been reached yet, subtract 1
  if (end.month < start.month || (end.month === start.month && end.day < start.day)) {
    years -= 1;
  }

  return Math.max(0, years);
}

/**
 * Computes the policy anniversary date for a given policy year.
 * Policy Year 1 anniversary is commencement date.
 * Policy Year 2 anniversary is commencement date + 1 year, etc.
 */
export function getPolicyAnniversary(commencementDateStr: string, policyYear: number): string {
  if (policyYear < 1) {
    throw new Error(`Policy year must be >= 1, received: ${policyYear}`);
  }
  const start = parseISODate(commencementDateStr);
  const targetYear = start.year + (policyYear - 1);

  // Handle Feb 29 leap-year edge cases by clamping to Feb 28 on non-leap years
  const maxDay = new Date(Date.UTC(targetYear, start.month, 0)).getUTCDate();
  const day = Math.min(start.day, maxDay);

  return formatISODate({
    year: targetYear,
    month: start.month,
    day
  });
}

/**
 * Adds whole years to an ISO date.
 */
export function addYearsToISODate(dateStr: string, yearsToAdd: number): string {
  const parts = parseISODate(dateStr);
  const targetYear = parts.year + yearsToAdd;
  const maxDay = new Date(Date.UTC(targetYear, parts.month, 0)).getUTCDate();
  const day = Math.min(parts.day, maxDay);

  return formatISODate({
    year: targetYear,
    month: parts.month,
    day
  });
}

/**
 * Calculates absolute difference in whole calendar days.
 */
export function diffInDays(startDateStr: string, endDateStr: string): number {
  const start = parseISODate(startDateStr);
  const end = parseISODate(endDateStr);

  const utc1 = Date.UTC(start.year, start.month - 1, start.day);
  const utc2 = Date.UTC(end.year, end.month - 1, end.day);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}
