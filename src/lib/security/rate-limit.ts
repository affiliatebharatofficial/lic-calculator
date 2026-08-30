/**
 * Production Rate Limiting Foundation
 * Sliding Window In-Memory & Edge KV Compatible Rate Limiter
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  retryAfter?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  ai: { maxRequests: 10, windowSeconds: 60 },
  admin_login: { maxRequests: 5, windowSeconds: 900 },
  contact_form: { maxRequests: 5, windowSeconds: 600 },
  calculator: { maxRequests: 60, windowSeconds: 60 },
  default: { maxRequests: 30, windowSeconds: 60 }
};

interface RateLimitRecord {
  timestamps: number[];
}

export class GlobalRateLimiter {
  private static store: Map<string, RateLimitRecord> = new Map();

  /**
   * Checks if a request by key/IP under a specific scope is within allowed rate limits.
   */
  public static check(scope: keyof typeof RATE_LIMIT_CONFIGS | string, clientKey: string): RateLimitResult {
    const config: RateLimitConfig = RATE_LIMIT_CONFIGS[scope] ?? RATE_LIMIT_CONFIGS.default ?? { maxRequests: 30, windowSeconds: 60 };
    const now = Date.now();
    const windowStart = now - config.windowSeconds * 1000;
    const storeKey = `${scope}:${clientKey}`;

    let record = this.store.get(storeKey);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(storeKey, record);
    }

    // Purge timestamps older than the sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= config.maxRequests) {
      const oldest = record.timestamps[0] || now;
      const resetSeconds = Math.max(1, Math.ceil((oldest + config.windowSeconds * 1000 - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
        retryAfter: resetSeconds
      };
    }

    record.timestamps.push(now);
    const remaining = config.maxRequests - record.timestamps.length;
    return {
      allowed: true,
      remaining,
      resetSeconds: config.windowSeconds
    };
  }

  /**
   * Clears in-memory rate limit records (for testing purposes).
   */
  public static clear(): void {
    this.store.clear();
  }
}

/**
 * Cloudflare Turnstile token validation helper
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey?: string,
  remoteIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  if (!secretKey || !token) {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    return {
      success: data.success,
      errorCodes: data['error-codes']
    };
  } catch {
    return { success: false, errorCodes: ['verification_failed'] };
  }
}
