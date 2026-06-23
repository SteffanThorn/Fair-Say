'use client';

import { CONFLICT_COLOURS, CONFLICT_LABELS } from '@/lib/historyData';

const FILTERS = [
  { id: 'all', label: 'All' },
  ...Object.entries(CONFLICT_LABELS).map(([id, label]) => ({ id, label })),
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 overflow-x-auto"
      style={{ background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex gap-2 min-w-max">
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          const colour   = f.id === 'all' ? null : CONFLICT_COLOURS[f.id];
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              aria-pressed={isActive}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-all whitespace-nowrap"
              style={
                isActive
                  ? {
                      backgroundColor: colour ?? '#10b981',
                      color: '#fff',
                      border: `1px solid ${colour ?? '#10b981'}`,
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#94a3b8',
                      border: `1px solid rgba(255,255,255,0.15)`,
                    }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
