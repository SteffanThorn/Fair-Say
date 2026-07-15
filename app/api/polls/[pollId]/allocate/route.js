import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

const MIN_GROUP_SIZE = 5;

function averageAllocations(rows, labels) {
  const sums = Object.fromEntries(labels.map((l) => [l, 0]));
  for (const row of rows) {
    for (const label of labels) {
      sums[label] += Number(row.allocations?.[label]) || 0;
    }
  }
  const count = rows.length || 1;
  return Object.fromEntries(labels.map((l) => [l, sums[l] / count]));
}

export async function POST(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Sign in to allocate' }, { status: 401 });
  }

  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll || poll.type !== 'allocation') {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { allocations } = body;
  const labels = poll.options.map((o) => o.label);

  const isValid =
    allocations &&
    typeof allocations === 'object' &&
    Object.keys(allocations).length === labels.length &&
    labels.every((label) => Number.isInteger(allocations[label]) && allocations[label] >= 0 && allocations[label] <= 100) &&
    labels.reduce((sum, label) => sum + allocations[label], 0) === 100;

  if (!isValid) {
    return NextResponse.json({ error: 'Allocations must be whole percentages across every category, summing to 100' }, { status: 400 });
  }

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const anonId = createHash('sha256').update(`${user.id}:${pollId}:${serverPepper}`).digest('hex');
  const admin = await createAdminClient();

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

  const { error: upsertError } = await admin.from('poll_allocations').upsert(
    {
      anon_id: anonId,
      poll_id: pollId,
      allocations,
      credential_tier: credentialTier,
      learn_badges: learnBadges,
    },
    { onConflict: 'anon_id' }
  );

  if (upsertError) {
    console.error('Allocation upsert error:', upsertError);
    return NextResponse.json({ error: 'Could not record allocation' }, { status: 500 });
  }

  const { data: rows } = await admin
    .from('poll_allocations')
    .select('anon_id, allocations, credential_tier, learn_badges')
    .eq('poll_id', pollId);

  const total = rows?.length ?? 0;
  const suppressed = total > 0 && total < MIN_GROUP_SIZE;

  return NextResponse.json({
    your_id: anonId.slice(0, 12),
    your_allocations: allocations,
    total,
    suppressed,
    averages: suppressed ? null : averageAllocations(rows, labels),
    rows: suppressed
      ? null
      : (rows ?? []).map((r) => ({
          id: r.anon_id.slice(0, 12),
          allocations: r.allocations,
          tier: r.credential_tier,
          badges: r.learn_badges ?? [],
        })),
  });
}
