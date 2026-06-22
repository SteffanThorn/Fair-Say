-- ============================================================
-- Fair Say NZ — source feedback
-- Stores user-submitted feedback on bias / validity / type indicators.
-- No auth required to submit.
-- ============================================================

CREATE TABLE IF NOT EXISTS source_feedback (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name  TEXT        NOT NULL,
  indicator    TEXT        NOT NULL CHECK (indicator IN ('bias', 'validity', 'source_type', 'other')),
  feedback     TEXT        NOT NULL,
  suggestion   TEXT,
  contact_email TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE source_feedback ENABLE ROW LEVEL SECURITY;

-- Public INSERT — no login required to submit feedback
CREATE POLICY "public_insert_source_feedback" ON source_feedback
  FOR INSERT WITH CHECK (true);

-- Reads are service-role only (admin review)
