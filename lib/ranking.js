// Adaptive Elo-style pairwise ranking. Pure functions, no dependencies —
// state is plain JSON so it can round-trip through poll_rankings.draft_state.

export function TOTAL_PAIRS(n) {
  return (n * (n - 1)) / 2;
}

function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function kFactor(comparisons) {
  return Math.max(8, 32 / (1 + comparisons / 10));
}

export function createEloState(options) {
  const labels = options.map((o) => o.label);
  const ratings = {};
  const comparisonCounts = {};
  for (const label of labels) {
    ratings[label] = 1000;
    comparisonCounts[label] = 0;
  }
  return { labels, ratings, comparisonCounts, shownPairs: [], comparisonsCount: 0 };
}

// Coverage phase (while unique pairs remain): favor options with the fewest
// comparisons so far, paired with whichever unshown opponent has the closest
// current rating (the most informative/uncertain matchup).
//
// Refinement phase (once all TOTAL_PAIRS(n) unique pairs have been shown at
// least once): re-compare whichever two options are adjacent in the current
// rating-sorted order — sharpening the boundary the ranking is least sure of,
// rather than re-asking about pairs that are already clearly separated.
export function pickNextPair(state) {
  const { labels, ratings, comparisonCounts, shownPairs } = state;
  const shownSet = new Set(shownPairs);

  if (shownSet.size >= TOTAL_PAIRS(labels.length)) {
    const sorted = [...labels].sort((a, b) => ratings[b] - ratings[a]);
    let best = [sorted[0], sorted[1]];
    let bestGap = Infinity;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = Math.abs(ratings[sorted[i]] - ratings[sorted[i + 1]]);
      if (gap < bestGap) {
        bestGap = gap;
        best = [sorted[i], sorted[i + 1]];
      }
    }
    return best;
  }

  const minCount = Math.min(...labels.map((l) => comparisonCounts[l]));
  const pool = labels.filter((l) => comparisonCounts[l] === minCount);

  let best = null;
  let bestGap = Infinity;
  for (const a of pool) {
    for (const b of labels) {
      if (a === b || shownSet.has(pairKey(a, b))) continue;
      const gap = Math.abs(ratings[a] - ratings[b]);
      if (gap < bestGap) {
        bestGap = gap;
        best = [a, b];
      }
    }
  }
  if (best) return best;

  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      if (!shownSet.has(pairKey(labels[i], labels[j]))) return [labels[i], labels[j]];
    }
  }
  return [labels[0], labels[1]];
}

export function recordComparison(state, winnerLabel, loserLabel) {
  const ratings = { ...state.ratings };
  const comparisonCounts = { ...state.comparisonCounts };

  const expectedWinner = 1 / (1 + 10 ** ((ratings[loserLabel] - ratings[winnerLabel]) / 400));
  const kWinner = kFactor(comparisonCounts[winnerLabel]);
  const kLoser = kFactor(comparisonCounts[loserLabel]);

  ratings[winnerLabel] += kWinner * (1 - expectedWinner);
  ratings[loserLabel] += kLoser * (0 - (1 - expectedWinner));
  comparisonCounts[winnerLabel] += 1;
  comparisonCounts[loserLabel] += 1;

  const key = pairKey(winnerLabel, loserLabel);
  const shownPairs = state.shownPairs.includes(key) ? state.shownPairs : [...state.shownPairs, key];

  return { ...state, ratings, comparisonCounts, shownPairs, comparisonsCount: state.comparisonsCount + 1 };
}

export function getRankingFromState(state) {
  return [...state.labels].sort((a, b) => state.ratings[b] - state.ratings[a]);
}

// Borda count across all published rankings for a poll.
// rankings: array of ordered-label arrays (index 0 = rank 1 = most important).
export function computeLeaderboard(rankings, labels) {
  const n = labels.length;
  const total = rankings.length;
  const bordaTotal = Object.fromEntries(labels.map((l) => [l, 0]));
  const rankSum = Object.fromEntries(labels.map((l) => [l, 0]));
  const topFiveCount = Object.fromEntries(labels.map((l) => [l, 0]));

  for (const ranking of rankings) {
    ranking.forEach((label, index) => {
      bordaTotal[label] += n - 1 - index;
      rankSum[label] += index + 1;
      if (index < 5) topFiveCount[label] += 1;
    });
  }

  return labels
    .map((label) => ({
      label,
      bordaTotal: bordaTotal[label],
      avgRank: total > 0 ? rankSum[label] / total : null,
      topFiveRate: total > 0 ? topFiveCount[label] / total : 0,
    }))
    .sort((a, b) => b.bordaTotal - a.bordaTotal || (a.avgRank ?? 0) - (b.avgRank ?? 0));
}
