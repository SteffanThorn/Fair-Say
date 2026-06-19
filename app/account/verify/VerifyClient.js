'use client';

import { useState } from 'react';
import Link from 'next/link';

const MESSAGE_MAX_AGE_MS = 5 * 60 * 1000;

function VerificationBadge({ method, verifiedAt, score }) {
  const label = method === 'didit' ? 'Government ID (Didit)' : 'Gitcoin Passport';
  const icon = method === 'didit' ? '🪪' : '⬡';
  const date = new Date(verifiedAt).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <span className="text-2xl leading-none mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-emerald-300">Verified — {label}</p>
        <p className="mt-0.5 text-xs text-slate-400">Verified on {date}{score != null ? ` · Passport score ${score.toFixed(1)}` : ''}</p>
      </div>
    </div>
  );
}

function PrivacySection({ method }) {
  if (method === 'didit') {
    return (
      <div className="mt-4 rounded-lg bg-white/3 p-4 text-xs text-slate-400 leading-relaxed space-y-2">
        <p className="font-semibold text-slate-300">What we know — and what we don't</p>
        <p>
          Verifying with a government ID doesn't connect your real identity to your Fair Say account in our database.
          What we keep is a one-way cryptographic fingerprint that only proves "a real, verified person exists" —
          it cannot be reversed to find out who you are, and it isn't linked to your votes or comments.
        </p>
        <p>
          <span className="text-slate-300 font-medium">What Fair Say stores:</span> a one-way hash. Nothing else — no document, no selfie, no name, no date of birth, no link between your identity and your account.
        </p>
        <p>
          <span className="text-slate-300 font-medium">The honest limit:</span> our verification partner, Didit, does see your ID document and a live selfie while performing the check — that's unavoidable, the same way a bouncer has to look at your ID to check it.
          We've built our system so we never receive or store anything that could re-identify you, but Didit's own records of the check are outside Fair Say's control.{' '}
          <a href="https://didit.me/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Read Didit's privacy policy</a> if you want to know how long they retain that data.
        </p>
        <p className="italic text-slate-500">
          Prefer not to share a document with any third party? Gitcoin Passport verifies you a different way — using your existing online reputation instead.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg bg-white/3 p-4 text-xs text-slate-400 leading-relaxed space-y-2">
      <p className="font-semibold text-slate-300">What we know — and what we don't</p>
      <p>
        This method avoids a document scan entirely. Verification is based on your existing online reputation — the stamps and credentials you've already linked to your Gitcoin Passport — not a government ID or selfie.
      </p>
      <p>
        <span className="text-slate-300 font-medium">What Fair Say stores:</span> a pass/fail result and your score (a number). No name, no address, no wallet address — the wallet is used only during the check and then discarded.
      </p>
      <p>
        <span className="text-slate-300 font-medium">What Gitcoin Passport sees:</span> whichever connected accounts or stamps you've linked to your Passport (e.g. GitHub, Twitter/X, ENS). This is information you've already made part of your public Passport profile — Fair Say doesn't extract anything new.
      </p>
      <p className="italic text-slate-500">
        This is a genuinely different privacy shape from the government ID option. With Gitcoin Passport, no third party sees a document; the tradeoff is that your verification is based on pseudonymous Web3 reputation rather than a legal identity check.
      </p>
    </div>
  );
}

function DiditCard({ alreadyVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startDidit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify/didit/start', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setError(data.message || 'A verification fee applies. Please try again later.');
        } else {
          setError(data.error || 'Could not start verification');
        }
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl leading-none">🪪</span>
        <div>
          <h2 className="font-semibold text-white">Government ID</h2>
          <p className="text-xs text-slate-400">via Didit</p>
        </div>
        {alreadyVerified && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">Verified</span>
        )}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        Verify using a New Zealand passport or driver's licence plus a live selfie. Strongest form of verification — accepted documents: NZ passport, NZ driver's licence.
      </p>
      <PrivacySection method="didit" />
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={startDidit}
        disabled={loading || alreadyVerified}
        className="mt-5 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {alreadyVerified ? 'Already verified' : loading ? 'Starting…' : 'Verify with ID document'}
      </button>
    </div>
  );
}

function GitcoinCard({ alreadyVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startGitcoin() {
    setError('');
    setLoading(true);
    try {
      if (!window.ethereum) {
        setError('No Web3 wallet detected. Install MetaMask or a similar wallet to continue.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Signature 1: proves wallet ownership to Fair Say
      const timestamp = Date.now();
      const authMessage = `Fair Say NZ: Verify identity\nAddress: ${address}\nTimestamp: ${timestamp}`;
      const authSignature = await window.ethereum.request({
        method: 'personal_sign',
        params: [authMessage, address],
      });

      // Fetch Gitcoin's own signing message
      const msgRes = await fetch('/api/auth/gitcoin-passport');
      const msgData = await msgRes.json();

      // Signature 2: submits passport to the Gitcoin scorer
      let gitcoinSignature = null;
      let nonce = msgData.nonce;
      if (msgData.message && msgData.message !== 'dev-bypass') {
        gitcoinSignature = await window.ethereum.request({
          method: 'personal_sign',
          params: [msgData.message, address],
        });
      }

      const res = await fetch('/api/verify/gitcoin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, authSignature, authMessage, gitcoinSignature, nonce }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      // Reload to show updated verification status
      window.location.reload();
    } catch (err) {
      if (err.code === 4001) {
        setError('Wallet connection was rejected.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl leading-none">⬡</span>
        <div>
          <h2 className="font-semibold text-white">Gitcoin Passport</h2>
          <p className="text-xs text-slate-400">Score of 15+ required</p>
        </div>
        {alreadyVerified && (
          <span className="ml-auto rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-300">Verified</span>
        )}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        Verify using your existing Web3 reputation. No document scan — your Gitcoin Passport stamps prove you're a real person based on accounts you've already connected.
      </p>
      <PrivacySection method="gitcoin" />
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={startGitcoin}
        disabled={loading || alreadyVerified}
        className="mt-5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-medium text-purple-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {alreadyVerified ? 'Already verified' : loading ? 'Connecting…' : '⬡ Connect wallet & verify'}
      </button>
    </div>
  );
}

export default function VerifyClient({ verifications, completedParam }) {
  const diditVerification = verifications.find((v) => v.method === 'didit');
  const gitcoinVerification = verifications.find((v) => v.method === 'gitcoin_passport');
  const isFullyVerified = diditVerification || gitcoinVerification;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Verified Human</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-xl">
          Optional, one-time verification that proves you're a real person — without linking your identity to your votes or account activity. Choose either method below; they're equally valid.
        </p>
      </div>

      {completedParam && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
          <p className="text-sm text-emerald-300 font-medium">Verification submitted — your status will update within a few seconds. Reload the page if it doesn't appear.</p>
        </div>
      )}

      {isFullyVerified && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">Your verification</h2>
          <div className="space-y-3">
            {diditVerification && (
              <VerificationBadge method="didit" verifiedAt={diditVerification.verified_at} />
            )}
            {gitcoinVerification && (
              <VerificationBadge method="gitcoin_passport" verifiedAt={gitcoinVerification.verified_at} score={gitcoinVerification.passport_score} />
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {isFullyVerified ? 'Verify with another method' : 'Choose a verification method'}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <DiditCard alreadyVerified={!!diditVerification} />
          <GitcoinCard alreadyVerified={!!gitcoinVerification} />
        </div>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Verification is always optional. Your account works fully without it.{' '}
        <Link href="/dashboard" className="text-cyan-400 hover:underline">Back to dashboard</Link>
      </p>
    </main>
  );
}
