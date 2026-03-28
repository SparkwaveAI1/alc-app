-- Topics (wiki modules)
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  overview text,
  subject_tag text,
  subtopics jsonb DEFAULT '[]',
  try_first_questions text[] DEFAULT '{}',
  key_vocabulary jsonb DEFAULT '[]',
  fun_fact text,
  parent_id uuid REFERENCES topics(id),
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Topic flashcards
CREATE TABLE IF NOT EXISTS topic_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Topic resources (links, YouTube, etc.)
CREATE TABLE IF NOT EXISTS topic_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'link' CHECK (type IN ('youtube', 'link', 'video', 'book', 'other')),
  url text NOT NULL,
  title text,
  summary text,
  created_at timestamptz DEFAULT now()
);

-- Topic notes
CREATE TABLE IF NOT EXISTS topic_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Trigger updated_at for topics
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- No RLS for now (app uses service role key for all DB ops)
ALTER TABLE topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE topic_flashcards DISABLE ROW LEVEL SECURITY;
ALTER TABLE topic_resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE topic_notes DISABLE ROW LEVEL SECURITY;
