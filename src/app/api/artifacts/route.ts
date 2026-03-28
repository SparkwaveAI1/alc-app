import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  const { title, description, type, content, topic_id } = await req.json()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/artifacts`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ title, description, type, content, topic_id: topic_id || null }),
  })
  const [artifact] = await res.json()
  return NextResponse.json({ artifact })
}
