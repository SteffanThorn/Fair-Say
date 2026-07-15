// Pure helpers for budget-allocation polls (percent-of-100 splits across
// a poll's options). No React, no fetch — shared between the poll-list
// card and the dedicated compare/rank/allocate flow.

export function zeroedAllocations(options) {
  return Object.fromEntries(options.map((o) => [o.label, 0]));
}

export function splitEvenly(options) {
  const n = options.length;
  const base = Math.floor(100 / n);
  const remainder = 100 - base * n;
  return Object.fromEntries(options.map((o, i) => [o.label, base + (i < remainder ? 1 : 0)]));
}

export function topAllocations(allocations, count = 3) {
  return Object.entries(allocations ?? {})
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
}

// Turns a priority order (index 0 = highest priority) into a starting
// percentage split — linearly decreasing weight by rank, remainder
// distributed to the largest fractional shares so it always sums to 100.
export function allocationFromOrder(order) {
  const n = order.length;
  const weights = order.map((_, i) => n - i);
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (100 * w) / sumWeights);
  const floors = raw.map(Math.floor);
  const remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const byFraction = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) result[byFraction[k][1]] += 1;
  return Object.fromEntries(order.map((label, i) => [label, result[i]]));
}
