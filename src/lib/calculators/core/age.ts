/**
 * Deterministic Age Calculation Engine
 */

import { parseISODate, diffInCompletedYears, compareISODates } from './dates';

export type AgeCalculationMethod =
  | 'last-birthday'     // Age on last completed birthday (standard)
  | 'nearest-birthday'  // Age rounded to closest birthday (if >= 6 months past last birthday, +1)
  | 'next-birthday';    // Age on upcoming birthday

/**
 * Calculates exact age on a specific calculation date using the requested method.
 */
export function calculateAge(
  dateOfBirthStr: string,
  asOfDateStr: string,
  method: AgeCalculationMethod = 'last-birthday'
): number {
  if (compareISODates(asOfDateStr, dateOfBirthStr) < 0) {
    throw new Error(`asOfDate (${asOfDateStr}) cannot be earlier than dateOfBirth (${dateOfBirthStr})`);
  }

  const completedYears = diffInCompletedYears(dateOfBirthStr, asOfDateStr);

  switch (method) {
    case 'last-birthday': {
      return completedYears;
    }

    case 'next-birthday': {
      const dob = parseISODate(dateOfBirthStr);
      const asOf = parseISODate(asOfDateStr);
      // If exact birthday today, age next birthday is completedYears + 1 (or completedYears if definition permits)
      const isExactBirthday = dob.month === asOf.month && dob.day === asOf.day;
      return isExactBirthday ? completedYears : completedYears + 1;
    }

    case 'nearest-birthday': {
      const dob = parseISODate(dateOfBirthStr);
      const asOf = parseISODate(asOfDateStr);

      // Determine months and days elapsed since last birthday
      let monthsElapsed = asOf.month - dob.month;
      if (monthsElapsed < 0) monthsElapsed += 12;

      if (asOf.day < dob.day) {
        monthsElapsed -= 1;
        if (monthsElapsed < 0) monthsElapsed += 12;
      }

      // If 6 months or more have elapsed since last birthday, round up
      if (monthsElapsed >= 6) {
        return completedYears + 1;
      }
      return completedYears;
    }

    default: {
      const exhaustiveCheck: never = method;
      throw new Error(`Unsupported age calculation method: ${exhaustiveCheck}`);
    }
  }
}

/**
 * Checks whether an entry age satisfies minimum and maximum age bounds.
 */
export function isAgeWithinRange(age: number, minAge: number, maxAge: number): boolean {
  return age >= minAge && age <= maxAge;
}
