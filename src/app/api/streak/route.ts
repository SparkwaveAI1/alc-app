import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function headers(extra = {}) {
  return { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra }
}

// GET — returns streak count + activity log
export async function GET() {
  const rows = await fetch(`${SB}/rest/v1/learner_activity?order=activity_date.desc&limit=60`, {
    headers: headers(),
  }).then(r => r.json())

  if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ streak: 0, totalDays: 0, recent: [] })

  // Calculate current streak
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  const dates = rows.map((r: { activity_date: string }) => {
    const d = new Date(r.activity_date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  })

  let check = today.getTime()
  for (const date of dates.sort((a, b) => b - a)) {
    if (date === check || date === check - 86400000) {
      streak++
      check = date - 86400000
    } else if (date < check - 86400000) {
      break
    }
  }

  return NextResponse.json({ streak, totalDays: rows.length, recent: rows.slice(0, 7) })
}

// POST — log today's activity
export async function POST(req: NextRequest) {
  const body = await req.json()
  const today = new Date().toISOString().split('T')[0]

  // Upsert today's activity
  const res = await fetch(`${SB}/rest/v1/learner_activity`, {
    method: 'POST',
    headers: headers({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify({
      activity_date: today,
      modules_created: body.modules_created || 0,
      cards_reviewed: body.cards_reviewed || 0,
      notes_added: body.notes_added || 0,
      artifacts_created: body.artifacts_created || 0,
    }),
  })
  const data = await res.json()
  return NextResponse.json({ ok: true, data })
}
