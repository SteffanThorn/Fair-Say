import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';

const RP_NAME = 'Fair Say NZ';
const RP_ID = process.env.PASSKEY_RP_ID || 'localhost';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const admin = await createAdminClient();

  // Exclude already-registered credentials so the browser doesn't offer them again.
  const { data: existingCreds } = await admin
    .from('passkey_credentials')
    .select('credential_id')
    .eq('user_id', user.id);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: new TextEncoder().encode(user.id),
    userName: `fairsay_${user.id.slice(0, 8)}`,
    userDisplayName: 'Fair Say NZ Account',
    attestationType: 'none',
    excludeCredentials: (existingCreds ?? []).map((c) => ({
      id: c.credential_id,
      type: 'public-key',
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'required',
    },
  });

  // Store challenge — consumed by register-verify (max 5-min TTL).
  await admin.from('passkey_challenges').insert({
    challenge: options.challenge,
    user_id: user.id,
  });

  return NextResponse.json(options);
}
