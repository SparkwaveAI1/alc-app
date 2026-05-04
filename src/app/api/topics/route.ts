import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/ai'

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

async function generateCoverImage(topicId: string, title: string, subjectTag: string, overview: string) {
  try {
    const prompt = `A beautiful, detailed illustration for a children's learning module about "${title}".
Subject area: ${subjectTag}.
Style: watercolor illustration, warm colors, educational, inspiring curiosity, suitable for ages 8-13.
No text, no letters, no words in the image.
Overview context: ${overview?.slice(0, 200) || ''}`

    const base64 = await generateImage(prompt)
    if (!base64) return

    // Upload to Supabase Storage
    const imageBuffer = Buffer.from(base64, 'base64')
    const fileName = `${topicId}.jpg`

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/topic-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'image/jpeg',
          'x-upsert': 'true',
        },
        body: imageBuffer,
      }
    )

    if (!uploadRes.ok) {
      console.error('Storage upload failed:', await uploadRes.text())
      return
    }

    // Save public URL back to topic
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/topic-images/${fileName}`

    await sb(`topics?id=eq.${topicId}`, 'PATCH', { image_url: imageUrl })

  } catch (err) {
    console.error('generateCoverImage error:', err)
  }
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
  const [topic] = await sb('topics', 'POST', {
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

  if (!topic?.id) return NextResponse.json({ error: 'Failed to save topic' }, { status: 500 })

  // Generate cover image in background — don't block the response
  generateCoverImage(topic.id, title, ai.subject_tag, ai.overview).catch(() => {})

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
