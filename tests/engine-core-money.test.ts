import { describe, it, expect } from 'vitest';
import {
  moneyFromRupees,
  moneyToRupees,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney,
  isNegativeMoney,
  compareMoney,
  maxMoney,
  minMoney,
  formatMoneyINR,
  roundNumber,
  roundPaiseToRupee,
  fromPercentage,
  toFraction,
  toPercentageNumber,
  applyPercentageToMoney,
  calculatePercentageRatio,
  formatPercentage
} from '@/lib/calculators';

describe('Deterministic Money Representation & Arithmetic', () => {
  it('converts rupees to exact integer paise', () => {
    const m = moneyFromRupees(1234.56);
    expect(m.paise).toBe(123456);
    expect(m.currency).toBe('INR');
    expect(moneyToRupees(m)).toBe(1234.56);
  });

  it('avoids floating point addition quirks (0.1 + 0.2 === 0.3)', () => {
    const a = moneyFromRupees(0.10);
    const b = moneyFromRupees(0.20);
    const sum = addMoney(a, b);
    expect(sum.paise).toBe(30);
    expect(moneyToRupees(sum)).toBe(0.30);
  });

  it('handles subtraction and negative balances safely', () => {
    const a = moneyFromRupees(100);
    const b = moneyFromRupees(150);
    const diff = subtractMoney(a, b);
    expect(diff.paise).toBe(-5000);
    expect(isNegativeMoney(diff)).toBe(true);
    expect(formatMoneyINR(diff)).toBe('-₹50');
  });

  it('multiplies and divides with explicit rounding', () => {
    const base = moneyFromRupees(100);
    const half = multiplyMoney(base, 0.5);
    expect(half.paise).toBe(5000);

    const third = divideMoney(base, 3);
    expect(third.paise).toBe(3333);
  });

  it('compares and finds min/max correctly', () => {
    const m1 = moneyFromRupees(500);
    const m2 = moneyFromRupees(1000);
    const m3 = moneyFromRupees(200);

    expect(compareMoney(m1, m2)).toBe(-1);
    expect(compareMoney(m2, m1)).toBe(1);
    expect(compareMoney(m1, m1)).toBe(0);

    expect(maxMoney(m1, m2, m3).paise).toBe(100000);
    expect(minMoney(m1, m2, m3).paise).toBe(20000);
  });

  it('formats INR strings with Indian commas', () => {
    const m1 = moneyFromRupees(500000); // 5 Lakhs
    expect(formatMoneyINR(m1)).toBe('₹5,00,000');

    const m2 = moneyFromRupees(10000000); // 1 Crore
    expect(formatMoneyINR(m2)).toBe('₹1,00,00,000');
  });
});

describe('Centralized Financial Rounding Engine', () => {
  it('supports standard half-up commercial rounding', () => {
    expect(roundNumber(2.4, 0, 'half-up')).toBe(2);
    expect(roundNumber(2.5, 0, 'half-up')).toBe(3);
    expect(roundNumber(2.6, 0, 'half-up')).toBe(3);
    expect(roundNumber(-2.5, 0, 'half-up')).toBe(-3);
  });

  it('supports banker\'s half-even rounding', () => {
    expect(roundNumber(2.5, 0, 'half-even')).toBe(2); // even
    expect(roundNumber(3.5, 0, 'half-even')).toBe(4); // even
  });

  it('supports floor and ceil rounding', () => {
    expect(roundNumber(2.9, 0, 'floor')).toBe(2);
    expect(roundNumber(2.1, 0, 'ceil')).toBe(3);
  });

  it('rounds paise to whole rupee', () => {
    expect(roundPaiseToRupee(25050)).toBe(25100); // ₹250.50 -> ₹251
    expect(roundPaiseToRupee(25040)).toBe(25000); // ₹250.40 -> ₹250
  });
});

describe('Deterministic Percentage Engine', () => {
  it('converts whole percentage into exact basis points', () => {
    const p = fromPercentage(4.5); // 4.5% GST
    expect(p.basisPoints).toBe(450);
    expect(toPercentageNumber(p)).toBe(4.5);
    expect(toFraction(p)).toBe(0.045);
    expect(formatPercentage(p)).toBe('4.50%');
  });

  it('applies percentage to money deterministically', () => {
    const amount = moneyFromRupees(1000);
    const gstRate = fromPercentage(18); // 18%
    const gstAmount = applyPercentageToMoney(amount, gstRate);
    expect(gstAmount.paise).toBe(18000); // ₹180
    expect(moneyToRupees(gstAmount)).toBe(180);
  });

  it('calculates ratio percentage between two money values safely', () => {
    const part = moneyFromRupees(45000);
    const total = moneyFromRupees(100000);
    const ratio = calculatePercentageRatio(part, total);
    expect(ratio.basisPoints).toBe(4500); // 45.00%
    expect(toPercentageNumber(ratio)).toBe(45);

    const zeroRatio = calculatePercentageRatio(part, moneyFromRupees(0));
    expect(zeroRatio.basisPoints).toBe(0);
  });
});
