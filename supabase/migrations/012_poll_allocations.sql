-- ============================================================
-- Fair Say NZ — budget-allocation polls (poll_allocations)
--
-- One row per (user, poll), same identity scheme as poll_votes /
-- poll_rankings: anon_id = SHA256(account_id + ':' + poll_id + ':' + VOTE_PEPPER).
-- A respondent splits 100% across a poll's options (e.g. "where should
-- your tax go?") instead of picking one option or ranking them.
--
-- allocations is a flat {label: percent} map covering every option in
-- the poll, percents summing to 100 — validated server-side before
-- insert, not re-validated by a CHECK (Postgres can't easily assert
-- "keys match the current option list" without duplicating poll config
-- into the DB). No account_id, no timestamps, no IP — same
-- minimal-retention posture as poll_votes / poll_rankings.
-- ============================================================

CREATE TABLE IF NOT EXISTS poll_allocations (
  anon_id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL,
  allocations JSONB NOT NULL,
  credential_tier TEXT NOT NULL DEFAULT 'email'
    CHECK (credential_tier IN ('email', 'verified_nz_citizen')),
  learn_badges TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS poll_allocations_poll_id_idx ON poll_allocations(poll_id);

ALTER TABLE poll_allocations ENABLE ROW LEVEL SECURITY;

-- All actual reads/writes go through the service-role admin client
-- (bypasses RLS), same as poll_votes / poll_rankings — these policies
-- exist for defense-in-depth/consistency with the existing tables' convention.
CREATE POLICY "authenticated_users_can_allocate" ON poll_allocations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_users_can_update_own_allocation" ON poll_allocations
  FOR UPDATE WITH CHECK (auth.uid() IS NOT NULL);
