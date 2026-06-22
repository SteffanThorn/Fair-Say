'use client';

import { useState } from 'react';
import Link from 'next/link';

const INDICATORS = [
  { value: 'bias',        label: 'Bias rating (Left / Centre / Right)' },
  { value: 'validity',    label: 'Validity rating (High / Medium / Low)' },
  { value: 'source_type', label: 'Source type (News / Blog / Podcast …)' },
  { value: 'other',       label: 'Something else' },
];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    source_name:   '',
    indicator:     '',
    feedback:      '',
    suggestion:    '',
    contact_email: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState('');

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error || 'Something went wrong. Please try again.');
      setStatus('error');
      return;
    }

    setStatus('done');
  }

  if (status === 'done') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card w-full max-w-md rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">✓</p>
          <h1 className="text-xl font-semibold text-white">Thanks for the feedback</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            We review all submissions and use them to improve our source indicators.
            Your input helps keep Fair Say NZ as accurate and fair as possible.
          </p>
          <Link
            href="/news"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            ← Back to Grounded News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Source indicator feedback</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Spotted a bias, validity, or source-type rating you disagree with?
          Tell us — every submission is reviewed and used to improve our indicators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card rounded-2xl p-6 space-y-5">
        {/* Source name */}
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Source name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. RNZ, The Spinoff, Kiwiblog"
            value={form.source_name}
            onChange={(e) => set('source_name', e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Indicator */}
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Which indicator? <span className="text-red-400">*</span>
          </label>
          <select
            value={form.indicator}
            onChange={(e) => set('indicator', e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
          >
            <option value="" disabled>Select one…</option>
            {INDICATORS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            What's wrong, and why? <span className="text-red-400">*</span>
          </label>
          <textarea
            placeholder="Describe the issue. Links to evidence are especially helpful."
            value={form.feedback}
            onChange={(e) => set('feedback', e.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 resize-y"
          />
        </div>

        {/* Suggestion */}
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Suggested correction <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Should be Centre-Left, not Left"
            value={form.suggestion}
            onChange={(e) => set('suggestion', e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Contact email */}
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Your email <span className="text-slate-500 font-normal">(optional — only if you'd like a response)</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.contact_email}
            onChange={(e) => set('contact_email', e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-400">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit feedback'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Submissions are anonymous unless you add your email above.
        </p>
      </form>

      <div className="mt-4 text-center">
        <Link href="/news" className="text-xs text-slate-500 hover:text-slate-300">
          ← Back to Grounded News
        </Link>
      </div>
    </main>
  );
}
