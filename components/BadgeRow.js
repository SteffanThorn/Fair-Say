'use client';

import { useEffect, useState } from 'react';

function BadgePill({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
      {label}
    </span>
  );
}

// Renders earned badges for a given account as a row of pill components.
// Returns null if the account has no badges — no empty state shown.
// Drop into any profile or poll-response context via: <BadgeRow accountId={id} />
export default function BadgeRow({ accountId }) {
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    if (!accountId) return;
    fetch(`/api/badges/${accountId}`)
      .then((r) => r.json())
      .then((data) => setBadges(data.badges ?? []))
      .catch(() => setBadges([]));
  }, [accountId]);

  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <BadgePill key={b.badge_id} label={b.learn_badges?.label ?? b.badge_id} />
      ))}
    </div>
  );
}
