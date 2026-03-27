-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'learner')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Households
CREATE TABLE households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Learners
CREATE TABLE learners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade_level integer NOT NULL DEFAULT 4,
  avatar_emoji text DEFAULT '🌟',
  streak_days integer DEFAULT 0,
  last_active_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_core boolean DEFAULT false,
  color text DEFAULT '#6366f1',
  icon text DEFAULT '📚',
  created_at timestamptz DEFAULT now()
);

-- Standards (seeded separately)
CREATE TABLE standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level integer NOT NULL,
  domain text NOT NULL,
  domain_name text NOT NULL,
  standard_code text NOT NULL UNIQUE,
  description text NOT NULL,
  order_index integer DEFAULT 0
);

-- Learner skills (tracks progress per standard)
CREATE TABLE learner_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  standard_id uuid NOT NULL REFERENCES standards(id),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'practicing', 'mastered')),
  correct_streak integer DEFAULT 0,
  attempts integer DEFAULT 0,
  mastered_at timestamptz,
  last_practiced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(learner_id, standard_id)
);

-- Practice sessions
CREATE TABLE practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  standard_id uuid REFERENCES standards(id),
  session_type text NOT NULL DEFAULT 'math_practice' CHECK (session_type IN ('math_practice', 'flashcard_review', 'free_learning')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  questions_attempted integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  ai_hints_given integer DEFAULT 0,
  notes text
);

-- Flashcard decks
CREATE TABLE flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  name text NOT NULL,
  description text,
  card_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Flashcards
CREATE TABLE flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  card_type text NOT NULL DEFAULT 'fact' CHECK (card_type IN ('fact', 'concept', 'process', 'visual')),
  front text NOT NULL,
  back text NOT NULL,
  ease_factor numeric DEFAULT 2.5,
  interval_days integer DEFAULT 1,
  repetitions integer DEFAULT 0,
  due_date date DEFAULT CURRENT_DATE,
  last_reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Learning logs
CREATE TABLE learning_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes integer,
  notes text,
  mood text CHECK (mood IN ('great', 'ok', 'hard')),
  created_at timestamptz DEFAULT now()
);

-- Resources
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  resource_type text NOT NULL DEFAULT 'link' CHECK (resource_type IN ('youtube', 'link', 'book', 'other')),
  title text NOT NULL,
  url text,
  thumbnail_url text,
  description text,
  tags text[] DEFAULT '{}',
  saved_at timestamptz DEFAULT now()
);

-- Artifacts
CREATE TABLE artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id),
  title text NOT NULL,
  description text,
  artifact_type text DEFAULT 'note' CHECK (artifact_type IN ('note', 'photo', 'drawing')),
  storage_path text,
  created_at timestamptz DEFAULT now()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learners_updated_at BEFORE UPDATE ON learners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcard_decks_updated_at BEFORE UPDATE ON flashcard_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 'parent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
