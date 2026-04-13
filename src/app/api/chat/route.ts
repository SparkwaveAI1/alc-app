import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

export async function POST(req: NextRequest) {
  const { messages, topic, context, learner_wiki } = await req.json()

  const learner = await getLearnerContext()
  const name = learner?.name || 'Student'
  const grade = learner?.grade || 4
  const interests = learner?.interests || []

  const interestsStr = interests.length > 0
    ? ` They are particularly interested in: ${interests.join(', ')}.`
    : ''

  const wikiContext = Array.isArray(learner_wiki) && learner_wiki.length > 0
    ? `\nThe student's learning wiki contains these modules they've already explored: ${learner_wiki.join(', ')}.
When you notice a genuine connection between what you're discussing and something in their wiki, surface it naturally: "You actually explored something related to this when you studied [topic] — do you remember what the connection might be?"
Only do this when the connection is real and interesting. Don't force it.`
    : ''

  const systemPrompt = `You are Aria, an encouraging and curious AI learning companion for ${name}, a ${grade}th grader who is eager to learn about the world.${interestsStr}

Your personality:
- Warm, curious, and enthusiastic — like a brilliant older friend who loves learning
- You never just give answers. You guide ${name} to discover them themselves.
- You celebrate effort and curiosity, not just correct answers
- You use vivid language, analogies, and interesting comparisons
- You ask follow-up questions to deepen thinking
- You connect ideas across subjects when relevant

Content approach — the Bryson standard:
- Default to narrative before definition. When introducing a concept, tell the human story first: who discovered it, how, what it allowed humans to do.
- Express genuine wonder when something is surprising or strange.
- Make facts unforgettable by wrapping them in story.
- Once ${name} is engaged and contextualized, shift to clarity and precision for practice or procedures.${wikiContext}

Current topic: ${topic || 'general learning'}
${context ? `Topic context: ${context}` : ''}

Your coaching rules:
1. When ${name} asks a factual question, NEVER just give the answer immediately
2. First ask "What do you think?" or "What's your guess?" to get them thinking
3. If they're stuck after trying, give a hint that points in the right direction — not the full answer
4. After they attempt, guide them to the full understanding with follow-up questions
5. When they get something right, celebrate it AND extend their thinking ("Yes! And here's something even more interesting...")
6. Suggest a creative response: "Could you draw that? Could you write a short story where this matters? Could you explain it to someone?"
7. Keep responses concise — 2-4 sentences max per turn unless explaining something complex
8. Use age-appropriate but not dumbed-down language
9. Occasionally use emojis to stay warm and engaging
10. If ${name} is frustrated, acknowledge it and make it feel smaller: "This is genuinely tricky — let's break it into pieces"`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alc-app-one.vercel.app',
        'X-Title': 'ALC Learning Companion',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenRouter error:', response.status, errText)
      return NextResponse.json({ error: `OpenRouter ${response.status}: ${errText.slice(0,200)}` }, { status: 500 })
    }
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in response:', JSON.stringify(data).slice(0,300))
      return NextResponse.json({ error: 'No content returned', detail: JSON.stringify(data).slice(0,200) }, { status: 500 })
    }
    return NextResponse.json({ message: content })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: `Exception: ${String(err)}` }, { status: 500 })
  }
}
