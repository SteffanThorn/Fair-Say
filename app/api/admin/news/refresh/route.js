import { NextResponse } from 'next/server';
import { refreshNZNews } from '@/lib/newsCache';

export async function POST(request) {
  const internalApiKey = request.headers.get('x-internal-api-key');
  if (!internalApiKey || internalApiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await refreshNZNews();
    return NextResponse.json({ ok: true, count: articles.length });
  } catch (error) {
    console.error('[POST /api/admin/news/refresh]', error);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
