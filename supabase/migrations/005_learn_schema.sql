-- ============================================================
-- Fair Say NZ — Learn & Earn Your Voice: schema
-- Badge award logic and course content are out of scope here.
-- This migration creates the tables and seeds badge definitions.
-- ============================================================

-- Opt-in flag: user wants to be emailed when Learn launches
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS learn_notify BOOLEAN NOT NULL DEFAULT FALSE;

-- Timestamp of first sneak-peek view (verified citizens only).
-- NULL = not yet viewed; set on first server-side render of /learn in State B.
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS learn_sneak_peek_viewed_at TIMESTAMPTZ;

-- ── Badge definitions ────────────────────────────────────────
-- Populated by seed / admin. Not user-writable.
CREATE TABLE IF NOT EXISTS learn_badges (
  id          TEXT        PRIMARY KEY,           -- e.g. 'debate_fundamentals'
  label       TEXT        NOT NULL,              -- e.g. '🗣️ Debate Ready'
  description TEXT        NOT NULL,
  course_slug TEXT        NOT NULL,              -- e.g. 'debate-fundamentals'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE learn_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can read badge definitions (needed for public profile display)
CREATE POLICY "public_read_learn_badges" ON learn_badges
  FOR SELECT USING (true);

-- ── Badges earned by accounts ────────────────────────────────
CREATE TABLE IF NOT EXISTS account_badges (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- References accounts.account_id (the Supabase auth UUID)
  account_id  UUID        NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  badge_id    TEXT        NOT NULL REFERENCES learn_badges(id),
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, badge_id)   -- one badge per person per course
);

ALTER TABLE account_badges ENABLE ROW LEVEL SECURITY;

-- Badges are public — they appear on profiles and alongside poll responses
CREATE POLICY "public_read_account_badges" ON account_badges
  FOR SELECT USING (true);
-- INSERT is service-role only (triggered by test-completion logic, not yet built)

-- ── Seed badge definitions ───────────────────────────────────
INSERT INTO learn_badges (id, label, description, course_slug) VALUES
  ('debate_fundamentals', '🗣️ Debate Ready',      'Passed the Debate Fundamentals course on Fair Say', 'debate-fundamentals'),
  ('nz_civics',           '🏛️ Civics Certified',  'Passed the NZ Civics course on Fair Say',           'nz-civics'),
  ('te_tiriti',           '📜 Treaty Aware',       'Completed the Te Tiriti o Waitangi course on Fair Say', 'te-tiriti')
ON CONFLICT (id) DO NOTHING;
