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

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Look up learning_area_id from subject_tag (match by title, case-insensitive)
  const subjectTag = ai.subject_tag || 'General'
  const areaRes = await sb(`learning_areas?title=ilike.${encodeURIComponent(subjectTag)}&select=id&limit=1`)
  const learningAreaId = Array.isArray(areaRes) && areaRes[0] ? areaRes[0].id : null

  // Save topic
  const topicResult = await sb('topics', 'POST', {
    title,
    slug,
    description,
    overview: ai.overview || ai.fun_fact || title,
    subject_tag: subjectTag,
    learning_area_id: learningAreaId,
    subtopics: ai.subtopics || [],
    try_first_questions: ai.try_first_questions || [],
    key_vocabulary: ai.key_vocabulary || [],
    fun_fact: ai.fun_fact || null,
    parent_topic_id: parent_id || null,
    ai_generated: true,
  })
  const topic = Array.isArray(topicResult) ? topicResult[0] : null

  if (!topic?.id) return NextResponse.json({ error: 'Failed to save topic' }, { status: 500 })

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

  // Generate image with timeout
  let imageUrl: string | null = null
  try {
    const result = await Promise.race([
      (async () => {
        const key = process.env.WAVESPEED_API_KEY
        if (!key) return null
        const res = await fetch('https://api.wavespeed.ai/api/v2/wavespeed-ai/flux-schnell', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: `Watercolor illustration for children about "${title}", subject ${ai.subject_tag}, warm colors, educational, no text`, image_size: 'square_hd', num_inference_steps: 4, num_images: 1, enable_sync_mode: true })
        })
        const data = await res.json()
        return data.data?.outputs?.[0] || null
      })(),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 20000))
    ])
    imageUrl = result as string | null
  } catch {}

  // Save image_url if we got one
  if (imageUrl) {
    await sb(`topics?id=eq.${topic.id}`, 'PATCH', { image_url: imageUrl })
  }

  // Return topic with image_url included directly
  return NextResponse.json({ topic: { ...topic, image_url: imageUrl } })
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
