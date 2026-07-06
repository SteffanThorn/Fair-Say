'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmailMagicLinkForm from '@/components/EmailMagicLinkForm';
import { createClient } from '@/lib/supabase/client';

const TAB_EMAIL = 'email';
const TAB_PASSPORT = 'passport';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMagicReturn = searchParams?.get('magic') === '1';
  const linkError = searchParams?.get('error');

  const [tab, setTab] = useState(TAB_EMAIL);
  const [finalizing, setFinalizing] = useState(isMagicReturn);
  const [finalizeError, setFinalizeError] = useState('');

  // Passkey sign-in state
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState('');

  useEffect(() => {
    if (!isMagicReturn) return;

    async function finalize() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setFinalizeError('Could not confirm your session. Please try signing in again.');
          setFinalizing(false);
          return;
        }

        const res = await fetch('/api/account/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fingerprint: 'unknown', newsletter_opt_in: false }),
        });

        if (res.ok || res.status === 409) {
          router.push('/dashboard');
        } else {
          const data = await res.json();
          setFinalizeError(data.error || 'Could not set up your account. Please try again.');
          setFinalizing(false);
        }
      } catch {
        setFinalizeError('Something went wrong. Please try again.');
        setFinalizing(false);
      }
    }

    finalize();
  }, [isMagicReturn, router]);

  async function handlePasskeySignIn() {
    setPasskeyError('');
    setPasskeyLoading(true);

    try {
      // 1. Get authentication challenge.
      const optRes = await fetch('/api/auth/passkey/auth-options', { method: 'POST' });
      if (!optRes.ok) {
        const d = await optRes.json();
        throw new Error(d.error || 'Could not start passkey sign-in');
      }
      const options = await optRes.json();

      // 2. Prompt device (Face ID / Touch ID / Windows Hello).
      const { startAuthentication } = await import('@simplewebauthn/browser');
      let assertResp;
      try {
        assertResp = await startAuthentication(options);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          throw new Error('Passkey sign-in was cancelled.');
        }
        throw err;
      }

      // 3. Verify with server — returns synthetic email + OTP.
      const verRes = await fetch('/api/auth/passkey/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertResp),
      });
      const verData = await verRes.json();
      if (!verRes.ok) throw new Error(verData.error || 'Passkey verification failed');

      // 4. Exchange OTP for Supabase session.
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: verData.email,
        token: verData.otp,
        type: 'email',
      });
      if (otpError) throw new Error(otpError.message);

      router.push('/dashboard');
    } catch (err) {
      setPasskeyError(err.message || 'Passkey sign-in failed. Please try again.');
      setPasskeyLoading(false);
    }
  }

  function handleSuccess() {
    router.push('/dashboard');
  }

  if (finalizing) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-4xl">✓</p>
          <h2 className="text-lg font-semibold text-white">Setting up your account…</h2>
          <p className="mt-2 text-sm text-slate-400">Just a moment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            One verified account. One vote per poll. Anonymous once you&apos;re in.
          </p>
        </div>

        {linkError === 'link-expired' && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            That sign-in link has expired or already been used. Please request a new code below.
          </div>
        )}

        {finalizeError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {finalizeError}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 mb-5 gap-1">
          <button
            onClick={() => setTab(TAB_EMAIL)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === TAB_EMAIL
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✉️ Email
          </button>
          <button
            onClick={() => setTab(TAB_PASSPORT)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === TAB_PASSPORT
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛂 NZ Passport
          </button>
        </div>

        {/* Email tab */}
        {tab === TAB_EMAIL && (
          <div className="card rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-lg">✉️</span>
              <div>
                <p className="text-sm font-medium text-white">Email verification</p>
                <p className="text-xs text-slate-400">
                  Tag:{' '}
                  <code className="text-emerald-400 text-xs">email</code>
                </p>
              </div>
            </div>
            <EmailMagicLinkForm onSuccess={handleSuccess} />
          </div>
        )}

        {/* NZ Passport tab */}
        {tab === TAB_PASSPORT && (
          <div className="card rounded-2xl p-5 space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🛂</span>
                <div>
                  <p className="font-medium text-white">No email required</p>
                  <p className="mt-0.5 text-slate-400">
                    Verify your NZ Passport via DiDit, then create a passkey (Face ID / Touch ID).
                    Fair Say only receives a confirmation — not your name or passport number.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🏅</span>
                <div>
                  <p className="font-medium text-white">Verified NZ Citizen tag</p>
                  <p className="mt-0.5 text-slate-400">
                    Carries the highest trust tier on Fair Say.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/auth/passport"
              className="block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-500"
            >
              Begin NZ Passport signup →
            </a>
          </div>
        )}

        {/* Passkey sign-in — for returning passport-account users */}
        <div className="mt-5 rounded-xl border border-white/8 bg-white/3 px-4 py-4">
          <p className="text-xs text-slate-400 mb-3">
            Already have a passport account? Sign in with your passkey.
          </p>
          {passkeyError && (
            <p className="text-xs text-red-400 mb-2">{passkeyError}</p>
          )}
          <button
            onClick={handlePasskeySignIn}
            disabled={passkeyLoading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {passkeyLoading ? (
              <span className="text-slate-400">Waiting for passkey…</span>
            ) : (
              <>
                <span>🔑</span>
                <span>Sign in with passkey</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <a href="/dashboard" className="text-emerald-400 hover:text-emerald-300">
            Go to dashboard →
          </a>
        </p>
      </div>
    </main>
  );
}
