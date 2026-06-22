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

  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setFormError('Invalid email or password');
    } else {
      router.push('/dashboard');
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
            required
          />
          {(formError || error) && (
            <p className="text-sm text-red-300">{formError || error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

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
