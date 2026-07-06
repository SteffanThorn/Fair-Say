import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { createServiceClient } from '@/lib/serviceSupabase';

export async function POST() {
  const admin = createServiceClient();

  // Generate a synthetic email the user never sees.
  const hex = randomBytes(16).toString('hex');
  const email = `pk_${hex}@pk.fairsay.nz`;

  // Create the Supabase user with email pre-confirmed (no email sent).
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (createError) {
    console.error('[passport-signup] createUser:', createError);
    return NextResponse.json({ error: 'Could not create account' }, { status: 500 });
  }

  // Generate an OTP so the client can establish a session immediately.
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError || !linkData?.properties?.email_otp) {
    console.error('[passport-signup] generateLink:', linkError);
    return NextResponse.json({ error: 'Could not generate sign-in token' }, { status: 500 });
  }

  return NextResponse.json({ email, otp: linkData.properties.email_otp });
}
