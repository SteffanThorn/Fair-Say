-- ============================================================
-- Fair Say NZ — individual vote visibility + one-vote enforcement
--
-- Replaces the broken random vote_hash deduplication with a
-- stable anon_id = SHA256(account_id || poll_id || VOTE_PEPPER).
-- The same user always produces the same anon_id for a given poll,
-- so the UNIQUE constraint enforces one vote per person per poll.
-- anon_id is also shown (truncated) in public results so individual
-- responses are visible without revealing identity.
--
-- learn_badges[] stores badge IDs earned by the voter at vote time,
-- shown alongside the response (e.g. 'nz_civics', 'debate_fundamentals').
-- ============================================================

-- vote_hash was NOT NULL but is now superseded by anon_id. Make it
-- nullable so old rows are preserved and new inserts can omit it.
ALTER TABLE poll_votes ALTER COLUMN vote_hash DROP NOT NULL;

-- anon_id: stable per-user per-poll hash. UNIQUE enforces one vote.
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS anon_id TEXT;

-- Partial unique index: existing rows without anon_id are ignored.
CREATE UNIQUE INDEX IF NOT EXISTS poll_votes_anon_id_key
  ON poll_votes(anon_id)
  WHERE anon_id IS NOT NULL;

-- learn_badges: badge IDs the voter held at time of casting.
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS learn_badges TEXT[] NOT NULL DEFAULT '{}';

-- ============================================================
-- RLS note: no changes needed.
-- The results API uses the service-role admin client which bypasses RLS.
-- Individual rows returned to users are already anonymised (anon_id only).
-- ============================================================
