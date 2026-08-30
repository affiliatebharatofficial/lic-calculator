/**
 * Premium payment frequency types
 */

export type PremiumFrequency =
  | 'yearly'
  | 'half-yearly'
  | 'quarterly'
  | 'monthly'
  | 'single';

export interface FrequencyMultiplier {
  readonly mode: PremiumFrequency;
  readonly installmentsPerYear: number;
  readonly modalFactor: number; // e.g. 1.0 for yearly, 0.505 for half-yearly, etc.
}

export const FREQUENCY_INSTALLMENTS: Record<PremiumFrequency, number> = {
  'yearly': 1,
  'half-yearly': 2,
  'quarterly': 4,
  'monthly': 12,
  'single': 1,
};
