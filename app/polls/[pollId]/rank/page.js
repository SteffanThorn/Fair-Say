'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getPollById } from '@/lib/polls';
import { createEloState, pickNextPair, recordComparison, getRankingFromState, TOTAL_PAIRS, shuffle } from '@/lib/ranking';
import { getGuestItem, setGuestItem } from '@/lib/guestStorage';

function nextBlockTarget(comparisonsCount) {
  if (comparisonsCount > 0 && comparisonsCount % 50 === 0) return comparisonsCount;
  return (Math.floor(comparisonsCount / 50) + 1) * 50;
}

export default function RankPollPage() {
  const { pollId } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const poll = useMemo(() => getPollById(pollId), [pollId]);
  const labels = useMemo(() => poll?.options.map((o) => o.label) ?? [], [poll]);
  const colorFor = useCallback((label) => poll?.options.find((o) => o.label === label)?.color ?? '#6b7280', [poll]);

  const [stage, setStage] = useState('loading');
  const [method, setMethod] = useState(null);
  const [eloState, setEloState] = useState(null);
  const [currentPair, setCurrentPair] = useState(null);
  const [blockTarget, setBlockTarget] = useState(50);
  const [directPool, setDirectPool] = useState([]);
  const [directRanked, setDirectRanked] = useState([]);
  const [reviewOrder, setReviewOrder] = useState([]);
  const [publishResult, setPublishResult] = useState(null);
  const [resultsView, setResultsView] = useState('collective');
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const saveDraft = useCallback(
    (nextMethod, draftState) => {
      if (status !== 'authenticated') return; // guest progress stays in-memory only
      fetch(`/api/polls/${pollId}/rank/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: nextMethod, draftState }),
      }).catch(() => {});
    },
    [pollId, status]
  );

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

  useEffect(() => {
    if (status !== 'authenticated' || !poll) return;
    let cancelled = false;

    fetch(`/api/polls/${pollId}/rank/draft`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;

        if (!data.exists) {
          setStage('method-choice');
          return;
        }

        if (data.status === 'published') {
          setPublishResult({ your_ranking: data.ranking, leaderboard: null, votes: null, total: null, suppressed: false });
          fetch(`/api/polls/${pollId}/rank-results`)
            .then((r) => r.json())
            .then((results) => {
              if (cancelled) return;
              setPublishResult((prev) => ({ ...prev, ...results }));
            });
          setStage('published');
          return;
        }

        setMethod(data.method);
        if (data.method === 'pairwise') {
          setEloState(data.draftState);
          const target = nextBlockTarget(data.draftState.comparisonsCount);
          setBlockTarget(target);
          if (data.draftState.comparisonsCount >= target) {
            setStage('popup');
          } else {
            setCurrentPair(pickNextPair(data.draftState));
            setStage('pairwise');
          }
        } else {
          setDirectPool(data.draftState.pool);
          setDirectRanked(data.draftState.ranked);
          setStage('direct');
        }
      })
      .catch(() => setStage('method-choice'));

    return () => {
      cancelled = true;
    };
  }, [status, poll, pollId]);

  useEffect(() => {
    if (status !== 'unauthenticated' || !poll) return;
    const stored = getGuestItem(`fairsaynz_guest_rank_${pollId}`);
    if (!stored) {
      setStage('method-choice');
      return;
    }
    // Guests never see community results, so there's nothing to fetch here.
    setMethod(stored.method);
    setReviewOrder(stored.ranking);
    setStage('guest-published');
  }, [status, poll, pollId]);

  function chooseMethod(chosen) {
    setMethod(chosen);
    if (chosen === 'pairwise') {
      const state = createEloState(poll.options);
      setEloState(state);
      setBlockTarget(50);
      setCurrentPair(pickNextPair(state));
      saveDraft('pairwise', state);
      setStage('pairwise');
    } else {
      const pool = shuffle(labels);
      setDirectPool(pool);
      setDirectRanked([]);
      saveDraft('direct', { pool, ranked: [] });
      setStage('direct');
    }
  }

  function handlePairwiseChoice(winnerLabel) {
    const loserLabel = currentPair[0] === winnerLabel ? currentPair[1] : currentPair[0];
    const next = recordComparison(eloState, winnerLabel, loserLabel);
    setEloState(next);
    saveDraft('pairwise', next);
    if (next.comparisonsCount >= blockTarget) {
      setStage('popup');
    } else {
      setCurrentPair(pickNextPair(next));
    }
  }

  function handleDirectTap(label) {
    const newPool = directPool.filter((l) => l !== label);
    const newRanked = [...directRanked, label];
    setDirectPool(newPool);
    setDirectRanked(newRanked);
    saveDraft('direct', { pool: newPool, ranked: newRanked });
    if (newRanked.length === labels.length) {
      setReviewOrder(newRanked);
      setStage('review');
    }
  }

  function handleDirectUndo() {
    if (directRanked.length === 0) return;
    const last = directRanked[directRanked.length - 1];
    const newRanked = directRanked.slice(0, -1);
    const newPool = [...directPool, last];
    setDirectRanked(newRanked);
    setDirectPool(newPool);
    saveDraft('direct', { pool: newPool, ranked: newRanked });
  }

  function moveReview(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= reviewOrder.length) return;
    const copy = [...reviewOrder];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setReviewOrder(copy);
  }

  async function handlePublish() {
    setPublishing(true);
    setError('');

    if (status !== 'authenticated') {
      // Guest: keep the ranking local, never call the publish endpoint or
      // fetch community results — guests only see their own ranking.
      setGuestItem(`fairsaynz_guest_rank_${pollId}`, { ranking: reviewOrder, method });
      setStage('guest-published');
      setPublishing(false);
      return;
    }

    try {
      const res = await fetch(`/api/polls/${pollId}/rank`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ranking: reviewOrder, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not publish ranking');
        return;
      }
      localStorage.setItem(`fairsaynz_ranked_${pollId}`, 'true');
      setPublishResult(data);
      setStage('published');
    } catch {
      setError('Network error — please try again');
    } finally {
      setPublishing(false);
    }
  }

  const totalPairs = labels.length ? TOTAL_PAIRS(labels.length) : 0;
  const allPairsSeen = eloState ? eloState.shownPairs.length >= totalPairs : false;

  if (!poll || poll.type !== 'ranked') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">Poll not found.</p>
        <Link href="/polls" className="mt-3 inline-block text-emerald-400 hover:underline">← Back to polls</Link>
      </main>
    );
  }

  if (status === 'loading' || stage === 'loading') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-purple-400">Ranking Poll</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{poll.question}</h1>
        <p className="mt-2 text-sm text-slate-400">A self-reflection exercise — rank all {labels.length} topics, adjust before publishing.</p>
      </header>

      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      {stage === 'method-choice' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => chooseMethod('pairwise')}
            className="card rounded-2xl p-6 text-left transition-colors hover:border-white/25"
          >
            <div className="text-2xl">⚖️</div>
            <h2 className="mt-3 font-semibold text-white">Compare pairs</h2>
            <p className="mt-2 text-sm text-slate-400">
              We show you two topics at a time — pick the one you worry about more. At least 50 comparisons, more if you want extra accuracy.
            </p>
          </button>
          <button
            onClick={() => chooseMethod('direct')}
            className="card rounded-2xl p-6 text-left transition-colors hover:border-white/25"
          >
            <div className="text-2xl">📝</div>
            <h2 className="mt-3 font-semibold text-white">Rank directly</h2>
            <p className="mt-2 text-sm text-slate-400">
              Tap all {labels.length} topics in order, from what worries you most to what worries you least, in one pass.
            </p>
          </button>
        </div>
      )}

      {stage === 'pairwise' && currentPair && (
        <div className="card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>Comparison {eloState.comparisonsCount + 1} of ≥50</span>
            <span>{eloState.shownPairs.length} of {totalPairs} pairs seen</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (eloState.comparisonsCount / blockTarget) * 100)}%` }}
            />
          </div>
          <p className="mt-5 mb-3 text-sm text-slate-300">Which do you worry about more?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentPair.map((label) => (
              <button
                key={label}
                onClick={() => handlePairwiseChoice(label)}
                className="rounded-xl border border-white/10 px-4 py-6 text-center text-sm font-medium text-slate-100 transition-colors hover:border-white/25 hover:bg-white/5"
                style={{ boxShadow: `inset 0 3px 0 ${colorFor(label)}` }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'popup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="card w-full max-w-sm rounded-2xl p-6 text-center">
            <div className="text-2xl">🎯</div>
            <h2 className="mt-3 font-semibold text-white">
              {allPairsSeen ? "You've compared every pair at least once" : `${eloState.comparisonsCount} comparisons done`}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {allPairsSeen
                ? 'More comparisons now sharpen the close calls in your ranking.'
                : 'Want more accuracy? Doing 50 more comparisons refines your ranking further.'}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  setBlockTarget(blockTarget + 50);
                  setCurrentPair(pickNextPair(eloState));
                  setStage('pairwise');
                }}
                className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
              >
                Do 50 more
              </button>
              <button
                onClick={() => {
                  setReviewOrder(getRankingFromState(eloState));
                  setStage('review');
                }}
                className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                See my ranking now
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'direct' && (
        <div className="card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>{directRanked.length} of {labels.length} ranked</span>
            {directRanked.length > 0 && (
              <button onClick={handleDirectUndo} className="text-slate-400 hover:text-slate-200">Undo last ↺</button>
            )}
          </div>

          {directRanked.length > 0 && (
            <ol className="mb-4 space-y-1 text-sm text-slate-200">
              {directRanked.map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs text-slate-500 tabular-nums">{i + 1}.</span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorFor(label) }} />
                  {label}
                </li>
              ))}
            </ol>
          )}

          <p className="mb-2 text-sm text-slate-300">Tap the topic that worries you most among those remaining:</p>
          <div className="flex flex-wrap gap-2">
            {directPool.map((label) => (
              <button
                key={label}
                onClick={() => handleDirectTap(label)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5"
                style={{ boxShadow: `inset 0 2px 0 ${colorFor(label)}` }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'review' && (
        <div className="card rounded-2xl p-6">
          <p className="mb-4 text-sm text-slate-300">Your ranking — adjust anything before publishing.</p>
          <ol className="space-y-1.5">
            {reviewOrder.map((label, i) => (
              <li key={label} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                <span className="w-5 text-right text-xs text-slate-500 tabular-nums">{i + 1}</span>
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(label) }} />
                <span className="flex-1 text-sm text-slate-100">{label}</span>
                <button
                  onClick={() => moveReview(i, -1)}
                  disabled={i === 0}
                  className="rounded px-1.5 py-0.5 text-slate-400 hover:text-white disabled:opacity-25"
                  aria-label={`Move ${label} up`}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveReview(i, 1)}
                  disabled={i === reviewOrder.length - 1}
                  className="rounded px-1.5 py-0.5 text-slate-400 hover:text-white disabled:opacity-25"
                  aria-label={`Move ${label} down`}
                >
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {status === 'authenticated'
                ? publishing ? 'Publishing…' : 'Publish my ranking'
                : publishing ? 'Saving…' : 'See my results'}
            </button>
            <button
              onClick={() => {
                setMethod(null);
                setEloState(null);
                setCurrentPair(null);
                setDirectPool([]);
                setDirectRanked([]);
                setReviewOrder([]);
                setStage('method-choice');
              }}
              className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {stage === 'published' && publishResult && (
        <div className="card rounded-2xl p-6">
          <p className="mb-4 text-sm text-emerald-300">✓ Your ranking is published — thanks for reflecting on this.</p>

          {publishResult.suppressed ? (
            <p className="text-sm text-slate-500 italic">Not enough responses yet to show results.</p>
          ) : publishResult.leaderboard ? (
            <>
              <div className="mb-4 flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit">
                <button
                  onClick={() => setResultsView('collective')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${resultsView === 'collective' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setResultsView('individual')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${resultsView === 'individual' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  👤 Responses
                </button>
              </div>

              {resultsView === 'collective' ? (
                <ol className="space-y-1.5">
                  {publishResult.leaderboard.map((row, i) => (
                    <li key={row.label} className="flex items-center gap-3 rounded-lg border border-white/8 px-3 py-2">
                      <span className="w-5 text-right text-xs text-slate-500 tabular-nums">{i + 1}</span>
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(row.label) }} />
                      <span className="flex-1 text-sm text-slate-100">{row.label}</span>
                      <span className="text-xs text-slate-400 tabular-nums">avg #{row.avgRank?.toFixed(1)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
                  {(publishResult.votes ?? []).map((row) => (
                    <div key={row.id} className="rounded-lg border border-white/6 bg-white/3 px-3 py-2 text-xs">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-slate-500">{row.id}</span>
                        {row.id === publishResult.your_id && <span className="text-emerald-400">✓ You</span>}
                      </div>
                      <p className="text-slate-300">
                        {row.ranking.slice(0, 3).join(' → ')}
                        {row.ranking.length > 3 && ` … +${row.ranking.length - 3} more`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-slate-400">{publishResult.total} ranking{publishResult.total !== 1 ? 's' : ''} published</p>
            </>
          ) : null}

          <Link href="/polls" className="mt-5 inline-block text-sm text-emerald-400 hover:underline">← Back to polls</Link>
        </div>
      )}

      {stage === 'guest-published' && (
        <div className="card rounded-2xl p-6">
          <p className="mb-2 text-sm text-slate-300">Your ranking:</p>
          <ol className="mb-5 space-y-1.5">
            {reviewOrder.map((label, i) => (
              <li key={label} className="flex items-center gap-3 rounded-lg border border-white/8 px-3 py-2">
                <span className="w-5 text-right text-xs text-slate-500 tabular-nums">{i + 1}</span>
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(label) }} />
                <span className="flex-1 text-sm text-slate-100">{label}</span>
              </li>
            ))}
          </ol>

          <p className="mb-1 text-xs text-slate-500">This preview isn&apos;t saved anywhere and disappears in an hour.</p>
          <p className="mb-5 text-sm text-slate-300">
            Want to publish your votes?{' '}
            <Link href="/auth" className="font-semibold text-emerald-400 underline hover:text-emerald-300">
              Sign up
            </Link>{' '}
            to have your say and see community results.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setMethod(null);
                setEloState(null);
                setCurrentPair(null);
                setDirectPool([]);
                setDirectRanked([]);
                setReviewOrder([]);
                setStage('method-choice');
              }}
              className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Start over
            </button>
          </div>

          <Link href="/polls" className="mt-5 inline-block text-sm text-emerald-400 hover:underline">← Back to polls</Link>
        </div>
      )}
    </main>
  );
}
