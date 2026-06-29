import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

const MIN_GROUP_SIZE = 5;

export async function GET(request, { params }) {
  const { pollId } = await params;
  if (!getPollById(pollId)) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier'); // 'email' | 'verified_nz_citizen' | null (all)

  const admin = await createAdminClient();

  let query = admin
    .from('poll_votes')
    .select('anon_id, vote_choice, credential_tier, learn_badges')
    .eq('poll_id', pollId);

  if (tier === 'email' || tier === 'verified_nz_citizen') {
    query = query.eq('credential_tier', tier);
  }

  const { data: votes, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Could not fetch results' }, { status: 500 });
  }

  const total = votes?.length ?? 0;

  // Suppress results if the filtered group is too small (de-anonymisation protection).
  if (total > 0 && total < MIN_GROUP_SIZE) {
    return NextResponse.json({
      counts: null,
      votes: null,
      total,
      suppressed: true,
      reason: 'Not enough responses in this group to display results.',
    });
  }

  const counts = {};
  for (const v of votes ?? []) {
    counts[v.vote_choice] = (counts[v.vote_choice] ?? 0) + 1;
  }

  // Expose individual rows with truncated anon_id (12 hex chars).
  // Rows with a legacy null anon_id (pre-migration votes) are skipped.
  const voteRows = (votes ?? [])
    .filter((v) => v.anon_id)
    .map((v) => ({
      id: v.anon_id.slice(0, 12),
      choice: v.vote_choice,
      tier: v.credential_tier,
      badges: v.learn_badges ?? [],
    }));

  return NextResponse.json({ counts, votes: voteRows, total, suppressed: false });
}
