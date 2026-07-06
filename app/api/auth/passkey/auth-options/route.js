import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';

const RP_ID = process.env.PASSKEY_RP_ID || 'localhost';

export async function POST() {
  const admin = await createAdminClient();

  // Discoverable credential flow — no allowCredentials, so the browser shows
  // any stored passkeys for this RP and the user selects one.
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'required',
  });

  // user_id is null because we don't know who the user is until after verification.
  await admin.from('passkey_challenges').insert({
    challenge: options.challenge,
    user_id: null,
  });

  return NextResponse.json(options);
}
