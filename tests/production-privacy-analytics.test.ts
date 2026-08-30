import { describe, it, expect, beforeEach } from 'vitest';
import { PrivacyPreservingTracker } from '@/lib/analytics';

describe('Privacy-Preserving Analytics & Data Minimization', () => {
  beforeEach(() => {
    PrivacyPreservingTracker.clear();
  });

  it('strips PII and financial inputs from analytics payloads', () => {
    const rawPayload = {
      eventType: 'calculation_completed',
      path: '/lic-premium-calculator',
      calculatorId: 'premium_calc',
      policy_number: '123456789',
      premium: 45000,
      sum_assured: 1000000,
      dob: '1990-01-01',
      locale: 'hi',
      durationMs: 145.2
    };

    const sanitized = PrivacyPreservingTracker.sanitizeEvent(rawPayload);
    expect(sanitized).toBeDefined();
    expect(sanitized?.eventType).toBe('calculation_completed');
    expect(sanitized?.locale).toBe('hi');
    expect(sanitized?.durationMs).toBe(145);

    // Forbidden keys must NOT exist
    expect((sanitized as any).policy_number).toBeUndefined();
    expect((sanitized as any).premium).toBeUndefined();
    expect((sanitized as any).sum_assured).toBeUndefined();
    expect((sanitized as any).dob).toBeUndefined();
  });

  it('records sanitized events into memory queue', () => {
    const event = PrivacyPreservingTracker.sanitizeEvent({
      eventType: 'page_view',
      path: '/lic-surrender-value-calculator'
    })!;

    PrivacyPreservingTracker.record(event);
    const events = PrivacyPreservingTracker.getEvents();
    expect(events.length).toBe(1);
    expect(events[0]?.eventType).toBe('page_view');
  });
});
