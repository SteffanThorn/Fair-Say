'use client';

import { useState } from 'react';
import Link from 'next/link';
import DiditConsentDisclosure from '@/components/DiditConsentDisclosure';

function VerificationBadge({ verifiedAt }) {
  const date = new Date(verifiedAt).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <span className="text-2xl leading-none mt-0.5">🪪</span>
      <div>
        <p className="text-sm font-semibold text-emerald-300">Verified NZ Citizen — Government ID (Didit)</p>
        <p className="mt-0.5 text-xs text-slate-400">Verified on {date}</p>
      </div>
    </div>
  );
}

function DiditCard({ alreadyVerified }) {
  const [showConsent, setShowConsent] = useState(false);
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
    <>
      {showConsent && (
        <DiditConsentDisclosure
          onAccept={() => {
            setShowConsent(false);
            startDidit();
          }}
          onCancel={() => setShowConsent(false)}
        />
      )}

      <div className="card rounded-2xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl leading-none">🪪</span>
          <div>
            <h2 className="font-semibold text-white">NZ Passport Verification</h2>
            <p className="text-xs text-slate-400">via Didit · Confirms NZ citizenship</p>
          </div>
          {alreadyVerified && (
            <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">Verified</span>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Verify your NZ passport and your identity becomes mathematically invisible, even to us.
          Scan your passport and complete a short liveness check — this confirms NZ citizenship without linking your identity to your votes or account.
        </p>

        <div className="mt-4 rounded-lg bg-white/3 p-4 text-xs text-slate-400 leading-relaxed space-y-2">
          <p className="font-semibold text-slate-300">What we store — and what we don't</p>
          <p>
            Fair Say never receives your passport image, biometric data, or passport number.
            Didit processes the scan and returns only a pass/fail result.
            We store a one-way hash of the session ID — it cannot be reversed, and it has no link to your votes or account activity.
          </p>
          <p>
            <span className="text-slate-300 font-medium">The honest limit:</span> Didit does see your passport document and a live selfie while performing the check — unavoidable, the same way a bouncer has to look at your ID.
            We've built our system so we never receive or store anything that could re-identify you, but Didit's own records are outside Fair Say's control.{' '}
            <a href="https://didit.me/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Read Didit's privacy policy →</a>
          </p>
          <p>
            <span className="text-slate-300 font-medium">Cost:</span> $2 NZD, charged only on successful verification. This covers Didit's fee, passed on at cost.
          </p>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          type="button"
          onClick={() => !alreadyVerified && setShowConsent(true)}
          disabled={loading || alreadyVerified}
          className="mt-5 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {alreadyVerified ? 'Already verified' : loading ? 'Starting…' : 'Verify my NZ passport →'}
        </button>
      </div>
    </>
  );
}

export default function VerifyClient({ verifications, completedParam }) {
  const diditVerification = verifications.find((v) => v.method === 'didit');

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Verified NZ Citizen</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-xl">
          Optional, one-time verification that confirms your NZ citizenship via passport — without linking your identity to your votes or account activity.
          Once verified, your responses appear in the Verified NZ Citizens filter on poll results.
        </p>
      </div>

      {completedParam && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
          <p className="text-sm text-emerald-300 font-medium">Verification submitted — your status will update within a few seconds. Reload the page if it doesn't appear.</p>
        </div>
      )}

      {diditVerification && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">Your verification</h2>
          <VerificationBadge verifiedAt={diditVerification.verified_at} />
        </section>
      )}

      {!diditVerification && (
        <section>
          <DiditCard alreadyVerified={false} />
        </section>
      )}

      <p className="mt-8 text-xs text-slate-500">
        Verification is always optional. Your account works fully without it — you can vote in any poll regardless.{' '}
        <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy policy</Link>
        {' · '}
        <Link href="/dashboard" className="text-cyan-400 hover:underline">Back to dashboard</Link>
      </p>
    </main>
  );
}
