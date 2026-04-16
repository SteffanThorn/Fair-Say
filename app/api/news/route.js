import { NextResponse } from 'next/server';
import { getNZNews } from '@/lib/newsCache';

// In-memory rate limiter — keyed by IP, max 1 call per 5 s
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 5_000;

function isRateLimited(ip) {
  const last = rateLimitMap.get(ip) || 0;
  if (Date.now() - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(ip, Date.now());
  return false;
}

export async function GET(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || 20), 50);

    const articles = await getNZNews({ limit });

    return NextResponse.json(
      { articles, count: articles.length, cachedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[GET /api/news]', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
