'use client';

import { useState } from 'react';

/**
 * Newsletter opt-in toggle for email-tier users on the dashboard.
 * @param {{ initialOptIn: boolean }} props
 */
export default function NewsletterToggle({ initialOptIn }) {
  const [optIn, setOptIn] = useState(initialOptIn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleToggle(e) {
    const next = e.target.checked;
    setOptIn(next); // optimistic
    setSaving(true);
    setError('');

    const res = await fetch('/api/account/newsletter', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opt_in: next }),
    });

    setSaving(false);

    if (!res.ok) {
      setOptIn(!next); // revert
      setError('Could not save preference. Please try again.');
    }
  }

  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={optIn}
          onChange={handleToggle}
          disabled={saving}
          className="mt-0.5 shrink-0 accent-emerald-500 disabled:opacity-50"
        />
        <span className="text-sm text-slate-300 leading-relaxed">
          Receive app and topic updates from Fair Say NZ
          {saving && <span className="ml-2 text-xs text-slate-500">Saving…</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
