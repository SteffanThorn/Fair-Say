import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  const { accountId } = await params;
  if (!accountId) {
    return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { data: badges, error } = await admin
    .from('account_badges')
    .select('badge_id, earned_at, learn_badges(id, label, description)')
    .eq('account_id', accountId)
    .order('earned_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Could not fetch badges' }, { status: 500 });
  }

  return NextResponse.json({ badges: badges ?? [] });
}
