-- 006: Align live schema with the API layer.
--
-- The API creates module flashcards as flashcards(topic_id, front, back,
-- card_type), but the live flashcards table is the old deck-based shape:
-- no topic_id, and deck_id/learner_id are NOT NULL. Module cards have no
-- deck or per-learner row, so link cards to topics and relax the old
-- deck-era constraints.

ALTER TABLE flashcards
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES topics(id) ON DELETE CASCADE;

ALTER TABLE flashcards ALTER COLUMN deck_id DROP NOT NULL;
ALTER TABLE flashcards ALTER COLUMN learner_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_flashcards_topic_id ON flashcards(topic_id);

-- The compile-context route persists its output to
-- learner_profile.compiled_context, which was never created. Without it the
-- weekly narrative, learning clusters, and convergence cards can never
-- populate, and the compile step re-runs on every app launch.

ALTER TABLE learner_profile
  ADD COLUMN IF NOT EXISTS compiled_context jsonb;
