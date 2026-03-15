#!/usr/bin/env node
import { cpSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const wikiSrc = join(root, '..', 'wiki');
const wikiDest = join(root, 'src', 'content', 'wiki');

function copyRecursive(src, dest) {
  if (!existsSync(src)) return;
  if (existsSync(dest)) rmSync(dest, { recursive: true });
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) {
      copyRecursive(s, d);
    } else if (name.endsWith('.md') || name.endsWith('.mdx')) {
      mkdirSync(dirname(d), { recursive: true });
      cpSync(s, d);
    }
  }
}

const locales = ['en', 'ko'];
for (const locale of locales) {
  const src = join(wikiSrc, locale);
  if (existsSync(src)) {
    copyRecursive(src, join(wikiDest, locale));
    console.log('Copied wiki', locale, 'to src/content/wiki/' + locale);
  }
}
if (!existsSync(join(wikiSrc, 'en')) && !existsSync(join(wikiSrc, 'ko'))) {
  console.warn('No wiki/en or wiki/ko found at', wikiSrc);
}
