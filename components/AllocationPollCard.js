'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getGuestItem } from '@/lib/guestStorage';
import { topAllocations } from '@/lib/allocation';
import AllocationResults from '@/components/AllocationResults';

export default function AllocationPollCard({ poll, credentialTier: filterTier, isAuthenticated }) {
  const guestKey = `fairsaynz_guest_allocate_${poll.id}`;
  const [allocated, setAllocated] = useState(false);
  const [yourAllocations, setYourAllocations] = useState(null);
  const [yourId, setYourId] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const tierParam = filterTier && filterTier !== 'all' ? `?tier=${filterTier}` : '';
      const res = await fetch(`/api/polls/${poll.id}/allocate-results${tierParam}`);
      if (!res.ok) return;
      setResults(await res.json());
    } catch {
      // silent — show nothing extra
    } finally {
      setLoading(false);
    }
  }, [poll.id, filterTier]);

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem(`fairsaynz_allocated_${poll.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAllocated(true);
        setYourAllocations(parsed.allocations);
        setYourId(parsed.yourId);
        fetchResults();
      } else {
        setLoading(false);
      }
    } else {
      const guest = getGuestItem(guestKey);
      if (guest) {
        setAllocated(true);
        setYourAllocations(guest.allocations);
      }
      setLoading(false);
    }
  }, [fetchResults, poll.id, isAuthenticated, guestKey]);

  useEffect(() => {
    if (allocated && isAuthenticated) {
      setLoading(true);
      fetchResults();
    }
  }, [filterTier, allocated, isAuthenticated, fetchResults]);

  const tierLabel =
    filterTier === 'verified_nz_citizen' ? 'Verified NZ Citizens' : filterTier === 'email' ? 'Email accounts' : null;

  return (
    <article className="card rounded-2xl p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Budget Poll</span>
          <span className="text-xs text-slate-400">{poll.note}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-white">{poll.question}</h2>
      </div>

      {loading ? (
        <div className="h-24 rounded-lg bg-white/5 animate-pulse" />
      ) : !allocated ? (
        <>
          <p className="mb-3 text-sm text-slate-400">
            Compare categories in pairs or rank them directly, then fine-tune a 100% split across all {poll.options.length}.
          </p>
          <Link
            href={`/polls/${poll.id}/allocate`}
            className="inline-block rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500"
          >
            Split your tax across {poll.options.length} categories →
          </Link>
        </>
      ) : !isAuthenticated ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-white/8 bg-white/3 px-4 py-3">
            <p className="mb-2 text-sm text-white">
              <span className="mr-1.5 text-emerald-400">✓</span>Your split:
            </p>
            <div className="space-y-1.5">
              {topAllocations(yourAllocations, poll.options.length).map(([label, pct]) => (
                <div key={label} className="flex items-center justify-between text-xs text-slate-300">
                  <span>{label}</span>
                  <span className="tabular-nums text-slate-400">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500">This preview isn&apos;t saved anywhere and disappears in an hour.</p>
          <p className="text-sm text-slate-300">
            Want to publish your split?{' '}
            <Link href="/auth" className="font-semibold text-emerald-400 underline hover:text-emerald-300">
              Sign up
            </Link>{' '}
            to have your say and see community results.
          </p>
        </div>
      ) : (
        <AllocationResults poll={poll} results={results} yourAllocations={yourAllocations} tierLabel={tierLabel} yourId={yourId} />
      )}
    </article>
  );
}
