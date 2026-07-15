import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
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

export async function GET(request, { params }) {
  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll || poll.type !== 'allocation') {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier'); // 'email' | 'verified_nz_citizen' | null (all)

  const admin = await createAdminClient();

  let query = admin
    .from('poll_allocations')
    .select('anon_id, allocations, credential_tier, learn_badges')
    .eq('poll_id', pollId);

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
      averages: null,
      rows: null,
      total,
      suppressed: true,
      reason: 'Not enough responses in this group to display results.',
    });
  }

  const labels = poll.options.map((o) => o.label);
  const averages = averageAllocations(rows ?? [], labels);

  const voteRows = (rows ?? []).map((r) => ({
    id: r.anon_id.slice(0, 12),
    allocations: r.allocations,
    tier: r.credential_tier,
    badges: r.learn_badges ?? [],
  }));

  return NextResponse.json({ averages, rows: voteRows, total, suppressed: false });
}
