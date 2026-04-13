import { NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const h = (extra: Record<string, string> = {}) => ({
  'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra,
})

async function supaFetch(path: string) {
  const res = await fetch(`${SB}/rest/v1/${path}`, { headers: h() })
  return res.json()
}

export async function GET() {
  const learner = await getLearnerContext()
  if (!learner) {
    return NextResponse.json({ cards: [], error: 'No learner found' }, { status: 404 })
  }

  try {
    const learnerId = learner.id

    // Get cards due for review: next_review <= now AND not archived
    const now = new Date().toISOString()
    const dueCards = await supaFetch(
      `flashcard_review_state?learner_id=eq.${learnerId}&next_review=lte.${now}&archived=eq.false&select=*`
    )

    if (Array.isArray(dueCards) && dueCards.length > 0) {
      // Get full flashcard details for each due card
      const cardIds = dueCards.map((s: any) => s.flashcard_id)
      const flashcardPromises = cardIds.map((id: string) =>
        supaFetch(`flashcards?id=eq.${id}&select=*`)
      )
      const flashcardResults = await Promise.all(flashcardPromises)
      const cards = flashcardResults
        .flat()
        .filter(Boolean)
        .map((card: any) => ({
          ...card,
          review_state: dueCards.find((s: any) => s.flashcard_id === card.id),
        }))

      return NextResponse.json({ cards })
    }

    // No due cards — return cards without any review state (new cards first)
    const allCards = await supaFetch(
      `flashcards?select=*&order=created_at.desc&limit=20`
    )

    // Filter out cards that already have review state
    const reviewStates = await supaFetch(
      `flashcard_review_state?learner_id=eq.${learnerId}&select=flashcard_id`
    )
    const reviewedIds = new Set(
      Array.isArray(reviewStates)
        ? reviewStates.map((s: any) => s.flashcard_id)
        : []
    )

    const newCards = Array.isArray(allCards)
      ? allCards.filter((c: any) => !reviewedIds.has(c.id))
      : []

    return NextResponse.json({ cards: newCards })
  } catch (e) {
    console.error('review-queue error:', e)
    return NextResponse.json({ cards: [], error: String(e) }, { status: 500 })
  }
}
