import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

const GOOGLE_AI_KEY = process.env.GOOGLE_GEMINI_API_KEY!

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

Return ONLY valid JSON array:
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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        }),
      }
    )

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) return NextResponse.json({ error: 'No response' }, { status: 500 })

    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const questions = JSON.parse(cleaned)

    return NextResponse.json({ questions })
  } catch (err) {
    console.error('generate-quiz error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
