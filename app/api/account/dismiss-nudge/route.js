import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Persists the user's choice to dismiss the Didit upgrade nudge.
// Stored on the account so the nudge is not shown again across sessions.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const admin = await createAdminClient();

  const { error } = await admin
    .from('accounts')
    .update({ hide_didit_nudge: true })
    .eq('account_id', user.id);

  if (error) {
    console.error('[POST /api/account/dismiss-nudge]', error);
    return NextResponse.json({ error: 'Could not save preference' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
