import { NextResponse } from 'next/server'

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function supaFetch(path: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  })
  return res.json()
}

export async function GET() {
  try {
    // Get all flashcards — for MVP, return all since we have no user-specific state yet
    const cards = await supaFetch('flashcards?order=created_at')
    return NextResponse.json({ cards: Array.isArray(cards) ? cards : [] })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ cards: [], error: String(e) }, { status: 500 })
  }
}
