'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmailMagicLinkForm from '@/components/EmailMagicLinkForm';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMagicReturn = searchParams?.get('magic') === '1';
  const linkError = searchParams?.get('error');

  const [finalizing, setFinalizing] = useState(isMagicReturn);
  const [finalizeError, setFinalizeError] = useState('');

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

        // 201 = new account created, 200 = already exists — both are fine
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
            One verified account. One vote per poll. Anonymous once you're in.
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

        <div className="mt-5 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Your email is kept so Fair Say NZ can send you app and relevant topic updates.
            You can unsubscribe at any time. For maximum privacy and a stronger say, consider the{' '}
            <a href="/account/verify" className="text-cyan-400 hover:text-cyan-300 underline">NZ Passport option</a>
            {' '}— your identity is hashed, remains anonymous, and we cannot see it.
          </p>
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
