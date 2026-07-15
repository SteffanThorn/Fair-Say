'use client';

import { useState, useMemo } from 'react';
import AllocationRow from '@/components/AllocationRow';
import { zeroedAllocations, splitEvenly } from '@/lib/allocation';

export default function AllocationEditor({ options, draft, setDraft, onSubmit, submitting, submitLabel, error }) {
  const [expandedOption, setExpandedOption] = useState(null);
  const toggleExpanded = (label) => setExpandedOption((prev) => (prev === label ? null : label));

  const total = useMemo(() => Object.values(draft).reduce((sum, v) => sum + v, 0), [draft]);
  const remaining = 100 - total;

  return (
    <>
      <div
        className={`mb-3 flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium ${
          total === 100 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-slate-300'
        }`}
      >
        <span>Total: {total}%</span>
        <span className="text-xs">
          {total === 100 ? "You're all set" : remaining > 0 ? `${remaining}% left to allocate` : `${-remaining}% over`}
        </span>
      </div>

      <div className="space-y-2">
        {options.map((option) => (
          <AllocationRow
            key={option.label}
            option={option}
            value={draft[option.label]}
            onChange={(v) => setDraft((prev) => ({ ...prev, [option.label]: v }))}
            expanded={expandedOption === option.label}
            onToggleExpand={() => toggleExpanded(option.label)}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setDraft(splitEvenly(options))}
          className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
        >
          Split evenly
        </button>
        <button
          type="button"
          onClick={() => setDraft(zeroedAllocations(options))}
          className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={total !== 100 || submitting}
          className="ml-auto rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </>
  );
}
