import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const { data: account } = await admin
    .from('accounts')
    .select('is_verified, verification_tag')
    .eq('account_id', user.id)
    .maybeSingle();

  return NextResponse.json({
    is_verified: account?.is_verified ?? false,
    verification_tag: account?.verification_tag ?? null,
  });
}
