import { NextRequest, NextResponse } from 'next/server'

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const { title, notes, log_type, duration_minutes } = await req.json()
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const res = await fetch(`${SB_URL}/rest/v1/learning_logs`, {
      method: 'POST',
      headers: {
        apikey: KEY, Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        title, notes: notes || null, log_type: log_type || 'note',
        duration_minutes: duration_minutes || null, user_id: null, logged_at: new Date().toISOString()
      })
    })

    const data = await res.json()
    return NextResponse.json({ log: data[0] || { id: Math.random(), title, log_type } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
