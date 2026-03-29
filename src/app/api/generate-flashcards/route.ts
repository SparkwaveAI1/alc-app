import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OR_KEY = process.env.OPENROUTER_API_KEY!

export async function POST(req: NextRequest) {
  const { content, topic_id, topic_title, count = 3 } = await req.json()
  if (!content || !topic_id) return NextResponse.json({ error: 'content and topic_id required' }, { status: 400 })

  const prompt = `You are creating flashcards for Nayomi, a curious 10-year-old advanced learner.

Topic: "${topic_title}"
Content she just learned:
"${content.slice(0, 1500)}"

Create exactly ${count} flashcard(s) from the most important facts or ideas in this content.
Rules:
- Questions should be specific and testable, not vague
- Answers should be concise (1-2 sentences max)
- Use language a 10-year-old would understand
- Focus on the most interesting or important facts

Return ONLY valid JSON array (no markdown):
[
  {"front": "question here", "back": "answer here"},
  ...
]`

  try {
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OR_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alc-app-one.vercel.app',
        'X-Title': 'ALC Learning Companion',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    const aiData = await aiRes.json()
    const raw = aiData.choices?.[0]?.message?.content || '[]'
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const cards = JSON.parse(cleaned)

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
