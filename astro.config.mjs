import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap()],
  site: 'https://creamfile.com',
  vite: {
    plugins: [yaml()],
  },
});
