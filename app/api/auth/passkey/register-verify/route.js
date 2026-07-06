import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

const RP_ID = process.env.PASSKEY_RP_ID || 'localhost';
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const admin = await createAdminClient();

  // Fetch the most recent pending challenge for this user.
  const { data: challengeRow, error: challengeErr } = await admin
    .from('passkey_challenges')
    .select('id, challenge, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (challengeErr || !challengeRow) {
    return NextResponse.json({ error: 'No pending challenge found' }, { status: 400 });
  }

  const ageMs = Date.now() - new Date(challengeRow.created_at).getTime();
  if (ageMs > 5 * 60 * 1000) {
    await admin.from('passkey_challenges').delete().eq('id', challengeRow.id);
    return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
  }

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 400 });
  }

  // Consume the challenge regardless of outcome.
  await admin.from('passkey_challenges').delete().eq('id', challengeRow.id);

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: 'Passkey verification failed' }, { status: 400 });
  }

  const { registrationInfo } = verification;

  const { error: insertError } = await admin.from('passkey_credentials').insert({
    user_id: user.id,
    credential_id: registrationInfo.credential.id,
    public_key: Buffer.from(registrationInfo.credential.publicKey).toString('base64'),
    sign_count: registrationInfo.credential.counter,
    credential_device_type: registrationInfo.credentialDeviceType,
    credential_backed_up: registrationInfo.credentialBackedUp,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'This passkey is already registered' }, { status: 409 });
    }
    console.error('[register-verify] insert:', insertError);
    return NextResponse.json({ error: 'Could not save passkey' }, { status: 500 });
  }

  return NextResponse.json({ registered: true });
}
