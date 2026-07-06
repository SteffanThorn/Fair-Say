import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';
import { computeLeaderboard } from '@/lib/ranking';

const MIN_GROUP_SIZE = 5;

export async function GET(request, { params }) {
  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll || poll.type !== 'ranked') {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier'); // 'email' | 'verified_nz_citizen' | null (all)

  const admin = await createAdminClient();

  let query = admin
    .from('poll_rankings')
    .select('anon_id, ranking, credential_tier, learn_badges')
    .eq('poll_id', pollId)
    .eq('status', 'published');

  if (tier === 'email' || tier === 'verified_nz_citizen') {
    query = query.eq('credential_tier', tier);
  }

  const { data: rows, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Could not fetch results' }, { status: 500 });
  }

  const total = rows?.length ?? 0;

  if (total > 0 && total < MIN_GROUP_SIZE) {
    return NextResponse.json({
      leaderboard: null,
      votes: null,
      total,
      suppressed: true,
      reason: 'Not enough responses in this group to display results.',
    });
  }

  const labels = poll.options.map((o) => o.label);
  const leaderboard = computeLeaderboard((rows ?? []).map((r) => r.ranking), labels);

  const votes = (rows ?? []).map((r) => ({
    id: r.anon_id.slice(0, 12),
    ranking: r.ranking,
    tier: r.credential_tier,
    badges: r.learn_badges ?? [],
  }));

  return NextResponse.json({ leaderboard, votes, total, suppressed: false });
}
