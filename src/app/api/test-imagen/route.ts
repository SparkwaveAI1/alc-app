import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.WAVESPEED_API_KEY
  const results: Record<string, unknown> = { keyExists: !!key }

  try {
    const res = await fetch('https://api.wavespeed.ai/api/v2/wavespeed-ai/flux-schnell', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A simple watercolor illustration of ancient Egypt pyramids',
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
        enable_sync_mode: true,
      })
    })

    const data = await res.json()
    results.status = res.status
    results.message = data.message
    results.hasOutput = !!data.data?.outputs?.[0]
    results.outputUrl = data.data?.outputs?.[0] || null
    results.response = JSON.stringify(data).slice(0, 500)
  } catch (err) {
    results.error = String(err)
  }

  return NextResponse.json(results)
}
