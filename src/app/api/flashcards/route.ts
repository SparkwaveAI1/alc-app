import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const h = (extra: Record<string, string> = {}) => ({
  'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra,
})

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topic_id')
  const path = topicId
    ? `flashcards?topic_id=eq.${topicId}&order=created_at`
    : `flashcards?order=created_at`
  const res = await fetch(`${SB}/rest/v1/${path}`, { headers: h() })
  const cards = await res.json()
  return NextResponse.json(Array.isArray(cards) ? cards : [])
}

export async function POST(req: NextRequest) {
  const { topic_id, front, back, card_type = 'fact' } = await req.json()
  if (!topic_id || !front || !back) {
    return NextResponse.json({ error: 'topic_id, front, and back required' }, { status: 400 })
  }
  const res = await fetch(`${SB}/rest/v1/flashcards`, {
    method: 'POST',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify({ topic_id, front, back, card_type }),
  })
  const [card] = await res.json()
  return NextResponse.json({ card })
}

export async function PATCH(req: NextRequest) {
  /**
   * Record review result.
   * knew_it = true → card is learned; mark archived=true (out of rotation)
   * knew_it = false → card comes back in 10 minutes
   */
  const { flashcard_id, user_id, knew_it } = await req.json()
  if (!flashcard_id || !user_id) {
    return NextResponse.json({ error: 'flashcard_id and user_id required' }, { status: 400 })
  }

  const CONSECUTIVE_TO_ARCHIVE = 2  // 2 correct in a row = learned

  try {
    // Get current state if exists
    const existing = await fetch(
      `${SB}/rest/v1/flashcard_review_state?flashcard_id=eq.${flashcard_id}&learner_id=eq.${user_id}&select=*`,
      { headers: h() }
    ).then(r => r.json())

    const state = Array.isArray(existing) && existing[0] ? existing[0] : null

    if (knew_it) {
      const newConsecutive = (state?.consecutive_correct || 0) + 1
      const archived = newConsecutive >= CONSECUTIVE_TO_ARCHIVE
      const nextReview = archived
        ? null  // no more reviews needed
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()  // 3 days

      await fetch(`${SB}/rest/v1/flashcard_review_state`, {
        method: 'POST',
        headers: h({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({
          flashcard_id,
          learner_id: user_id,
          next_review: nextReview || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          review_count: (state?.review_count || 0) + 1,
          consecutive_correct: newConsecutive,
          archived,
          updated_at: new Date().toISOString(),
        }),
      })

      return NextResponse.json({
        ok: true,
        archived,
        consecutive_correct: newConsecutive,
        message: archived ? 'Card mastered! 🎉' : `Keep going — ${CONSECUTIVE_TO_ARCHIVE - newConsecutive} more to master`,
      })
    } else {
      // Try again: come back in 10 minutes, reset streak
      const nextReview = new Date(Date.now() + 10 * 60 * 1000).toISOString()

      await fetch(`${SB}/rest/v1/flashcard_review_state`, {
        method: 'POST',
        headers: h({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({
          flashcard_id,
          learner_id: user_id,
          next_review: nextReview,
          review_count: (state?.review_count || 0) + 1,
          consecutive_correct: 0,
          archived: false,
          updated_at: new Date().toISOString(),
        }),
      })

      return NextResponse.json({
        ok: true,
        archived: false,
        consecutive_correct: 0,
        next_review: nextReview,
        message: "No worries — it'll come back soon! 💪",
      })
    }
  } catch (e) {
    console.error('flashcard PATCH error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await fetch(`${SB}/rest/v1/flashcards?id=eq.${id}`, {
    method: 'DELETE',
    headers: h(),
  })
  return NextResponse.json({ ok: true })
}
