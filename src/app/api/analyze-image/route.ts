import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'
import { visionComplete, parseAIJSON } from '@/lib/ai'

interface AnalyzeResponse {
  aria_response: string
  what_it_is: string
  suggested_module_title: string
  subject_tag: string
  wiki_connections: string[]
  flashcard_seeds: Array<{ front: string; back: string }>
}

const MODE_CONTEXT: Record<string, string> = {
  saw: 'The student photographed something they noticed in the world and are curious about.',
  made: 'The student photographed something they created — art, a project, something they built.',
  did: 'The student photographed something they did or an experience they had.',
}

export async function POST(req: NextRequest) {
  try {
    const { image_base64, media_type, mode, recent_topics } = await req.json()

    if (!image_base64) {
      return NextResponse.json({ error: 'image_base64 required' }, { status: 400 })
    }

    // Strip base64 prefix if present
    const cleanBase64 = image_base64.replace(/^data:[^;]+;base64,/, '')
    const mimeType = media_type || 'image/jpeg'

    const learner = await getLearnerContext()
    const name = learner?.name || 'Student'
    const grade = learner?.grade || 4

    const modeContext = MODE_CONTEXT[mode || 'saw'] ?? 'The student photographed something they are curious about.'

    const recentContext = Array.isArray(recent_topics) && recent_topics.length > 0
      ? `The student has recently been exploring: ${recent_topics.slice(0, 5).join(', ')}.`
      : ''

    const prompt = `You are Aria, a warm and curious AI learning companion for ${name}, a ${grade}th grader.

${modeContext}
${recentContext}

Look at this photo carefully and respond as Aria would — with genuine curiosity and specific observations about what you actually see. Not generic encouragement.

Return ONLY valid JSON:
{
  "aria_response": "2-3 sentences responding specifically to what's in the image. Express genuine curiosity. Ask one question that gets the student thinking. If mode is 'made', ask about their creative choices. If mode is 'saw', wonder about what it is or how it works. If mode is 'did', ask what they learned.",
  "what_it_is": "Brief factual identification of the main subject in the photo — 1 sentence",
  "suggested_module_title": "A specific, curious module title based on what's in the image — not generic",
  "subject_tag": "one of: History, Geography, Science, Math, Art, Music, Writing, Life Skills, Culture",
  "wiki_connections": ["title of related module if relevant", "another if relevant"],
  "flashcard_seeds": [
    { "front": "question about what's in the photo", "back": "answer" },
    { "front": "another question", "back": "answer" }
  ]
}`

    const { content } = await visionComplete({
      imageBase64: cleanBase64,
      mimeType,
      prompt,
      temperature: 0.8,
      maxTokens: 800,
    })

    const parsed = parseAIJSON<AnalyzeResponse>(content)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('analyze-image error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
