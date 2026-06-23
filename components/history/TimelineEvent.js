'use client';

import { CONFLICT_COLOURS } from '@/lib/historyData';
import ConflictBadge from './ConflictBadge';

export default function TimelineEvent({ event, onSelect, dimmed }) {
  const colour = CONFLICT_COLOURS[event.conflictType];

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(event);
    }
  }

  return (
    <div
      className="relative flex gap-5 pl-8 cursor-pointer group"
      style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 0.25s ease' }}
      role="button"
      tabIndex={0}
      aria-label={`${event.yearDisplay}: ${event.title}`}
      onClick={() => onSelect(event)}
      onKeyDown={handleKey}
    >
      {/* Node on the spine */}
      <div
        className="absolute left-0 top-1 w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-[#080f1e] transition-transform group-hover:scale-125"
        style={{ backgroundColor: colour, ringColor: colour }}
      />

      {/* Card */}
      <div className="card rounded-xl p-4 w-full mb-4 transition-colors group-hover:border-white/20 group-hover:bg-white/5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-0.5">{event.yearDisplay}</p>
            <p className="font-semibold text-white leading-snug">{event.title}</p>
            <p className="mt-1 text-sm italic text-slate-400">{event.hook}</p>
          </div>
          <ConflictBadge conflictType={event.conflictType} />
        </div>
      </div>
    </div>
  );
}
