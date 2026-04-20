import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const isVercel = !!process.env.VERCEL;
// GitHub Pages URL is case-sensitive: use lowercase to match repo name (e.g. config)
// WIKI_BASE / WIKI_SITE env vars override for self-hosted deploys (e.g. AWS + Tailscale at http://config-wiki/)
const base = process.env.WIKI_BASE ?? (isVercel ? '/' : '/config');
const site = process.env.WIKI_SITE ?? (isVercel
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'config-wiki.vercel.app'}`
  : 'https://kwangc.github.io');

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: '_assets',
  },
});
