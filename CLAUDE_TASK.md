# Claude Code Task: Build AI Learning Companion MVP

## Context
Building a personal learning OS for Scott Johnson's 10-year-old daughter.
Stack: Next.js 14 (App Router) + TypeScript strict + Tailwind CSS + Shadcn/Radix + Supabase

## What to Build

### Phase 1 Scope (this task):
1. Full Next.js 14 app scaffold
2. Supabase schema migrations
3. Auth (parent signup/login)
4. Parent onboarding (household + learner profile creation)
5. Today screen (child daily entry point)
6. Math mastery skill map (Grade 4 Common Core)

---

## Architecture

```
/root/repos/alc-app/
  src/
    app/                    # Next.js App Router
      (auth)/
        login/page.tsx
        signup/page.tsx
      (app)/
        layout.tsx          # App shell (sidebar nav)
        dashboard/page.tsx  # Parent dashboard
        today/page.tsx      # Child today screen
        math/
          page.tsx          # Math skill map
          [skillId]/page.tsx # Individual skill practice
        onboarding/
          page.tsx          # Multi-step parent onboarding
      layout.tsx            # Root layout
      page.tsx              # Root redirect
    components/
      ui/                   # Shadcn components (auto-generated)
      auth/
        LoginForm.tsx
        SignupForm.tsx
      onboarding/
        HouseholdSetup.tsx
        LearnerProfileSetup.tsx
      today/
        TodayScreen.tsx
        DailyPlan.tsx
        StreakBadge.tsx
      math/
        SkillMap.tsx
        SkillCard.tsx
        SkillGrid.tsx
        MasteryBadge.tsx
      layout/
        Sidebar.tsx
        TopBar.tsx
    lib/
      supabase/
        client.ts           # Browser Supabase client
        server.ts           # Server Supabase client
        middleware.ts       # Auth middleware helper
      types/
        database.ts         # Generated DB types (manually written)
        index.ts
      hooks/
        useAuth.ts
        useLearner.ts
        useSkills.ts
    middleware.ts            # Next.js middleware for auth
  supabase/
    migrations/
      001_initial_schema.sql
      002_seed_grade4_standards.sql
    config.toml
  public/
    favicon.ico
  .env.example
  .env.local               # NOT committed
  SETUP.md
  README.md
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.ts
```

---

## Step-by-Step Instructions

### Step 1: Initialize Next.js project

```bash
cd /root/repos/alc-app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

Then install additional deps:
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-tooltip
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @tanstack/react-query
npm install sonner  # toast notifications
```

### Step 2: Install Shadcn UI components

```bash
npx shadcn-ui@latest init --yes
npx shadcn-ui@latest add button card badge progress tabs dialog input label textarea toast
```

### Step 3: Create Supabase migrations

Create `supabase/migrations/001_initial_schema.sql`:

```sql
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
```

Create `supabase/migrations/002_seed_grade4_standards.sql`:

```sql
-- Grade 4 Common Core Math Standards
INSERT INTO standards (grade_level, domain, domain_name, standard_code, description, order_index) VALUES

-- Operations and Algebraic Thinking (OA)
(4, 'OA', 'Operations & Algebraic Thinking', '4.OA.1', 'Interpret a multiplication equation as a comparison. Multiply or divide to solve word problems involving multiplicative comparison.', 1),
(4, 'OA', 'Operations & Algebraic Thinking', '4.OA.2', 'Multiply or divide to solve word problems involving multiplicative comparison.', 2),
(4, 'OA', 'Operations & Algebraic Thinking', '4.OA.3', 'Solve multistep word problems posed with whole numbers using the four operations.', 3),
(4, 'OA', 'Operations & Algebraic Thinking', '4.OA.4', 'Find all factor pairs for a whole number in the range 1–100. Recognize prime and composite numbers.', 4),
(4, 'OA', 'Operations & Algebraic Thinking', '4.OA.5', 'Generate a number or shape pattern that follows a given rule. Identify features of the pattern.', 5),

-- Number & Operations in Base Ten (NBT)
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.1', 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right.', 10),
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.2', 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form. Compare two multi-digit numbers.', 11),
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.3', 'Use place value understanding to round multi-digit whole numbers to any place.', 12),
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.4', 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.', 13),
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.5', 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers using strategies based on place value and properties of operations.', 14),
(4, 'NBT', 'Number & Operations in Base Ten', '4.NBT.6', 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors.', 15),

-- Number & Operations — Fractions (NF)
(4, 'NF', 'Number & Operations — Fractions', '4.NF.1', 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b) by using visual fraction models.', 20),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.2', 'Compare two fractions with different numerators and different denominators by creating common denominators or numerators.', 21),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.3', 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b. Add and subtract mixed numbers with like denominators.', 22),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.4', 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.', 23),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.5', 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100. Add two fractions with denominators 10 and 100.', 24),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.6', 'Use decimal notation for fractions with denominators 10 or 100.', 25),
(4, 'NF', 'Number & Operations — Fractions', '4.NF.7', 'Compare two decimals to hundredths by reasoning about their size.', 26),

-- Measurement & Data (MD)
(4, 'MD', 'Measurement & Data', '4.MD.1', 'Know relative sizes of measurement units within one system of units. Convert larger units to smaller units within a given measurement system.', 30),
(4, 'MD', 'Measurement & Data', '4.MD.2', 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money.', 31),
(4, 'MD', 'Measurement & Data', '4.MD.3', 'Apply the area and perimeter formulas for rectangles in real world and mathematical problems.', 32),
(4, 'MD', 'Measurement & Data', '4.MD.4', 'Make a line plot to display a data set of measurements in fractions of a unit. Solve problems involving addition and subtraction of fractions.', 33),
(4, 'MD', 'Measurement & Data', '4.MD.5', 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint. Understand concepts of angle measurement.', 34),
(4, 'MD', 'Measurement & Data', '4.MD.6', 'Measure angles in whole-number degrees using a protractor.', 35),
(4, 'MD', 'Measurement & Data', '4.MD.7', 'Recognize angle measure as additive. Solve addition and subtraction problems to find unknown angles.', 36),

-- Geometry (G)
(4, 'G', 'Geometry', '4.G.1', 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures.', 40),
(4, 'G', 'Geometry', '4.G.2', 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size.', 41),
(4, 'G', 'Geometry', '4.G.3', 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts.', 42);
```

Create `supabase/migrations/003_rls_policies.sql`:

```sql
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
```

### Step 4: Environment files

Create `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
```

Create `.env.local` with placeholder values (app should gracefully handle missing Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

### Step 5: Supabase client setup

`src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### Step 6: Auth middleware

`src/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup')
  
  if (!user && !isAuthRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

### Step 7: Database types

Create `src/lib/types/database.ts` with full TypeScript types matching the schema.

### Step 8: Build the UI

#### Root page.tsx (redirect)
```typescript
// src/app/page.tsx
import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/dashboard')
}
```

#### Login page
Beautiful, minimal login form with email/password. "New here? Sign up" link.

#### Signup page
Email + password + display name. Auto-redirects to onboarding after signup.

#### Onboarding page
Multi-step wizard:
1. Welcome + household name
2. Create learner profile (name, grade, emoji avatar picker)
3. Done — redirect to dashboard

#### App layout with sidebar
Sidebar with nav:
- 🏠 Today (child's view)
- 📐 Math Skills
- 🗂️ Flashcards (placeholder for now)
- 📚 Resources (placeholder)
- 📊 Dashboard (parent view)

#### Today screen (`/today`)
Child-friendly, big colorful layout:
- Greeting: "Good morning, [name]! 🌟"
- Streak badge: "🔥 [N] day streak"
- Today's suggestion: "Ready for math? Let's practice fractions!"
- Quick log entry: "What did you learn today?"
- Recent activity list

#### Math skill map (`/math`)
Visual grid organized by domain:
- Section header per domain (OA, NBT, NF, MD, G)
- Skill cards with:
  - Standard code (4.OA.1)
  - Short description
  - Status badge: 🔘 Not started | 🟡 Practicing | ✅ Mastered
  - Progress dots (correct streak)
- Domain progress bar

#### Math skill detail (`/math/[skillId]`)
- Full standard description
- Practice placeholder (AI coach in Phase 2)
- Mark as "tried today" button
- History of attempts

### Step 9: SETUP.md

Create comprehensive SETUP.md:
```markdown
# ALC App — Setup Guide

## Prerequisites
- Node.js 18+
- Supabase account
- Vercel account

## 1. Supabase Setup (5 minutes)

1. Go to https://supabase.com → New Project
2. Name: alc-app | Region: us-east-1
3. Copy your project URL and keys

4. Run migrations in this order via Supabase SQL Editor:
   - supabase/migrations/001_initial_schema.sql
   - supabase/migrations/002_seed_grade4_standards.sql
   - supabase/migrations/003_rls_policies.sql

5. Under Authentication → Providers → Email: ensure Email/Password is enabled

## 2. Local Development

```bash
cp .env.example .env.local
# Fill in your Supabase URL and keys in .env.local

npm install
npm run dev
# Open http://localhost:3000
```

## 3. Vercel Deployment

1. Push repo to GitHub (SparkwaveAI1/alc-app)
2. Import to Vercel: vercel.com/new
3. Add env vars:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy
```

---

## IMPORTANT REQUIREMENTS:

1. TypeScript strict — no `any` types
2. All components must be functional React components
3. Use Tailwind for ALL styling (no inline styles)
4. Responsive/mobile-first design
5. The app must build without errors: `npm run build` must succeed
6. Handle Supabase connection errors gracefully (show setup instructions if not configured)
7. All pages must have proper loading states
8. Git commit at the end with message: `feat(alc): initial MVP scaffold — auth, onboarding, today screen, math skill map [NO-TASK: ALC-001]`

## After building, run:
```bash
npm run build && echo "BUILD SUCCESS"
git add -A && git commit -m "feat(alc): initial MVP scaffold — auth, onboarding, today screen, math skill map [NO-TASK: ALC-001]"
openclaw system event --text "Done: ALC MVP scaffold complete — Next.js app built successfully with auth, onboarding, today screen, and math skill map" --mode now
```
