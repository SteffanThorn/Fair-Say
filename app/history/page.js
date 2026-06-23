'use client';

import { useState, useCallback } from 'react';
import { HISTORY_EVENTS, ERAS } from '@/lib/historyData';
import EraMarker from '@/components/history/EraMarker';
import TimelineEvent from '@/components/history/TimelineEvent';
import FilterBar from '@/components/history/FilterBar';
import HistoryPanel from '@/components/history/HistoryPanel';

export default function HistoryPage() {
  const [activeFilter, setActiveFilter]   = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = activeFilter === 'all'
    ? HISTORY_EVENTS
    : HISTORY_EVENTS.filter((e) => e.conflictType === activeFilter);

  // For prev/next navigation within the currently filtered list
  const currentIndex = selectedEvent
    ? filteredEvents.findIndex((e) => e.id === selectedEvent.id)
    : -1;

  const handleSelect = useCallback((event) => setSelectedEvent(event), []);
  const handleClose  = useCallback(() => setSelectedEvent(null), []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setSelectedEvent(filteredEvents[currentIndex - 1]);
  }, [currentIndex, filteredEvents]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredEvents.length - 1) setSelectedEvent(filteredEvents[currentIndex + 1]);
  }, [currentIndex, filteredEvents]);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 md:py-12">
      {/* Page header */}
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Aotearoa's Story</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          A timeline of the forces that shaped New Zealand — told from both sides.
          Every event names the real conflict, presents each side's strongest argument,
          and notes what history shows about where each position led.
        </p>
      </header>

      {/* Filter bar */}
      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {/* Timeline */}
      <div className="mt-8 relative">
        {/* Vertical spine */}
        <div
          className="absolute left-[5px] top-0 bottom-0 w-0.5 pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />

        {ERAS.map((era) => {
          const eraEvents = HISTORY_EVENTS.filter((e) => e.era === era.id);
          if (!eraEvents.length) return null;

          const visibleInEra = eraEvents.filter(
            (e) => activeFilter === 'all' || e.conflictType === activeFilter
          );

          return (
            <div key={era.id}>
              <EraMarker era={era} />
              {eraEvents.map((event) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  onSelect={handleSelect}
                  dimmed={activeFilter !== 'all' && event.conflictType !== activeFilter}
                />
              ))}
              {visibleInEra.length === 0 && activeFilter !== 'all' && (
                <p className="pl-8 pb-6 text-xs text-slate-500 italic">
                  No events in this era match the selected filter.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel */}
      <HistoryPanel
        event={selectedEvent}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredEvents.length - 1}
      />
    </main>
  );
}
