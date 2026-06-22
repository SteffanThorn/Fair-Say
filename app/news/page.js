import { Suspense } from 'react';
import { getNZNews } from '@/lib/newsCache';
import { getDataClient } from '@/lib/supabase/data';
import { RSS_SOURCE_BY_KEY, RSS_SOURCE_BY_DISPLAY_NAME } from '@/lib/rss-sources';
import NewsSourcesSection from '@/components/news/NewsSourcesSection';

export const metadata = {
  title: 'Grounded News',
  description: 'NZ politics news aggregated from multiple sources. Neutral summaries, no spin.',
};

export const revalidate = 600;

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card rounded-2xl animate-pulse p-4 flex gap-4">
          <div className="w-28 h-20 shrink-0 rounded-xl bg-slate-700/50" />
          <div className="flex-1 space-y-2.5 py-1">
            <div className="h-3 w-24 rounded-full bg-slate-700/60" />
            <div className="h-4 w-full rounded bg-slate-700/60" />
            <div className="h-4 w-4/5 rounded bg-slate-700/50" />
            <div className="h-3 w-full rounded bg-slate-700/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function EnrichedFeed() {
  let articles = [];
  let sources = [];

  try {
    const supabase = getDataClient();
    const [articlesData, sourcesResult] = await Promise.all([
      getNZNews({ limit: 40 }),
      supabase.from('news_sources').select('*').eq('active', true).order('name'),
    ]);
    articles = articlesData;
    sources = sourcesResult.data || [];
  } catch {
    return (
      <div className="card rounded-2xl p-8 text-center">
        <p className="text-2xl mb-2">🔌</p>
        <p className="font-semibold text-white">Database not connected</p>
        <p className="mt-1 text-sm text-slate-400">
          Check your Supabase credentials in <code className="text-emerald-400">.env.local</code>.
        </p>
      </div>
    );
  }

  // Build DB source lookup by full name
  const dbSourceByName = {};
  for (const s of sources) {
    dbSourceByName[s.name] = s;
  }

  // Enrich each article: prefer DB data, fall back to static defaults in rss-sources.js
  const enrichedArticles = articles.map((article) => {
    const rssSource =
      RSS_SOURCE_BY_KEY[article.feed_source] ||
      RSS_SOURCE_BY_DISPLAY_NAME[article.source] ||
      null;
    const dbSource = rssSource ? dbSourceByName[rssSource.newsSourcesName] : null;

    return {
      ...article,
      sourceType: dbSource?.type || rssSource?.defaultType || 'news',
      sourceBias: dbSource?.bias || rssSource?.defaultBias || null,
      sourceValidity: dbSource?.validity_rating || rssSource?.defaultValidity || null,
      sourcePlatforms: dbSource?.platforms || rssSource?.defaultPlatforms || ['web'],
      hasPaywall: rssSource?.hasPaywall || false,
      fundedBy: dbSource?.funded_by || null,
    };
  });

  return <NewsSourcesSection articles={enrichedArticles} sources={sources} />;
}

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Fair Say NZ</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">📰 Grounded News</h1>
        <p className="mt-2 max-w-xl text-slate-300 text-sm leading-relaxed">
          NZ politics and government — headlines and summaries from across the media spectrum.
          Read broadly. Check multiple sources before forming an opinion.
        </p>

        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>ℹ️ About these articles:</strong> Fair Say NZ aggregates headlines from
            independent NZ news sources. We do not write, edit, or endorse any article.
            Bias indicators reflect the source&apos;s general editorial tendency.
          </p>
        </div>
      </header>

      <Suspense fallback={<FeedSkeleton />}>
        <EnrichedFeed />
      </Suspense>
    </main>
  );
}
