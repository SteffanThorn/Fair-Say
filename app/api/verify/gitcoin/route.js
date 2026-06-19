import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/serviceSupabase';

const PASSPORT_THRESHOLD = 15;
const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;
const GITCOIN_BASE = 'https://api.scorer.gitcoin.co';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { address, authSignature, authMessage, gitcoinSignature, nonce } = await request.json();

    if (!address || !authSignature || !authMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify wallet ownership via our own signed message
    const recovered = ethers.verifyMessage(authMessage, authSignature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const match = authMessage.match(/Timestamp: (\d+)/);
    if (!match || Date.now() - parseInt(match[1], 10) > MESSAGE_MAX_AGE_MS) {
      return NextResponse.json({ error: 'Signed message has expired — please try again' }, { status: 401 });
    }

    // Submit passport to scorer and check score.
    // The wallet address is used only for the API call; it is NOT persisted.
    const apiKey = process.env.GITCOIN_API_KEY;
    const scorerId = process.env.GITCOIN_SCORER_ID;
    let score = null;

    if (apiKey && scorerId) {
      const headers = { 'X-API-Key': apiKey, 'Content-Type': 'application/json' };

      if (gitcoinSignature && nonce) {
        await fetch(`${GITCOIN_BASE}/registry/submit-passport`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ address, signature: gitcoinSignature, nonce, scorer_id: scorerId }),
        });
      }

      const scoreRes = await fetch(
        `${GITCOIN_BASE}/registry/score/${scorerId}/${address}`,
        { headers }
      );

      if (scoreRes.ok) {
        const data = await scoreRes.json();
        score = parseFloat(data.score || '0');
      }
    }

    if (score !== null && score < PASSPORT_THRESHOLD) {
      return NextResponse.json({
        error: `Passport score too low (${score.toFixed(1)} / ${PASSPORT_THRESHOLD}). Add more stamps at passport.gitcoin.co.`,
        score,
      }, { status: 403 });
    }

    const admin = createServiceClient();

    // Write verification. Wallet address is intentionally not stored —
    // only the score (numeric) and timestamp are persisted.
    await admin.from('account_verifications').upsert(
      {
        account_id: user.id,
        method: 'gitcoin_passport',
        passport_score: score,
        verified_at: new Date().toISOString(),
      },
      { onConflict: 'account_id,method' }
    );

    await admin
      .from('accounts')
      .update({ is_verified: true, verification_tag: 'human_passport' })
      .eq('account_id', user.id);

    return NextResponse.json({ ok: true, score });
  } catch (error) {
    console.error('[POST /api/verify/gitcoin]', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
