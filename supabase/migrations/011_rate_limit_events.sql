-- ============================================================
-- Fair Say NZ — basic rate limiting
-- One row per attempt, keyed by an arbitrary caller-defined string
-- (e.g. "passport-signup:<ip>" or "didit-start:<account_id>").
-- Checked via a trailing-window COUNT, same pattern already used
-- for the Didit monthly free-tier quota in verification_billing_log.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rate_limit_events_key_created_idx
  ON rate_limit_events(key, created_at);

ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;
-- Service role only — no client-facing policies.

-- ============================================================
-- Cleanup: purge old events (> 1 day) so the table doesn't grow unbounded.
-- Run via pg_cron or a Supabase Edge Function cron:
--   DELETE FROM rate_limit_events WHERE created_at < NOW() - INTERVAL '1 day';
-- ============================================================
