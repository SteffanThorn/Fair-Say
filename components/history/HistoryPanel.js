'use client';

import { useEffect, useRef } from 'react';
import { CONFLICT_COLOURS } from '@/lib/historyData';
import ConflictBadge from './ConflictBadge';

function SideColumn({ side, colour }) {
  return (
    <div className="flex-1 min-w-0 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${colour}` }}>
      <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: colour }}>{side.label}</p>
      <p className="text-sm text-slate-300 leading-relaxed mb-3">{side.argument}</p>

      {side.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-400 mb-1">What this position got right</p>
          <ul className="space-y-1">
            {side.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {side.failures.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">Where it fell short</p>
          <ul className="space-y-1">
            {side.failures.map((f, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-300">
                <span className="text-amber-400 mt-0.5 shrink-0">✗</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function HistoryPanel({ event, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const panelRef  = useRef(null);
  const closeRef  = useRef(null);
  const colour    = event ? CONFLICT_COLOURS[event.conflictType] : '#10b981';

  // ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus close button when panel opens
  useEffect(() => {
    if (event) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [event]);

  // Focus trap
  useEffect(() => {
    if (!event || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    function trap(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [event]);

  // Prevent body scroll while open
  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [event]);

  const open = !!event;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={event?.title ?? 'History event'}
        className="fixed z-40 bg-[#0d1626] overflow-y-auto flex flex-col"
        style={{
          // Desktop: right panel
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(480px, 100vw)',
          borderLeft: '1px solid rgba(255,255,255,0.09)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {event && (
          <>
            {/* Accent bar */}
            <div className="h-1 w-full shrink-0" style={{ backgroundColor: colour }} />

            {/* Header */}
            <div className="p-5 pb-4 border-b border-white/8 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{event.yearDisplay}</p>
                  <h2 className="text-lg font-bold text-white leading-snug">{event.title}</h2>
                  <div className="mt-2">
                    <ConflictBadge conflictType={event.conflictType} size="lg" />
                  </div>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close panel"
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Conflict axis */}
              <div className="mt-3 pt-3 border-t border-white/8">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Conflict axis</p>
                <p className="text-sm font-semibold" style={{ color: colour }}>{event.conflictAxisLabel}</p>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* What happened */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">What happened</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{event.whatHappened}</p>
              </section>

              {/* Two sides */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">The two sides</h3>
                <div className="flex flex-col gap-3">
                  <SideColumn side={event.sideA} colour={colour} />
                  <SideColumn side={event.sideB} colour={colour} />
                </div>
              </section>

              {/* Legacy */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Why it still matters</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{event.legacyToday}</p>
              </section>

              {/* Sources */}
              {event.sources?.length > 0 && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">Sources & further reading</h3>
                  <ul className="space-y-1.5">
                    {event.sources.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          {s.label} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Navigation footer */}
            <div className="shrink-0 border-t border-white/8 px-5 py-4 flex items-center justify-between">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
