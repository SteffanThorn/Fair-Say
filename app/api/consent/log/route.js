import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Logs that a user saw and accepted a pre-collection disclosure.
// Required by the NZ Biometric Processing Privacy Code 2025.
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { consentType, disclosureVersion } = body;

  if (!consentType || !disclosureVersion) {
    return NextResponse.json({ error: 'consentType and disclosureVersion are required' }, { status: 400 });
  }

  const admin = await createAdminClient();

  const { error } = await admin.from('consent_log').insert({
    account_id: user.id,
    consent_type: consentType,
    disclosure_version: disclosureVersion,
  });

  if (error) {
    console.error('[POST /api/consent/log]', error);
    return NextResponse.json({ error: 'Could not record consent' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
