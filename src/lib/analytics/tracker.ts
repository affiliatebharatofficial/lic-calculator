/**
 * Privacy-Preserving Analytics Tracker with Strict Data Minimization
 */

import type { AnalyticsEvent } from './types';

const DISALLOWED_KEYS = new Set([
  'policy_number',
  'policyno',
  'premium',
  'sum_assured',
  'dob',
  'name',
  'email',
  'phone',
  'mobile',
  'salary',
  'address'
]);

export class PrivacyPreservingTracker {
  private static events: AnalyticsEvent[] = [];

  /**
   * Sanitizes analytics event ensuring zero PII or raw financial inputs are retained.
   */
  public static sanitizeEvent(raw: Record<string, unknown>): AnalyticsEvent | null {
    if (!raw || typeof raw !== 'object') return null;

    const eventType = raw.eventType as AnalyticsEvent['eventType'];
    if (!eventType) return null;

    // Verify raw input does not attempt to smuggle forbidden keys
    for (const key of Object.keys(raw)) {
      if (DISALLOWED_KEYS.has(key.toLowerCase())) {
        delete raw[key];
      }
    }

    const sanitized: AnalyticsEvent = {
      eventType,
      path: typeof raw.path === 'string' ? raw.path.slice(0, 100) : undefined,
      calculatorId: typeof raw.calculatorId === 'string' ? raw.calculatorId.slice(0, 50) : undefined,
      planCode: typeof raw.planCode === 'string' ? raw.planCode.slice(0, 20) : undefined,
      locale: typeof raw.locale === 'string' ? raw.locale.slice(0, 5) : 'en',
      durationMs: typeof raw.durationMs === 'number' && isFinite(raw.durationMs) ? Math.round(raw.durationMs) : undefined,
      timestamp: new Date().toISOString()
    };

    return sanitized;
  }

  public static record(event: AnalyticsEvent): void {
    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }
  }

  public static getEvents(): readonly AnalyticsEvent[] {
    return this.events;
  }

  public static clear(): void {
    this.events = [];
  }
}
