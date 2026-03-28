import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

export async function POST(req: NextRequest) {
  const { topic_id, front, back } = await req.json()
  const res = await fetch(`${SB}/rest/v1/topic_flashcards`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ topic_id, front, back }),
  })
  const [card] = await res.json()
  return NextResponse.json({ card })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await fetch(`${SB}/rest/v1/topic_flashcards?id=eq.${id}`, {
    method: 'DELETE',
    headers: h(),
  })
  return NextResponse.json({ ok: true })
}
