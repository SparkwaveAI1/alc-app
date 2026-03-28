import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra: Record<string, string> = {}) => ({
  'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra
})

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topic_id')
  const path = topicId
    ? `flashcards?topic_id=eq.${topicId}&order=created_at`
    : `flashcards?order=created_at`
  const res = await fetch(`${SB}/rest/v1/${path}`, { headers: h() })
  const cards = await res.json()
  return NextResponse.json(Array.isArray(cards) ? cards : [])
}

export async function POST(req: NextRequest) {
  const { topic_id, front, back } = await req.json()
  const res = await fetch(`${SB}/rest/v1/flashcards`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ topic_id, front, back, card_type: 'fact' }),
  })
  const [card] = await res.json()
  return NextResponse.json({ card })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await fetch(`${SB}/rest/v1/flashcards?id=eq.${id}`, {
    method: 'DELETE',
    headers: h(),
  })
  return NextResponse.json({ ok: true })
}
