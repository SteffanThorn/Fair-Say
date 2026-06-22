'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const encoded = searchParams.get('e') || '';
  let email = '';
  try {
    email = encoded ? atob(encoded) : '';
  } catch {
    // malformed base64 — leave email empty
  }

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-2xl mb-3">⚠️</p>
        <p className="text-white font-semibold">Invalid unsubscribe link</p>
        <p className="mt-2 text-sm text-slate-400">This link appears to be broken or expired.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300">
          ← Back to Fair Say NZ
        </Link>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="text-center">
        <p className="text-3xl mb-3">✓</p>
        <p className="text-white font-semibold">You've been unsubscribed</p>
        <p className="mt-2 text-sm text-slate-400">
          <strong className="text-slate-200">{email}</strong> will no longer receive updates from Fair Say NZ.
          You can re-enable updates in your{' '}
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 underline">account settings</Link>.
        </p>
      </div>
    );
  }

  async function handleUnsubscribe() {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Could not unsubscribe. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('done');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="text-center">
      <p className="text-2xl mb-3">✉️</p>
      <h1 className="text-xl font-semibold text-white">Unsubscribe from Fair Say NZ?</h1>
      <p className="mt-2 text-sm text-slate-400">
        This will stop all update emails to <strong className="text-slate-200">{email}</strong>.
      </p>

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        onClick={handleUnsubscribe}
        disabled={status === 'loading'}
        className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
      >
        {status === 'loading' ? 'Unsubscribing…' : 'Yes, unsubscribe'}
      </button>

      <p className="mt-4">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
          Cancel, take me back
        </Link>
      </p>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm rounded-2xl p-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-6 text-center">Fair Say NZ</p>
        <Suspense fallback={<p className="text-sm text-slate-400 text-center">Loading…</p>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </main>
  );
}
