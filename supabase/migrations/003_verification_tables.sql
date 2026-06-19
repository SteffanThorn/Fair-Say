-- ============================================================
-- Fair Say NZ — verified human tier
-- Privacy design: account_verifications stores a one-way hash
-- (SHA256 of didit_session_id + server_pepper), never raw PII.
-- pending_verifications is deleted immediately after each flow.
-- verification_billing_log has no account_id — intentionally
-- unlinkable from account_verifications or auth.users.
-- ============================================================

-- Add 'didit' to the verification_tag constraint on accounts
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_verification_tag_check;
ALTER TABLE accounts ADD CONSTRAINT accounts_verification_tag_check
  CHECK (verification_tag IN ('phone_nz', 'email', 'web3_wallet', 'human_passport', 'didit'));

-- Permanent verification record — minimal, hash-based, no PII
CREATE TABLE IF NOT EXISTS account_verifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method      TEXT        NOT NULL CHECK (method IN ('didit', 'gitcoin_passport')),
  -- SHA256(didit_session_id + server_pepper) — one-way, cannot be reversed without the pepper.
  -- NULL for gitcoin_passport (no session ID involved).
  verification_hash TEXT,
  -- Gitcoin Passport score at time of verification. NULL for didit.
  passport_score    NUMERIC,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Document expiry from Didit, if provided. NULL if not applicable.
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, method)
);

ALTER TABLE account_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own verification status"
  ON account_verifications FOR SELECT
  USING (auth.uid() = account_id);
-- No INSERT/UPDATE/DELETE for users — service role only.

-- Short-lived staging table, deleted on completion (success or failure)
-- and cleaned up by cron for abandoned flows (> 1 hour old).
CREATE TABLE IF NOT EXISTS pending_verifications (
  verification_request_token TEXT    PRIMARY KEY,
  account_id                 UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method                     TEXT    NOT NULL CHECK (method IN ('didit', 'gitcoin_passport')),
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pending_verifications ENABLE ROW LEVEL SECURITY;
-- Service role only — no client-facing policies.

-- Billing log: tracks monthly Didit usage for free-tier management.
-- Deliberately has NO account_id and NO foreign key to account_verifications.
-- It must not be joinable back to any user record.
CREATE TABLE IF NOT EXISTS verification_billing_log (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  method       TEXT    NOT NULL CHECK (method IN ('didit')),
  successful   BOOLEAN NOT NULL,
  billed_to_user BOOLEAN NOT NULL DEFAULT FALSE,
  -- 0 if within free tier or unsuccessful; 2.00 if billed via Stripe
  amount_nzd   NUMERIC,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE verification_billing_log ENABLE ROW LEVEL SECURITY;
-- Service role only — no client-facing policies.

-- ============================================================
-- Cleanup: remove abandoned pending_verifications rows (> 1 hour)
-- Run this as a Supabase Edge Function cron or pg_cron job:
--
--   DELETE FROM pending_verifications
--   WHERE created_at < NOW() - INTERVAL '1 hour';
-- ============================================================
