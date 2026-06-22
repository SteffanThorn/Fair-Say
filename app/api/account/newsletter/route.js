import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function PATCH(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let opt_in;
  try {
    const body = await request.json();
    opt_in = body.opt_in;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof opt_in !== 'boolean') {
    return NextResponse.json({ error: 'opt_in must be a boolean' }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { error } = await admin
    .from('accounts')
    .update({ newsletter_opt_in: opt_in })
    .eq('account_id', user.id)
    .eq('verification_tag', 'email'); // only email-tier users have an email to update

  if (error) {
    console.error('[PATCH /api/account/newsletter]', error);
    return NextResponse.json({ error: 'Could not update preference' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newsletter_opt_in: opt_in });
}
