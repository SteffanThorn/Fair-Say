/**
 * lib/newsCache.js
 *
 * Fetches NZ politics articles from NewsAPI.org, caches them in MongoDB
 * (NewsArticle collection), and falls back to RNZ RSS via Cheerio if the
 * API key is missing or the request fails.
 *
 * Cache TTL: 30 minutes — avoids hammering the free 100 req/day limit.
 */

import * as cheerio from 'cheerio';
import dbConnect from '@/lib/mongodb';
import NewsArticle from '@/lib/models/NewsArticle';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ── NewsAPI ────────────────────────────────────────────────────────────────

async function fetchFromNewsAPI({ pageSize = 20 } = {}) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error('NEWS_API_KEY not set');

  const params = new URLSearchParams({
    q: '"New Zealand" (politics OR parliament OR government OR election OR "general election")',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(pageSize),
    apiKey,
  });

  const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
    next: { revalidate: 0 }, // always fresh when we call this
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI ${res.status}: ${text}`);
  }

  const data = await res.json();

  return (data.articles || [])
    .filter((a) => a.url && a.title && a.title !== '[Removed]')
    .map((a) => ({
      title: a.title,
      source: a.source?.name || 'Unknown',
      url: a.url,
      summary: a.description || '',
      publishedDate: new Date(a.publishedAt),
      category: 'politics',
      imageUrl: a.urlToImage || null,
      apiSourceId: Buffer.from(a.url).toString('base64').slice(0, 64),
      feedSource: 'newsapi',
    }));
}

// ── RNZ RSS fallback ───────────────────────────────────────────────────────

async function fetchFromRNZRSS() {
  const res = await fetch('https://www.rnz.co.nz/rss/political.xml', {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`RNZ RSS ${res.status}`);

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const articles = [];
  $('item').each((_, el) => {
    const title = $(el).find('title').text().trim();
    const url = $(el).find('link').text().trim() || $(el).find('guid').text().trim();
    const summary = $(el).find('description').text().replace(/<[^>]+>/g, '').trim();
    const pubDateRaw = $(el).find('pubDate').text().trim();
    const publishedDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
    const imageUrl =
      $(el).find('media\\:content, media\\:thumbnail').attr('url') ||
      $(el).find('enclosure').attr('url') ||
      null;

    if (title && url) {
      articles.push({
        title,
        source: 'RNZ',
        url,
        summary,
        publishedDate,
        category: 'politics',
        imageUrl,
        apiSourceId: Buffer.from(url).toString('base64').slice(0, 64),
        feedSource: 'rss',
      });
    }
  });

  return articles;
}

// ── Cache helpers ──────────────────────────────────────────────────────────

async function getNewestArticleAge() {
  const newest = await NewsArticle.findOne().sort({ createdAt: -1 }).select('createdAt').lean();
  if (!newest) return Infinity;
  return Date.now() - newest.createdAt.getTime();
}

async function upsertArticles(articles) {
  const ops = articles.map((a) => ({
    updateOne: {
      filter: { apiSourceId: a.apiSourceId },
      update: { $setOnInsert: a },
      upsert: true,
    },
  }));
  if (ops.length) await NewsArticle.bulkWrite(ops, { ordered: false });
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns up to `limit` NZ politics articles.
 * Refreshes the MongoDB cache if it's stale (> CACHE_TTL_MS old).
 */
export async function getNZNews({ limit = 20, forceRefresh = false } = {}) {
  await dbConnect();

  const age = await getNewestArticleAge();
  const isStale = forceRefresh || age > CACHE_TTL_MS;

  if (isStale) {
    try {
      const articles = await fetchFromNewsAPI({ pageSize: 30 });
      await upsertArticles(articles);
    } catch (err) {
      console.warn('[newsCache] NewsAPI failed, trying RNZ RSS:', err.message);
      try {
        const rssArticles = await fetchFromRNZRSS();
        await upsertArticles(rssArticles);
      } catch (rssErr) {
        console.error('[newsCache] RNZ RSS also failed:', rssErr.message);
        // Fall through — serve whatever is in the cache already
      }
    }
  }

  const articles = await NewsArticle.find()
    .sort({ publishedDate: -1 })
    .limit(limit)
    .lean();

  return articles;
}

/**
 * Force-refresh the cache. Called by the admin refresh route.
 */
export async function refreshNZNews() {
  return getNZNews({ forceRefresh: true });
}
