import { createServiceClient } from '@/lib/serviceSupabase';

// Trailing-window counter backed by Postgres — works reliably across
// Vercel's serverless invocations, unlike an in-memory Map.
export async function checkRateLimit({ key, limit, windowSeconds }) {
  const admin = createServiceClient();
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count } = await admin
    .from('rate_limit_events')
    .select('*', { count: 'exact', head: true })
    .eq('key', key)
    .gte('created_at', windowStart);

  if ((count || 0) >= limit) {
    return { allowed: false };
  }

  await admin.from('rate_limit_events').insert({ key });
  return { allowed: true };
}

// Best-effort caller IP for keying unauthenticated endpoints.
export function getRequestIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
