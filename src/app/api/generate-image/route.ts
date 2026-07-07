import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force Node runtime — Edge will break Buffer/arrayBuffer handling
export const runtime = 'nodejs'
export const maxDuration = 60

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function sb(path: string, method = 'GET', body?: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'PATCH' ? 'return=minimal' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  const { topic_id, title, subject_tag } = await req.json()
  console.log('[generate-image] route hit, topic_id:', topic_id)

  if (!topic_id) return NextResponse.json({ error: 'topic_id required' }, { status: 400 })

  try {
    const prompt = `A beautiful watercolor illustration for a children's learning module about "${title}". Subject area: ${subject_tag}. Warm colors, educational, inspiring curiosity, suitable for ages 8-13. No text or letters in the image.`

    // Step 1: Generate with Gemini (returns inline base64 image data)
    const genRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const genData = await genRes.json()

    if (!genRes.ok) {
      console.error('[generate-image] Gemini error:', JSON.stringify(genData).slice(0, 300))
      return NextResponse.json({ error: 'Image generation failed', detail: genData?.error }, { status: 500 })
    }

    type Part = { inlineData?: { mimeType: string; data: string } }
    const parts: Part[] = genData?.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find(p => p.inlineData?.data)
    if (!imagePart?.inlineData) {
      console.error('[generate-image] no image in Gemini response')
      return NextResponse.json({ error: 'No image in generation response' }, { status: 500 })
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
    const mimeType = imagePart.inlineData.mimeType || 'image/png'
    const ext = mimeType.includes('jpeg') ? 'jpg' : 'png'

    // Step 2: Upload to Supabase Storage
    const fileName = `${topic_id}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase
      .storage
      .from('topic-images')
      .upload(fileName, imageBuffer, {
        contentType: mimeType,
        upsert: true
      })

    if (uploadError) {
      console.error('[generate-image] Supabase upload failed:', uploadError)
      return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('topic-images')
      .getPublicUrl(fileName)

    // Step 3: Save to topic
    await sb(`topics?id=eq.${topic_id}`, 'PATCH', { image_url: publicUrl })
    console.log('[generate-image] saved image_url:', publicUrl.slice(0, 80))

    return NextResponse.json({ image_url: publicUrl })

  } catch (err) {
    console.error('[generate-image] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
