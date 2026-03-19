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
  return cleaned || raw || null;
}

function buildGeminiPrompt({ twitterText, redditText, discordText, issueTitle }) {
  return `
You are summarizing "AINews | AINews" issue pages for a robotics/AI wiki.
We need short, readable section recaps.

Task:
- For each section (Twitter / Reddit / Discord), output:
  - bullets_en: array of 4-5 bullet strings in English
  - bullets_ko: array of 4-5 bullet strings in Korean
- Each bullet string should be a short sentence.
- Output must be valid JSON only.
- Output must be a single JSON object with keys exactly: twitter, reddit, discord.
- Do not wrap in markdown fences.
- Do not include any additional commentary.
- If a section has no useful content, return an empty array for that section.

Issue title (card): ${issueTitle}

=== AI Twitter Recap SECTION TEXT ===
${twitterText}

=== AI Reddit Recap SECTION TEXT ===
${redditText}

=== AI Discords SECTION TEXT ===
${discordText}

Output JSON schema:
{
  "twitter": { "bullets_en": string[], "bullets_ko": string[] },
  "reddit": { "bullets_en": string[], "bullets_ko": string[] },
  "discord": { "bullets_en": string[], "bullets_ko": string[] }
}
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
      // Ask Gemini to return strict JSON when supported.
      responseMimeType: 'application/json',
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
  const existingById = new Map((existing.items ?? []).map((x) => [x.id, x]));

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

  const toProcess = filtered
    .filter((x) => !existingById.has(x.slug))
    .slice(0, MAX_PROCESS_NEW);

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
      twitterText: sliceForModel(twitterText, 9000),
      redditText: sliceForModel(redditText, 9000),
      discordText: sliceForModel(discordText, 6000),
      issueTitle,
    };

    const basePrompt = buildGeminiPrompt(payload);
    const prompt = basePrompt;

    let geminiText = await callGemini({ prompt });
    let parsed = null;
    try {
      parsed = parseGeminiJson(geminiText);
    } catch (err) {
      // Most common failure: Gemini output got truncated (missing closing `}`).
      if (isLikelyTruncatedJson(geminiText)) {
        console.warn(
          `Gemini output truncated for ${issue.slug}. Retrying with stronger "JSON only" instruction...`
        );
        const retryPrompt =
          basePrompt +
          '\n\nCRITICAL: The previous output was truncated. Regenerate and output ONLY a complete JSON object that fully closes braces. Do not use markdown fences.'; 
        geminiText = await callGemini({ prompt: retryPrompt });
        parsed = parseGeminiJson(geminiText);
      } else {
        throw err;
      }
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

