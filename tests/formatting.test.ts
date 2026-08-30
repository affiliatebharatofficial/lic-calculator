import { describe, it, expect } from 'vitest';
import {
  formatINR,
  inrToWords,
  safeAdd,
  safeSubtract,
  safeRound,
  formatPercentage,
  formatYears
} from '../src/lib/formatting';

describe('Financial Formatting Utilities', () => {
  describe('formatINR', () => {
    it('formats numbers according to Indian numbering system (Lakhs and Crores)', () => {
      expect(formatINR(1000)).toBe('₹1,000');
      expect(formatINR(10000)).toBe('₹10,000');
      expect(formatINR(100000)).toBe('₹1,00,000');
      expect(formatINR(1000000)).toBe('₹10,00,000');
      expect(formatINR(10000000)).toBe('₹1,00,00,000');
      expect(formatINR(12345678)).toBe('₹1,23,45,678');
    });

    it('handles negative amounts and zero', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatINR(-50000)).toBe('-₹50,000');
      expect(formatINR(null)).toBe('₹0');
      expect(formatINR(undefined)).toBe('₹0');
    });

    it('supports compact representation (Lakh and Cr)', () => {
      expect(formatINR(500000, { compact: true })).toBe('₹5 Lakh');
      expect(formatINR(1500000, { compact: true })).toBe('₹15 Lakh');
      expect(formatINR(10000000, { compact: true })).toBe('₹1 Cr');
      expect(formatINR(25000000, { compact: true })).toBe('₹2.50 Cr');
    });

    it('respects includeSymbol and decimals options', () => {
      expect(formatINR(100000, { includeSymbol: false })).toBe('1,00,000');
      expect(formatINR(100000.5, { decimals: 2 })).toBe('₹1,00,000.50');
    });
  });

  describe('inrToWords', () => {
    it('converts numbers to Indian Rupees in words', () => {
      expect(inrToWords(1000000)).toBe('Ten Lakh Rupees Only');
      expect(inrToWords(500000)).toBe('Five Lakh Rupees Only');
      expect(inrToWords(15000000)).toBe('One Crore Fifty Lakh Rupees Only');
      expect(inrToWords(0)).toBe('Zero Rupees');
    });
  });

  describe('Safe Precision Arithmetic', () => {
    it('prevents floating-point rounding inaccuracies', () => {
      // In vanilla JS: 0.1 + 0.2 = 0.30000000000000004
      expect(safeAdd(0.1, 0.2)).toBe(0.3);
      expect(safeSubtract(1.0, 0.9)).toBe(0.1);
      expect(safeRound(1234.5678, 2)).toBe(1234.57);
    });

    it('formats percentages accurately', () => {
      expect(formatPercentage(8.5)).toBe('8.5%');
      expect(formatPercentage(12.3456, { decimals: 2 })).toBe('12.35%');
      expect(formatPercentage(null)).toBe('0%');
    });

    it('formats duration in years', () => {
      expect(formatYears(1)).toBe('1 Year');
      expect(formatYears(20)).toBe('20 Years');
    });
  });
});
