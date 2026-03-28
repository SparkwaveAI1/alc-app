import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { title, description } = await req.json()

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const prompt = `You are creating a structured learning module for Nayomi, a 10-year-old advanced learner who loves history, geography, art, writing, and creative expression.

Topic: "${title}"
Description: "${description || 'No additional description provided'}"

Create a rich, engaging learning module in JSON format. The language should be warm, curious, and age-appropriate for a bright 10-year-old — never condescending, always exciting.

Return ONLY valid JSON with this exact structure:
{
  "overview": "2-3 sentence engaging introduction to this topic that makes it feel exciting and relevant",
  "subject_tag": "one of: History, Geography, Science, Writing, Math, Art, Music, Life Skills, Culture",
  "subtopics": [
    { "title": "Subtopic title", "description": "One sentence what this covers", "emoji": "relevant emoji" },
    { "title": "...", "description": "...", "emoji": "..." }
  ],
  "key_vocabulary": [
    { "word": "word or term", "definition": "simple kid-friendly definition" }
  ],
  "try_first_questions": [
    "Question that gets Nayomi thinking before she learns — no wrong answers",
    "Another open question",
    "A creative or imaginative question related to the topic"
  ],
  "youtube_search_suggestions": [
    "specific search term for YouTube that would find great educational content",
    "another search suggestion",
    "a third search suggestion"
  ],
  "flashcard_seeds": [
    { "front": "Question or term", "back": "Answer or definition" },
    { "front": "...", "back": "..." },
    { "front": "...", "back": "..." },
    { "front": "...", "back": "..." },
    { "front": "...", "back": "..." }
  ],
  "fun_fact": "One amazing fact about this topic that will blow Nayomi's mind"
}

Provide exactly 4-6 subtopics, 6-8 vocabulary words, 3 try-first questions, 3 youtube suggestions, and 5 flashcard seeds.`

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
        model: 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    // Strip markdown code fences if present
    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Generate module error:', err)
    return NextResponse.json({ error: 'Failed to generate module' }, { status: 500 })
  }
}
