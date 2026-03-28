import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function sb(path: string, method = 'GET', body?: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

// GET /api/topics — list all topics
export async function GET() {
  const topics = await sb('topics?order=created_at.desc&select=*')
  return NextResponse.json(topics)
}

// POST /api/topics — create a topic with AI content + flashcards
export async function POST(req: NextRequest) {
  const { title, description, ai, parent_id } = await req.json()

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Save topic
  const [topic] = await sb('topics', 'POST', {
    title,
    slug,
    description,
    overview: ai.overview,
    subject_tag: ai.subject_tag,
    subtopics: ai.subtopics,
    try_first_questions: ai.try_first_questions,
    key_vocabulary: ai.key_vocabulary,
    parent_id: parent_id || null,
    ai_generated: true,
  })

  if (!topic?.id) return NextResponse.json({ error: 'Failed to save topic' }, { status: 500 })

  // Save flashcards
  if (ai.flashcard_seeds?.length) {
    const cards = ai.flashcard_seeds.map((c: { front: string; back: string }) => ({
      topic_id: topic.id,
      front: c.front,
      back: c.back,
    }))
    await sb('topic_flashcards', 'POST', cards)
  }

  return NextResponse.json({ topic })
}
