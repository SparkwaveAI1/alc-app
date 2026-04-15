import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'
import { chatComplete, parseAIJSON } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const { title, description } = await req.json()

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const learner = await getLearnerContext()
  const name = learner?.name || 'Student'
  const grade = learner?.grade || 4
  const interests = learner?.interests || []

  const interestsStr = interests.length > 0
    ? ` They are particularly interested in: ${interests.join(', ')}.`
    : ''

  // Bryson standard: module overviews must begin with human story, not definition.
  // The prompt instructs the AI to lead with narrative — who discovered, how, what human need drove it.
  const prompt = `You are creating a structured learning module for ${name}, a ${grade}th grader who is curious about the world.${interestsStr}

Topic: "${title}"
Description: "${description || 'No additional description provided'}"

Create a rich, engaging learning module in JSON format.

IMPORTANT — The Bryson Standard:
- Begin the overview with a human story: who discovered this, how, what strange accident or wrong turn led to the breakthrough
- Before defining a thing, tell the story of the person or moment that revealed it
- Express genuine wonder when something is surprising
- The overview should make ${name} feel: "I HAVE to learn more about this"
- After the story hook, the overview can include a sentence of contextual framing

Return ONLY valid JSON with this exact structure:
{
  "overview": "A 2-3 sentence introduction that begins with human story or discovery moment — NOT a definition. Make it feel like the start of an adventure.",
  "subject_tag": "one of: History, Geography, Science, Writing, Math, Art, Music, Life Skills, Culture",
  "subtopics": [
    { "title": "Subtopic title", "description": "One sentence what this covers", "emoji": "relevant emoji" },
    { "title": "...", "description": "...", "emoji": "..." }
  ],
  "key_vocabulary": [
    { "word": "word or term", "definition": "simple kid-friendly definition" }
  ],
  "try_first_questions": [
    "Question that gets ${name} thinking before they learn — no wrong answers, pure curiosity",
    "Another open, inviting question",
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
  "fun_fact": "One amazing, surprising fact about this topic"
}

Provide exactly 4-6 subtopics, 6-8 vocabulary words, 3 try-first questions, 3 youtube suggestions, and 5 flashcard seeds. Make every word count — this is for a curious young mind who deserves excellence.`

  try {
    const { content } = await chatComplete(prompt, { temperature: 0.7, maxTokens: 4000 })
    const parsed = parseAIJSON(content)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Generate module error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
