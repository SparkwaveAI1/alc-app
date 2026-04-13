-- Clean up any orphaned tables from previous failed attempts
DROP TABLE IF EXISTS flashcard_review_state CASCADE;
DROP TABLE IF EXISTS topic_connections CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS learner_profile CASCADE;
DROP TABLE IF EXISTS learning_areas CASCADE;

-- Learner profile: one row per learner, drives all AI personalization
CREATE TABLE learner_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid REFERENCES learners(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Student',
  grade_level integer DEFAULT 4,
  interests text[] DEFAULT '{}',
  preferred_subjects text[] DEFAULT '{}',
  learning_history text[] DEFAULT '{}',
  avatar_emoji text DEFAULT '✨',
  streak_days integer DEFAULT 0,
  last_active_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Flashcard review state: simple "knew it / try again" spaced repetition
CREATE TABLE flashcard_review_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id uuid NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  next_review timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  consecutive_correct integer DEFAULT 0,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(flashcard_id, learner_id)
);

-- Topic connections: links between modules for wiki self-awareness
CREATE TABLE topic_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id_a uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  topic_id_b uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  connection_type text DEFAULT 'related',
  connection_note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic_id_a, topic_id_b)
);

-- Learning areas: subject categories for explore view
CREATE TABLE learning_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#7C5CBF',
  icon text DEFAULT '📚',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Daily challenges: one per day, personalized to learner
CREATE TABLE daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid REFERENCES learners(id) ON DELETE CASCADE,
  question text NOT NULL,
  hint text,
  topic_context text,
  subject_tag text,
  challenge_date date DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  learner_response text,
  answer_submitted text,
  created_at timestamptz DEFAULT now()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learner_profile_updated_at BEFORE UPDATE ON learner_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcard_review_state_updated_at BEFORE UPDATE ON flashcard_review_state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed learning areas
INSERT INTO learning_areas (name, slug, description, color, icon, display_order) VALUES
  ('History', 'history', 'Explore civilizations, events, and the people who shaped our world', '#F5A623', '🏛️', 1),
  ('Science', 'science', 'Discover how the natural world works', '#4CAF7C', '🔬', 2),
  ('Geography', 'geography', 'Maps, cultures, and the physical world', '#5BA4CF', '🌍', 3),
  ('Math', 'math', 'Numbers, patterns, and logical thinking', '#5BA4CF', '🔢', 4),
  ('Reading & Writing', 'reading-writing', 'Stories, words, and creative expression', '#7C5CBF', '📖', 5),
  ('Art & Music', 'art-music', 'Creative expression through every medium', '#E8715A', '🎨', 6),
  ('Life Skills', 'life-skills', 'Practical knowledge for the real world', '#4CAF7C', '🛠️', 7);
