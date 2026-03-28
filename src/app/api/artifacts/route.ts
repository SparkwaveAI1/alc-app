import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }

// Single-learner app — use a fixed learner UUID (Nayomi's profile id will replace this once onboarding done)
// For now use a stable placeholder UUID that satisfies the NOT NULL constraint
const LEARNER_ID = '00000000-0000-0000-0000-000000000001'

export async function GET() {
  const res = await fetch(`${SB}/rest/v1/artifacts?order=created_at.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } })
  const data = await res.json()
  return NextResponse.json(Array.isArray(data) ? data : [])
}

export async function POST(req: NextRequest) {
  const { title, description, artifact_type, type, topic_id } = await req.json()
  const res = await fetch(`${SB}/rest/v1/artifacts`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({
      learner_id: LEARNER_ID,
      title,
      description,
      artifact_type: artifact_type || type || 'other',
      topic_id: topic_id || null,
    }),
  })
  const [artifact] = await res.json()
  if (!artifact?.id) {
    const raw = await res.text().catch(() => 'unknown')
    return NextResponse.json({ error: 'Failed to save', detail: raw }, { status: 500 })
  }
  return NextResponse.json({ artifact })
}
