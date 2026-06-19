import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/serviceSupabase';
import { createDiditSession } from '@/lib/didit';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createServiceClient();

    // Check if already verified via Didit
    const { data: existing } = await admin
      .from('account_verifications')
      .select('id')
      .eq('account_id', user.id)
      .eq('method', 'didit')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already verified via Didit' }, { status: 409 });
    }

    // Check monthly free-tier usage (500 free verifications/month, NZT-based)
    const now = new Date(new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' }));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count } = await admin
      .from('verification_billing_log')
      .select('*', { count: 'exact', head: true })
      .eq('method', 'didit')
      .eq('successful', true)
      .gte('created_at', startOfMonth);

    if ((count || 0) >= 500) {
      // TODO: integrate Stripe $2 NZD charge here before proceeding.
      // Charge fires ONLY after webhook confirms success — do not pre-charge.
      return NextResponse.json({
        error: 'billing_required',
        message: 'The free verification quota for this month is full. A $2 NZD fee applies — this will only be charged if your verification succeeds.',
      }, { status: 402 });
    }

    // Random single-use token — the only reference sent to Didit.
    // Never contains or derives from the account_id or email.
    const verificationRequestToken = randomBytes(32).toString('hex');

    const { error: insertError } = await admin
      .from('pending_verifications')
      .insert({
        verification_request_token: verificationRequestToken,
        account_id: user.id,
        method: 'didit',
      });

    if (insertError) throw insertError;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      || process.env.NEXTAUTH_URL
      || 'https://fair-say.vercel.app';

    const { url } = await createDiditSession({
      verificationRequestToken,
      callbackUrl: `${appUrl}/account/verify?status=done`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('[POST /api/verify/didit/start]', error);
    return NextResponse.json({ error: 'Could not start verification' }, { status: 500 });
  }
}
