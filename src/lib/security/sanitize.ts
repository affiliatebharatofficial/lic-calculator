/**
 * Input sanitization and XSS prevention utilities
 */

/**
 * Escapes potentially dangerous HTML characters
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes generic user text input by trimming and stripping dangerous characters
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validates and sanitizes a numeric input
 */
export function sanitizeNumber(input: unknown, defaultValue: number = 0): number {
  if (typeof input === 'number' && !isNaN(input) && isFinite(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const parsed = Number(input.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }
  return defaultValue;
}
