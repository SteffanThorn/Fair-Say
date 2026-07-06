import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/serviceSupabase';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { checkRateLimit, getRequestIp } from '@/lib/rateLimit';

const RP_ID = process.env.PASSKEY_RP_ID || 'localhost';
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimit({ key: `passkey-auth-verify:${ip}`, limit: 20, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts — please try again later' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const admin = createServiceClient();

  // Look up the credential by its base64url ID to identify the user.
  const credentialId = body.id;
  const { data: cred, error: credErr } = await admin
    .from('passkey_credentials')
    .select('*')
    .eq('credential_id', credentialId)
    .maybeSingle();

  if (credErr || !cred) {
    return NextResponse.json({ error: 'Passkey not recognised' }, { status: 401 });
  }

  // Fetch the most recent anonymous challenge (user_id IS NULL).
  const { data: challengeRow, error: challengeErr } = await admin
    .from('passkey_challenges')
    .select('id, challenge, created_at')
    .is('user_id', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (challengeErr || !challengeRow) {
    return NextResponse.json({ error: 'No pending challenge' }, { status: 400 });
  }

  const ageMs = Date.now() - new Date(challengeRow.created_at).getTime();
  if (ageMs > 5 * 60 * 1000) {
    await admin.from('passkey_challenges').delete().eq('id', challengeRow.id);
    return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: cred.credential_id,
        publicKey: Buffer.from(cred.public_key, 'base64'),
        counter: cred.sign_count,
      },
      requireUserVerification: true,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 401 });
  }

  // Consume the challenge.
  await admin.from('passkey_challenges').delete().eq('id', challengeRow.id);

  if (!verification.verified) {
    return NextResponse.json({ error: 'Passkey verification failed' }, { status: 401 });
  }

  // Update the sign count (clone detection — reject if newCounter <= stored).
  await admin
    .from('passkey_credentials')
    .update({ sign_count: verification.authenticationInfo.newCounter })
    .eq('id', cred.id);

  // Retrieve the synthetic email so the client can exchange it for a session.
  const { data: { user }, error: userErr } = await admin.auth.admin.getUserById(cred.user_id);

  if (userErr || !user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 401 });
  }

  // Issue a one-time OTP so the client can call supabase.auth.verifyOtp().
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
  });

  if (linkError || !linkData?.properties?.email_otp) {
    console.error('[auth-verify] generateLink:', linkError);
    return NextResponse.json({ error: 'Could not generate session token' }, { status: 500 });
  }

  return NextResponse.json({ email: user.email, otp: linkData.properties.email_otp });
}
