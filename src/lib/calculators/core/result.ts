/**
 * Standardized Result & Breakdown Builder Engine
 */

import type { Money } from '../types/money';
import type { RuleVersion } from '../types/rules';
import type {
  CalculatorResult,
  CalculationBreakdown,
  CalculationLineItem,
  CalculationWarning
} from '../types/calculator';
import { sumMoney, subtractMoney } from './money';

export class BreakdownBuilder {
  private readonly items: CalculationLineItem[] = [];
  private readonly title: string;

  constructor(title: string = 'Calculation Breakdown') {
    this.title = title;
  }

  public addItem(item: CalculationLineItem): this {
    this.items.push(item);
    return this;
  }

  public addLine(
    id: string,
    label: string,
    amount: Money,
    isAddition: boolean = true,
    category?: CalculationLineItem['category'],
    notes?: string
  ): this {
    this.items.push({
      id,
      label,
      amount,
      isAddition,
      category,
      notes
    });
    return this;
  }

  public build(): CalculationBreakdown {
    const additions: Money[] = [];
    const deductions: Money[] = [];

    for (const item of this.items) {
      if (item.isAddition) {
        additions.push(item.amount);
      } else {
        deductions.push(item.amount);
      }
    }

    const subtotal = sumMoney(additions);
    const totalDeductions = sumMoney(deductions);
    const netTotal = subtractMoney(subtotal, totalDeductions);

    return {
      title: this.title,
      items: Object.freeze([...this.items]),
      subtotal,
      netTotal
    };
  }
}

export function createCalculatorResult<TData = Record<string, unknown>>(params: {
  calculatorId: string;
  result: TData;
  primaryAmount: Money;
  breakdown: CalculationBreakdown;
  warnings?: readonly CalculationWarning[];
  ruleVersion: RuleVersion;
  startTime?: number;
}): CalculatorResult<TData> {
  const executionTimeMs = params.startTime ? Math.max(0, performance.now() - params.startTime) : 0;

  return {
    calculatorId: params.calculatorId,
    success: true,
    currency: 'INR',
    result: params.result,
    primaryAmount: params.primaryAmount,
    breakdown: params.breakdown,
    warnings: params.warnings || Object.freeze([]),
    ruleVersion: params.ruleVersion,
    calculatedAt: new Date().toISOString(),
    executionTimeMs
  };
}
