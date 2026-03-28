-- Migration: topics, topic_flashcards, topic_resources, topic_notes
-- Required by the wiki page (/wiki/[slug])

CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  overview text,
  subject_tag text,
  subtopics jsonb DEFAULT '[]'::jsonb,
  try_first_questions jsonb DEFAULT '[]'::jsonb,
  key_vocabulary jsonb DEFAULT '[]'::jsonb,
  fun_fact text,
  parent_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'link' CHECK (type IN ('youtube', 'video', 'link', 'book', 'other')),
  url text NOT NULL,
  title text NOT NULL,
  summary text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS topics_slug_idx ON topics(slug);
CREATE INDEX IF NOT EXISTS topic_flashcards_topic_id_idx ON topic_flashcards(topic_id);
CREATE INDEX IF NOT EXISTS topic_resources_topic_id_idx ON topic_resources(topic_id);
CREATE INDEX IF NOT EXISTS topic_notes_topic_id_idx ON topic_notes(topic_id);
