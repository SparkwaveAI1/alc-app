'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

export default function ReviewPage() {
  const [cards, setCards] = useState<any[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/review-queue')
        const data = await res.json()
        setCards(Array.isArray(data?.cards) ? data.cards : [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const card = cards[currentCard]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EDE8F9, #FDFBF7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🃏</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#7C5CBF' }}>Loading cards...</div>
      </div>
    </div>
  )

  if (cards.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EDE8F9, #FDFBF7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", flexDirection: 'column', gap: 20, padding: '40px 20px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>All caught up!</div>
        <p style={{ fontSize: 16, color: '#6B6560', margin: 0 }}>No cards due for review right now.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EDE8F9, #FDFBF7)', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Review Cards 🃏</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Card {currentCard + 1} of {cards.length}</p>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div style={{ perspective: '1000px', marginBottom: 16 }}>
          <div style={{
            position: 'relative', minHeight: 240,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* Front */}
            <div onClick={() => setFlipped(!flipped)} style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: '#fff', borderRadius: 24, padding: '32px 24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 24px rgba(45,42,38,0.12)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6560', letterSpacing: '1px', marginBottom: 18 }}>QUESTION</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2D2A26', lineHeight: 1.5 }}>{card?.front}</div>
              <div style={{ marginTop: 24, fontSize: 32 }}>👆</div>
            </div>
            {/* Back */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              background: '#7C5CBF', borderRadius: 24, padding: '32px 24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,92,191,0.2)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 18 }}>ANSWER</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>{card?.back}</div>
            </div>
          </div>
        </div>

        {flipped && (
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: '✗ Forgot', color: '#E05555' },
              { label: '😤 Hard', color: '#F5A623' },
              { label: '✓ Got it', color: '#4CAF7C' },
            ].map(b => (
              <button key={b.label} onClick={() => {
                setCurrentCard(Math.min(cards.length - 1, currentCard + 1))
                setFlipped(false)
              }} style={{
                flex: 1, background: b.color, color: '#fff', border: 'none', borderRadius: 14,
                padding: '12px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                {b.label}
              </button>
            ))}
          </div>
        )}

        {!flipped && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: 14, color: '#6B6560' }}>Flip the card to reveal the answer</div>
          </div>
        )}
      </div>

      <Nav active="me" />
    </div>
  )
}
