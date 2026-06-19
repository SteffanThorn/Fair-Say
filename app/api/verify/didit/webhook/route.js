import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/lib/serviceSupabase';
import { verifyDiditWebhook } from '@/lib/verifyWebhook';

// Use Node.js runtime so we have full crypto support and raw body access
export const runtime = 'nodejs';

export async function POST(request) {
  // Read raw body BEFORE any parsing — required for signature verification.
  // X-Signature-V2 signs a canonical form of the JSON; X-Signature signs the raw bytes.
  // Parsing first and re-stringifying would break both.
  const rawBody = await request.text();

  let body;
  try {
    body = verifyDiditWebhook(rawBody, request.headers);
  } catch (error) {
    console.error('[webhook/didit] Signature verification failed:', error.message);
    // Return 200 so Didit doesn't retry an intentionally rejected request;
    // use 401 for genuine signature failures that Didit should know about.
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const { session_id, status, vendor_data: token } = body;
    const admin = createServiceClient();

    // Atomically claim and delete the pending row.
    // If the token is missing (replay, abandoned flow), do nothing and return 200.
    const { data: pending } = await admin
      .from('pending_verifications')
      .delete()
      .eq('verification_request_token', token)
      .select('account_id')
      .maybeSingle();

    if (!pending) {
      return NextResponse.json({ ok: true });
    }

    const successful = status === 'Approved';

    // Log for billing — no account_id here by design.
    // This table must not be joinable back to account_verifications.
    await admin.from('verification_billing_log').insert({
      method: 'didit',
      successful,
      billed_to_user: false,
      amount_nzd: 0,
      // TODO: when count >= 500, set billed_to_user: true, amount_nzd: 2.00,
      // and trigger the Stripe charge here (after success only, never before).
    });

    if (successful) {
      // Hash the Didit session ID with our server pepper.
      // This proves a verified session happened without storing the session ID itself.
      const pepper = process.env.SERVER_PEPPER || process.env.IDENTITY_SECRET;
      const verificationHash = createHash('sha256')
        .update(session_id + pepper)
        .digest('hex');

      await admin.from('account_verifications').upsert(
        {
          account_id: pending.account_id,
          method: 'didit',
          verification_hash: verificationHash,
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'account_id,method' }
      );

      await admin
        .from('accounts')
        .update({ is_verified: true, verification_tag: 'didit' })
        .eq('account_id', pending.account_id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[webhook/didit] Processing error:', error);
    // Return 500 so Didit retries (it retries on 5xx)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
