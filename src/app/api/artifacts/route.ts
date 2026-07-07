import { NextRequest, NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

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
    const { title, content, description, artifact_type, type } = await req.json()
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
    const learner = await getLearnerContext()
    if (!learner) return NextResponse.json({ error: 'No learner found' }, { status: 404 })
    // Live artifacts table: learner_id (required), title, description,
    // artifact_type, storage_path — no content or topic_id columns.
    const res = await fetch(`${SB}/rest/v1/artifacts`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({
        learner_id: learner.id,
        title,
        description: description || content || null,
        artifact_type: artifact_type || type || 'text',
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
