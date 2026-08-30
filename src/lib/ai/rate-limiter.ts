/**
 * Server-Side Rate Limiter for AI Endpoints
 */

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitBucket>();

export interface RateLimitConfig {
  readonly maxRequests: number; // e.g. 20 requests
  readonly windowMs: number;    // e.g. 60,000 ms (1 minute)
}

export class RateLimiter {
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 20,
    windowMs: 60 * 1000 // 1 minute
  };

  /**
   * Checks if an identifier has exceeded rate limits.
   */
  public static check(
    identifier: string,
    config: RateLimitConfig = this.DEFAULT_CONFIG
  ): { isAllowed: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const key = `ratelimit_${identifier || 'anonymous'}`;

    // Clean up stale entries occasionally
    if (memoryStore.size > 5000) {
      for (const [k, bucket] of memoryStore.entries()) {
        if (now > bucket.resetTime) {
          memoryStore.delete(k);
        }
      }
    }

    const bucket = memoryStore.get(key);

    if (!bucket || now > bucket.resetTime) {
      // New or expired window
      memoryStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return {
        isAllowed: true,
        remaining: config.maxRequests - 1,
        resetInMs: config.windowMs
      };
    }

    if (bucket.count >= config.maxRequests) {
      return {
        isAllowed: false,
        remaining: 0,
        resetInMs: Math.max(0, bucket.resetTime - now)
      };
    }

    bucket.count += 1;
    return {
      isAllowed: true,
      remaining: config.maxRequests - bucket.count,
      resetInMs: Math.max(0, bucket.resetTime - now)
    };
  }

  public static reset(identifier: string): void {
    const key = `ratelimit_${identifier || 'anonymous'}`;
    memoryStore.delete(key);
  }
}
