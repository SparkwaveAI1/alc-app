/**
 * Shared AI client for ALC Learning Companion.
 *
 * Configure via environment variables:
 *   AI_PROVIDER=gemini       → Google AI direct (default)
 *   AI_PROVIDER=openrouter  → OpenRouter (for any model)
 *
 * Gemini config:
 *   GEMINI_MODEL=gemini-2.5-flash (default)
 *   GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY
 *
 * OpenRouter config:
 *   OPENROUTER_API_KEY
 *   OPENROUTER_MODEL (default: google/gemini-2.0-flash-001)
 */

const PROVIDER = process.env.AI_PROVIDER || 'gemini'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001'

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
// Core completion helpers
// ---------------------------------------------------------------------------

function geminiRole(role: string): 'user' | 'model' {
  return role === 'user' ? 'user' : 'model'
}

/**
 * Multi-turn chat completion with full conversation history.
 */
export async function chatCompleteWithHistory(history: ChatMessage[], newMessage: string, options?: {
  system?: string
  temperature?: number
  maxTokens?: number
}): Promise<AIResponse> {
  const temperature = options?.temperature ?? 0.8
  const maxTokens = options?.maxTokens ?? 400

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
      body: JSON.stringify({
        contents,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    })

    const data = await res.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) {
      throw new Error(`Gemini error: ${JSON.stringify(data.error || data).slice(0, 300)}`)
    }
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
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alc-app-one.vercel.app',
        'X-Title': 'ALC Learning Companion',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error(`OpenRouter error: ${JSON.stringify(data).slice(0, 200)}`)
    }
    return { content, raw: data }
  }

  throw new Error(`Unknown AI provider: ${PROVIDER}`)
}

/**
 * Single-prompt completion (no conversation history).
 */
export async function chatComplete(prompt: string, options?: {
  system?: string
  temperature?: number
  maxTokens?: number
}): Promise<AIResponse> {
  return chatCompleteWithHistory([], prompt, options)
}

// ---------------------------------------------------------------------------
// Vision
// ---------------------------------------------------------------------------

/**
 * Vision completion — sends an image + text prompt and returns the text response.
 * Only supported when AI_PROVIDER=gemini.
 */
export async function visionComplete(options: {
  imageBase64: string   // base64 string, no prefix
  mimeType: string      // 'image/jpeg' or 'image/png'
  prompt: string
  temperature?: number
  maxTokens?: number
}): Promise<AIResponse> {
  if (PROVIDER !== 'gemini') {
    throw new Error('visionComplete only supports AI_PROVIDER=gemini')
  }

  const key = getGeminiKey()
  if (!key) throw new Error('AI not configured: GOOGLE_GEMINI_API_KEY not set')
  const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${key}`

  const { imageBase64, mimeType, prompt: text, temperature = 0.8, maxTokens = 800 } = options

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: text },
        ],
      }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  })

  const data = await res.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new Error(`Vision error: ${JSON.stringify(data.error || data).slice(0, 300)}`)
  }
  return { content, raw: data }
}

// ---------------------------------------------------------------------------
// JSON parsing
// ---------------------------------------------------------------------------

/**
 * Parse JSON from an AI response that may be wrapped in markdown fences.
 */
export function parseAIJSON<T>(content: string): T {
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned) as T
}
