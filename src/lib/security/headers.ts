/**
 * Production Security Headers Configuration
 * Compatible with Cloudflare Workers, Pages, and Astro SSR
 */

export interface SecurityHeaderOptions {
  isAdmin?: boolean;
  allowIframe?: boolean;
}

export function getSecurityHeaders(options: SecurityHeaderOptions = {}): HeadersInit {
  const isAdm = options.isAdmin ?? false;

  const baseHeaders: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
  };

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    isAdm ? "frame-ancestors 'none'" : "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ];

  baseHeaders['Content-Security-Policy'] = cspDirectives.join('; ');

  return baseHeaders;
}
