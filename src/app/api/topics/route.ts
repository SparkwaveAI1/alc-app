import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30 // 30 second function timeout

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function sb(path: string, method = 'GET', body?: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : method === 'PATCH' ? 'return=minimal' : '',
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

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Slugs are unique — suffix if this one is already taken
  const existing = await sb(`topics?slug=like.${encodeURIComponent(baseSlug)}*&select=slug`)
  const taken = new Set(Array.isArray(existing) ? existing.map((t: { slug: string }) => t.slug) : [])
  let slug = baseSlug
  for (let i = 2; taken.has(slug); i++) slug = `${baseSlug}-${i}`

  const subjectTag = ai.subject_tag || 'General'

  // Save topic
  const topicResult = await sb('topics', 'POST', {
    title,
    slug,
    description,
    overview: ai.overview || ai.fun_fact || title,
    subject_tag: subjectTag,
    subtopics: ai.subtopics || [],
    try_first_questions: ai.try_first_questions || [],
    key_vocabulary: ai.key_vocabulary || [],
    fun_fact: ai.fun_fact || null,
    parent_id: parent_id || null,
    ai_generated: true,
  })
  const topic = Array.isArray(topicResult) ? topicResult[0] : null

  if (!topic?.id) {
    console.error('[topics] POST insert failed. topicResult:', JSON.stringify(topicResult))
    console.error('[topics] payload sent:', JSON.stringify({ title, slug, subject_tag: subjectTag }))
    return NextResponse.json({ error: 'Failed to save topic', supabase_response: topicResult }, { status: 500 })
  }

  // Save flashcards
  if (ai.flashcard_seeds?.length) {
    for (const c of ai.flashcard_seeds) {
      await sb('flashcards', 'POST', {
        topic_id: topic.id,
        front: c.front,
        back: c.back,
        card_type: 'fact',
      })
    }
  }

  return NextResponse.json({ topic })
}

// PATCH /api/topics — update subtopic content
export async function PATCH(req: NextRequest) {
  const { topic_id, subtopics } = await req.json()

  if (!topic_id || !subtopics) {
    return NextResponse.json({ error: 'topic_id and subtopics required' }, { status: 400 })
  }

  const result = await sb(`topics?id=eq.${topic_id}`, 'PATCH', {
    subtopics,
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
