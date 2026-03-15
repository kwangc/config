#!/usr/bin/env node
/**
 * News 항목을 수집해 wiki-site/src/data/news.json 을 갱신하는 스크립트 템플릿.
 * 실제 스크래핑·요약 로직은 아래에 추가하면 됩니다.
 *
 * 사용: node automation/scripts/update_wiki_news.js
 * (또는 Claude 등으로 요약 API 연동 후 이 스크립트가 JSON을 쓰도록 확장)
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');
const newsPath = join(root, 'wiki-site', 'src', 'data', 'news.json');

const schema = {
  items: [
    {
      id: 'unique-id',
      title: '제목',
      url: 'https://...',
      summary: '요약 (스크래핑 또는 LLM 요약)',
      date: 'YYYY-MM-DD',
      source: 'arxiv|rss|manual|...',
      tags: ['VLA', 'robotics'],
    },
  ],
};

function loadExisting() {
  if (!existsSync(newsPath)) return { items: [] };
  try {
    return JSON.parse(readFileSync(newsPath, 'utf-8'));
  } catch {
    return { items: [] };
  }
}

async function fetchNewItems() {
  // TODO: 실제 소스 연동 예시
  // - arXiv API: https://export.arxiv.org/api/query?search_query=...
  // - RSS 피드 파싱
  // - 뉴스 API + (선택) Claude 등으로 요약 후 items에 push
  const newItems = [];
  // newItems.push({ id: '...', title: '...', url: '...', summary: '...', date: '...', source: 'arxiv', tags: [] });
  return newItems;
}

async function main() {
  const existing = loadExisting();
  const newItems = await fetchNewItems();
  const combined = {
    items: [...newItems, ...existing.items].slice(0, 100),
  };
  writeFileSync(newsPath, JSON.stringify(combined, null, 2), 'utf-8');
  console.log('Updated', newsPath, 'with', combined.items.length, 'items');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
