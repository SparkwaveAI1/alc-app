import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

  const results: Record<string, unknown> = { keyExists: !!key, keyPrefix: key.slice(0, 8) + '...' }

  for (const model of ['imagen-3.0-generate-001', 'imagen-3.0-fast-generate-001']) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: 'a red circle' }],
            parameters: { sampleCount: 1 }
          })
        }
      )
      const data = await res.json()
      results[model] = { status: res.status, error: data.error?.message, hasImage: !!data.predictions?.[0]?.bytesBase64Encoded }
    } catch (err) {
      results[model] = { error: String(err) }
    }
  }

  return NextResponse.json(results)
}
