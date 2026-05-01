import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY!
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  ...extra
})

export async function POST(req: NextRequest) {
  const { topics } = await req.json()

  // Need at least 3 modules to find patterns
  if (!topics || topics.length < 3) {
    return NextResponse.json({
      active_threads: [],
      path_suggestion: null,
      convergence: { detected: false },
      last_updated: new Date().toISOString()
    })
  }

  const topicList = topics
    .map((t: any) => `- ${t.title} (${t.subject_tag || 'General'})`)
    .join('\n')

  const prompt = `You are analyzing a student's learning history to identify intellectual threads and suggest next steps.

Student's modules:
${topicList}

Do the following:
1. Identify 1-3 active learning threads — sequences of topics that show a direction of curiosity
2. For each thread, identify the natural next step — a subtopic or adjacent topic that deepens the thread without jumping too far. The new subject should arrive as a guest of the existing one, not as a replacement.
3. Detect any convergences — places where two separate threads are approaching the same intellectual territory from different directions
4. For the strongest thread, write a path suggestion in Curio's voice
5. If a convergence exists, write a convergence notice in Curio's voice

Rules:
- The next step must feel like a natural extension of the existing thread, not a jump to a new area
- The bridge must connect the suggestion to what the student already knows — "carbon dating is how archaeologists date Egyptian artifacts" not "carbon dating leads to nuclear physics"
- Curio's voice: warm, genuinely curious, not performed enthusiasm. "You've been following an interesting trail..." not "Great job!"
- One clear next step only — not a list of options
- If fewer than 2 distinct threads exist, set path_suggestion to null
- Only set convergence.detected to true if two genuinely separate threads are arriving at the same territory

Return ONLY valid JSON, no markdown:
{
  "active_threads": [
    {
      "thread": "descriptive name of the thread",
      "modules": ["module title 1", "module title 2"],
      "natural_next": "suggested next module title",
      "bridge": "one sentence connecting the suggestion to what they already know"
    }
  ],
  "path_suggestion": {
    "curio_message": "2-3 sentences in Curio's voice ending with an implicit invitation. Use the phrase 'here is where your curiosity leads if you are willing to follow it somewhere unexpected' or a variation.",
    "suggested_module_title": "the specific module title to create",
    "bridge": "one sentence connection"
  },
  "convergence": {
    "detected": false,
    "thread_a": "",
    "thread_b": "",
    "meeting_point": "",
    "curio_message": ""
  },
  "last_updated": ""
}`

  try {
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
        })
      }
    )

    const aiData = await aiRes.json()
    const content = aiData.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) throw new Error('No AI response')

    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const compiledContext = JSON.parse(cleaned)
    compiledContext.last_updated = new Date().toISOString()

    // Save to learner_profile.compiled_context
    await fetch(`${SB}/rest/v1/learner_profile?limit=1`, {
      method: 'PATCH',
      headers: h({ 'Prefer': 'return=minimal' }),
      body: JSON.stringify({
        compiled_context: compiledContext,
        updated_at: new Date().toISOString()
      })
    })

    return NextResponse.json(compiledContext)

  } catch (err) {
    console.error('compile-context error:', err)
    return NextResponse.json({
      active_threads: [],
      path_suggestion: null,
      convergence: { detected: false },
      last_updated: new Date().toISOString(),
      error: String(err)
    })
  }
}
