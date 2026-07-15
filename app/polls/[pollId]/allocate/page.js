'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getPollById } from '@/lib/polls';
import { createEloState, pickNextPair, recordComparison, getRankingFromState, TOTAL_PAIRS, shuffle } from '@/lib/ranking';
import { allocationFromOrder, topAllocations } from '@/lib/allocation';
import { getGuestItem, setGuestItem } from '@/lib/guestStorage';
import AllocationEditor from '@/components/AllocationEditor';
import AllocationResults from '@/components/AllocationResults';
import CurrentSpendingReference from '@/components/CurrentSpendingReference';

export default function AllocatePollPage() {
  const { pollId } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const poll = useMemo(() => getPollById(pollId), [pollId]);
  const labels = useMemo(() => poll?.options.map((o) => o.label) ?? [], [poll]);
  const colorFor = useCallback((label) => poll?.options.find((o) => o.label === label)?.color ?? '#6b7280', [poll]);
  const optionFor = useCallback((label) => poll?.options.find((o) => o.label === label), [poll]);
  const guestKey = `fairsaynz_guest_allocate_${pollId}`;

  const [stage, setStage] = useState('loading');
  const [eloState, setEloState] = useState(null);
  const [currentPair, setCurrentPair] = useState(null);
  const [expandedSide, setExpandedSide] = useState(null);
  const [blockTarget, setBlockTarget] = useState(50);
  const [directPool, setDirectPool] = useState([]);
  const [directRanked, setDirectRanked] = useState([]);
  const [draft, setDraft] = useState(null);
  const [yourAllocations, setYourAllocations] = useState(null);
  const [yourId, setYourId] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

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
    if (status === 'loading' || !poll) return;

    if (status === 'authenticated') {
      const stored = localStorage.getItem(`fairsaynz_allocated_${pollId}`);
      if (!stored) {
        setStage('method-choice');
        return;
      }
      const parsed = JSON.parse(stored);
      setYourAllocations(parsed.allocations);
      setYourId(parsed.yourId);
      fetch(`/api/polls/${pollId}/allocate-results`)
        .then((r) => r.json())
        .then((data) => setResults(data))
        .catch(() => {});
      setStage('published');
    } else {
      const guest = getGuestItem(guestKey);
      if (!guest) {
        setStage('method-choice');
        return;
      }
      setYourAllocations(guest.allocations);
      setStage('guest-published');
    }
  }, [status, poll, pollId, guestKey]);

  function chooseMethod(chosen) {
    if (chosen === 'pairwise') {
      const state = createEloState(poll.options);
      setEloState(state);
      setBlockTarget(50);
      setCurrentPair(pickNextPair(state));
      setStage('pairwise');
    } else {
      setDirectPool(shuffle(labels));
      setDirectRanked([]);
      setStage('direct');
    }
  }

  function handlePairwiseChoice(winnerLabel) {
    const loserLabel = currentPair[0] === winnerLabel ? currentPair[1] : currentPair[0];
    const next = recordComparison(eloState, winnerLabel, loserLabel);
    setEloState(next);
    setExpandedSide(null);
    if (next.comparisonsCount >= blockTarget) {
      setStage('popup');
    } else {
      setCurrentPair(pickNextPair(next));
    }
  }

  function finishWithOrder(order) {
    setDraft(allocationFromOrder(order));
    setStage('allocate');
  }

  function handleDirectTap(label) {
    const newPool = directPool.filter((l) => l !== label);
    const newRanked = [...directRanked, label];
    setDirectPool(newPool);
    setDirectRanked(newRanked);
    if (newRanked.length === labels.length) {
      finishWithOrder(newRanked);
    }
  }

  function handleDirectUndo() {
    if (directRanked.length === 0) return;
    const last = directRanked[directRanked.length - 1];
    setDirectRanked(directRanked.slice(0, -1));
    setDirectPool([...directPool, last]);
  }

  function startOver() {
    setEloState(null);
    setCurrentPair(null);
    setDirectPool([]);
    setDirectRanked([]);
    setDraft(null);
    setError('');
    setStage('method-choice');
  }

  function editMySplit() {
    setDraft(yourAllocations ?? Object.fromEntries(labels.map((l) => [l, 0])));
    setError('');
    setStage('allocate');
  }

  async function handlePublish() {
    setPublishing(true);
    setError('');

    if (status !== 'authenticated') {
      setGuestItem(guestKey, { allocations: draft });
      setYourAllocations(draft);
      setStage('guest-published');
      setPublishing(false);
      return;
    }

    try {
      const res = await fetch(`/api/polls/${pollId}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocations: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not publish your split');
        return;
      }
      localStorage.setItem(`fairsaynz_allocated_${pollId}`, JSON.stringify({ allocations: draft, yourId: data.your_id }));
      setYourAllocations(draft);
      setYourId(data.your_id);
      setResults(data);
      setStage('published');
    } catch {
      setError('Network error — please try again');
    } finally {
      setPublishing(false);
    }
  }

  const totalPairs = labels.length ? TOTAL_PAIRS(labels.length) : 0;
  const allPairsSeen = eloState ? eloState.shownPairs.length >= totalPairs : false;

  if (!poll || poll.type !== 'allocation') {
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
        <p className="text-xs uppercase tracking-widest text-amber-400">Budget Poll</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{poll.question}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Build a starting order, then fine-tune a 100% split across all {labels.length} categories.
        </p>
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
              We show you two categories at a time — pick the one you&apos;d fund more. At least 50 comparisons, more if you want extra accuracy.
            </p>
          </button>
          <button
            onClick={() => chooseMethod('direct')}
            className="card rounded-2xl p-6 text-left transition-colors hover:border-white/25"
          >
            <div className="text-2xl">📝</div>
            <h2 className="mt-3 font-semibold text-white">Rank directly</h2>
            <p className="mt-2 text-sm text-slate-400">
              Tap all {labels.length} categories in order, from where you&apos;d put the most funding to the least, in one pass.
            </p>
          </button>
        </div>
      )}

      {stage === 'method-choice' && <CurrentSpendingReference />}

      {stage === 'pairwise' && currentPair && (
        <div className="card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>Comparison {eloState.comparisonsCount + 1} of ≥50</span>
            <span>{eloState.shownPairs.length} of {totalPairs} pairs seen</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (eloState.comparisonsCount / blockTarget) * 100)}%` }}
            />
          </div>
          <p className="mt-5 mb-1 text-sm text-slate-300">Which would you fund more?</p>
          <p className="mb-3 text-xs text-slate-500">
            This builds a starting percentage split — you&apos;ll fine-tune the exact numbers afterward.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentPair.map((label) => {
              const option = optionFor(label);
              const expanded = expandedSide === label;
              return (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 overflow-hidden transition-colors hover:border-white/25"
                  style={{ boxShadow: `inset 0 3px 0 ${option.color}` }}
                >
                  <div className="flex items-stretch">
                    <button
                      onClick={() => handlePairwiseChoice(label)}
                      className="flex-1 min-w-0 px-4 py-6 text-center text-sm font-medium text-slate-100 hover:bg-white/5"
                    >
                      {label}
                    </button>
                    {option.description && (
                      <button
                        type="button"
                        onClick={() => setExpandedSide((prev) => (prev === label ? null : label))}
                        aria-expanded={expanded}
                        aria-label={`More information about ${label}`}
                        className="shrink-0 border-l border-white/10 px-3 text-slate-400 hover:bg-white/5 hover:text-white"
                      >
                        {expanded ? '▲' : 'ⓘ'}
                      </button>
                    )}
                  </div>
                  {option.description && expanded && (
                    <p className="border-t border-white/8 bg-white/3 px-4 py-3 text-left text-xs leading-relaxed text-slate-400">
                      {option.description}
                    </p>
                  )}
                </div>
              );
            })}
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
                ? 'More comparisons now sharpen the close calls in your starting split.'
                : 'Want more accuracy? Doing 50 more comparisons refines your starting split further.'}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  setBlockTarget(blockTarget + 50);
                  setCurrentPair(pickNextPair(eloState));
                  setExpandedSide(null);
                  setStage('pairwise');
                }}
                className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500"
              >
                Do 50 more
              </button>
              <button
                onClick={() => finishWithOrder(getRankingFromState(eloState))}
                className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                See my split now
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

          <p className="mb-1 text-sm text-slate-300">Tap the category you&apos;d fund most among those remaining:</p>
          <p className="mb-3 text-xs text-slate-500">
            This builds a starting percentage split — you&apos;ll fine-tune the exact numbers afterward.
          </p>
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

      {stage === 'allocate' && draft && (
        <div className="card rounded-2xl p-6">
          <p className="mb-4 text-sm text-slate-300">
            Starting split based on your priority order — adjust anything before publishing.
          </p>
          <AllocationEditor
            options={poll.options}
            draft={draft}
            setDraft={setDraft}
            onSubmit={handlePublish}
            submitting={publishing}
            submitLabel={
              status === 'authenticated'
                ? publishing ? 'Publishing…' : 'Publish my split'
                : publishing ? 'Saving…' : 'See my results'
            }
            error={error}
          />
          <button
            onClick={startOver}
            className="mt-3 rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Start over
          </button>
        </div>
      )}

      {stage === 'published' && (
        <div className="card rounded-2xl p-6">
          <p className="mb-4 text-sm text-emerald-300">✓ Your split is published — thanks for having your say.</p>
          <AllocationResults poll={poll} results={results} yourAllocations={yourAllocations} yourId={yourId} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={editMySplit}
              className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Edit my split
            </button>
            <Link href="/polls" className="inline-block text-sm text-emerald-400 hover:underline self-center">← Back to polls</Link>
          </div>
        </div>
      )}

      {stage === 'guest-published' && (
        <div className="card rounded-2xl p-6">
          <p className="mb-2 text-sm text-slate-300">Your split:</p>
          <div className="mb-5 space-y-1.5">
            {topAllocations(yourAllocations, labels.length).map(([label, pct]) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-white/8 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(label) }} />
                <span className="flex-1 text-sm text-slate-100">{label}</span>
                <span className="text-xs text-slate-400 tabular-nums">{pct}%</span>
              </div>
            ))}
          </div>

          <p className="mb-1 text-xs text-slate-500">This preview isn&apos;t saved anywhere and disappears in an hour.</p>
          <p className="mb-5 text-sm text-slate-300">
            Want to publish your split?{' '}
            <Link href="/auth" className="font-semibold text-emerald-400 underline hover:text-emerald-300">
              Sign up
            </Link>{' '}
            to have your say and see community results.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={editMySplit}
              className="rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Edit my split
            </button>
            <button
              onClick={startOver}
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
