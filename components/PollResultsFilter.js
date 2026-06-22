'use client';

import { useState } from 'react';

const FILTERS = [
  {
    id: 'all',
    label: 'All responses',
    tooltip: 'Everyone who voted — any Fair Say account, regardless of verification. No geographic or nationality check applies to this group. Useful for seeing the broadest possible range of views.',
  },
  {
    id: 'email',
    label: 'Email accounts',
    tooltip: 'Accounts created with an email address. This confirms a real email inbox — nothing more. No check on nationality, residency, or location.',
  },
  {
    id: 'verified_nz_citizen',
    label: 'Verified NZ Citizens',
    tooltip: 'Accounts where the holder verified a New Zealand passport via Didit. A NZ passport is issued only to NZ citizens — this is the strongest available signal that a response came from a New Zealand citizen. Verification is a one-time gateway. It is not linked to individual votes.',
  },
];

function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="ml-1 text-slate-500 hover:text-slate-300 transition-colors text-xs leading-none"
      >
        ⓘ
      </button>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-60 rounded-lg border border-white/10 bg-[#0d1a2d] px-3 py-2.5 text-xs text-slate-300 leading-relaxed shadow-xl pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0d1a2d]" />
        </span>
      )}
    </span>
  );
}

export default function PollResultsFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-slate-500 mr-1">Filter:</span>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selected === f.id
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 border border-white/8 hover:border-white/20 hover:text-white'
          }`}
        >
          {f.label}
          <Tooltip text={f.tooltip} />
        </button>
      ))}
    </div>
  );
}
