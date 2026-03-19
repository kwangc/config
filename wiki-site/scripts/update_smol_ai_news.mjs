/**
 * Scrape AINews (news.smol.ai) last ~30 days and update wiki-site/src/data/news.json.
 *
 * How it works:
 * 1) Fetch https://news.smol.ai/issues and extract issue links (cards).
 * 2) Parse date from URL slug and filter to last N days.
 * 3) For each new issue (not present in news.json), fetch the issue page and extract:
 *    - AI Twitter Recap section
 *    - AI Reddit Recap section
 *    - AI Discords section
 * 4) Ask Gemini to output section summaries (4-5 bullets each), both EN and KO.
 * 5) Store Korean summaries in news.json for UI rendering.
 *
 * Required env:
 *  - GEMINI_API_KEY
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wikiRoot = path.join(__dirname, '..');

const NEWS_JSON_PATH = path.join(wikiRoot, 'src', 'data', 'news.json');
const ISSUES_URL = 'https://news.smol.ai/issues';

const KEEP_LAST_DAYS = Number(process.env.KEEP_LAST_DAYS ?? '45');
const LOOKBACK_DAYS = Number(process.env.LOOKBACK_DAYS ?? '30');
const MAX_PROCESS_NEW = Number(process.env.MAX_PROCESS_NEW ?? '3');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Prefer a free-tier friendly, low-latency model.
// If the chosen model isn't available for this key/project, we will fall back automatically.
const GEMINI_MODEL_CANDIDATES = (
  process.env.GEMINI_MODEL_CANDIDATES ??
  [
    process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest',
  ].join(',')
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY env var');
}

const GEMINI_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? '2000');

function parseIssueSlugToDate(slug) {
  // Expected: 26-03-16-not-much  => 2026-03-16
  const m = slug.match(/^(\d{2})-(\d{2})-(\d{2})-/);
  if (!m) return null;
  const yy = Number(m[1]);
  const year = 2000 + yy;
  const month = m[2];
  const day = m[3];
  return `${year}-${month}-${day}`;
}

function isoToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function dateToMs(isoDate) {
  // Treat as local midnight; acceptable for day-granularity filters.
  return new Date(`${isoDate}T00:00:00`).getTime();
}

function normalizeWhitespace(s) {
  return s
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToPlainText(html) {
  return normalizeWhitespace(
    html
      // Remove noisy chunks first.
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      // Preserve some structure.
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|section|article|h1|h2|h3|h4|ul|ol|li)>/gi, '\n')
      .replace(/<li>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      // Drop tags.
      .replace(/<[^>]+>/g, ' ')
      // Basic entity decode (expand if needed).
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
  );
}

function extractSectionText(plainText, startMarker, endMarkerOrNull) {
  const startIdx = plainText.indexOf(startMarker);
  if (startIdx < 0) return '';
  const endIdx = endMarkerOrNull ? plainText.indexOf(endMarkerOrNull, startIdx + startMarker.length) : -1;
  const sliceEnd = endIdx >= 0 ? endIdx : plainText.length;
  return normalizeWhitespace(plainText.slice(startIdx, sliceEnd));
}

function sliceForModel(s, maxChars) {
  if (!s) return '';
  const trimmed = s.trim();
  if (trimmed.length <= maxChars) return trimmed;
  // Keep the head (most summary-dense) and a short tail.
  const head = trimmed.slice(0, maxChars - 500);
  const tail = trimmed.slice(-500);
  return `${head}\n\n[...truncated...]\n\n${tail}`;
}

function pickRecapInput(sectionText, { maxBulletLines = 35, maxHeaderLines = 6, maxChars = 6500 } = {}) {
  if (!sectionText) return '';
  const lines = sectionText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // htmlToPlainText turns <li> into "- " lines, but the page may also contain "*" bullets.
  const bulletLines = lines.filter((l) => /^([-•*]|\d+\.)\s+/.test(l)).slice(0, maxBulletLines);
  const headerLines = lines
    .filter((l) => !/^([-•*]|\d+\.)\s+/.test(l))
    .slice(0, maxHeaderLines);

  return sliceForModel([...headerLines, ...bulletLines].join('\n'), maxChars);
}

function extractIssueLinksFromIssuesHtml(html) {
  // Extract anchor hrefs that look like: https://news.smol.ai/issues/26-03-16-not-much
  // or: /issues/26-03-16-not-much
  const items = [];

  // Relative href: /issues/<slug>
  const relRe = /href=(['"])(\/issues\/(\d{2}-\d{2}-\d{2}-[^"?#/]+))\1/gi;
  let m;
  while ((m = relRe.exec(html))) {
    const url = `https://news.smol.ai${m[2]}`;
    const s = m[3];
    items.push({ url, slug: s });
  }

  // Absolute href: https://news.smol.ai/issues/<slug>
  const absRe = /href=(['"])(https?:\/\/news\.smol\.ai\/issues\/(\d{2}-\d{2}-\d{2}-[^"?#/]+))\1/gi;
  while ((m = absRe.exec(html))) {
    const url = m[2];
    const s = m[3];
    items.push({ url, slug: s });
  }

  // Dedup by slug.
  const seen = new Set();
  return items.filter((x) => {
    if (seen.has(x.slug)) return false;
    seen.add(x.slug);
    return true;
  });
}

function extractCardTitleFromIssuesHtml(html, issueUrl, issueSlug) {
  // The issues listing anchors usually look like:
  //   <a href=".../issues/<slug>">Mar 10 Some main title...</a>
  // Sometimes there may be nested spans; we strip tags after capture.
  const safeSlug = issueSlug ?? issueUrl.split('/').filter(Boolean).pop();
  if (!safeSlug) return null;

  const slugEsc = safeSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const titleRe = new RegExp(
    `<a[^>]*href=(['"])([^'"]*${slugEsc}[^'"]*)\\1[^>]*>([\\s\\S]*?)<\\/a>`,
    'i'
  );

  const m = html.match(titleRe);
  if (!m) return null;
  const inner = m[3] ?? '';
  const raw = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Strip the leading date like "Mar 10 ".
  const cleaned = raw.replace(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+/i, '');
  // Listing UI sometimes appends "Show details".
  const finalTitle = (cleaned || raw || '').replace(/\s*Show details\s*$/i, '').trim();
  return finalTitle || null;
}

function buildGeminiPrompt({ twitterText, redditText, discordText, issueTitle }) {
  return `
You are summarizing "AINews | AINews" issue pages for a robotics/AI wiki.
We need short, readable section recaps.

Task:
- For each section (Twitter / Reddit / Discord), output:
  - bulleted English topic recap (6-10 bullets max)
  - bulleted Korean topic recap (6-10 bullets max)
- Each bullet must be a single line starting with "- ".
- Each bullet line must contain at least 3 sentences (so it can cover a full topic), and must not contain newline characters.
- Each bullet must represent ONE major topic/theme. Do not merge multiple unrelated themes into a single bullet.
- Ensure coverage: include all major themes present in the section text; prefer missing fewer themes over making bullets too short.
- Do NOT output any text other than the markers and their bullet lines.

Issue title (card): ${issueTitle}

=== AI Twitter Recap SECTION TEXT ===
${twitterText}

=== AI Reddit Recap SECTION TEXT ===
${redditText}

=== AI Discords SECTION TEXT ===
${discordText}

Output format (exact markers; no markdown fences):
TWITTER_EN
- bullet...
- bullet...
TWITTER_KO
- bullet...
- bullet...

REDDIT_EN
- bullet...
REDDIT_KO
- bullet...

DISCORD_EN
- bullet...
DISCORD_KO
- bullet...

Rules:
- Output 0 bullets if the input section is empty (just the marker).
- Otherwise output up to 10 bullets per section (aim 6-10). If there are fewer major themes, output fewer bullets.
- Use only "-" bullet lines. No numbering.
`.trim();
}

async function callGeminiForModel({ prompt, model }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      // Keep output tight because we only need 3 sections.
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Gemini response missing text: ${JSON.stringify(data).slice(0, 500)}`);
  return text;
}

async function callGemini({ prompt }) {
  let lastErr;
  for (const model of GEMINI_MODEL_CANDIDATES) {
    try {
      return await callGeminiForModel({ prompt, model });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('Gemini call failed');
}

function parseGeminiJson(text) {
  // Gemini sometimes wraps in markdown. Extract the outermost JSON object.
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first < 0 || last < 0 || last <= first) {
    throw new Error(`Could not find JSON object in Gemini output: ${text.slice(0, 250)}`);
  }
  const jsonText = text.slice(first, last + 1);
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(
      `Gemini JSON parse failed. Error: ${(err && err.message) || String(err)}. Output head: ${text.slice(
        0,
        400
      )}`
    );
  }
}

const ALL_MARKERS = ['TWITTER_EN', 'TWITTER_KO', 'REDDIT_EN', 'REDDIT_KO', 'DISCORD_EN', 'DISCORD_KO'];

function parseBulletsForMarker(text, marker) {
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const anyMarkerAlt = ALL_MARKERS.map((m) => escapeRegExp(m)).join('|');
  const markerRe = new RegExp(`${escapeRegExp(marker)}\\s*:?'`, 'i');

  // Find marker start (position-based parsing to avoid newline-format issues).
  const startMatch = markerRe.exec(text);
  if (!startMatch) return [];

  const startIdx = startMatch.index + startMatch[0].length;

  // Find the earliest next marker after start.
  const nextRe = new RegExp(`(?:${anyMarkerAlt})\\s*:?`, 'g');
  nextRe.lastIndex = startIdx;
  const nextMatch = nextRe.exec(text);
  const endIdx = nextMatch ? nextMatch.index : text.length;

  const block = text.slice(startIdx, endIdx);

  const lines = block.split(/\r?\n/).map((l) => l.trim());
  const bullets = [];

  for (const line of lines) {
    if (!/^[-•*]\s*/.test(line)) continue; // only accept explicit bullet lines
    const clean = line.replace(/^[-•*]\s*/, '').trim();
    if (!clean) continue;
    if (ALL_MARKERS.includes(clean)) continue; // never treat marker tokens as bullets
    bullets.push(clean);
    if (bullets.length >= 10) break;
  }

  return bullets;
}

function parseGeminiMarkers(text) {
  // Accept either markers alone or markers + bullet lines.
  return {
    twitter: {
      bullets_en: parseBulletsForMarker(text, 'TWITTER_EN'),
      bullets_ko: parseBulletsForMarker(text, 'TWITTER_KO'),
    },
    reddit: {
      bullets_en: parseBulletsForMarker(text, 'REDDIT_EN'),
      bullets_ko: parseBulletsForMarker(text, 'REDDIT_KO'),
    },
    discord: {
      bullets_en: parseBulletsForMarker(text, 'DISCORD_EN'),
      bullets_ko: parseBulletsForMarker(text, 'DISCORD_KO'),
    },
  };
}

function isLikelyTruncatedJson(text) {
  const first = text.indexOf('{');
  if (first < 0) return false;
  // If there is no closing brace, output is probably truncated.
  const last = text.lastIndexOf('}');
  return last < first;
}

async function loadExistingNews() {
  try {
    const raw = await fs.readFile(NEWS_JSON_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { items: [] };
  }
}

async function saveNews(items) {
  await fs.writeFile(NEWS_JSON_PATH, JSON.stringify({ items }, null, 2), 'utf-8');
}

async function main() {
  const existing = await loadExistingNews();
  const existingItems = (existing.items ?? []).filter((x) => {
    if (!x || typeof x !== 'object') return false;
    if (typeof x.id !== 'string') return false;
    if (!/^(\d{2})-(\d{2})-(\d{2})-/.test(x.id)) return false;
    if (typeof x.url !== 'string' || !x.url.startsWith('https://news.smol.ai/issues/')) return false;
    return true;
  });
  const existingById = new Map(existingItems.map((x) => [x.id, x]));

  const issuesRes = await fetch(ISSUES_URL);
  if (!issuesRes.ok) throw new Error(`Failed to fetch issues list: ${issuesRes.status} ${issuesRes.statusText}`);
  const issuesHtml = await issuesRes.text();
  const issueLinks = extractIssueLinksFromIssuesHtml(issuesHtml);

  const today = isoToday();
  const cutoff = dateToMs(today) - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;

  const filtered = issueLinks
    .map((x) => {
      const date = parseIssueSlugToDate(x.slug);
      return { ...x, date };
    })
    .filter((x) => x.date && dateToMs(x.date) >= cutoff)
    // Prefer deterministic ordering (newer first)
    .sort((a, b) => dateToMs(b.date) - dateToMs(a.date));

  // Always refresh the latest N issues so summary quality/title changes propagate.
  const toProcess = filtered.slice(0, MAX_PROCESS_NEW);

  const updated = new Map(existingById);

  console.log(`Found ${filtered.length} issues in last ${LOOKBACK_DAYS} days. New: ${toProcess.length}.`);

  for (const issue of toProcess) {
    const issueTitle =
      extractCardTitleFromIssuesHtml(issuesHtml, issue.url, issue.slug) ?? issue.slug;

    const issueRes = await fetch(issue.url);
    if (!issueRes.ok) throw new Error(`Failed to fetch issue page: ${issueRes.status} ${issueRes.statusText}`);
    const issueHtml = await issueRes.text();
    const plainText = htmlToPlainText(issueHtml);

    // Markers come from the issue page structure.
    const twitterText = extractSectionText(plainText, 'AI Twitter Recap', 'AI Reddit Recap');
    const redditText = extractSectionText(plainText, 'AI Reddit Recap', 'AI Discords');
    const discordText = extractSectionText(plainText, 'AI Discords', null);

    const payload = {
      twitterText: pickRecapInput(twitterText, { maxBulletLines: 140, maxHeaderLines: 10, maxChars: 12000 }),
      redditText: pickRecapInput(redditText, { maxBulletLines: 120, maxHeaderLines: 10, maxChars: 12000 }),
      discordText: pickRecapInput(discordText, { maxBulletLines: 80, maxHeaderLines: 8, maxChars: 8000 }),
      issueTitle,
    };

    const basePrompt = buildGeminiPrompt(payload);
    const prompt = basePrompt;

    let geminiText = await callGemini({ prompt });
    let parsed = parseGeminiMarkers(geminiText);

    // If the model failed to follow the marker format, parsed bullets will be all empty.
    const allEmpty =
      !parsed?.twitter?.bullets_en?.length &&
      !parsed?.twitter?.bullets_ko?.length &&
      !parsed?.reddit?.bullets_en?.length &&
      !parsed?.reddit?.bullets_ko?.length &&
      !parsed?.discord?.bullets_en?.length &&
      !parsed?.discord?.bullets_ko?.length;

    if (allEmpty) {
      console.warn(`Gemini marker format failed for ${issue.slug}. Retrying...`);
      const retryPrompt =
        basePrompt +
        '\n\nCRITICAL: Output EXACTLY the markers listed. After each marker, output ONLY "-" bullet lines. No other text.';
      geminiText = await callGemini({ prompt: retryPrompt });
      parsed = parseGeminiMarkers(geminiText);
    }

    const twitter = parsed?.twitter ?? {};
    const reddit = parsed?.reddit ?? {};
    const discord = parsed?.discord ?? {};

    const bulletsKo = [
      ...(Array.isArray(twitter?.bullets_ko) ? twitter.bullets_ko : []),
      ...(Array.isArray(reddit?.bullets_ko) ? reddit.bullets_ko : []),
      ...(Array.isArray(discord?.bullets_ko) ? discord.bullets_ko : []),
    ].filter((x) => typeof x === 'string' && x.trim());

    const summaryKo = bulletsKo.join('\n');

    updated.set(issue.slug, {
      id: issue.slug,
      title: issueTitle,
      url: issue.url,
      date: issue.date,
      source: 'smol-ai',
      recaps: {
        twitter: {
          bulletsKo: Array.isArray(twitter?.bullets_ko) ? twitter.bullets_ko : [],
          bulletsEn: Array.isArray(twitter?.bullets_en) ? twitter.bullets_en : [],
        },
        reddit: {
          bulletsKo: Array.isArray(reddit?.bullets_ko) ? reddit.bullets_ko : [],
          bulletsEn: Array.isArray(reddit?.bullets_en) ? reddit.bullets_en : [],
        },
        discord: {
          bulletsKo: Array.isArray(discord?.bullets_ko) ? discord.bullets_ko : [],
          bulletsEn: Array.isArray(discord?.bullets_en) ? discord.bullets_en : [],
        },
      },
      // Backward compatibility with the old UI shape.
      summaryKo,
    });
  }

  const items = Array.from(updated.values())
    .filter((x) => x?.date)
    .sort((a, b) => dateToMs(b.date) - dateToMs(a.date))
    .filter((x) => dateToMs(x.date) >= dateToMs(today) - KEEP_LAST_DAYS * 24 * 60 * 60 * 1000);

  await saveNews(items);
  console.log(`Saved ${items.length} items to ${NEWS_JSON_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

