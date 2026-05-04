import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

  const results: Record<string, unknown> = { keyExists: !!key, keyPrefix: key.slice(0, 10) + '...' }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'A simple red circle on white background' }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        })
      }
    )
    const data = await res.json()
    results.status = res.status
    results.error = data.error?.message
    results.candidateCount = data.candidates?.length
    const parts = data.candidates?.[0]?.content?.parts || []
    results.partTypes = parts.map((p: any) => Object.keys(p))
    results.hasImagePart = parts.some((p: any) => p.inlineData?.mimeType?.startsWith('image/'))
    results.rawResponseSlice = JSON.stringify(data).slice(0, 500)
  } catch (err) {
    results.exception = String(err)
  }

  return NextResponse.json(results)
}
