'use client';

import { useState, useEffect } from 'react';

const BIAS_POS = {
  'left':         { pct: 8,  color: '#3b82f6' },
  'centre-left':  { pct: 30, color: '#93c5fd' },
  'centre':       { pct: 50, color: '#9ca3af' },
  'centre-right': { pct: 70, color: '#fca5a5' },
  'right':        { pct: 92, color: '#ef4444' },
};

const TYPE_COLORS = {
  news:     'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  podcast:  'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  blog:     'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  research: 'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  advocacy: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  social:   'bg-pink-500/15 text-pink-300 border border-pink-500/25',
};

const PLATFORM_ICONS = {
  web:      { icon: '🌐', label: 'Web' },
  youtube:  { icon: '▶️', label: 'YouTube' },
  podcast:  { icon: '🎙️', label: 'Podcast' },
  facebook: { icon: 'f',  label: 'Facebook' },
  x:        { icon: '𝕏', label: 'X' },
};

const VALIDITY_CONFIG = {
  high:    { icon: '🟢', label: 'High validity' },
  medium:  { icon: '🟡', label: 'Medium validity' },
  low:     { icon: '🔴', label: 'Low validity' },
  unrated: { icon: '⚪', label: 'Unrated' },
};

const DISPLAY_LABELS = {
  'centre-left':    'Centre-Left',
  'centre-right':   'Centre-Right',
  'focused-agenda': 'Focused Agenda',
};

function displayLabel(val) {
  return DISPLAY_LABELS[val] || val.charAt(0).toUpperCase() + val.slice(1);
}

function BiasBar({ bias }) {
  if (bias === 'focused-agenda') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 mb-1">
        <span>🎯</span>
        <span className="italic">Focused agenda</span>
      </div>
    );
  }
  const cfg = BIAS_POS[bias];
  if (!cfg) return null;
  return (
    <div className="mt-2 mb-1 relative h-3 flex items-center">
      <div
        className="h-1.5 w-full rounded-full"
        style={{ background: 'linear-gradient(to right, #3b82f6, #9ca3af, #ef4444)' }}
      />
      <div
        className="absolute w-3 h-3 rounded-full border-2"
        style={{
          left: `calc(${cfg.pct}% - 6px)`,
          backgroundColor: 'white',
          borderColor: cfg.color,
        }}
      />
    </div>
  );
}

function FilterGroup({ groupLabel, options, value, onChange }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <span className="text-xs text-slate-500 shrink-0 pt-1 w-16">{groupLabel}</span>
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onChange(null)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            value === null
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-300'
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? null : opt)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              value === opt
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-300'
            }`}
          >
            {displayLabel(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function SourceCard({ source }) {
  const typeColor = TYPE_COLORS[source.type] || TYPE_COLORS.news;
  const validity = VALIDITY_CONFIG[source.validity_rating] || VALIDITY_CONFIG.unrated;

  // Split out AI note from human note
  let humanNote = null;
  let aiNote = null;
  if (source.validity_notes) {
    const aiIdx = source.validity_notes.indexOf('AI note:');
    if (aiIdx !== -1) {
      const before = source.validity_notes.slice(0, aiIdx).trim();
      humanNote = before || null;
      aiNote = source.validity_notes.slice(aiIdx + 'AI note:'.length).trim();
    } else {
      humanNote = source.validity_notes;
    }
  }

  return (
    <div className="card rounded-2xl p-4 flex flex-col gap-2.5">
      {/* Name + type */}
      <div className="flex items-start justify-between gap-2">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white hover:text-emerald-300 transition-colors text-sm leading-snug"
        >
          {source.name}
        </a>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full capitalize font-medium ${typeColor}`}>
          {source.type}
        </span>
      </div>

      {/* Platform badges */}
      <div className="flex gap-1.5 flex-wrap">
        {source.platforms.map((p) => {
          const cfg = PLATFORM_ICONS[p];
          return (
            <span
              key={p}
              className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400"
            >
              {cfg?.icon || p} {cfg?.label || p}
            </span>
          );
        })}
      </div>

      {/* Bias spectrum */}
      <BiasBar bias={source.bias} />

      {/* Validity */}
      <div className="text-xs text-slate-300">
        {validity.icon} {validity.label}
      </div>

      {/* Notes */}
      {(humanNote || aiNote) && (
        <div className="text-xs text-slate-400 space-y-1">
          {humanNote && <p>{humanNote}</p>}
          {aiNote && (
            <p className="text-slate-500 italic">
              <span className="not-italic mr-0.5">🤖</span>
              <span className="text-slate-500 not-italic">AI note:</span>{' '}
              {aiNote}
            </p>
          )}
        </div>
      )}

      {/* Funded by */}
      {source.funded_by && (
        <div className="mt-auto pt-1 border-t border-white/5 text-xs text-slate-500">
          💰 {source.funded_by}
        </div>
      )}
    </div>
  );
}

const TYPE_OPTIONS     = ['news', 'podcast', 'blog', 'research', 'advocacy'];
const BIAS_OPTIONS     = ['left', 'centre-left', 'centre', 'centre-right', 'right', 'focused-agenda'];
const VALIDITY_OPTIONS = ['high', 'medium', 'low'];
const PLATFORM_OPTIONS = ['web', 'youtube', 'podcast', 'facebook', 'x'];

export default function NewsSourcesSection({ sources = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({ type: null, bias: null, validity: null, platform: null });

  // Open by default on desktop
  useEffect(() => {
    if (window.innerWidth >= 768) setExpanded(true);
  }, []);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = sources.filter((s) => {
    if (filters.type     && s.type             !== filters.type)            return false;
    if (filters.bias     && s.bias             !== filters.bias)            return false;
    if (filters.validity && s.validity_rating  !== filters.validity)        return false;
    if (filters.platform && !s.platforms.includes(filters.platform))        return false;
    return true;
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">📡 News Sources</h2>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-lg border border-white/10 hover:border-white/20"
        >
          {expanded ? 'Hide sources' : 'Show sources'}
        </button>
      </div>

      {expanded && (
        <>
          {/* Intro */}
          <div className="mb-4 space-y-1.5">
            <p className="text-sm text-slate-400 leading-relaxed">
              We&apos;ve mapped the NZ political media landscape — mainstream outlets, independent voices,
              podcasts, and opinion — with transparent tags for bias, type, and claim validity.
              Read broadly. Think critically. Always check multiple sources.
            </p>
            <p className="text-xs text-slate-500">
              Where you see 🤖 <em>AI note:</em> — this is an AI-researched assessment of referencing quality.
              All other notes are human editorial judgements.
            </p>
          </div>

          {sources.length === 0 ? (
            <div className="card rounded-2xl p-6 text-center text-sm text-slate-400">
              <p className="text-xl mb-2">🗂️</p>
              <p className="font-medium text-white">Sources not loaded</p>
              <p className="mt-1 text-xs">Run the <code className="text-emerald-400">news_sources</code> migration in your Supabase SQL editor to populate this section.</p>
            </div>
          ) : (
            <>
              {/* Filter bar */}
              <div className="card rounded-2xl p-4 mb-5 space-y-3">
                <FilterGroup
                  groupLabel="Type"
                  options={TYPE_OPTIONS}
                  value={filters.type}
                  onChange={(v) => setFilter('type', v)}
                />
                <FilterGroup
                  groupLabel="Bias"
                  options={BIAS_OPTIONS}
                  value={filters.bias}
                  onChange={(v) => setFilter('bias', v)}
                />
                <FilterGroup
                  groupLabel="Validity"
                  options={VALIDITY_OPTIONS}
                  value={filters.validity}
                  onChange={(v) => setFilter('validity', v)}
                />
                <FilterGroup
                  groupLabel="Platform"
                  options={PLATFORM_OPTIONS}
                  value={filters.platform}
                  onChange={(v) => setFilter('platform', v)}
                />
              </div>

              {/* Cards */}
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No sources match the selected filters.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((s) => (
                    <SourceCard key={s.id} source={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
