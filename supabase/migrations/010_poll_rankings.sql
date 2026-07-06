-- ============================================================
-- Fair Say NZ — full-ranking polls (poll_rankings)
--
-- One row per (user, poll), same identity scheme as poll_votes:
-- anon_id = SHA256(account_id + ':' + poll_id + ':' + VOTE_PEPPER).
-- Unlike poll_votes, a row here lives through a draft -> published
-- lifecycle so a pairwise-comparison session can resume after a
-- refresh instead of restarting from zero.
--
-- No raw comparison events are ever stored — only the running state
-- needed to resume (draft_state), cleared once published. No account_id.
-- No timestamps. No IP — same minimal-retention posture as poll_votes.
-- ============================================================

CREATE TABLE IF NOT EXISTS poll_rankings (
  anon_id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  method TEXT CHECK (method IN ('pairwise', 'direct')),
  draft_state JSONB,
  ranking TEXT[],
  credential_tier TEXT NOT NULL DEFAULT 'email'
    CHECK (credential_tier IN ('email', 'verified_nz_citizen')),
  learn_badges TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS poll_rankings_poll_id_idx ON poll_rankings(poll_id);

ALTER TABLE poll_rankings ENABLE ROW LEVEL SECURITY;

-- All actual reads/writes go through the service-role admin client
-- (bypasses RLS), same as poll_votes — these policies exist for
-- defense-in-depth/consistency with the existing table's convention.
CREATE POLICY "authenticated_users_can_draft_rank" ON poll_rankings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "authenticated_users_can_update_own_rank" ON poll_rankings
  FOR UPDATE WITH CHECK (auth.uid() IS NOT NULL);
