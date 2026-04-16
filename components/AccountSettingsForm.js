'use client';

import { useState } from 'react';

export default function AccountSettingsForm({ initialElectorate = '' }) {
  const [electorate, setElectorate] = useState(initialElectorate);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      const response = await fetch('/api/account/electorate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredElectorate: electorate }),
      });

      if (!response.ok) {
        setNotice('Could not save');
        return;
      }

      setNotice('Saved');
    } catch {
      setNotice('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap items-end gap-3">
      <label className="min-w-50 flex-1">
        <span className="mb-1 block text-sm text-slate-400">Preferred electorate</span>
        <input
          type="text"
          placeholder="e.g. Ilam, Wellington Central, Tāmaki"
          value={electorate}
          onChange={(event) => setElectorate(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
      {notice ? <p className="text-sm text-emerald-300">{notice}</p> : null}
    </form>
  );
}
