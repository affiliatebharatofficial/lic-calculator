import { describe, it, expect } from 'vitest';
import {
  isValidISODate,
  diffInCompletedYears,
  getPolicyAnniversary,
  diffInDays,
  calculateAge,
  isAgeWithinRange
} from '@/lib/calculators';

describe('Deterministic Date Utility Engine', () => {
  it('validates ISO date format and real calendar constraints', () => {
    expect(isValidISODate('2024-02-29')).toBe(true); // Leap year
    expect(isValidISODate('2023-02-29')).toBe(false); // Not a leap year
    expect(isValidISODate('2024-04-31')).toBe(false); // April has 30 days
    expect(isValidISODate('invalid-date')).toBe(false);
  });

  it('computes completed policy years correctly across anniversaries', () => {
    // Exactly 5 years
    expect(diffInCompletedYears('2019-06-15', '2024-06-15')).toBe(5);
    // 1 day before 5th anniversary -> 4 years
    expect(diffInCompletedYears('2019-06-15', '2024-06-14')).toBe(4);
    // 1 day after 5th anniversary -> 5 years
    expect(diffInCompletedYears('2019-06-15', '2024-06-16')).toBe(5);
  });

  it('calculates policy anniversaries and clamps leap year days', () => {
    // Leap year commencement: 2020-02-29
    expect(getPolicyAnniversary('2020-02-29', 1)).toBe('2020-02-29');
    // Year 2 anniversary (2021 is non-leap year) -> clamps to 2021-02-28
    expect(getPolicyAnniversary('2020-02-29', 2)).toBe('2021-02-28');
    // Year 5 anniversary (2024 is leap year) -> 2024-02-29
    expect(getPolicyAnniversary('2020-02-29', 5)).toBe('2024-02-29');
  });

  it('computes day difference without timezone bias', () => {
    expect(diffInDays('2024-01-01', '2024-01-10')).toBe(9);
    expect(diffInDays('2024-01-01', '2024-01-01')).toBe(0);
  });
});

describe('Deterministic Age Calculation Engine', () => {
  const dob = '1990-05-15';

  it('calculates age under last-birthday method', () => {
    expect(calculateAge(dob, '2020-05-14', 'last-birthday')).toBe(29);
    expect(calculateAge(dob, '2020-05-15', 'last-birthday')).toBe(30);
    expect(calculateAge(dob, '2020-11-20', 'last-birthday')).toBe(30);
  });

  it('calculates age under nearest-birthday method (LIC actuarial rounding)', () => {
    // 29 yrs + 5 months -> 29
    expect(calculateAge(dob, '2019-10-15', 'nearest-birthday')).toBe(29);
    // 29 yrs + 6 months -> rounds up to 30
    expect(calculateAge(dob, '2019-11-15', 'nearest-birthday')).toBe(30);
  });

  it('calculates age under next-birthday method', () => {
    expect(calculateAge(dob, '2020-05-14', 'next-birthday')).toBe(30);
    expect(calculateAge(dob, '2020-05-15', 'next-birthday')).toBe(30); // exact birthday
    expect(calculateAge(dob, '2020-05-16', 'next-birthday')).toBe(31);
  });

  it('verifies age range boundaries', () => {
    expect(isAgeWithinRange(8, 8, 55)).toBe(true);
    expect(isAgeWithinRange(55, 8, 55)).toBe(true);
    expect(isAgeWithinRange(7, 8, 55)).toBe(false);
    expect(isAgeWithinRange(56, 8, 55)).toBe(false);
  });
});
