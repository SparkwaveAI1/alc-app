import { NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET /api/parent-stats — aggregate stats for the parent dashboard
export async function GET() {
  const learner = await getLearnerContext()
  if (!learner) {
    return NextResponse.json({ error: 'No learner found' }, { status: 404 })
  }

  // "Locked in" = cards the learner has mastered (archived by the review loop)
  const res = await fetch(
    `${SB}/rest/v1/flashcard_review_state?learner_id=eq.${learner.id}&archived=eq.true&select=id`,
    {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    }
  )
  const contentRange = res.headers.get('content-range')
  const lockedIn = contentRange ? parseInt(contentRange.split('/')[1], 10) || 0 : 0

  return NextResponse.json({ locked_in: lockedIn })
}
