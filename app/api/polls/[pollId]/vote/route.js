import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

export async function POST(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });
  }

  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { choice } = body;
  if (!choice || !poll.options.find((o) => o.label === choice)) {
    return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
  }

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // anon_id = SHA256(account_id + ":" + poll_id + ":" + server_pepper)
  // Stable per user per poll — same input always produces the same hash.
  // The UNIQUE constraint on anon_id enforces one vote per person per poll.
  // Truncated to 12 hex chars for public display; full hash stored internally.
  const anonId = createHash('sha256')
    .update(`${user.id}:${pollId}:${serverPepper}`)
    .digest('hex');

  const admin = await createAdminClient();

  // Determine credential tier from account state.
  const { data: account } = await admin
    .from('accounts')
    .select('verification_tag, is_verified')
    .eq('account_id', user.id)
    .maybeSingle();

  const credentialTier =
    account?.is_verified && account?.verification_tag === 'didit'
      ? 'verified_nz_citizen'
      : 'email';

  // Fetch any learn badges earned by this user.
  const { data: earnedBadges } = await admin
    .from('account_badges')
    .select('badge_id')
    .eq('account_id', user.id);

  const learnBadges = earnedBadges?.map((b) => b.badge_id) ?? [];

  const { error: insertError } = await admin.from('poll_votes').insert({
    anon_id: anonId,
    poll_id: pollId,
    vote_choice: choice,
    verification_tag: account?.verification_tag || 'email',
    credential_tier: credentialTier,
    learn_badges: learnBadges,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 409 });
    }
    console.error('Vote insert error:', insertError);
    return NextResponse.json({ error: 'Could not record vote' }, { status: 500 });
  }

  // Return fresh counts + individual rows for all tiers so the client
  // can display both the bar chart and the individual response list.
  const { data: votes } = await admin
    .from('poll_votes')
    .select('anon_id, vote_choice, credential_tier, learn_badges')
    .eq('poll_id', pollId);

  const counts = {};
  const countsByTier = { email: {}, verified_nz_citizen: {} };

  for (const v of votes ?? []) {
    counts[v.vote_choice] = (counts[v.vote_choice] ?? 0) + 1;
    const tierBucket = countsByTier[v.credential_tier] ?? {};
    tierBucket[v.vote_choice] = (tierBucket[v.vote_choice] ?? 0) + 1;
    countsByTier[v.credential_tier] = tierBucket;
  }

  const total = votes?.length ?? 0;

  // Expose individual rows with truncated anon_id (12 hex chars).
  const voteRows = (votes ?? []).map((v) => ({
    id: v.anon_id ? v.anon_id.slice(0, 12) : null,
    choice: v.vote_choice,
    tier: v.credential_tier,
    badges: v.learn_badges ?? [],
  }));

  return NextResponse.json({
    voted: choice,
    your_id: anonId.slice(0, 12),
    counts,
    total,
    countsByTier,
    votes: voteRows,
  });
}
