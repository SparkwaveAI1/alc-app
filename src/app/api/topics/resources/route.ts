import { NextRequest, NextResponse } from 'next/server'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  const { topic_id, url, title, type } = await req.json()
  const res = await fetch(`${URL}/rest/v1/topic_resources`, {
    method: 'POST',
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({ topic_id, url, title, type }),
  })
  const [resource] = await res.json()
  return NextResponse.json({ resource })
}
