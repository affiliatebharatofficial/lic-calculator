/**
 * Client-Side AI Assistant Controller
 * Safely requests AI explanations and renders structured output into calculator pages.
 */

import type { StructuredExplanation, StructuredChatAnswer } from '../ai/types';

export class AIClient {
  /**
   * Explains the current calculator result using the backend AI API.
   */
  public static async explainResult(payload: {
    calculatorId: string;
    planName?: string;
    planCode?: string;
    primaryResult: string;
    breakdownItems?: Array<{ label: string; amount: string; notes?: string }>;
    assumptions?: string[];
    warnings?: string[];
    ruleVersion?: string;
    sourceReference?: string;
    userQuestion?: string;
  }): Promise<{ success: boolean; data?: StructuredExplanation; error?: string }> {
    try {
      const response = await fetch('/api/ai/explain-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        return {
          success: false,
          error: json?.error?.message || 'AI explanation is temporarily unavailable.'
        };
      }

      return {
        success: true,
        data: json.data as StructuredExplanation
      };
    } catch {
      return {
        success: false,
        error: 'Network connection error. Please verify your internet connection.'
      };
    }
  }

  /**
   * Sends a message to the AI Policy Assistant.
   */
  public static async askChat(payload: {
    message: string;
    currentCalculatorId?: string;
    currentPlanCode?: string;
    currentResultContext?: string;
  }): Promise<{ success: boolean; data?: StructuredChatAnswer; error?: string }> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        return {
          success: false,
          error: json?.error?.message || 'AI assistant is temporarily unavailable.'
        };
      }

      return {
        success: true,
        data: json.data as StructuredChatAnswer
      };
    } catch {
      return {
        success: false,
        error: 'Network connection error. Please try again.'
      };
    }
  }

  /**
   * Renders structured explanation data safely into a DOM element.
   */
  public static renderExplanationHTML(data: StructuredExplanation): string {
    const numbersList = (data.whatNumbersMean || [])
      .map(
        (n) => `
      <div class="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div class="font-semibold text-slate-800 text-xs">${escapeHtml(n.label)}</div>
          <div class="text-xs text-slate-500 mt-0.5">${escapeHtml(n.meaning)}</div>
        </div>
        <div class="font-mono font-bold text-slate-900 text-sm whitespace-nowrap">${escapeHtml(n.amount)}</div>
      </div>
    `
      )
      .join('');

    const assumptionsList = (data.keyAssumptions || [])
      .map((a) => `<li class="text-xs text-slate-600 flex items-start gap-1.5"><span class="text-brand-600 mt-0.5">•</span><span>${escapeHtml(a)}</span></li>`)
      .join('');

    const warningsList = (data.importantWarnings || [])
      .map((w) => `<li class="text-xs text-amber-800 flex items-start gap-1.5"><span class="text-amber-500 mt-0.5">⚠️</span><span>${escapeHtml(w)}</span></li>`)
      .join('');

    const verifyList = (data.whatToVerify || [])
      .map((v) => `<li class="text-xs text-slate-600 flex items-start gap-1.5"><span class="text-emerald-600 mt-0.5">✓</span><span>${escapeHtml(v)}</span></li>`)
      .join('');

    return `
      <div class="space-y-4 text-left">
        <!-- Summary Box -->
        <div class="p-4 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-950">
          <div class="font-bold text-xs uppercase tracking-wider text-brand-800 mb-1 flex items-center gap-1.5">
            <span>✨ AI Explanation Summary</span>
          </div>
          <p class="text-sm font-medium leading-relaxed">${escapeHtml(data.summary)}</p>
        </div>

        <!-- Numbers Meaning -->
        ${
          numbersList
            ? `
          <div>
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">What Each Number Means</h4>
            <div class="space-y-2">${numbersList}</div>
          </div>
        `
            : ''
        }

        <!-- How Calculated -->
        ${
          data.howCalculated
            ? `
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Calculation Method</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(data.howCalculated)}</p>
          </div>
        `
            : ''
        }

        <!-- Grid of Assumptions & Checklist -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${
            assumptionsList
              ? `
            <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Assumptions</h4>
              <ul class="space-y-1.5">${assumptionsList}</ul>
            </div>
          `
              : ''
          }
          ${
            verifyList
              ? `
            <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">What to Verify on Document</h4>
              <ul class="space-y-1.5">${verifyList}</ul>
            </div>
          `
              : ''
          }
        </div>

        <!-- Warnings if any -->
        ${
          warningsList
            ? `
          <div class="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
            <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">Important Notes</h4>
            <ul class="space-y-1">${warningsList}</ul>
          </div>
        `
            : ''
        }

        <!-- AI Disclaimer Badge -->
        <div class="text-[11px] text-slate-400 text-center pt-2">
          AI-generated explanation for informational clarity. Calculated amounts are strictly determined by our verified actuarial engine.
        </div>
      </div>
    `;
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
