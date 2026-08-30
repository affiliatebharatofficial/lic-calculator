/**
 * HTTP Caching and ETag Generation for Edge Performance
 */

export class CacheControlManager {
  /**
   * Generates caching headers for deterministic public calculations and verified metadata.
   */
  public static getPublicCalculatorCacheHeaders(etag?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      'Vary': 'Accept-Encoding, Accept-Language'
    };

    if (etag) {
      headers['ETag'] = `"${etag}"`;
    }

    return headers;
  }

  /**
   * Generates strictly private, non-cacheable headers for admin and AI endpoints.
   */
  public static getPrivateNoCacheHeaders(): Record<string, string> {
    return {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }

  /**
   * Generates a deterministic hash string to be used as an ETag.
   */
  public static generateETag(payload: unknown): string {
    const json = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return 'W/' + Math.abs(hash).toString(16);
  }
}
