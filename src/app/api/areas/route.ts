import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${SB}/rest/v1/learning_areas`, {
    method: 'POST', headers: h({ 'Prefer': 'return=representation' }), body: JSON.stringify(body),
  })
  const [area] = await res.json()
  return NextResponse.json({ area })
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json()
  const res = await fetch(`${SB}/rest/v1/learning_areas?id=eq.${id}`, {
    method: 'PATCH', headers: h({ 'Prefer': 'return=representation' }), body: JSON.stringify(updates),
  })
  const [area] = await res.json()
  return NextResponse.json({ area })
}
