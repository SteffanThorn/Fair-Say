'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiditUpgradeNudge({ onDismiss }) {
  const [dismissing, setDismissing] = useState(false);

  async function handleDismiss() {
    setDismissing(true);
    try {
      await fetch('/api/account/dismiss-nudge', { method: 'POST' });
    } catch {
      // Non-fatal — dismiss optimistically regardless.
    }
    onDismiss();
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/3 px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          🇳🇿 Want your vote counted in the Kiwis-only view?
        </p>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Verify your NZ passport to have your responses included in the Verified NZ Citizens filter — so your voice counts as distinctly Kiwi.
          Verification is optional, one-time, and $2 NZD at cost. Your anonymity is unchanged either way.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/account/verify"
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500 whitespace-nowrap"
        >
          Verify my NZ passport →
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={dismissing}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-50 whitespace-nowrap"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
