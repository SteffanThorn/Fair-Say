'use client';

import { NZ_CORE_CROWN_EXPENSES } from '@/lib/nzBudget';

export default function CurrentSpendingReference() {
  const { fiscalYear, totalBillions, sourceLabel, sourceUrl, otherIncludes, categories } = NZ_CORE_CROWN_EXPENSES;

  return (
    <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 p-5">
      <h3 className="text-sm font-semibold text-white">Where does tax currently go?</h3>
      <p className="mt-1 text-xs text-slate-400">
        Forecast NZ Government spending, {fiscalYear} — ${totalBillions}b total core Crown expenses.
      </p>

      <div className="mt-4 space-y-2">
        {categories.map((cat) => {
          const pct = (cat.billions / totalBillions) * 100;
          return (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="w-40 sm:w-56 shrink-0 text-xs text-slate-300">{cat.label}</span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div className="h-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
              </div>
              <span className="w-16 shrink-0 text-right text-xs text-slate-400 tabular-nums">
                ${cat.billions}b · {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">{otherIncludes}</p>
      <p className="mt-2 text-xs text-slate-500">
        Source:{' '}
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
          {sourceLabel}
        </a>
      </p>
    </div>
  );
}
