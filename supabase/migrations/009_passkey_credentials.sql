-- ============================================================
-- Fair Say NZ — passkey (WebAuthn) support
--
-- Passport accounts have no email visible to the user.
-- A synthetic email (pk_<random>@pk.fairsay.nz) is used
-- internally by Supabase auth; the user only ever signs in
-- with their device passkey (Face ID, Touch ID, etc.).
--
-- passkey_credentials: one row per registered authenticator.
-- passkey_challenges:  ephemeral rows, deleted after use (max 5 min TTL).
-- ============================================================

CREATE TABLE IF NOT EXISTS passkey_credentials (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- base64url-encoded credential ID from the authenticator
  credential_id          TEXT        NOT NULL UNIQUE,
  -- base64-encoded COSE public key
  public_key             TEXT        NOT NULL,
  -- monotonically increasing counter to detect cloned authenticators
  sign_count             BIGINT      NOT NULL DEFAULT 0,
  -- 'singleDevice' or 'multiDevice' (synced via iCloud/Google etc.)
  credential_device_type TEXT        NOT NULL DEFAULT 'singleDevice',
  -- true if the passkey is backed up to the cloud
  credential_backed_up   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS passkey_credentials_user_id_idx ON passkey_credentials(user_id);

ALTER TABLE passkey_credentials ENABLE ROW LEVEL SECURITY;
-- Service role only — no direct client access.

CREATE TABLE IF NOT EXISTS passkey_challenges (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge  TEXT        NOT NULL,
  -- NULL during authentication (user identity unknown until assertion is verified)
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE passkey_challenges ENABLE ROW LEVEL SECURITY;
-- Service role only.

-- ============================================================
-- Cleanup: purge stale challenges (> 5 min old).
-- Run via pg_cron or a Supabase Edge Function cron:
--   DELETE FROM passkey_challenges
--   WHERE created_at < NOW() - INTERVAL '5 minutes';
-- ============================================================
