import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'
import { chatComplete, parseAIJSON } from '@/lib/ai'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  const { content, topic_id, topic_title, count = 3 } = await req.json()
  if (!content || !topic_id) return NextResponse.json({ error: 'content and topic_id required' }, { status: 400 })

  const learner = await getLearnerContext()
  const name = learner?.name || 'Student'
  const grade = learner?.grade || 4

  const prompt = `You are creating flashcards for ${name}, a curious ${grade}th grader.

Topic: "${topic_title}"
Content they just learned:
"${content.slice(0, 1500)}"

Create exactly ${count} flashcard(s) from the most important facts or ideas in this content.
Rules:
- Questions should be specific and testable, not vague
- Answers should be concise (1-2 sentences max)
- Use language a ${grade}th grader would understand
- Focus on the most interesting or important facts

Return ONLY valid JSON array (no markdown):
[
  {"front": "question here", "back": "answer here"},
  ...
]`

  try {
    const { content } = await chatComplete(prompt, { temperature: 0.7, maxTokens: 600 })
    const cards = parseAIJSON<Array<{ front: string; back: string }>>(content)

    // Save each card to DB
    const saved = []
    for (const card of cards) {
      const res = await fetch(`${SB}/rest/v1/flashcards`, {
        method: 'POST',
        headers: {
          'apikey': KEY, 'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json', 'Prefer': 'return=representation',
        },
        body: JSON.stringify({ topic_id, front: card.front, back: card.back, card_type: 'fact' }),
      })
      const [saved_card] = await res.json()
      if (saved_card?.id) saved.push(saved_card)
    }

    return NextResponse.json({ cards: saved })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
