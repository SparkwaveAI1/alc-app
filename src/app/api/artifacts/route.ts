import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }

export async function GET() {
  const res = await fetch(`${SB}/rest/v1/artifacts?order=created_at.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } })
  const data = await res.json()
  return NextResponse.json(Array.isArray(data) ? data : [])
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, artifact_type, type, topic_id } = await req.json()
    const res = await fetch(`${SB}/rest/v1/artifacts`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({
        title,
        description,
        artifact_type: artifact_type || type || 'other',
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.message || 'Save failed' }, { status: 500 })
    const [artifact] = Array.isArray(data) ? data : [data]
    return NextResponse.json({ artifact })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
