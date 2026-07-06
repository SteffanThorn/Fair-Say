'use client';

import { useState } from 'react';
import Link from 'next/link';

const MODULES = [
  {
    icon: '🗣️',
    title: 'Debate Fundamentals',
    status: 'Coming Soon',
    statusExtra: null,
    description:
      'Learn to spot logical fallacies, understand burden of proof, and steel-man an opposing argument. These aren\'t debate tricks — they\'re the foundation of honest political conversation.',
    badge: '🗣️ Debate Ready',
    time: '~20 minutes',
    note: null,
  },
  {
    icon: '🏛️',
    title: 'NZ Civics',
    status: 'Coming Soon',
    statusExtra: null,
    description:
      'How Parliament works, how MMP shapes representation, how laws are made, and your rights as an NZ resident. Straightforward. No spin.',
    badge: '🏛️ Civics Certified',
    time: '~25 minutes',
    note: 'Some of this overlaps with our Civics reference page — the test is what earns the badge.',
  },
  {
    icon: '📜',
    title: 'Te Tiriti o Waitangi',
    status: 'Coming Soon',
    statusExtra: 'Built with Māori input',
    description:
      'An honest walkthrough of the Treaty — its text, its history, the arguments on different sides, what the evidence shows, and the real struggles it connects to today. Co-designed with Māori contributors.',
    badge: '📜 Treaty Aware',
    time: '~30 minutes',
    note: null,
  },
];

function ModuleCard({ mod }) {
  return (
    <div className="card rounded-2xl p-5 sm:p-6 flex flex-col opacity-90">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{mod.icon}</span>
          <h3 className="text-base font-semibold text-white leading-snug">{mod.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
            {mod.status}
          </span>
          {mod.statusExtra && (
            <span className="rounded-full bg-emerald-900/40 border border-emerald-700/30 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
              {mod.statusExtra}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">{mod.description}</p>

      {mod.note && (
        <p className="text-xs text-slate-500 italic mb-4">{mod.note}</p>
      )}

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>What you'll earn: <span className="text-slate-300">{mod.badge}</span></span>
          <span>{mod.time}</span>
        </div>

        {/* Progress bar — locked */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">Progress</span>
            <span className="text-xs text-slate-600">0%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5">
            <div className="h-1.5 rounded-full bg-slate-700 w-0" />
          </div>
        </div>

        <button
          type="button"
          disabled
          className="w-full rounded-lg border border-white/8 bg-white/3 px-4 py-2.5 text-xs text-slate-600 cursor-not-allowed"
        >
          Not yet available
        </button>
      </div>
    </div>
  );
}

function ComingSoonCopy({ isAuthenticated }) {
  return (
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
      <p>
        We're building something new: a set of short, free courses designed to help you engage with NZ politics more confidently.
      </p>
      <p className="text-slate-400">
        Not to tell you what to think. To give you better tools for thinking.
      </p>
      <p>
        Each course has a short test at the end. Pass it, and you earn a permanent badge on your Fair Say profile — visible on your poll responses and comments.
      </p>

      <div className="mt-6 space-y-5">
        {[
          {
            icon: '🗣️',
            title: 'Debate Fundamentals',
            desc: 'Logical fallacies. Burden of proof. Steel-manning an argument. The basics of thinking clearly in a political conversation.',
          },
          {
            icon: '🏛️',
            title: 'NZ Civics',
            desc: 'How parliament works, MMP, how laws are made, your rights. The stuff every Kiwi should know but nobody teaches clearly.',
          },
          {
            icon: '📜',
            title: 'Te Tiriti o Waitangi',
            desc: 'Both sides of the argument. Fact vs fiction. Current struggles.',
          },
        ].map((m) => (
          <div key={m.title} className="flex gap-3">
            <span className="text-xl leading-none mt-0.5 shrink-0">{m.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white">{m.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/8 bg-white/3 px-5 py-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🔒</span>
          <p className="text-sm font-semibold text-white">Sneak peek for verified NZ citizens</p>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Verified NZ passport holders get early access to see the module content and track their place in the queue.
        </p>
        {isAuthenticated ? (
          <Link
            href="/account/verify"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Verify your NZ passport to unlock sneak peek →
          </Link>
        ) : (
          <Link
            href="/auth"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Join free to get notified when Learn launches →
          </Link>
        )}
      </div>
    </div>
  );
}

function NotifyButton({ initial }) {
  const [notified, setNotified] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleNotify() {
    if (notified || loading) return;
    setLoading(true);
    try {
      await fetch('/api/account/notify-learn', { method: 'POST' });
      setNotified(true);
    } catch {
      // Optimistic — show confirmation anyway
      setNotified(true);
    } finally {
      setLoading(false);
    }
  }

  if (notified) {
    return (
      <p className="text-sm text-emerald-300 font-medium">
        ✓ You're on the list. We'll email you when Learn launches.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleNotify}
      disabled={loading}
      className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
    >
      {loading ? 'Saving…' : '✓ Notify me when Learn launches'}
    </button>
  );
}

export default function LearnClient({ isAuthenticated, isVerifiedCitizen, initialLearnNotify }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">🎓 Learn & Earn Your Voice</h1>
        <p className="mt-2 text-lg text-slate-300 font-medium">Short courses. Honest tests. Badges that mean something.</p>
      </div>

      {isVerifiedCitizen ? (
        /* ── State B: Verified NZ citizen sneak peek ── */
        <>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5">
            <span className="text-sm">🇳🇿</span>
            <span className="text-xs font-medium text-blue-300">Verified NZ Citizen — Sneak Peek Access</span>
          </div>

          <div className="mb-8 space-y-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
            <p>
              You're one of the first to see this. The Learn section is still in development — but as a verified NZ citizen, here's what's coming and where you'll start.
            </p>
            <p>
              Your badges will appear on your profile and alongside your poll votes and comments, so others can see you've engaged with the material — not just your opinion.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {MODULES.map((mod) => (
              <ModuleCard key={mod.title} mod={mod} />
            ))}
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
            <p className="text-sm font-semibold text-white mb-3">
              Want to be first to know when these go live?
            </p>
            <NotifyButton initial={initialLearnNotify} />
          </div>
        </>
      ) : (
        /* ── State A: Coming soon ── */
        <ComingSoonCopy isAuthenticated={isAuthenticated} />
      )}
    </main>
  );
}
