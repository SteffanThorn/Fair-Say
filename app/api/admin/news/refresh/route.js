import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/serverAuth';
import { refreshNZNews } from '@/lib/newsCache';

export async function POST() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const articles = await refreshNZNews();
    return NextResponse.json({ ok: true, count: articles.length });
  } catch (error) {
    console.error('[POST /api/admin/news/refresh]', error);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
