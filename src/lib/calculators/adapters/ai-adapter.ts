/**
 * Safe AI Context Sanitizer and Explanation Adapter
 * Prepares deterministic results for AI interpretation while strictly preventing
 * AI from calculating or modifying authoritative monetary numbers.
 */

import type { CalculatorResult } from '../types/calculator';
import { formatMoneyINR } from '../core/money';

export interface SanitizedAiContext {
  readonly calculatorId: string;
  readonly summaryStatement: string;
  readonly primaryCalculatedAmount: string;
  readonly lineItems: readonly { label: string; amount: string; category?: string }[];
  readonly warnings: readonly string[];
  readonly systemPromptInstruction: string;
}

/**
 * Sanitizes a deterministic CalculatorResult into a safe payload for future AI LLM explanation.
 */
export function sanitizeResultForAi<T = unknown>(result: CalculatorResult<T>): SanitizedAiContext {
  const lineItems = result.breakdown.items.map((item) => ({
    label: item.label,
    amount: formatMoneyINR(item.amount),
    category: item.category
  }));

  const warnings = result.warnings.map((w) => w.message);

  return {
    calculatorId: result.calculatorId,
    summaryStatement: `Deterministic calculation for ${result.calculatorId} completed at ${result.calculatedAt}`,
    primaryCalculatedAmount: formatMoneyINR(result.primaryAmount),
    lineItems: Object.freeze(lineItems),
    warnings: Object.freeze(warnings),
    systemPromptInstruction:
      'CRITICAL FINANCIAL BOUNDARY: The monetary figures provided in this payload were computed by a deterministic financial engine and are authoritative. Your role is strictly to explain the components and terminology to the user in clear, empathetic language. You MUST NOT alter, recalculate, or contradict any monetary values provided in this payload.'
  };
}
