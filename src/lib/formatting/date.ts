/**
 * Date Formatting Utilities (Standard Indian Format DD/MM/YYYY)
 */

/**
 * Formats a Date object or ISO string to Indian DD/MM/YYYY format
 */
export function formatIndianDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats a Date object or ISO string to a human-readable format (e.g., "15 Aug 2024")
 */
export function formatReadableDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Calculates policy duration in years and months between two dates
 */
export function calculateDurationInYears(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;

  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.2425);
  return Math.floor(diffYears * 10) / 10;
}
