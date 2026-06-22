-- ============================================================
-- Fair Say NZ — two-tier email retention + newsletter opt-in
-- Email-tier: raw email stored for transactional + newsletter use.
-- Passport-tier: email remains NULL — no contact possible.
-- ============================================================

ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT false;
