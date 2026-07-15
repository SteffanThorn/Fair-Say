'use client';

export default function AllocationRow({ option, value, onChange, expanded, onToggleExpand, readOnly, extra }) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: option.color }} />
        <span className="flex-1 min-w-0 truncate text-sm text-slate-200">{option.label}</span>
        {option.description && (
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-label={`More information about ${option.label}`}
            className="shrink-0 text-slate-400 hover:text-white"
          >
            {expanded ? '▲' : 'ⓘ'}
          </button>
        )}
        {readOnly ? (
          <>
            {extra}
            <span className="w-14 shrink-0 text-right text-sm font-medium text-white tabular-nums">{value}%</span>
          </>
        ) : (
          <>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={value}
              onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              className="w-14 shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-white tabular-nums focus:border-emerald-400/50 focus:outline-none"
            />
            <span className="shrink-0 text-xs text-slate-500">%</span>
          </>
        )}
      </div>
      {!readOnly && (
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ accentColor: option.color }}
          className="w-full px-4 pb-2.5"
        />
      )}
      {readOnly && (
        <div className="mx-4 mb-2.5 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: option.color }} />
        </div>
      )}
      {option.description && expanded && (
        <p className="border-t border-white/8 bg-white/3 px-4 py-2.5 text-xs leading-relaxed text-slate-400">
          {option.description}
        </p>
      )}
    </div>
  );
}
