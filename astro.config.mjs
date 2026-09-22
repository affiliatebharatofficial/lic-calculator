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
    '/author/rajesh-sharma': '/author/naveen-chaudhary/',
    '/hi/author/rajesh-sharma': '/hi/author/naveen-chaudhary/',
    '/mr/author/rajesh-sharma': '/mr/author/naveen-chaudhary/',
    '/gu/author/rajesh-sharma': '/gu/author/naveen-chaudhary/',
    '/bn/author/rajesh-sharma': '/bn/author/naveen-chaudhary/',
    '/ta/author/rajesh-sharma': '/ta/author/naveen-chaudhary/',
    '/te/author/rajesh-sharma': '/te/author/naveen-chaudhary/'
  },
  vite: {
    ssr: {
      external: ['node:crypto', 'node:fs/promises', 'node:path', 'node:url'],
      noExternal: ['clsx', 'tailwind-merge']
    }
  }
});
