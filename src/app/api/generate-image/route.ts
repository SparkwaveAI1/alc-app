import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force Node runtime — Edge will break Buffer/arrayBuffer handling
export const runtime = 'nodejs'
export const maxDuration = 60

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const WAVESPEED_KEY = process.env.WAVESPEED_API_KEY!

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

    // Step 1: Submit to WaveSpeed
    const submitRes = await fetch('https://api.wavespeed.ai/api/v3/wavespeed-ai/flux-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WAVESPEED_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size: '1024*1024',
        guidance_scale: 3.5,
        seed: -1,
        enable_safety_checker: true,
      })
    })

    const submitData = await submitRes.json()
    console.log('[generate-image] submit status:', submitRes.status, submitData?.data?.id)

    if (!submitRes.ok || !submitData?.data?.id) {
      return NextResponse.json({ error: 'WaveSpeed submit failed', detail: submitData }, { status: 500 })
    }

    const requestId = submitData.data.id

    // Step 2: Poll for result (max 10 attempts, 3s apart = 30s max)
    let wavespeedUrl: string | null = null
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 3000))

      const resultRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
        { headers: { 'Authorization': `Bearer ${WAVESPEED_KEY}` } }
      )
      const resultData = await resultRes.json()
      const status = resultData?.data?.status
      console.log(`[generate-image] poll ${i+1}: ${status}`)

      if (status === 'completed' && resultData?.data?.outputs?.[0]) {
        wavespeedUrl = resultData.data.outputs[0]
        break
      } else if (status === 'failed') {
        return NextResponse.json({ error: 'WaveSpeed generation failed' }, { status: 500 })
      }
    }

    if (!wavespeedUrl) {
      return NextResponse.json({ error: 'Timed out waiting for image' }, { status: 500 })
    }

    // Step 3: Download from WaveSpeed and upload to Supabase Storage
    const imageRes = await fetch(wavespeedUrl)
    if (!imageRes.ok) throw new Error(`WaveSpeed download failed: ${imageRes.status}`)
    const imageBuffer = await imageRes.arrayBuffer()

    const fileName = `${topic_id}-${Date.now()}.jpg`

    const { error: uploadError } = await supabase
      .storage
      .from('topic-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    let finalUrl: string
    if (uploadError) {
      console.error('[generate-image] Supabase upload failed:', uploadError)
      finalUrl = wavespeedUrl  // fallback so user still gets an image
    } else {
      const { data: { publicUrl } } = supabase
        .storage
        .from('topic-images')
        .getPublicUrl(fileName)
      finalUrl = publicUrl
      console.log('[generate-image] Uploaded to Supabase:', publicUrl)
    }

    // Step 4: Save to topic
    await sb(`topics?id=eq.${topic_id}`, 'PATCH', { image_url: finalUrl })
    console.log('[generate-image] saved image_url:', finalUrl.slice(0, 80))

    return NextResponse.json({ image_url: finalUrl })

  } catch (err) {
    console.error('[generate-image] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
