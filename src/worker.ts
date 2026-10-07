/// <reference types="@cloudflare/workers-types" />
import { createExports as createAstroExports } from '@astrojs/cloudflare/entrypoints/server.js';

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
        if (url.hostname === WORKERS_DEV_HOST) {
          url.protocol = 'https:';
          url.hostname = CANONICAL_HOST;
          url.port = '';
          return Response.redirect(url.toString(), 301);
        }
        return astro.default.fetch(request, env as never, context);
      }
    }
  };
}
