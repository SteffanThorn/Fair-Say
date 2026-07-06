'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { POLLS } from '@/lib/polls';
import PollResultsFilter from '@/components/PollResultsFilter';
import DiditUpgradeNudge from '@/components/DiditUpgradeNudge';

const BADGE_LABELS = {
  nz_civics: '🏛️ Civics',
  debate_fundamentals: '🗣️ Debate Ready',
  te_tiriti: '📜 Treaty Aware',
};

const TYPE_BADGE = {
  'election-vote': { label: 'Election Poll', cls: 'bg-blue-500/15 text-blue-300' },
  general: { label: 'Community Poll', cls: 'bg-emerald-500/15 text-emerald-300' },
  ranked: { label: 'Ranking Poll', cls: 'bg-purple-500/15 text-purple-300' },
};

function VoteRow({ row, yourId }) {
  const isYou = row.id === yourId;
  return (
    <div
      className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg text-xs ${
        isYou
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-white/3 border border-white/6'
      }`}
    >
      <span className="font-mono text-slate-500 shrink-0">{row.id}</span>
      <span className={`flex-1 min-w-0 truncate ${isYou ? 'text-white font-medium' : 'text-slate-300'}`}>
        {isYou && <span className="mr-1 text-emerald-400">✓</span>}
        {row.choice}
      </span>
      <span className="flex flex-wrap gap-1 shrink-0">
        {row.tier === 'verified_nz_citizen' && (
          <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">🇳🇿 NZ Citizen</span>
        )}
        {(row.badges ?? []).map((b) =>
          BADGE_LABELS[b] ? (
            <span key={b} className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-blue-300">
              {BADGE_LABELS[b]}
            </span>
          ) : null
        )}
      </span>
    </div>
  );
}

function PollCard({ poll, credentialTier: filterTier }) {
  const [voted, setVoted] = useState(null);
  const [yourId, setYourId] = useState(null);
  const [counts, setCounts] = useState(() => Object.fromEntries(poll.options.map((o) => [o.label, 0])));
  const [voteRows, setVoteRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [suppressed, setSuppressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [resultsView, setResultsView] = useState('collective'); // 'collective' | 'individual'

  const fetchResults = useCallback(async () => {
    try {
      const tierParam = filterTier && filterTier !== 'all' ? `?tier=${filterTier}` : '';
      const res = await fetch(`/api/polls/${poll.id}/results${tierParam}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.suppressed) {
        setSuppressed(true);
        setCounts({});
        setVoteRows([]);
        setTotal(data.total ?? 0);
      } else {
        setSuppressed(false);
        setCounts(data.counts ?? {});
        setVoteRows(data.votes ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent — show zeroed counts
    } finally {
      setLoading(false);
    }
  }, [poll.id, filterTier]);

  useEffect(() => {
    fetchResults();
    const stored = localStorage.getItem(`fairsaynz_voted_${poll.id}`);
    const storedId = localStorage.getItem(`fairsaynz_yourid_${poll.id}`);
    if (stored) setVoted(stored);
    if (storedId) setYourId(storedId);
  }, [fetchResults, poll.id]);

  // Re-fetch when filter changes, but only if we've already voted (results are visible)
  useEffect(() => {
    if (voted) {
      setLoading(true);
      fetchResults();
    }
  }, [filterTier, voted, fetchResults]);

  async function handleVote(label) {
    if (voted || voting) return;
    setVoting(true);
    setError('');
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: label }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Vote failed');
        return;
      }
      setVoted(label);
      setYourId(data.your_id ?? null);
      setCounts(data.counts ?? {});
      setVoteRows(data.votes ?? []);
      setTotal(data.total ?? 0);
      setSuppressed(false);
      localStorage.setItem(`fairsaynz_voted_${poll.id}`, label);
      if (data.your_id) localStorage.setItem(`fairsaynz_yourid_${poll.id}`, data.your_id);
    } catch {
      setError('Network error — please try again');
    } finally {
      setVoting(false);
    }
  }

  const badge = TYPE_BADGE[poll.type] || TYPE_BADGE.general;

  const tierLabel =
    filterTier === 'verified_nz_citizen'
      ? 'Verified NZ Citizens'
      : filterTier === 'email'
      ? 'Email accounts'
      : null;

  return (
    <article className="card rounded-2xl p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
          <span className="text-xs text-slate-400">{poll.note}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-white">{poll.question}</h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {poll.options.map((o) => (
            <div key={o.label} className="h-10 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : !voted ? (
        <div className="space-y-2">
          {poll.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleVote(option.label)}
              disabled={voting}
              className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-left text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : suppressed ? null : (
        <>
          {/* Toggle */}
          <div className="mt-4 flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit">
            <button
              type="button"
              onClick={() => setResultsView('collective')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                resultsView === 'collective'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Overview
            </button>
            <button
              type="button"
              onClick={() => setResultsView('individual')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                resultsView === 'individual'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👤 Responses
            </button>
          </div>

          {/* Collective view */}
          {resultsView === 'collective' && (
            <div className="mt-3 space-y-2">
              {poll.options.map((option) => {
                const count = counts[option.label] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const isChosen = voted === option.label;
                return (
                  <div key={option.label} className="relative rounded-lg overflow-hidden border border-white/8">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: option.color, opacity: 0.18 }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-2.5">
                      <span className={`text-sm ${isChosen ? 'font-semibold text-white' : 'text-slate-300'}`}>
                        {isChosen && <span className="mr-1.5">✓</span>}
                        {option.label}
                      </span>
                      <span className="text-xs font-medium text-slate-400 tabular-nums">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Individual view */}
          {resultsView === 'individual' && (
            <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
              {voteRows.length > 0 ? voteRows.map((row) => (
                <VoteRow key={row.id} row={row} yourId={yourId} />
              )) : (
                <p className="text-xs text-slate-500 italic">No responses yet.</p>
              )}
            </div>
          )}
        </>
      )}

      {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}

      {voted ? (
        suppressed ? (
          <p className="mt-4 text-xs text-slate-500 italic">
            Not enough responses in this group to display results.
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-400">
            {total} response{total !== 1 ? 's' : ''}
            {tierLabel ? ` · ${tierLabel}` : ''}
          </p>
        )
      ) : (
        <p className="mt-4 text-xs text-slate-500">
          {loading ? '' : 'Click an option to vote and see the results.'}
        </p>
      )}
    </article>
  );
}

function RankedPollCard({ poll, credentialTier: filterTier }) {
  const [ranked, setRanked] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultsView, setResultsView] = useState('collective');

  const fetchResults = useCallback(async () => {
    try {
      const tierParam = filterTier && filterTier !== 'all' ? `?tier=${filterTier}` : '';
      const res = await fetch(`/api/polls/${poll.id}/rank-results${tierParam}`);
      if (!res.ok) return;
      setResults(await res.json());
    } catch {
      // silent — show nothing extra
    } finally {
      setLoading(false);
    }
  }, [poll.id, filterTier]);

  useEffect(() => {
    const isRanked = localStorage.getItem(`fairsaynz_ranked_${poll.id}`) === 'true';
    setRanked(isRanked);
    if (isRanked) fetchResults();
    else setLoading(false);
  }, [fetchResults, poll.id]);

  useEffect(() => {
    if (ranked) {
      setLoading(true);
      fetchResults();
    }
  }, [filterTier, ranked, fetchResults]);

  const badge = TYPE_BADGE.ranked;
  const colorFor = (label) => poll.options.find((o) => o.label === label)?.color ?? '#6b7280';

  return (
    <article className="card rounded-2xl p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
          <span className="text-xs text-slate-400">{poll.note}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-white">{poll.question}</h2>
      </div>

      {loading ? (
        <div className="h-24 rounded-lg bg-white/5 animate-pulse" />
      ) : !ranked ? (
        <>
          <p className="mb-3 text-sm text-slate-400">
            Rank all {poll.options.length} topics from what worries you most to what worries you least — compare pairs one at a time, or rank them all in one pass.
          </p>
          <Link
            href={`/polls/${poll.id}/rank`}
            className="inline-block rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
          >
            Rank all {poll.options.length} topics →
          </Link>
        </>
      ) : results?.suppressed ? (
        <p className="text-xs text-slate-500 italic">Not enough responses in this group to display results.</p>
      ) : results?.leaderboard ? (
        <>
          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit">
            <button
              type="button"
              onClick={() => setResultsView('collective')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                resultsView === 'collective' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Overview
            </button>
            <button
              type="button"
              onClick={() => setResultsView('individual')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                resultsView === 'individual' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👤 Responses
            </button>
          </div>

          {resultsView === 'collective' ? (
            <ol className="mt-3 space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
              {results.leaderboard.map((row, i) => (
                <li key={row.label} className="flex items-center gap-3 rounded-lg border border-white/8 px-3 py-2">
                  <span className="w-5 text-right text-xs text-slate-500 tabular-nums">{i + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(row.label) }} />
                  <span className="flex-1 text-sm text-slate-200">{row.label}</span>
                  <span className="text-xs text-slate-400 tabular-nums">avg #{row.avgRank?.toFixed(1)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
              {(results.votes ?? []).length > 0 ? (
                results.votes.map((row) => (
                  <div key={row.id} className="rounded-lg bg-white/3 border border-white/6 px-3 py-2 text-xs">
                    <span className="font-mono text-slate-500">{row.id}</span>
                    <p className="mt-1 text-slate-300">
                      {row.ranking.slice(0, 3).join(' → ')}
                      {row.ranking.length > 3 && ` … +${row.ranking.length - 3} more`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No responses yet.</p>
              )}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">{results.total} ranking{results.total !== 1 ? 's' : ''} published</p>
        </>
      ) : null}
    </article>
  );
}

export default function PollsPage() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [accountState, setAccountState] = useState(null);
  const [filterTier, setFilterTier] = useState('all');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setStatus(user ? 'authenticated' : 'unauthenticated');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, authSession) => {
      setStatus(authSession?.user ? 'authenticated' : 'unauthenticated');
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/account/state')
      .then((r) => r.json())
      .then((d) => setAccountState(d))
      .catch(() => setAccountState({ credentialTier: 'email', hideDiditNudge: false }));
  }, [isAuthenticated]);

  const isLoadingSession = status === 'loading';
  const showNudge =
    isAuthenticated &&
    accountState?.credentialTier === 'email' &&
    !accountState?.hideDiditNudge &&
    !nudgeDismissed;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Community Polls</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Anonymous civic polls. One vote per account. After voting, you can see individual responses — each identified only by a per-poll anonymous hash, never a name.
        </p>
      </header>

      {/* Privacy note */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Privacy:</strong> Your vote is hashed with a per-poll one-way function — it cannot be traced back to you, and changes between polls so your responses across different polls cannot be linked.{' '}
          <Link href="/privacy" className="underline hover:text-blue-100">
            Privacy policy →
          </Link>
        </p>
      </div>

      {/* ── Tier choice – always visible ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Email – weak say */}
        <div className="card rounded-2xl p-6 flex flex-col">
          <div className="mb-4 text-3xl">📧</div>
          <h2 className="text-lg font-bold text-white">Email</h2>
          <p className="mt-0.5 text-sm text-slate-400">for a weak say</p>
          <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-500">
            Quick to set up with just an email address. Your vote is counted in community results. Anyone can participate.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link href="/auth" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-500">
              Create free account →
            </Link>
            <Link href="/auth" className="rounded-lg border border-white/12 px-4 py-2 text-center text-sm text-slate-400 hover:bg-white/5">
              Sign in
            </Link>
          </div>
        </div>

        {/* ID Proof – strong say */}
        <div className="card rounded-2xl border-emerald-500/20 p-6 flex flex-col" style={{background:'rgba(16,185,129,0.04)'}}>
          <div className="mb-4 text-3xl">🪪</div>
          <h2 className="text-lg font-bold text-white">ID Proof</h2>
          <p className="mt-0.5 text-sm text-emerald-300">for a strong say</p>
          <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-500">
            Verify your NZ identity to give your vote stronger weight. Results can be filtered to show verified citizens only — so your voice counts as distinctly Kiwi.
          </p>
          <div className="mt-5">
            <Link href="/account/verify" className="block rounded-lg border border-emerald-500/40 bg-emerald-500/12 px-4 py-2.5 text-center text-sm font-medium text-emerald-100 hover:bg-emerald-500/20">
              Verify your identity →
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-600 italic">
            * First 500 ID verifications per month are free. When the monthly quota is reached, verification reopens the following month.
          </p>
        </div>
      </div>

      {isLoadingSession ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {POLLS.map((poll) => (
            <div key={poll.id} className="card rounded-2xl p-5 space-y-3">
              <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
              <div className="h-6 w-3/4 rounded bg-white/5 animate-pulse" />
              {poll.options.slice(0, 5).map((o) => (
                <div key={o.label} className="h-10 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : !isAuthenticated ? null : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                Signed in
              </span>
              {accountState?.credentialTier === 'verified_nz_citizen' && (
                <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                  🪪 Verified NZ Citizen
                </span>
              )}
              <span className="text-xs text-slate-400">Your votes are anonymous and cannot be traced back to you.</span>
            </div>
            <PollResultsFilter selected={filterTier} onChange={setFilterTier} />
          </div>

          {showNudge && (
            <DiditUpgradeNudge onDismiss={() => setNudgeDismissed(true)} />
          )}

          <div className="grid gap-5 lg:grid-cols-2 mt-5">
            {POLLS.map((poll) =>
              poll.type === 'ranked' ? (
                <RankedPollCard key={poll.id} poll={poll} credentialTier={filterTier} />
              ) : (
                <PollCard key={poll.id} poll={poll} credentialTier={filterTier} />
              )
            )}
          </div>
        </>
      )}

      <section className="mt-10 rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
        <h3 className="mb-2 font-semibold text-white">Want to see your MP's voting record?</h3>
        <p className="text-sm text-slate-300 mb-3">
          Find every active MP, their party, electorate, and contact details.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/mps" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Browse all MPs →
          </Link>
          <Link href="/civics" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
            How MMP works →
          </Link>
        </div>
      </section>
    </main>
  );
}
