import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const PASSPORT_THRESHOLD = 15;
const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;

async function checkPassportScore(address) {
  const apiKey = process.env.GITCOIN_API_KEY;
  const scorerId = process.env.GITCOIN_SCORER_ID;
  if (!apiKey || !scorerId) return null; // bypass in dev when not configured

  const res = await fetch(
    `https://api.scorer.gitcoin.co/registry/score/${scorerId}/${address}`,
    { headers: { 'X-API-Key': apiKey } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return parseFloat(data.score || '0');
}

export async function POST(request) {
  try {
    const { address, signature, message, name, mode } = await request.json();

    if (!address || !signature || !message) {
      return NextResponse.json({ error: 'Missing address, signature, or message' }, { status: 400 });
    }

    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const match = message.match(/Timestamp: (\d+)/);
    if (!match || Date.now() - parseInt(match[1]) > MESSAGE_MAX_AGE_MS) {
      return NextResponse.json({ error: 'Signed message has expired — please try again' }, { status: 401 });
    }

    const score = await checkPassportScore(address);
    if (score !== null && score < PASSPORT_THRESHOLD) {
      return NextResponse.json({
        error: `Passport score too low (${score.toFixed(1)} / ${PASSPORT_THRESHOLD}). Add more stamps at passport.gitcoin.co.`,
      }, { status: 403 });
    }

    await dbConnect();

    if (mode === 'signin') {
      const user = await User.findOne({ walletAddress: address.toLowerCase() });
      if (!user) {
        return NextResponse.json({ error: 'No account found for this wallet' }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    const existing = await User.findOne({ walletAddress: address.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account already exists for this wallet' }, { status: 409 });
    }

    const displayName = (name || '').trim() || `Passport ${address.slice(0, 6)}…${address.slice(-4)}`;

    await User.create({
      authMethod: 'gitcoin',
      walletAddress: address.toLowerCase(),
      name: displayName,
    });

    return NextResponse.json({ message: 'Account created' }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/auth/gitcoin-passport]', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
