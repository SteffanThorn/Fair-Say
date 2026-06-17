'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || '';
  const created = searchParams?.get('created') === '1';

  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [walletError, setWalletError] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);

  async function handleEmailSignin(event) {
    event.preventDefault();
    setEmailError('');
    setEmailLoading(true);

    const result = await signIn('credentials', {
      email: emailForm.email,
      password: emailForm.password,
      redirect: false,
    });

    setEmailLoading(false);

    if (result?.error) {
      setEmailError('Invalid email or password');
    } else {
      router.push('/dashboard');
    }
  }

  async function handleWalletSignin() {
    setWalletError('');
    setWalletLoading(true);

    try {
      if (!window.ethereum) {
        setWalletError('No Web3 wallet detected. Install MetaMask or a similar wallet to continue.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      const timestamp = Date.now();
      const message = `Fair Say NZ: Verify identity\nAddress: ${address}\nTimestamp: ${timestamp}`;

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      const result = await signIn('wallet', {
        walletAddress: address,
        signature,
        message,
        redirect: false,
      });

      if (result?.error) {
        setWalletError(result.error === 'CredentialsSignin' ? 'No account found for this wallet' : result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      if (err.code === 4001) {
        setWalletError('Wallet connection was rejected.');
      } else {
        setWalletError(err.message || 'Something went wrong');
      }
    } finally {
      setWalletLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <div className="card w-full rounded-3xl p-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-300">Access your civic account.</p>
        {created && (
          <p className="mt-3 text-sm text-emerald-300">Account created. Please sign in.</p>
        )}

        <form onSubmit={handleEmailSignin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={emailForm.email}
            onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={emailForm.password}
            onChange={(e) => setEmailForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            required
          />
          {(emailError || error) && (
            <p className="text-sm text-red-300">{emailError || error}</p>
          )}
          <button
            type="submit"
            disabled={emailLoading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {emailLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-white/10" />
          <span className="text-xs text-slate-500">or</span>
          <hr className="flex-1 border-white/10" />
        </div>

        {walletError && <p className="mb-3 text-sm text-red-300">{walletError}</p>}
        <button
          type="button"
          onClick={handleWalletSignin}
          disabled={walletLoading}
          className="w-full rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 font-medium text-purple-300 hover:bg-purple-500/20 disabled:opacity-60"
        >
          {walletLoading ? 'Connecting…' : '⬡ Sign in with Gitcoin Passport'}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          Need an account?{' '}
          <Link href="/auth/signup" className="text-cyan-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
