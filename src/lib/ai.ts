/**
 * Shared AI client for ALC Learning Companion.
 *
 * Configure via AI_PROVIDER env var:
 *   gemini      → Google AI direct (default)
 *   minimax     → MiniMax OpenAI-compatible API
 *   openrouter  → OpenRouter
 *
 * Gemini: GOOGLE_GEMINI_API_KEY + GEMINI_MODEL (default: gemini-2.5-flash)
 * MiniMax: MINIMAX_API_KEY + MINIMAX_MODEL (default: MiniMax-VL-01)
 * OpenRouter: OPENROUTER_API_KEY + OPENROUTER_MODEL
 */

const PROVIDER = (process.env.AI_PROVIDER || 'gemini').trim().toLowerCase()
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
const OPENROUTER_MODEL = (process.env.OPENROUTER_MODEL || 'gpt-4o-mini').trim()
const MINIMAX_MODEL = (process.env.MINIMAX_MODEL || 'MiniMax-VL-01').trim()

const MINIMAX_BASE_URL = 'https://api.minimax.io/v1'

function getGeminiKey(): string {
  return process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
}

function getOpenRouterKey(): string {
  return process.env.OPENROUTER_API_KEY || ''
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  content: string
  raw?: unknown
}

// ---------------------------------------------------------------------------
// Multi-turn chat
// ---------------------------------------------------------------------------

function geminiRole(role: string): 'user' | 'model' {
  return role === 'user' ? 'user' : 'model'
}

export async function chatCompleteWithHistory(history: ChatMessage[], newMessage: string, options?: {
  system?: string
  temperature?: number
  maxTokens?: number
}): Promise<AIResponse> {
  const temperature = options?.temperature ?? 0.8
  const maxTokens = options?.maxTokens ?? 400

  // 30s timeout to prevent hanging requests
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    if (PROVIDER === 'gemini') {
      const key = getGeminiKey()
      if (!key) throw new Error('AI not configured: GOOGLE_GEMINI_API_KEY not set')
      const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${key}`

      const contents: { role: string; parts: { text: string }[] }[] = []
      if (options?.system) {
        contents.push({ role: 'user', parts: [{ text: options.system }] })
      }
      for (const msg of history) {
        if (msg.role === 'system') continue
        contents.push({ role: geminiRole(msg.role), parts: [{ text: msg.content }] })
      }
      contents.push({ role: 'user', parts: [{ text: newMessage }] })

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature, maxOutputTokens: maxTokens } }),
        signal: controller.signal,
      })

      const data = await res.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!content) throw new Error(`Gemini error: ${JSON.stringify(data.error || data).slice(0, 300)}`)
      return { content, raw: data }
    }

    if (PROVIDER === 'minimax') {
      const key = process.env.MINIMAX_API_KEY || ''
      if (!key) throw new Error('AI not configured: MINIMAX_API_KEY not set')

      const messages: { role: string; content: string }[] = []
      if (options?.system) messages.push({ role: 'system', content: options.system })
      for (const msg of history) {
        if (msg.role === 'system') continue
        messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content })
      }
      messages.push({ role: 'user', content: newMessage })

      const res = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MINIMAX_MODEL || 'MiniMax-M2.7', messages, max_tokens: maxTokens, temperature }),
        signal: controller.signal,
      })

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) throw new Error(`MiniMax error: ${JSON.stringify(data).slice(0, 200)}`)
      return { content, raw: data }
    }

    if (PROVIDER === 'openrouter') {
      const key = getOpenRouterKey()
      if (!key) throw new Error('AI not configured: OPENROUTER_API_KEY not set')

      const messages: { role: string; content: string }[] = []
      if (options?.system) messages.push({ role: 'system', content: options.system })
      for (const msg of history) {
        if (msg.role === 'system') continue
        messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content })
      }
      messages.push({ role: 'user', content: newMessage })

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://alc-app-one.vercel.app', 'X-Title': 'ALC Learning Companion' },
        body: JSON.stringify({ model: OPENROUTER_MODEL, messages, temperature, max_tokens: maxTokens }),
        signal: controller.signal,
      })

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) throw new Error(`OpenRouter error: ${JSON.stringify(data).slice(0, 200)}`)
      return { content, raw: data }
    }

    throw new Error(`Unknown AI provider: ${PROVIDER}`)
  } finally {
    clearTimeout(timeout)
  }
}

export async function chatComplete(prompt: string, options?: {
  system?: string; temperature?: number; maxTokens?: number
}): Promise<AIResponse> {
  return chatCompleteWithHistory([], prompt, options)
}

// ---------------------------------------------------------------------------
// Vision
// ---------------------------------------------------------------------------

export async function visionComplete(options: {
  imageBase64: string
  mimeType: string
  prompt: string
  temperature?: number
  maxTokens?: number
}): Promise<AIResponse> {
  const { imageBase64, mimeType, prompt: text, temperature = 0.8, maxTokens = 800 } = options

  if (PROVIDER === 'gemini') {
    const key = getGeminiKey()
    if (!key) throw new Error('AI not configured: GOOGLE_GEMINI_API_KEY not set')
    const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${key}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    })

    const data = await res.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) throw new Error(`Gemini vision error: ${JSON.stringify(data.error || data).slice(0, 300)}`)
    return { content, raw: data }
  }

  if (PROVIDER === 'minimax') {
    const key = process.env.MINIMAX_API_KEY || ''
    if (!key) throw new Error('AI not configured: MINIMAX_API_KEY not set')

    const res = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MINIMAX_MODEL || 'MiniMax-VL-01',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          ],
        }],
        max_tokens: maxTokens,
        temperature,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error(`MiniMax vision error: ${JSON.stringify(data).slice(0, 200)}`)
    return { content, raw: data }
  }

  if (PROVIDER === 'openrouter') {
    const key = getOpenRouterKey()
    if (!key) throw new Error('AI not configured: OPENROUTER_API_KEY not set')

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://alc-app-one.vercel.app', 'X-Title': 'ALC Learning Companion' },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: [{ type: 'text', text }, { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }] }],
        max_tokens: maxTokens,
        temperature,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error(`OpenRouter vision error: ${JSON.stringify(data).slice(0, 200)}`)
    return { content, raw: data }
  }

  throw new Error(`visionComplete: AI_PROVIDER=${PROVIDER} not supported`)
}

// ---------------------------------------------------------------------------
// JSON parsing
// ---------------------------------------------------------------------------

export function parseAIJSON<T>(content: string): T {
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned) as T
}

export async function generateImage(prompt: string): Promise<string | null> {
  const key = process.env.WAVESPEED_API_KEY
  if (!key) {
    console.error('[generateImage] WAVESPEED_API_KEY not set')
    return null
  }

  try {
    const res = await fetch('https://api.wavespeed.ai/api/v2/black-forest-labs/flux-1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
      })
    })

    const data = await res.json()
    console.log('[generateImage] WaveSpeed status:', res.status)

    if (!res.ok) {
      console.error('[generateImage] WaveSpeed error:', JSON.stringify(data).slice(0, 300))
      return null
    }

    // WaveSpeed returns a URL, not base64 — fetch the image and convert
    const imageUrl = data.data?.outputs?.[0]
    if (!imageUrl) {
      console.error('[generateImage] No output URL in response:', JSON.stringify(data).slice(0, 300))
      return null
    }

    // Download image and convert to base64 for Supabase upload
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) return null

    const arrayBuffer = await imageRes.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    console.log('[generateImage] Success, image size:', base64.length)
    return base64

  } catch (err) {
    console.error('[generateImage] error:', err)
    return null
  }
}
