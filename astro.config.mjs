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
  vite: {
    ssr: {
      noExternal: ['clsx', 'tailwind-merge']
    }
  }
});
