import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

function anonIdFor(userId, pollId, pepper) {
  return createHash('sha256').update(`${userId}:${pollId}:${pepper}`).digest('hex');
}

export async function GET(request, { params }) {
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

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const anonId = anonIdFor(user.id, pollId, serverPepper);
  const admin = await createAdminClient();

  const { data: row } = await admin
    .from('poll_rankings')
    .select('status, method, draft_state, ranking')
    .eq('anon_id', anonId)
    .maybeSingle();

  if (!row) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    status: row.status,
    method: row.method,
    draftState: row.draft_state,
    ranking: row.ranking,
  });
}

export async function PUT(request, { params }) {
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

  const { method, draftState } = body;
  if (!['pairwise', 'direct'].includes(method) || typeof draftState !== 'object' || draftState === null) {
    return NextResponse.json({ error: 'Invalid draft payload' }, { status: 400 });
  }

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const anonId = anonIdFor(user.id, pollId, serverPepper);
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
      status: 'draft',
      method,
      draft_state: draftState,
      credential_tier: credentialTier,
      learn_badges: learnBadges,
    },
    { onConflict: 'anon_id' }
  );

  if (upsertError) {
    console.error('Draft upsert error:', upsertError);
    return NextResponse.json({ error: 'Could not save progress' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
