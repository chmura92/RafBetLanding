// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://posadzki-wylewki.opole.pl',
  integrations: [sitemap()],
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
