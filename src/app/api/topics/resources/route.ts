import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }

function detectType(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
  if (/vimeo\.com/.test(url)) return 'video'
  return 'link'
}

export async function POST(req: NextRequest) {
  try {
    const { topic_id, url, title, type } = await req.json()
    const resourceType = type || detectType(url)
    const res = await fetch(`${SB}/rest/v1/topic_resources`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ topic_id, url, title, type: resourceType }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.message || 'Save failed' }, { status: 500 })
    const [resource] = Array.isArray(data) ? data : [data]
    return NextResponse.json({ resource })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
