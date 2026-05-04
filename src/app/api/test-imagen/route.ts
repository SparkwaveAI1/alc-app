import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.WAVESPEED_API_KEY
  const results: Record<string, unknown> = { keyExists: !!key }

  const models = [
    'wavespeed-ai/flux-2-schnell',
    'wavespeed-ai/flux-2-klein',
    'wavespeed-ai/z-image-turbo',
    'black-forest-labs/flux-2-schnell',
    'wavespeed-ai/flux-dev-ultra-fast',
  ]

  for (const model of models) {
    try {
      const res = await fetch(`https://api.wavespeed.ai/api/v2/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A red circle on white background',
          image_size: 'square_hd',
          num_images: 1,
        })
      })
      const data = await res.json()
      results[model] = {
        status: res.status,
        message: data.message,
        hasOutput: !!data.data?.outputs?.[0],
        outputUrl: data.data?.outputs?.[0]?.slice(0, 80) || null
      }
      if (res.ok && data.data?.outputs?.[0]) {
        results.workingModel = model
        break
      }
    } catch (err) {
      results[model] = { error: String(err) }
    }
  }

  return NextResponse.json(results)
}
