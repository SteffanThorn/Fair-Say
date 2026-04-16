'use client';

import { useState } from 'react';

export default function NewsletterSignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Subscription failed');
        return;
      }

      setStatus(data.message || 'Subscribed');
      setEmail('');
      setName('');
    } catch {
      setStatus('Subscription failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-6 rounded-2xl p-6">
      <div className="grid gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          placeholder="Your name (optional)"
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email address"
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
        {status ? <p className="text-sm text-slate-300">{status}</p> : null}
      </div>
    </form>
  );
}
