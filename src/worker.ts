/// <reference types="@cloudflare/workers-types" />
import { createExports as createAstroExports } from '@astrojs/cloudflare/entrypoints/server.js';
import { GUIDE_PUBLISH_DATES } from './lib/content/guide-publish-dates';

// Canonical host redirect, enforced at the Worker entrypoint for EVERY
// request (Astro middleware alone never sees static-asset requests - the
// adapter serves those from ASSETS first - and workers.dev must never serve
// content directly: duplicate-host / SEO dilution).
const WORKERS_DEV_HOST = 'lic-calculators.affiliatebharatofficial.workers.dev';
const CANONICAL_HOST = 'lic-calculators.com';

// Astro invokes createExports(manifest) on this module and uses the returned
// default export as the Worker's exported handler.
export function createExports(manifest: Parameters<typeof createAstroExports>[0]) {
  const astro = createAstroExports(manifest);
  return {
    default: {
      async fetch(request: Request, env: unknown, context: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        // Canonical URL hygiene: exactly one URL per page. http -> https,
        // www -> apex, and extensionless page paths -> trailing slash,
        // combined into a single 301 so there are no redirect chains.
        // GET/HEAD only, so posts are never rewritten; /api/ paths and
        // files (last segment contains a dot) are left alone.
        if (
          (request.method === 'GET' || request.method === 'HEAD') &&
          (url.hostname === CANONICAL_HOST || url.hostname === `www.${CANONICAL_HOST}`)
        ) {
          const target = new URL(url.toString());
          target.protocol = 'https:';
          target.hostname = CANONICAL_HOST;
          target.port = '';
          const lastSegment = target.pathname.split('/').pop() ?? '';
          if (
            target.pathname.length > 1 &&
            !target.pathname.endsWith('/') &&
            !lastSegment.includes('.') &&
            !target.pathname.startsWith('/api/')
          ) {
            target.pathname += '/';
          }
          if (target.toString() !== url.toString()) {
            return Response.redirect(target.toString(), 301);
          }
        }
        if (url.hostname === WORKERS_DEV_HOST) {
          url.protocol = 'https:';
          url.hostname = CANONICAL_HOST;
          url.port = '';
          return Response.redirect(url.toString(), 301);
        }
        // Guide date-gate: guides publish one per day, so a guide whose
        // publish date (Asia/Calcutta) is still in the future returns 404
        // and opens automatically at 00:00 IST on its date — no rebuild
        // needed. Slugs missing from the map are never gated.
        const guideMatch = url.pathname.match(
          /^\/(?:(en|hi|mr|gu|bn|ta|te)\/)?guides\/([a-z0-9-]+)\/?$/
        );
        if (guideMatch) {
          const publishDate = GUIDE_PUBLISH_DATES[guideMatch[2]];
          if (publishDate) {
            const todayIST = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'Asia/Calcutta',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(new Date());
            if (publishDate > todayIST) {
              return new Response('Not Found', {
                status: 404,
                headers: { 'content-type': 'text/plain; charset=utf-8' }
              });
            }
          }
        }
        return astro.default.fetch(request, env as never, context);
      }
    }
  };
}
