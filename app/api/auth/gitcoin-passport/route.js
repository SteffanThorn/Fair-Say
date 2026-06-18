import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const PASSPORT_THRESHOLD = 15;
const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;

const GITCOIN_BASE = 'https://api.scorer.gitcoin.co';

function gitcoinHeaders() {
  return { 'X-API-Key': process.env.GITCOIN_API_KEY, 'Content-Type': 'application/json' };
}

async function submitAndScore(address, gitcoinSignature, nonce) {
  const apiKey = process.env.GITCOIN_API_KEY;
  const scorerId = process.env.GITCOIN_SCORER_ID;
  if (!apiKey || !scorerId) return null; // bypass in dev

  await fetch(`${GITCOIN_BASE}/registry/submit-passport`, {
    method: 'POST',
    headers: gitcoinHeaders(),
    body: JSON.stringify({ address, signature: gitcoinSignature, nonce, scorer_id: scorerId }),
  });

  const scoreRes = await fetch(
    `${GITCOIN_BASE}/registry/score/${scorerId}/${address}`,
    { headers: gitcoinHeaders() }
  );
  if (!scoreRes.ok) return null;
  const data = await scoreRes.json();
  return parseFloat(data.score || '0');
}

// GET — return the Gitcoin signing message + nonce for the client to sign
export async function GET() {
  const apiKey = process.env.GITCOIN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'dev-bypass', nonce: 'dev' });
  }

  const res = await fetch(`${GITCOIN_BASE}/registry/signing-message`, {
    headers: gitcoinHeaders(),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Could not fetch signing message' }, { status: 502 });
  }
  const data = await res.json();
  // returns { message, nonce }
  return NextResponse.json(data);
}

// POST — verify wallet auth sig, submit passport, check score, create/find user
export async function POST(request) {
  try {
    const { address, authSignature, authMessage, gitcoinSignature, nonce, name, mode } =
      await request.json();

    if (!address || !authSignature || !authMessage) {
      return NextResponse.json({ error: 'Missing address, signature, or message' }, { status: 400 });
    }

    // Verify our own auth signature (proves wallet ownership to Fair Say)
    const recovered = ethers.verifyMessage(authMessage, authSignature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const match = authMessage.match(/Timestamp: (\d+)/);
    if (!match || Date.now() - parseInt(match[1]) > MESSAGE_MAX_AGE_MS) {
      return NextResponse.json({ error: 'Signed message has expired — please try again' }, { status: 401 });
    }

    await dbConnect();

    // Sign-in: just verify wallet ownership, no passport re-check
    if (mode === 'signin') {
      const user = await User.findOne({ walletAddress: address.toLowerCase() });
      if (!user) {
        return NextResponse.json({ error: 'No account found for this wallet' }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    // Sign-up: submit passport to Gitcoin and check score
    const score = await submitAndScore(address, gitcoinSignature, nonce);
    if (score !== null && score < PASSPORT_THRESHOLD) {
      return NextResponse.json({
        error: `Passport score too low (${score.toFixed(1)} / ${PASSPORT_THRESHOLD}). Add more stamps at passport.gitcoin.co.`,
      }, { status: 403 });
    }

    const existing = await User.findOne({ walletAddress: address.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account already exists for this wallet' }, { status: 409 });
    }

    const displayName = (name || '').trim() || `Passport ${address.slice(0, 6)}…${address.slice(-4)}`;
    await User.create({ authMethod: 'gitcoin', walletAddress: address.toLowerCase(), name: displayName });

    return NextResponse.json({ message: 'Account created' }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/auth/gitcoin-passport]', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
