import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const isVercel = !!process.env.VERCEL;
const base = isVercel ? '/' : '/Config';
const site = isVercel
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'config-wiki.vercel.app'}`
  : 'https://kwangc.github.io';

export default defineConfig({
  integrations: [mdx()],
  site,
  base,
  output: 'static',
  build: {
    assets: '_assets',
  },
});
