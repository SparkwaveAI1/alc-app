import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.WAVESPEED_API_KEY
  const results: Record<string, unknown> = { keyExists: !!key, keyPrefix: key ? key.slice(0, 8) + '...' : 'missing' }

  try {
    const res = await fetch('https://api.wavespeed.ai/api/v2/black-forest-labs/flux-1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'A simple red circle on white background',
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
      })
    })

    const data = await res.json()
    results.status = res.status
    results.response = JSON.stringify(data).slice(0, 500)
    results.outputUrl = data.data?.outputs?.[0] || data.outputs?.[0] || null
  } catch (err) {
    results.error = String(err)
  }

  return NextResponse.json(results)
}
