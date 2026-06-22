-- ============================================================
-- Fair Say NZ — legal compliance: NZ Privacy Act 2020 +
-- Biometric Processing Privacy Code 2025
-- ============================================================

-- 1. Remove gitcoin_passport from account_verifications.method constraint.
--    Only 'didit' is supported as a verification method going forward.
ALTER TABLE account_verifications DROP CONSTRAINT IF EXISTS account_verifications_method_check;
ALTER TABLE account_verifications ADD CONSTRAINT account_verifications_method_check
  CHECK (method IN ('didit'));

-- 2. Remove any existing gitcoin_passport rows before the constraint takes effect.
DELETE FROM account_verifications WHERE method = 'gitcoin_passport';

-- Also remove gitcoin_passport from pending_verifications
ALTER TABLE pending_verifications DROP CONSTRAINT IF EXISTS pending_verifications_method_check;
ALTER TABLE pending_verifications ADD CONSTRAINT pending_verifications_method_check
  CHECK (method IN ('didit'));
DELETE FROM pending_verifications WHERE method = 'gitcoin_passport';

-- 3. Remove web3_wallet from the accounts.verification_tag constraint.
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_verification_tag_check;
ALTER TABLE accounts ADD CONSTRAINT accounts_verification_tag_check
  CHECK (verification_tag IN ('phone_nz', 'email', 'human_passport', 'didit'));
-- Note: existing web3_wallet rows are left as-is (legacy accounts).
--       New accounts will only use 'email' or 'didit'.

-- 4. Add credential_tier to poll_votes.
--    Recorded at vote time from the account's current state.
--    'verified_nz_citizen' = Didit-verified NZ passport holder.
--    'email' = email-only account.
--    Cannot be updated retroactively.
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS credential_tier TEXT
  NOT NULL DEFAULT 'email'
  CHECK (credential_tier IN ('email', 'verified_nz_citizen'));

-- Also update the verification_tag constraint on poll_votes to allow 'didit'
ALTER TABLE poll_votes DROP CONSTRAINT IF EXISTS poll_votes_verification_tag_check;
ALTER TABLE poll_votes ADD CONSTRAINT poll_votes_verification_tag_check
  CHECK (verification_tag IN ('phone_nz', 'email', 'web3_wallet', 'human_passport', 'didit'));

-- 5. Update poll_votes RLS: all authenticated users may vote (no is_verified gate).
DROP POLICY IF EXISTS "verified_users_can_vote" ON poll_votes;
CREATE POLICY "authenticated_users_can_vote" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Nudge dismissal flag on accounts.
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS hide_didit_nudge BOOLEAN NOT NULL DEFAULT FALSE;

-- 7. Consent log — required by Biometric Processing Privacy Code 2025.
--    Records that the user saw and accepted the pre-collection disclosure
--    before Didit biometric processing begins.
CREATE TABLE IF NOT EXISTS consent_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type     TEXT        NOT NULL, -- 'didit_biometric_disclosure'
  accepted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Version of the disclosure the user saw (date-stamped, e.g. '2025-11-01')
  disclosure_version TEXT      NOT NULL
);

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
-- Service role only for INSERT. Users can SELECT their own consent history.
CREATE POLICY "users_read_own_consent" ON consent_log
  FOR SELECT USING (auth.uid() = account_id);
-- No user INSERT policy — inserts are via service role only.

-- ============================================================
-- Schema notes for application code:
--
-- credential_tier mapping (set at vote time in API route):
--   accounts.verification_tag = 'didit' AND is_verified = true  → 'verified_nz_citizen'
--   otherwise                                                     → 'email'
--
-- Results filtering (API route):
--   All:                  SELECT count(*) GROUP BY vote_choice
--   Email only:           WHERE credential_tier = 'email'
--   Verified NZ Citizens: WHERE credential_tier = 'verified_nz_citizen'
--   Suppress groups < 5 responses to prevent de-anonymisation.
-- ============================================================
