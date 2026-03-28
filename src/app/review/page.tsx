'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Card = {
  id: string
  front: string
  back: string
  topic_id: string
  topic_title?: string
  interval_days: number
  ease_factor: number
  review_count: number
  next_review: string
}

type ReviewResult = 'easy' | 'good' | 'hard' | 'missed'

// SM-2 spaced repetition algorithm
function nextInterval(card: Card, result: ReviewResult): { interval: number; ease: number } {
  let ease = card.ease_factor
  let interval = card.interval_days

  if (result === 'missed') {
    interval = 1
    ease = Math.max(1.3, ease - 0.2)
  } else if (result === 'hard') {
    interval = Math.max(1, Math.ceil(interval * 1.2))
    ease = Math.max(1.3, ease - 0.15)
  } else if (result === 'good') {
    interval = card.review_count === 0 ? 1 : Math.ceil(interval * ease)
    ease = ease
  } else { // easy
    interval = card.review_count === 0 ? 3 : Math.ceil(interval * ease * 1.3)
    ease = Math.min(3.0, ease + 0.15)
  }

  return { interval, ease }
}

export default function Review() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState<ReviewResult[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => { loadDueCards() }, [])

  async function loadDueCards() {
    const now = new Date().toISOString()
    // Get all cards due for review (next_review <= now), join with topics for title
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/topic_flashcards?or=(next_review.is.null,next_review.lte.${now})&order=next_review.asc.nullsfirst&limit=20&select=*,topics(title)`,
      { headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
    )
    const data = await res.json()
    const mapped = (Array.isArray(data) ? data : []).map((c: Card & { topics?: { title: string } }) => ({
      ...c,
      topic_title: c.topics?.title || 'Unknown topic',
    }))
    setCards(mapped)
    setLoading(false)
  }

  async function recordResult(result: ReviewResult) {
    const card = cards[current]
    const { interval, ease } = nextInterval(card, result)
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + interval)

    // Update card in Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?id=eq.${card.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON!,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        next_review: nextDate.toISOString(),
        interval_days: interval,
        ease_factor: ease,
        review_count: card.review_count + 1,
      }),
    })

    setSession(prev => [...prev, result])
    setFlipped(false)

    if (current + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrent(prev => prev + 1)
    }
  }

  // Stats for done screen
  const easy = session.filter(r => r === 'easy').length
  const good = session.filter(r => r === 'good').length
  const hard = session.filter(r => r === 'hard').length
  const missed = session.filter(r => r === 'missed').length

  const resultColors: Record<ReviewResult, string> = {
    easy: '#065F46',
    good: '#1D4ED8',
    hard: '#B45309',
    missed: '#DC2626',
  }

  const resultBgs: Record<ReviewResult, string> = {
    easy: 'linear-gradient(135deg, #065F46, #10B981)',
    good: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
    hard: 'linear-gradient(135deg, #B45309, #F59E0B)',
    missed: 'linear-gradient(135deg, #DC2626, #EF4444)',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🃏</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading your cards...</div>
    </div>
  )

  // DONE SCREEN
  if (done || (cards.length === 0 && !loading)) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {cards.length === 0 ? '🎉 All caught up!' : '🏆 Session Complete!'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0' }}>
          {cards.length === 0 ? 'No cards due for review right now' : `You reviewed ${cards.length} card${cards.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div style={{ padding: '28px 16px 100px' }}>
        {cards.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 22, padding: '24px', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Session Results</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([['easy', '😎', easy], ['good', '👍', good], ['hard', '😅', hard], ['missed', '😬', missed]] as [ReviewResult, string, number][]).map(([key, emoji, count]) => (
                <div key={key} style={{ background: resultBgs[key], borderRadius: 16, padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>{emoji}</div>
                  <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{count}</div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔁</div>
          <div style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>
            {missed + hard > 0
              ? `${missed + hard} card${missed + hard !== 1 ? 's' : ''} will come back sooner for more practice.`
              : 'All cards scheduled for future review based on how well you knew them!'}
          </div>
        </div>

        <Link href="/explore" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: 999, padding: '16px', textAlign: 'center', color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 6px 22px rgba(124,58,237,0.35)' }}>
            Back to My Modules
          </div>
        </Link>
      </div>
      <Nav active="progress" />
    </div>
  )

  const card = cards[current]
  const progress = ((current) / cards.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: '0 0 28px 28px', padding: '52px 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(217,70,239,0.4)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, marginBottom: 16 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>✕ End session</Link>
          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '6px 14px', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            {current + 1} / {cards.length}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, height: 6, position: 'relative', zIndex: 1 }}>
          <div style={{ background: '#fff', borderRadius: 999, height: 6, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        {card.topic_title && (
          <div style={{ marginTop: 10, position: 'relative', zIndex: 1 }}>
            <span style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '4px 12px', color: '#fff', fontSize: 11, fontWeight: 700 }}>{card.topic_title}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '28px 16px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* CARD */}
        <div
          onClick={() => !flipped && setFlipped(true)}
          style={{
            width: '100%', maxWidth: 420,
            minHeight: 220,
            borderRadius: 28,
            background: flipped
              ? 'linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)'
              : '#fff',
            boxShadow: flipped
              ? '0 12px 40px rgba(124,58,237,0.45)'
              : '0 8px 28px rgba(0,0,0,0.1)',
            padding: '32px 28px',
            cursor: flipped ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            transition: 'all 0.35s ease',
            marginBottom: 24,
          }}
        >
          {!flipped ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 12, letterSpacing: '0.8px' }}>TAP TO REVEAL ANSWER</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.front}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, letterSpacing: '0.8px' }}>ANSWER</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.back}</div>
            </>
          )}
        </div>

        {/* RATING BUTTONS — only show after flip */}
        {flipped ? (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textAlign: 'center', marginBottom: 16 }}>How well did you know that?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([
                { key: 'missed' as ReviewResult, emoji: '😬', label: 'Missed it', sub: 'See again soon' },
                { key: 'hard' as ReviewResult, emoji: '😅', label: 'Hard', sub: 'Review in 1-2 days' },
                { key: 'good' as ReviewResult, emoji: '👍', label: 'Got it', sub: 'Review later' },
                { key: 'easy' as ReviewResult, emoji: '😎', label: 'Easy!', sub: 'Long interval' },
              ]).map(btn => (
                <button key={btn.key} onClick={() => recordResult(btn.key)} style={{
                  background: resultBgs[btn.key],
                  borderRadius: 20, padding: '16px 12px', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  boxShadow: `0 4px 14px ${resultColors[btn.key]}44`,
                }}>
                  <span style={{ fontSize: 26 }}>{btn.emoji}</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{btn.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>{btn.sub}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center' }}>
            Think about it first, then tap the card
          </div>
        )}
      </div>
      <Nav active="progress" />
    </div>
  )
}
