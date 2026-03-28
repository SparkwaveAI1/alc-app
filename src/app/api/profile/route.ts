import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

export async function GET() {
  const res = await fetch(`${SB}/rest/v1/learner_profile?limit=1`, { headers: h() })
  const [profile] = await res.json()
  return NextResponse.json(profile || null)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // Upsert — only one profile row
  const existing = await fetch(`${SB}/rest/v1/learner_profile?limit=1`, { headers: h() }).then(r => r.json())

  if (existing?.[0]) {
    const res = await fetch(`${SB}/rest/v1/learner_profile?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
    })
    const [profile] = await res.json()
    return NextResponse.json({ profile })
  } else {
    const res = await fetch(`${SB}/rest/v1/learner_profile`, {
      method: 'POST',
      headers: h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(body),
    })
    const [profile] = await res.json()
    return NextResponse.json({ profile })
  }
}
