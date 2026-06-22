import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// Public route — no auth required. The email param is the authentication for this action.
export async function POST(request) {
  let email;
  try {
    const body = await request.json();
    email = body.email?.trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { error } = await admin
    .from('accounts')
    .update({ newsletter_opt_in: false })
    .eq('email', email);

  if (error) {
    console.error('[POST /api/unsubscribe]', error);
    return NextResponse.json({ error: 'Could not process unsubscribe request' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
