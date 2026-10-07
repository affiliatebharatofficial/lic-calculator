import { defineMiddleware } from 'astro:middleware';

// Canonical host redirect: the workers.dev deployment URL must never serve
// content directly (duplicate-host / SEO dilution). Any request that arrives
// on the workers.dev hostname is permanently redirected to the same path on
// the production domain.
const WORKERS_DEV_HOST = 'lic-calculators.affiliatebharatofficial.workers.dev';
const CANONICAL_HOST = 'lic-calculators.com';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  if (url.hostname === WORKERS_DEV_HOST) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return next();
});
