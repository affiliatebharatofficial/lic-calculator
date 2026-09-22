import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL || 'https://lic-calculators.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  output: 'static',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/admin/')
    })
  ],
  redirects: {
    '/author/naveen-chaudhary': '/author/firoz-khan/',
    '/author/ananya-deshmukh': '/author/firoz-khan/',
    '/author/vikram-sen': '/author/firoz-khan/',
    '/author/rajesh-sharma': '/author/firoz-khan/',
    '/hi/author/naveen-chaudhary': '/hi/author/firoz-khan/',
    '/hi/author/ananya-deshmukh': '/hi/author/firoz-khan/',
    '/hi/author/vikram-sen': '/hi/author/firoz-khan/',
    '/hi/author/rajesh-sharma': '/hi/author/firoz-khan/',
    '/mr/author/naveen-chaudhary': '/mr/author/firoz-khan/',
    '/mr/author/ananya-deshmukh': '/mr/author/firoz-khan/',
    '/mr/author/vikram-sen': '/mr/author/firoz-khan/',
    '/mr/author/rajesh-sharma': '/mr/author/firoz-khan/',
    '/gu/author/naveen-chaudhary': '/gu/author/firoz-khan/',
    '/gu/author/ananya-deshmukh': '/gu/author/firoz-khan/',
    '/gu/author/vikram-sen': '/gu/author/firoz-khan/',
    '/gu/author/rajesh-sharma': '/gu/author/firoz-khan/',
    '/bn/author/naveen-chaudhary': '/bn/author/firoz-khan/',
    '/bn/author/ananya-deshmukh': '/bn/author/firoz-khan/',
    '/bn/author/vikram-sen': '/bn/author/firoz-khan/',
    '/bn/author/rajesh-sharma': '/bn/author/firoz-khan/',
    '/ta/author/naveen-chaudhary': '/ta/author/firoz-khan/',
    '/ta/author/ananya-deshmukh': '/ta/author/firoz-khan/',
    '/ta/author/vikram-sen': '/ta/author/firoz-khan/',
    '/ta/author/rajesh-sharma': '/ta/author/firoz-khan/',
    '/te/author/naveen-chaudhary': '/te/author/firoz-khan/',
    '/te/author/ananya-deshmukh': '/te/author/firoz-khan/',
    '/te/author/vikram-sen': '/te/author/firoz-khan/',
    '/te/author/rajesh-sharma': '/te/author/firoz-khan/'
  },
  vite: {
    ssr: {
      external: ['node:crypto', 'node:fs/promises', 'node:path', 'node:url'],
      noExternal: ['clsx', 'tailwind-merge']
    }
  }
});
