-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Households: parent can CRUD their household
CREATE POLICY "Parent can manage household" ON households FOR ALL USING (parent_id = auth.uid());

-- Learners: parent of household can CRUD
CREATE POLICY "Parent can manage learners" ON learners FOR ALL
  USING (household_id IN (SELECT id FROM households WHERE parent_id = auth.uid()));

-- Subjects: parent can manage
CREATE POLICY "Parent can manage subjects" ON subjects FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Standards: public read (everyone can see standards)
CREATE POLICY "Standards are public" ON standards FOR SELECT USING (true);

-- Learner skills: parent can CRUD
CREATE POLICY "Parent can manage learner skills" ON learner_skills FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Practice sessions: parent can CRUD
CREATE POLICY "Parent can manage practice sessions" ON practice_sessions FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Flashcard decks: parent can CRUD
CREATE POLICY "Parent can manage flashcard decks" ON flashcard_decks FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Flashcards: parent can CRUD
CREATE POLICY "Parent can manage flashcards" ON flashcards FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Learning logs: parent can CRUD
CREATE POLICY "Parent can manage learning logs" ON learning_logs FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Resources: parent can CRUD
CREATE POLICY "Parent can manage resources" ON resources FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));

-- Artifacts: parent can CRUD
CREATE POLICY "Parent can manage artifacts" ON artifacts FOR ALL
  USING (learner_id IN (
    SELECT l.id FROM learners l
    JOIN households h ON l.household_id = h.id
    WHERE h.parent_id = auth.uid()
  ));
