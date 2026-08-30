import { describe, it, expect, beforeEach } from 'vitest';
import { MetricsRegistry, StructuredLogger } from '@/lib/observability';

describe('Production Observability, Health & Structured Logging', () => {
  beforeEach(() => {
    MetricsRegistry.reset();
  });

  it('records metrics and reports accurate health snapshot', () => {
    MetricsRegistry.recordRequest(25, 200, true, false);
    MetricsRegistry.recordRequest(45, 200, true, false);
    MetricsRegistry.recordRequest(120, 500, false, true);

    const snapshot = MetricsRegistry.getSnapshot();
    expect(snapshot.totalRequests).toBe(3);
    expect(snapshot.successCount).toBe(2);
    expect(snapshot.errorCount).toBe(1);
    expect(snapshot.calculatorInvocations).toBe(2);
    expect(snapshot.aiInvocations).toBe(1);
    expect(snapshot.averageLatencyMs).toBe(63); // (25+45+120)/3 = 63.3
  });

  it('redacts sensitive secrets and passwords from structured log context', () => {
    const rawContext = {
      user: 'admin_user',
      password: 'SuperSecretPassword123!',
      token: 'jwt_token_abcdef',
      details: {
        apiKey: 'secret_key_999',
        plan: 'table_914'
      }
    };

    const sanitized = StructuredLogger.sanitizeContext(rawContext) as any;
    expect(sanitized.user).toBe('admin_user');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.details.apiKey).toBe('[REDACTED]');
    expect(sanitized.details.plan).toBe('table_914');
  });
});
