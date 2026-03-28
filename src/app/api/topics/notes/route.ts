import { NextRequest, NextResponse } from 'next/server'

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function supaFetch(path: string, method: string = 'GET', body?: any) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(method === 'POST' && { 'Prefer': 'return=representation' })
    },
    body: body ? JSON.stringify(body) : undefined
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const { topic_id, content } = await req.json()
    if (!topic_id || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const note = await supaFetch('topic_notes', 'POST', {
      topic_id, content, user_id: null
    })

    return NextResponse.json({ note: note[0] || { id: Math.random(), content, created_at: new Date().toISOString() } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
