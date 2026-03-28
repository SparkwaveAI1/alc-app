import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OR_KEY = process.env.OPENROUTER_API_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

async function generateChallenge(recentTopics: string[]): Promise<{ question: string; hint: string }> {
  const topicContext = recentTopics.length > 0
    ? `The learner has recently studied: ${recentTopics.slice(0, 5).join(', ')}.`
    : 'The learner is just getting started.'

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OR_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [{
        role: 'user',
        content: `You are creating a daily thinking challenge for Nayomi, a bright 10-year-old. ${topicContext}

Create one engaging question that makes her think, wonder, or connect ideas. It should be:
- Open-ended (no single right answer)
- Curious and imaginative  
- Related to what she's been learning if possible, or a great standalone question
- 4th-grade appropriate but not easy

Return ONLY valid JSON: {"question": "the question", "hint": "a gentle nudge if she gets stuck — one sentence"}`,
      }],
      temperature: 0.9,
      max_tokens: 200,
    }),
  })
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || '{}'
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Check if today's challenge already exists
  const existing = await fetch(`${SB}/rest/v1/daily_challenges?challenge_date=eq.${today}&limit=1`, { headers: h() }).then(r => r.json())
  if (existing?.[0]) return NextResponse.json(existing[0])

  // Get recent topics for context
  const topics = await fetch(`${SB}/rest/v1/topics?order=created_at.desc&limit=5&select=title`, { headers: h() }).then(r => r.json())
  const topicTitles = (Array.isArray(topics) ? topics : []).map((t: { title: string }) => t.title)

  // Generate new challenge
  const { question, hint } = await generateChallenge(topicTitles)

  const [challenge] = await fetch(`${SB}/rest/v1/daily_challenges`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ challenge_date: today, question, hint }),
  }).then(r => r.json())

  return NextResponse.json(challenge)
}

export async function POST(req: NextRequest) {
  const { id, answer } = await req.json()
  const [updated] = await fetch(`${SB}/rest/v1/daily_challenges?id=eq.${id}`, {
    method: 'PATCH',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ answer_submitted: answer, completed: true }),
  }).then(r => r.json())

  // Log to learning_logs
  await fetch(`${SB}/rest/v1/learning_logs`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=minimal' }),
    body: JSON.stringify({ title: 'Daily challenge', log_type: 'challenge', duration_minutes: 5 }),
  }).catch(() => {}) // non-critical

  return NextResponse.json({ challenge: updated })
}
