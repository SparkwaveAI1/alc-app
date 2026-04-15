import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'
import { chatComplete, parseAIJSON } from '@/lib/ai'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

async function generateChallenge(learnerName: string, learnerGrade: number, recentTopics: string[]): Promise<{ question: string; hint: string }> {
  const topicContext = recentTopics.length > 0
    ? `The learner has recently studied: ${recentTopics.slice(0, 5).join(', ')}.`
    : 'The learner is just getting started. Great opportunity for a standalone curiosity sparker.'

  const prompt = `You are creating a daily thinking challenge for ${learnerName}, a bright ${learnerGrade}th grader. ${topicContext}

Create one engaging question that makes them think, wonder, or connect ideas. It should be:
- Open-ended (no single right answer)
- Curious and imaginative
- Related to what they've been learning if possible, or a great standalone question
- ${learnerGrade}th-grade appropriate but not easy
- The kind of question you'd keep turning over in your head all day

Return ONLY valid JSON: {"question": "the question", "hint": "a gentle nudge if they get stuck — one sentence"}`

  const { content } = await chatComplete(prompt, { temperature: 0.9, maxTokens: 200 })
  return parseAIJSON(content)
}

export async function GET() {
  const learner = await getLearnerContext()
  if (!learner) return NextResponse.json({ error: 'No learner found' }, { status: 404 })

  const today = new Date().toISOString().split('T')[0]

  // Check if today's challenge already exists for this learner
  const existing = await fetch(
    `${SB}/rest/v1/daily_challenges?learner_id=eq.${learner.id}&challenge_date=eq.${today}&limit=1`,
    { headers: h() }
  ).then(r => r.json())

  if (existing?.[0]) return NextResponse.json(existing[0])

  // Get recent topics for context
  const topics = await fetch(
    `${SB}/rest/v1/topics?order=created_at.desc&limit=5&select=title`,
    { headers: h() }
  ).then(r => r.json())
  const topicTitles = (Array.isArray(topics) ? topics : []).map((t: { title: string }) => t.title)

  // Generate new challenge
  const { question, hint } = await generateChallenge(learner.name, learner.grade, topicTitles)

  const [challenge] = await fetch(`${SB}/rest/v1/daily_challenges`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({
      learner_id: learner.id,
      challenge_date: today,
      question,
      hint,
    }),
  }).then(r => r.json())

  return NextResponse.json(challenge)
}

export async function POST(req: NextRequest) {
  const { id, answer } = await req.json()
  const learner = await getLearnerContext()

  const [updated] = await fetch(`${SB}/rest/v1/daily_challenges?id=eq.${id}`, {
    method: 'PATCH',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ learner_response: answer, completed: true }),
  }).then(r => r.json())

  // Log to learning_logs
  await fetch(`${SB}/rest/v1/learning_logs`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=minimal' }),
    body: JSON.stringify({
      learner_id: learner?.id,
      title: 'Daily challenge',
      log_type: 'challenge',
      duration_minutes: 5,
    }),
  }).catch(() => {})

  return NextResponse.json({ challenge: updated })
}
