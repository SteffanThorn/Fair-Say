import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';
import { computeLeaderboard } from '@/lib/ranking';

const MIN_GROUP_SIZE = 5;

export async function POST(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in to rank' }, { status: 401 });
  }

  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll || poll.type !== 'ranked') {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { ranking, method } = body;
  const labels = poll.options.map((o) => o.label);

  const isValidPermutation =
    Array.isArray(ranking) &&
    ranking.length === labels.length &&
    new Set(ranking).size === labels.length &&
    ranking.every((label) => labels.includes(label));

  if (!isValidPermutation || !['pairwise', 'direct'].includes(method)) {
    return NextResponse.json({ error: 'Invalid ranking' }, { status: 400 });
  }

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const anonId = createHash('sha256').update(`${user.id}:${pollId}:${serverPepper}`).digest('hex');
  const admin = await createAdminClient();

  const { data: existing } = await admin
    .from('poll_rankings')
    .select('status')
    .eq('anon_id', anonId)
    .maybeSingle();

  if (existing?.status === 'published') {
    return NextResponse.json({ error: 'You have already submitted a ranking for this poll' }, { status: 409 });
  }

  const { data: account } = await admin
    .from('accounts')
    .select('verification_tag, is_verified')
    .eq('account_id', user.id)
    .maybeSingle();

  const credentialTier =
    account?.is_verified && account?.verification_tag === 'didit' ? 'verified_nz_citizen' : 'email';

  const { data: earnedBadges } = await admin
    .from('account_badges')
    .select('badge_id')
    .eq('account_id', user.id);

  const learnBadges = earnedBadges?.map((b) => b.badge_id) ?? [];

  const { error: upsertError } = await admin.from('poll_rankings').upsert(
    {
      anon_id: anonId,
      poll_id: pollId,
      status: 'published',
      method,
      draft_state: null,
      ranking,
      credential_tier: credentialTier,
      learn_badges: learnBadges,
    },
    { onConflict: 'anon_id' }
  );

  if (upsertError) {
    console.error('Ranking publish error:', upsertError);
    return NextResponse.json({ error: 'Could not publish ranking' }, { status: 500 });
  }

  const { data: rows } = await admin
    .from('poll_rankings')
    .select('anon_id, ranking, credential_tier, learn_badges')
    .eq('poll_id', pollId)
    .eq('status', 'published');

  const total = rows?.length ?? 0;
  const suppressed = total > 0 && total < MIN_GROUP_SIZE;

  return NextResponse.json({
    your_id: anonId.slice(0, 12),
    your_ranking: ranking,
    total,
    suppressed,
    leaderboard: suppressed ? null : computeLeaderboard(rows.map((r) => r.ranking), labels),
    votes: suppressed
      ? null
      : (rows ?? []).map((r) => ({
          id: r.anon_id.slice(0, 12),
          ranking: r.ranking,
          tier: r.credential_tier,
          badges: r.learn_badges ?? [],
        })),
  });
}
