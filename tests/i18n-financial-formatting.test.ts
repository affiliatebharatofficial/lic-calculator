import { describe, it, expect } from 'vitest';
import { formatCurrencyINR, formatDate } from '@/lib/i18n';

describe('i18n Financial & Date Formatting Invariants', () => {
  it('formats Indian Rupee amounts deterministically', () => {
    expect(formatCurrencyINR(150000)).toBe('₹1,50,000');
    expect(formatCurrencyINR(68750)).toBe('₹68,750');
    expect(formatCurrencyINR(56250)).toBe('₹56,250');
    expect(formatCurrencyINR(10000000)).toBe('₹1,00,00,000');
  });

  it('formats dates consistently using Intl.DateTimeFormat', () => {
    const iso = '2026-08-30';
    const formattedEn = formatDate(iso, 'en');
    expect(formattedEn).toContain('2026');

    const formattedHi = formatDate(iso, 'hi');
    expect(formattedHi).toContain('2026');
  });
});
