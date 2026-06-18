'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [tab, setTab] = useState('email');

  // Email form state
  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '', preferredElectorate: '' });
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Gitcoin Passport state
  const [passportName, setPassportName] = useState('');
  const [passportError, setPassportError] = useState('');
  const [passportLoading, setPassportLoading] = useState(false);

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setEmailError('');
    setEmailLoading(true);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailForm),
    });

    const data = await response.json();
    setEmailLoading(false);

    if (!response.ok) {
      setEmailError(data.error || 'Could not create your account');
      return;
    }

    router.push('/auth/signin?created=1');
  }

  async function handlePassportSignup() {
    setPassportError('');
    setPassportLoading(true);

    try {
      if (!window.ethereum) {
        setPassportError('No Web3 wallet detected. Install MetaMask or a similar wallet to continue.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Signature 1: Fair Say auth (proves wallet ownership to us)
      const timestamp = Date.now();
      const authMessage = `Fair Say NZ: Verify identity\nAddress: ${address}\nTimestamp: ${timestamp}`;
      const authSignature = await window.ethereum.request({
        method: 'personal_sign',
        params: [authMessage, address],
      });

      // Fetch Gitcoin's own signing message
      const msgRes = await fetch('/api/auth/gitcoin-passport');
      const msgData = await msgRes.json();

      // Signature 2: Gitcoin Passport (submits passport to scorer)
      let gitcoinSignature = null;
      let nonce = msgData.nonce;
      if (msgData.message && msgData.message !== 'dev-bypass') {
        gitcoinSignature = await window.ethereum.request({
          method: 'personal_sign',
          params: [msgData.message, address],
        });
      }

      const response = await fetch('/api/auth/gitcoin-passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          authSignature,
          authMessage,
          gitcoinSignature,
          nonce,
          name: passportName || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPassportError(data.error || 'Could not create your account');
        return;
      }

      router.push('/auth/signin?created=1');
    } catch (err) {
      if (err.code === 4001) {
        setPassportError('Wallet connection was rejected.');
      } else {
        setPassportError(err.message || 'Something went wrong');
      }
    } finally {
      setPassportLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <div className="card w-full rounded-3xl p-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-slate-300">Join thousands of NZers getting better civic info.</p>

        <div className="mt-6 flex rounded-lg border border-white/10 p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === 'email'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✉ Email
          </button>
          <button
            type="button"
            onClick={() => setTab('gitcoin')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === 'gitcoin'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⬡ Gitcoin Passport
          </button>
        </div>

        {tab === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={emailForm.name}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
              required
            />
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
              placeholder="Password (8+ chars)"
              value={emailForm.password}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
              minLength={8}
              required
            />
            <input
              type="text"
              placeholder="Your electorate (optional, e.g. Ilam)"
              value={emailForm.preferredElectorate}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, preferredElectorate: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            />
            {emailError && <p className="text-sm text-red-300">{emailError}</p>}
            <button
              type="submit"
              disabled={emailLoading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {emailLoading ? 'Creating…' : 'Create account'}
            </button>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign up using your Gitcoin Passport. A Passport score of 15+ is required — add stamps at{' '}
              <span className="text-purple-300">passport.gitcoin.co</span>.
            </p>
            <input
              type="text"
              placeholder="Display name (optional)"
              value={passportName}
              onChange={(e) => setPassportName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            />
            {passportError && <p className="text-sm text-red-300">{passportError}</p>}
            <button
              type="button"
              onClick={handlePassportSignup}
              disabled={passportLoading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-500 disabled:opacity-60"
            >
              {passportLoading ? 'Connecting…' : 'Connect Wallet & Verify Passport'}
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-cyan-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
