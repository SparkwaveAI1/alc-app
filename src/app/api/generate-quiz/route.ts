import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'
import { chatComplete, parseAIJSON } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const { topic_title, overview, subtopics, key_vocabulary, subject_tag } = await req.json()

  if (!topic_title) return NextResponse.json({ error: 'topic_title required' }, { status: 400 })

  const learner = await getLearnerContext()

  const subtopicText = Array.isArray(subtopics)
    ? subtopics.map((s: any) => s.title).join(', ')
    : ''

  const vocabText = Array.isArray(key_vocabulary)
    ? key_vocabulary.map((v: any) => `${v.word}: ${v.definition}`).join('; ')
    : ''

  const prompt = `Create a short quiz for ${learner?.promptString || 'a curious student'} about "${topic_title}" (${subject_tag}).

Module overview: ${overview || ''}
Key subtopics covered: ${subtopicText}
Key vocabulary: ${vocabText}

Generate exactly 5 quiz questions. Use a mix of types:
- 2 multiple choice questions (4 options each, exactly 1 correct)
- 1 true/false question
- 2 fill-in-the-blank questions (one word or short phrase answer)

Make the questions genuinely test understanding, not just memorization.
Language should be appropriate for a Grade ${learner?.grade || 4} student.
Questions should be specific to this topic — not generic.

Return ONLY valid JSON array with exactly 5 questions:
[
  {
    "type": "multiple_choice",
    "question": "question text",
    "options": ["A. option", "B. option", "C. option", "D. option"],
    "correct": "A",
    "explanation": "one sentence explaining why this is correct"
  },
  {
    "type": "true_false",
    "question": "statement to evaluate",
    "correct": "true",
    "explanation": "one sentence explanation"
  },
  {
    "type": "fill_in",
    "question": "The ___ was responsible for...",
    "correct": "answer",
    "explanation": "one sentence explanation"
  }
]`

  try {
    const { content } = await chatComplete(prompt, { temperature: 0.7, maxTokens: 1200 })
    const questions = parseAIJSON(content)
    return NextResponse.json({ questions })
  } catch (err) {
    console.error('generate-quiz error:', err)
    const provider = process.env.AI_PROVIDER || '(not set)'
    return NextResponse.json({ error: String(err), debug: { provider } }, { status: 500 })
  }
}
