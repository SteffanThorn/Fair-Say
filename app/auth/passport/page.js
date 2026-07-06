'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STEPS = {
  INFO: 'info',
  CREATING: 'creating',
  DIDIT: 'didit',
  PASSKEY: 'passkey',
  DONE: 'done',
};

// Collect device fingerprint once, lazily — mirrors components/EmailMagicLinkForm.js
let fingerprintPromise = null;
function getFingerprint() {
  if (!fingerprintPromise) {
    fingerprintPromise = import('@fingerprintjs/fingerprintjs')
      .then((FingerprintJS) => FingerprintJS.default.load())
      .then((fp) => fp.get())
      .then((result) => result.visitorId)
      .catch(() => 'unknown');
  }
  return fingerprintPromise;
}

export default function PassportSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStep = searchParams?.get('step');

  // Returning from DiDit lands on ?step=passkey
  const [step, setStep] = useState(urlStep === 'passkey' ? STEPS.DIDIT : STEPS.INFO);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);
  const fingerprintRef = useRef(null);

  // Pre-load fingerprint as soon as the page mounts
  useEffect(() => {
    getFingerprint().then((id) => { fingerprintRef.current = id; });
  }, []);

  // After DiDit redirect: wait for webhook to process, then move to passkey step.
  useEffect(() => {
    if (step !== STEPS.DIDIT) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 20; // 40 s max

    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch('/api/account/status');
        if (res.ok) {
          const data = await res.json();
          if (data.is_verified) {
            clearInterval(pollRef.current);
            setStep(STEPS.PASSKEY);
            return;
          }
        }
      } catch {
        // network hiccup — keep polling
      }
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(pollRef.current);
        setError('Verification timed out. Please contact support if this persists.');
      }
    }, 2000);

    return () => clearInterval(pollRef.current);
  }, [step]);

  async function handleBegin() {
    setError('');
    setLoading(true);
    setStep(STEPS.CREATING);

    try {
      const supabase = createClient();

      // 1. Create passport account — returns synthetic email + OTP.
      const signupRes = await fetch('/api/auth/passport-signup', { method: 'POST' });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error || 'Could not create account');

      // 2. Establish Supabase session.
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: signupData.email,
        token: signupData.otp,
        type: 'email',
      });
      if (otpError) throw new Error(otpError.message);

      // 3. Initialise the accounts row (same API email users call).
      const fingerprint = fingerprintRef.current ?? (await getFingerprint());
      const finalizeRes = await fetch('/api/account/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint, newsletter_opt_in: false }),
      });
      if (!finalizeRes.ok) {
        const finalizeData = await finalizeRes.json().catch(() => ({}));
        throw new Error(finalizeData.error || 'Could not finalise account');
      }

      // 4. Start DiDit — redirect back to this page at ?step=passkey.
      const diditRes = await fetch('/api/verify/didit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectTo: '/auth/passport?step=passkey' }),
      });
      const diditData = await diditRes.json();

      if (diditRes.status === 402) {
        throw new Error(`Verification slots are full this month — try again after ${diditData.nextOpenDate}.`);
      }
      if (!diditRes.ok) throw new Error(diditData.error || 'Could not start passport verification');

      // 5. Leave the page — DiDit takes over.
      window.location.href = diditData.url;
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep(STEPS.INFO);
      setLoading(false);
    }
  }

  async function handleRegisterPasskey() {
    setError('');
    setLoading(true);

    try {
      // 1. Get registration options from server.
      const optRes = await fetch('/api/auth/passkey/register-options', { method: 'POST' });
      if (!optRes.ok) {
        const d = await optRes.json();
        throw new Error(d.error || 'Could not get registration options');
      }
      const options = await optRes.json();

      // 2. Prompt the browser (Touch ID / Face ID / Windows Hello).
      const { startRegistration } = await import('@simplewebauthn/browser');
      let attResp;
      try {
        attResp = await startRegistration(options);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          throw new Error('Passkey registration was cancelled. Please try again.');
        }
        throw err;
      }

      // 3. Verify and store with server.
      const verRes = await fetch('/api/auth/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attResp),
      });
      const verData = await verRes.json();
      if (!verRes.ok) throw new Error(verData.error || 'Could not save passkey');

      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message || 'Passkey registration failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
          <h1 className="text-2xl font-bold text-white">NZ Passport account</h1>
          <p className="mt-2 text-sm text-slate-400">
            No email required. Your passport proves you&apos;re an NZ citizen — then your device becomes your key.
          </p>
        </div>

        {/* Step: Info */}
        {step === STEPS.INFO && (
          <div className="space-y-4">
            <div className="card rounded-2xl p-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🛂</span>
                <div>
                  <p className="font-medium text-white">Step 1 — Verify your NZ Passport</p>
                  <p className="mt-1 text-slate-400">DiDit scans your passport chip. Fair Say only receives a confirmation — not your name or passport number.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🔑</span>
                <div>
                  <p className="font-medium text-white">Step 2 — Create a passkey</p>
                  <p className="mt-1 text-slate-400">Your device (Face ID / Touch ID / Windows Hello) becomes your login. No password, no email needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🏅</span>
                <div>
                  <p className="font-medium text-white">Verified NZ Citizen tag</p>
                  <p className="mt-1 text-slate-400">Your votes carry the <code className="text-emerald-400 text-xs">verified_nz_citizen</code> tier — the highest trust level on Fair Say.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200 leading-relaxed">
              ⚠️ <strong>Keep your device safe.</strong> If you lose access to this device and have no backup passkey, account recovery will require re-verification via DiDit.
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleBegin}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading ? 'Starting…' : 'Begin passport verification →'}
            </button>

            <p className="text-center text-xs text-slate-500">
              Prefer email?{' '}
              <a href="/auth" className="text-emerald-400 hover:text-emerald-300">
                Use email instead
              </a>
            </p>
          </div>
        )}

        {/* Step: Creating account (transitional — redirects away) */}
        {step === STEPS.CREATING && (
          <div className="card rounded-2xl p-6 text-center space-y-3">
            <p className="text-3xl animate-pulse">🛂</p>
            <p className="text-white font-medium">Setting up your account…</p>
            <p className="text-sm text-slate-400">You&apos;ll be redirected to DiDit to verify your NZ Passport.</p>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* Step: Waiting for DiDit webhook */}
        {step === STEPS.DIDIT && (
          <div className="card rounded-2xl p-6 text-center space-y-3">
            <p className="text-3xl animate-pulse">⏳</p>
            <p className="text-white font-medium">Confirming verification…</p>
            <p className="text-sm text-slate-400">This takes a few seconds after your passport scan completes.</p>
            {error && (
              <div className="text-sm text-red-400 text-left">
                <p>{error}</p>
                <a href="/auth" className="mt-2 block text-emerald-400 hover:text-emerald-300">
                  Back to sign-in
                </a>
              </div>
            )}
          </div>
        )}

        {/* Step: Register passkey */}
        {step === STEPS.PASSKEY && (
          <div className="space-y-4">
            <div className="card rounded-2xl p-5 text-center space-y-3">
              <p className="text-4xl">✅</p>
              <p className="text-white font-semibold">Passport verified!</p>
              <p className="text-sm text-slate-400">
                Now create a passkey so you can sign in next time without anything else.
                Your device will prompt you with Face ID, Touch ID, or Windows Hello.
              </p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleRegisterPasskey}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading ? 'Setting up passkey…' : '🔑 Create passkey'}
            </button>
          </div>
        )}

        {/* Step: Done */}
        {step === STEPS.DONE && (
          <div className="card rounded-2xl p-6 text-center space-y-4">
            <p className="text-4xl">🎉</p>
            <h2 className="text-lg font-semibold text-white">You&apos;re all set</h2>
            <p className="text-sm text-slate-400">
              Your NZ Passport account is ready. Sign in anytime with your passkey — no email, no password.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Go to dashboard →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
