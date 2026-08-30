/**
 * Production Structured JSON Logger with Privacy & Secret Redaction
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface StructuredLogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly context?: Record<string, unknown>;
  readonly durationMs?: number;
  readonly path?: string;
  readonly status?: number;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'api_key',
  'apikey',
  'policy_number',
  'policyno',
  'email',
  'phone',
  'mobile'
]);

export class StructuredLogger {
  /**
   * Recursively sanitizes context data, redacting sensitive secrets and PII.
   */
  public static sanitizeContext(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeContext(item));
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lower) || lower.includes('secret') || lower.includes('password') || lower.includes('token')) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.sanitizeContext(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  public static log(level: LogLevel, message: string, context?: Record<string, unknown>): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? (this.sanitizeContext(context) as Record<string, unknown>) : undefined
    };

    return entry;
  }

  public static info(message: string, context?: Record<string, unknown>): StructuredLogEntry {
    return this.log('info', message, context);
  }

  public static warn(message: string, context?: Record<string, unknown>): StructuredLogEntry {
    return this.log('warn', message, context);
  }

  public static error(message: string, context?: Record<string, unknown>): StructuredLogEntry {
    return this.log('error', message, context);
  }
}
