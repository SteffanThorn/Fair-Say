import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Returns the current account's credential tier and nudge state.
// Used by the polls page to determine which filter options to offer
// and whether to show the Didit upgrade nudge.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const admin = await createAdminClient();

  const { data: account } = await admin
    .from('accounts')
    .select('verification_tag, is_verified, hide_didit_nudge, learn_notify, learn_sneak_peek_viewed_at')
    .eq('account_id', user.id)
    .maybeSingle();

  const credentialTier =
    account?.is_verified && account?.verification_tag === 'didit'
      ? 'verified_nz_citizen'
      : 'email';

  return NextResponse.json({
    credentialTier,
    hideDiditNudge: account?.hide_didit_nudge ?? false,
    learnNotify: account?.learn_notify ?? false,
    learnSneakPeekViewedAt: account?.learn_sneak_peek_viewed_at ?? null,
  });
}
