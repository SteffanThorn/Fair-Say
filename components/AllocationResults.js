'use client';

import { useState } from 'react';
import AllocationRow from '@/components/AllocationRow';
import { topAllocations } from '@/lib/allocation';

const BADGE_LABELS = {
  nz_civics: '🏛️ Civics',
  debate_fundamentals: '🗣️ Debate Ready',
  te_tiriti: '📜 Treaty Aware',
};

export default function AllocationResults({ poll, results, yourAllocations, tierLabel, yourId }) {
  const [resultsView, setResultsView] = useState('collective');
  const [expandedOption, setExpandedOption] = useState(null);
  const toggleExpanded = (label) => setExpandedOption((prev) => (prev === label ? null : label));

  if (results?.suppressed) {
    return <p className="text-xs text-slate-500 italic">Not enough responses in this group to display results.</p>;
  }
  if (!results?.averages) return null;

  return (
    <>
      <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit">
        <button
          type="button"
          onClick={() => setResultsView('collective')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            resultsView === 'collective' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Overview
        </button>
        <button
          type="button"
          onClick={() => setResultsView('individual')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            resultsView === 'individual' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          👤 Responses
        </button>
      </div>

      {resultsView === 'collective' && (
        <div className="mt-3 space-y-2">
          {[...poll.options]
            .sort((a, b) => (results.averages[b.label] ?? 0) - (results.averages[a.label] ?? 0))
            .map((option) => {
              const avg = Math.round((results.averages[option.label] ?? 0) * 10) / 10;
              const mine = yourAllocations?.[option.label] ?? 0;
              return (
                <AllocationRow
                  key={option.label}
                  option={option}
                  value={avg}
                  readOnly
                  extra={<span className="shrink-0 text-xs text-slate-500 tabular-nums">you: {mine}%</span>}
                  expanded={expandedOption === option.label}
                  onToggleExpand={() => toggleExpanded(option.label)}
                />
              );
            })}
        </div>
      )}

      {resultsView === 'individual' && (
        <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
          {(results.rows ?? []).length > 0 ? (
            results.rows.map((row) => (
              <div key={row.id} className="rounded-lg bg-white/3 border border-white/6 px-3 py-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-slate-500">{row.id}</span>
                  {row.id === yourId && <span className="text-emerald-400">✓ You</span>}
                  {row.tier === 'verified_nz_citizen' && (
                    <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">🇳🇿 NZ Citizen</span>
                  )}
                  {(row.badges ?? []).map((b) =>
                    BADGE_LABELS[b] ? (
                      <span key={b} className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-blue-300">
                        {BADGE_LABELS[b]}
                      </span>
                    ) : null
                  )}
                </div>
                <p className="mt-1 text-slate-300">
                  {topAllocations(row.allocations)
                    .map(([label, pct]) => `${label} ${pct}%`)
                    .join(' · ')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No responses yet.</p>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">
        {results.total} response{results.total !== 1 ? 's' : ''}
        {tierLabel ? ` · ${tierLabel}` : ''}
      </p>
    </>
  );
}
