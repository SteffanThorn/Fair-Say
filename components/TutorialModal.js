'use client';

import { useState, useEffect } from 'react';
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
    cta: null,
  },
  {
    icon: '📰',
    title: 'Grounded News',
    body: 'Every article shows the outlet\'s bias rating (Left / Centre / Right), validity score, funding model, and paywall status — so you can judge the source, not just the headline.',
    cta: { label: 'Browse news →', href: '/news' },
  },
  {
    icon: '🏛️',
    title: 'Parties & Policies',
    body: 'Read neutral summaries of every NZ party — including outside parliament — and compare their policies side-by-side on Housing, Climate, Health, Economy, Treaty, Immigration, and Education.',
    cta: { label: 'Compare policies →', href: '/policies' },
  },
  {
    icon: '🧑‍💼',
    title: 'Find Your MP',
    body: 'Search all active MPs by name, party, or electorate. Each profile includes their bio, role, and direct contact details — so reaching your representative takes seconds.',
    cta: { label: 'Search MPs →', href: '/mps' },
  },
  {
    icon: '📚',
    title: 'Learn How NZ Works',
    body: 'Not sure how MMP works or how a bill becomes law? The Civics section has interactive diagrams covering parliament, the three branches of government, and Treaty history.',
    cta: { label: 'Explore civics →', href: '/civics' },
  },
  {
    icon: '🗳️',
    title: 'Have Your Say — Polls',
    body: 'Vote on community polls anonymously. Create a free account for a basic vote, or verify your NZ passport for a "strong say" counted in the Verified Citizens view. No individual tracking — ever.',
    cta: { label: 'See open polls →', href: '/polls' },
  },
  {
    icon: '✅',
    title: 'You\'re all set',
    body: 'Start anywhere — or head to your dashboard for a quick overview of everything. You can revisit this guide any time from the Tutorial link in the menu.',
    cta: { label: 'Go to dashboard →', href: '/dashboard' },
  },
];

export default function TutorialModal({ isMember }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

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

  function dismiss() {
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
    setOpen(false);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col"
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
  );
}
