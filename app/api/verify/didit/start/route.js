import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/serviceSupabase';
import { createDiditSession } from '@/lib/didit';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { allowed } = await checkRateLimit({ key: `didit-start:${user.id}`, limit: 3, windowSeconds: 3600 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts — please try again later' }, { status: 429 });
    }

    let body = {};
    try { body = await request.json(); } catch { /* no body is fine */ }

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
      const nextOpen = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        .toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Pacific/Auckland' });
      return NextResponse.json({
        error: 'quota_full',
        nextOpenDate: nextOpen,
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.fairsay.co.nz';

    const callbackPath = body.redirectTo || '/account/verify?status=done';
    const { url } = await createDiditSession({
      verificationRequestToken,
      callbackUrl: `${appUrl}${callbackPath}`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('[POST /api/verify/didit/start]', error);
    return NextResponse.json({ error: 'Could not start verification' }, { status: 500 });
  }
}
