/**
 * Client-side Dynamic Calculator Controller & History Manager
 */

import { AIClient } from './ai-client';

export interface CalculationHistoryEntry {
  readonly id: string;
  readonly calculatorId: string;
  readonly calculatorName: string;
  readonly primaryAmount: string;
  readonly summary: string;
  readonly timestamp: string;
}

const STORAGE_KEY = 'lic_calc_history_v1';

export class LocalHistoryManager {
  public static getHistory(): CalculationHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static addEntry(entry: Omit<CalculationHistoryEntry, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.getHistory();
      const newEntry: CalculationHistoryEntry = {
        ...entry,
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString()
      };
      // Keep most recent 10 calculations
      const updated = [newEntry, ...history].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Safe fallback if storage unavailable
    }
  }

  public static clearHistory(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

/**
 * Initializes interactive calculator form handling on the client.
 */
export function initCalculatorForm(config: {
  formId: string;
  apiEndpoint: string;
  calculatorId: string;
  calculatorName: string;
  onSuccess?: (data: any) => void;
  onError?: (errorMessage: string, fieldErrors?: Array<{ field: string; message: string }>) => void;
}) {
  if (typeof window === 'undefined') return;

  const form = document.getElementById(config.formId) as HTMLFormElement | null;
  if (!form) return;

  // Initialize Explain with AI button listener
  initExplainWithAIButton(config.calculatorId, config.calculatorName);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const errorBanner = document.getElementById('calc-error-banner');
    const resultContainer = document.getElementById('calc-result-container');
    const liveAnnouncer = document.getElementById('calc-live-announcer');

    // Clear previous errors
    document.querySelectorAll('.field-error-msg').forEach((el) => el.remove());
    document.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
    if (errorBanner) {
      errorBanner.classList.add('hidden');
      errorBanner.textContent = '';
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      const originalText = submitBtn.dataset.originalText || submitBtn.textContent || 'Calculate';
      submitBtn.dataset.originalText = originalText;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Calculating...
      `;
    }

    try {
      const formData = new FormData(form);
      const payload: Record<string, any> = {};

      formData.forEach((val, key) => {
        if (typeof val === 'string' && val !== '') {
          const num = Number(val);
          payload[key] = !isNaN(num) && /^-?\d+(\.\d+)?$/.test(val.trim()) ? num : val;
        }
      });

      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        const message = resJson.error?.message || "We don't currently have a verified rule set for this policy calculation.";
        const fieldErrors = resJson.error?.details || [];

        if (errorBanner) {
          errorBanner.textContent = message;
          errorBanner.classList.remove('hidden');
        }

        // Show field errors
        fieldErrors.forEach((fe: { field: string; message: string }) => {
          const inputField = form.querySelector(`[name="${fe.field}"]`);
          if (inputField) {
            inputField.setAttribute('aria-invalid', 'true');
            const errSpan = document.createElement('p');
            errSpan.className = 'field-error-msg text-xs text-rose-600 font-medium mt-1';
            errSpan.textContent = fe.message;
            inputField.parentElement?.appendChild(errSpan);
          }
        });

        if (liveAnnouncer) {
          liveAnnouncer.textContent = `Calculation failed: ${message}`;
        }

        if (config.onError) config.onError(message, fieldErrors);
      } else {
        const data = resJson.data;

        // Store latest result globally for AI Explanation
        (window as any).__LATEST_CALCULATION_RESULT__ = {
          calculatorId: config.calculatorId,
          calculatorName: config.calculatorName,
          inputs: payload,
          data
        };

        // Accessible announcement
        if (liveAnnouncer) {
          liveAnnouncer.textContent = `Calculation complete. Estimated result: ${formatMoneyDisplay(data.primaryAmount?.paise || 0)}`;
        }

        // Save local history
        LocalHistoryManager.addEntry({
          calculatorId: config.calculatorId,
          calculatorName: config.calculatorName,
          primaryAmount: formatMoneyDisplay(data.primaryAmount?.paise || 0),
          summary: `${config.calculatorName} for Plan ${payload.planTableNo || '914'}`
        });

        if (config.onSuccess) {
          config.onSuccess(data);
        } else {
          // Default DOM updater
          updateResultCardsInDOM(data);
        }

        // Show Explain with AI trigger button
        const explainAiBtn = document.getElementById('explain-ai-btn');
        if (explainAiBtn) {
          explainAiBtn.classList.remove('hidden');
        }

        if (resultContainer) {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          resultContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      }
    } catch {
      const msg = 'Network connection failed. Please check your internet connection.';
      if (errorBanner) {
        errorBanner.textContent = msg;
        errorBanner.classList.remove('hidden');
      }
      if (config.onError) config.onError(msg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = submitBtn.dataset.originalText || 'Calculate';
      }
    }
  });
}

function initExplainWithAIButton(calculatorId: string, _calculatorName: string) {
  const explainBtn = document.getElementById('explain-ai-btn');
  const aiContainer = document.getElementById('ai-explanation-container');
  const loadingEl = document.getElementById('ai-explanation-loading');
  const errorEl = document.getElementById('ai-explanation-error');
  const errorMsgEl = document.getElementById('ai-error-message');
  const contentEl = document.getElementById('ai-explanation-content');
  const closeBtn = document.getElementById('close-ai-explanation');

  closeBtn?.addEventListener('click', () => {
    if (aiContainer) aiContainer.classList.add('hidden');
  });

  explainBtn?.addEventListener('click', async () => {
    const cached = (window as any).__LATEST_CALCULATION_RESULT__;
    if (!cached || !aiContainer) return;

    aiContainer.classList.remove('hidden');
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    if (contentEl) contentEl.innerHTML = '';
    aiContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const breakdownItems = (cached.data?.breakdown?.items || []).map((i: any) => ({
      label: i.label,
      amount: formatMoneyDisplay(i.amount?.paise || 0),
      notes: i.notes
    }));

    const primaryFormatted = formatMoneyDisplay(cached.data?.primaryAmount?.paise || 0);

    const res = await AIClient.explainResult({
      calculatorId,
      planName: `Plan ${cached.inputs?.planTableNo || '914'}`,
      planCode: String(cached.inputs?.planTableNo || '914'),
      primaryResult: primaryFormatted,
      breakdownItems,
      assumptions: cached.data?.assumptions?.map((a: any) => a.description || a),
      warnings: cached.data?.warnings?.map((w: any) => w.message || w),
      ruleVersion: cached.data?.ruleVersion?.version,
      sourceReference: cached.data?.ruleVersion?.sourceReference
    });

    if (loadingEl) loadingEl.classList.add('hidden');

    if (res.success && res.data && contentEl) {
      contentEl.innerHTML = AIClient.renderExplanationHTML(res.data);
    } else if (errorEl && errorMsgEl) {
      errorMsgEl.textContent = res.error || 'AI explanation is temporarily unavailable.';
      errorEl.classList.remove('hidden');
    }
  });
}

export function formatMoneyDisplay(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

export function updateResultCardsInDOM(data: any) {
  if (typeof document === 'undefined') return;

  const primaryEl = document.getElementById('calc-primary-result-amount');
  if (primaryEl && data.primaryAmount?.paise !== undefined) {
    primaryEl.textContent = formatMoneyDisplay(data.primaryAmount.paise);
  }

  // Update source badge
  const sourceEl = document.getElementById('calc-rule-source-badge');
  if (sourceEl && data.ruleVersion) {
    sourceEl.textContent = `Rule Version: ${data.ruleVersion.version} (${data.ruleVersion.sourceReference || 'Verified Rule Set'})`;
    sourceEl.classList.remove('hidden');
  }

  // Update itemized breakdown
  const breakdownListEl = document.getElementById('calc-breakdown-list');
  if (breakdownListEl && data.breakdown?.items) {
    breakdownListEl.innerHTML = '';
    data.breakdown.items.forEach((item: any) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between py-2 border-b border-slate-100 text-sm';
      row.innerHTML = `
        <span class="text-slate-600 font-medium">${item.label}</span>
        <span class="font-bold text-slate-900">${formatMoneyDisplay(item.amount.paise)}</span>
      `;
      breakdownListEl.appendChild(row);
    });
  }
}
