/**
 * Learner profile utility — fetches learner context for AI personalization.
 * All AI calls should use getLearnerContext() instead of hardcoding student info.
 */

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const h = (extra: Record<string, string> = {}) => ({
  'apikey': SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json',
  ...extra,
})

export interface LearnerContext {
  id: string
  name: string
  displayName: string
  grade: number
  interests: string[]
  preferredSubjects: string[]
  learningHistory: string[]
  avatarEmoji: string
  streakDays: number
  promptString: string  // formatted string for AI prompts
}

/**
 * Get learner context for AI personalization.
 * Returns a fully populated LearnerContext or null if no learner found.
 *
 * Usage in API routes:
 *   const learner = await getLearnerContext()
 *   if (!learner) return NextResponse.json({ error: 'No learner found' }, { status: 404 })
 *   const { promptString, name, grade } = learner
 */
export async function getLearnerContext(): Promise<LearnerContext | null> {
  try {
    // First try learner_profile (new way)
    const profileRes = await fetch(`${SB_URL}/rest/v1/learner_profile?select=*&limit=1`, { headers: h() })
    const profiles = await profileRes.json()

    if (Array.isArray(profiles) && profiles[0]) {
      const p = profiles[0]
      return {
        id: p.id,
        name: p.display_name,
        displayName: p.display_name,
        grade: p.grade_level,
        interests: p.interests || [],
        preferredSubjects: p.preferred_subjects || [],
        learningHistory: p.learning_history || [],
        avatarEmoji: p.avatar_emoji || '✨',
        streakDays: p.streak_days || 0,
        promptString: buildPromptString(p),
      }
    }

    // Fallback to learners table
    const learnersRes = await fetch(`${SB_URL}/rest/v1/learners?select=*&limit=1`, { headers: h() })
    const learners = await learnersRes.json()

    if (Array.isArray(learners) && learners[0]) {
      const l = learners[0]
      return {
        id: l.id,
        name: l.name,
        displayName: l.name,
        grade: l.grade_level,
        interests: [],
        preferredSubjects: [],
        learningHistory: [],
        avatarEmoji: l.avatar_emoji || '✨',
        streakDays: l.streak_days || 0,
        promptString: buildPromptStringFromLearner(l),
      }
    }

    return null
  } catch (e) {
    console.error('getLearnerContext error:', e)
    return null
  }
}

function buildPromptString(p: Record<string, unknown>): string {
  const name = (p.display_name as string) || 'Student'
  const grade = (p.grade_level as number) || 4
  const interests = (p.interests as string[]) || []
  const subjects = (p.preferred_subjects as string[]) || []

  let str = `You are speaking with ${name}, a ${grade}th grader`
  if (interests.length > 0) {
    str += ` who is interested in: ${interests.join(', ')}`
  }
  if (subjects.length > 0) {
    str += `. They particularly enjoy: ${subjects.join(', ')}`
  }
  str += '. Be warm, curious, and encouraging. Use age-appropriate but not dumbed-down language. Connect new ideas to what they already know and care about.'
  return str
}

function buildPromptStringFromLearner(l: Record<string, unknown>): string {
  const name = (l.name as string) || 'Student'
  const grade = (l.grade_level as number) || 4
  return `You are speaking with ${name}, a ${grade}th grader who is curious and eager to learn. Be warm, curious, and encouraging. Use age-appropriate but not dumbed-down language.`
}

/**
 * Update learner profile fields (interests, learning history, etc.)
 */
export async function updateLearnerProfile(id: string, updates: Partial<{
  interests: string[]
  preferred_subjects: string[]
  learning_history: string[]
  streak_days: number
  last_active_date: string
  display_name: string
  grade_level: number
}>): Promise<void> {
  try {
    await fetch(`${SB_URL}/rest/v1/learner_profile?id=eq.${id}`, {
      method: 'PATCH',
      headers: h({ 'Prefer': 'return=minimal' }),
      body: JSON.stringify(updates),
    })
  } catch (e) {
    console.error('updateLearnerProfile error:', e)
  }
}
