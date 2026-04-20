'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, string> = {
  Math: '#5BA4CF', Reading: '#7C5CBF', Writing: '#7C5CBF',
  Science: '#4CAF7C', History: '#F5A623', Geography: '#5BA4CF',
  Art: '#E8715A', Music: '#7C5CBF', default: '#7C5CBF',
}

export default function FlashcardsPage() {
  const [modules, setModules] = useState<any[]>([])
  const [cardsByModule, setCardsByModule] = useState<Record<string, any[]>>({})
  const [dueCount, setDueCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // Get all topics
        const topicsRes = await fetch(
          `${SB_URL}/rest/v1/topics?order=created_at.desc&select=id,title,slug,subject_tag`,
          { headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` } }
        ).then(r => r.json())

        // Get all non-archived flashcards
        const cardsRes = await fetch(
          `${SB_URL}/rest/v1/flashcards?archived=eq.false&order=created_at`,
          { headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` } }
        ).then(r => r.json())

        // Get due count
        const reviewRes = await fetch('/api/review-queue').then(r => r.json())
        setDueCount(reviewRes?.total_due || 0)

        if (Array.isArray(topicsRes) && Array.isArray(cardsRes)) {
          setModules(topicsRes)
          // Group cards by topic_id
          const grouped: Record<string, any[]> = {}
          for (const card of cardsRes) {
            if (!grouped[card.topic_id]) grouped[card.topic_id] = []
            grouped[card.topic_id].push(card)
          }
          setCardsByModule(grouped)
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [])

  const totalCards = Object.values(cardsByModule).flat().length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#7C5CBF' }}>Loading flashcards...</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
          My Flashcards 🗂️
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          {totalCards} card{totalCards !== 1 ? 's' : ''} across {modules.filter(m => cardsByModule[m.id]?.length > 0).length} modules
        </p>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Review all due cards */}
        {dueCount > 0 && (
          <Link href="/review" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', borderRadius: 18, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 20px rgba(124,92,191,0.25)' }}>
              <div style={{ fontSize: 32 }}>🃏</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
                  {dueCount} card{dueCount !== 1 ? 's' : ''} due for review
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Review all due cards now</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>→</div>
            </div>
          </Link>
        )}

        {/* Cards by module */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 12 }}>
          BY MODULE
        </div>

        {modules.filter(m => cardsByModule[m.id]?.length > 0).length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🃏</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 6 }}>No flashcards yet</div>
            <p style={{ fontSize: 14, color: '#6B6560', margin: '0 0 16px' }}>Create a module to get started</p>
            <Link href="/new-module" style={{ background: '#7C5CBF', color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              Create a module ✨
            </Link>
          </div>
        ) : (
          modules
            .filter(m => cardsByModule[m.id]?.length > 0)
            .map(m => {
              const cards = cardsByModule[m.id] || []
              const color = SUBJECT_COLORS[m.subject_tag] || SUBJECT_COLORS.default
              const isExpanded = expandedModule === m.id

              return (
                <div key={m.id} style={{ background: '#fff', borderRadius: 18, marginBottom: 10, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
                  {/* Module header — tap to expand */}
                  <div
                    onClick={() => setExpandedModule(isExpanded ? null : m.id)}
                    style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderLeft: `4px solid ${color}` }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.4px', marginBottom: 2 }}>
                        {m.subject_tag?.toUpperCase() || 'MODULE'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#2D2A26', fontSize: 15 }}>{m.title}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B6560', fontWeight: 600 }}>
                      {cards.length} card{cards.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ color: '#D1C8D8', fontSize: 16, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</div>
                  </div>

                  {/* Expanded card list */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #F3F0EB', padding: '12px 18px' }}>
                      {cards.map((card, i) => (
                        <div key={card.id} style={{ padding: '10px 0', borderBottom: i < cards.length - 1 ? '1px solid #F9F6F0' : 'none' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#2D2A26', marginBottom: 4 }}>{card.front}</div>
                          <div style={{ fontSize: 12, color: '#6B6560' }}>{card.back}</div>
                        </div>
                      ))}
                      <Link
                        href={`/topic/${m.slug}`}
                        style={{ display: 'block', textAlign: 'center', marginTop: 12, color, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}
                      >
                        Go to module →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })
        )}
      </div>

      <Nav active="me" />
    </div>
  )
}
