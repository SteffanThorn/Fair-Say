'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const COOKIE_NAME = 'fairsay_tutorial_seen';
const COOKIE_DAYS = 365;

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

const STEPS = [
  {
    icon: '🇳🇿',
    title: 'Welcome to Fair Say NZ',
    body: 'A 100% neutral civic platform — no party endorsements, no spin. Everything here is sourced, factual, and built to help you engage with NZ politics confidently.',
    highlight: null,
    cta: null,
  },
  {
    icon: '📰',
    title: 'Grounded News',
    body: 'Every article shows the outlet\'s bias rating (Left / Centre / Right), validity score, funding model, and paywall status — so you can judge the source, not just the headline.',
    highlight: '[data-tutorial="news"]',
    cta: { label: 'Browse news →', href: '/news' },
  },
  {
    icon: '🏛️',
    title: 'Parties & Policies',
    body: 'Read neutral summaries of every NZ party — including outside parliament — and compare their policies side-by-side on Housing, Climate, Health, Economy, Treaty, Immigration, and Education.',
    highlight: '[data-tutorial="policies"]',
    cta: { label: 'Compare policies →', href: '/policies' },
  },
  {
    icon: '🧑‍💼',
    title: 'Find Your MP',
    body: 'Search all active MPs by name, party, or electorate. Each profile includes their bio, role, and direct contact details — so reaching your representative takes seconds.',
    highlight: '[data-tutorial="mps"]',
    cta: { label: 'Search MPs →', href: '/mps' },
  },
  {
    icon: '📚',
    title: 'Learn How NZ Works',
    body: 'Not sure how MMP works or how a bill becomes law? The Civics section has interactive diagrams covering parliament, the three branches of government, and Treaty history.',
    highlight: '[data-tutorial="civics"]',
    cta: { label: 'Explore civics →', href: '/civics' },
  },
  {
    icon: '🗳️',
    title: 'Have Your Say — Polls',
    body: 'Vote on community polls anonymously. Create a free account for a basic vote, or verify your NZ passport for a "strong say" counted in the Verified Citizens view. No individual tracking — ever.',
    highlight: '[data-tutorial="polls"]',
    cta: { label: 'See open polls →', href: '/polls' },
  },
  {
    icon: '🛠️',
    title: 'Still growing — your ideas help',
    body: 'Fair Say NZ is a work in progress. New features, corrections, and content are added regularly. If you spot something wrong or have an idea, the Suggest button is always there — we read every one.',
    highlight: '[data-tutorial="suggest"]',
    cta: null,
  },
];

const PADDING = 8;

export default function TutorialModal({ isMember }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState(null);

  const measureHighlight = useCallback((selector) => {
    if (!selector) { setHighlightRect(null); return; }
    const el = document.querySelector(selector);
    if (!el) { setHighlightRect(null); return; }
    const r = el.getBoundingClientRect();
    setHighlightRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!isMember && !getCookie(COOKIE_NAME)) {
        setOpen(true);
      }
    }, 0);
    function handleReopen() {
      setStep(0);
      setOpen(true);
    }
    window.addEventListener('fairsay:open-tutorial', handleReopen);
    return () => {
      clearTimeout(id);
      window.removeEventListener('fairsay:open-tutorial', handleReopen);
    };
  }, [isMember]);

  // Measure spotlight target whenever step changes or modal opens
  useEffect(() => {
    const id = setTimeout(() => {
      if (!open) { setHighlightRect(null); } else { measureHighlight(STEPS[step].highlight); }
    }, 0);
    return () => clearTimeout(id);
  }, [open, step, measureHighlight]);

  // Re-measure on resize so the ring tracks the element
  useEffect(() => {
    if (!open) return;
    function onResize() { measureHighlight(STEPS[step].highlight); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, step, measureHighlight]);

  function dismiss() {
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
    setOpen(false);
    setHighlightRect(null);
  }

  function prev() {
    setStep((s) => Math.max(0, s - 1));
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }

  if (!open) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Dark backdrop — transparent so spotlight box-shadow handles the dimming */}
      <div
        className="fixed inset-0 z-50"
        onClick={dismiss}
      />

      {/* Spotlight ring: transparent div positioned over the target element.
          The enormous box-shadow spread creates the dark overlay everywhere else. */}
      {highlightRect && (
        <div
          className="pointer-events-none fixed z-[51]"
          style={{
            top: highlightRect.top - PADDING,
            left: highlightRect.left - PADDING,
            width: highlightRect.width + PADDING * 2,
            height: highlightRect.height + PADDING * 2,
            borderRadius: 10,
            animation: 'tutorial-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Fallback overlay when no spotlight (welcome step) */}
      {!highlightRect && (
        <div
          className="fixed inset-0 pointer-events-none z-[51]"
          style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(3px)' }}
        />
      )}

      {/* Modal card — sits above everything */}
      <div
        className="fixed z-[52] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-2xl shadow-2xl flex flex-col"
          style={{ background: '#0d1627', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Quick tour — {step + 1} of {STEPS.length}
            </span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Skip tutorial"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white text-xs"
            >
              Skip
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 flex flex-col gap-4 flex-1">
            <div className="text-5xl text-center pt-2 pb-1">{current.icon}</div>
            <h2 className="text-lg font-semibold text-white text-center">{current.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed text-center">{current.body}</p>

            {current.cta && (
              <Link
                href={current.cta.href}
                onClick={dismiss}
                className="mx-auto mt-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-600/30 hover:text-emerald-200 transition-colors"
              >
                {current.cta.label}
              </Link>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pb-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-emerald-500' : 'w-1.5 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-4 rounded-b-2xl"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              {isLast ? 'Get started' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
