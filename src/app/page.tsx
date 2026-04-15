'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const SUBJECT_COLORS: Record<string, string> = {
  Math: '#5BA4CF', Reading: '#7C5CBF', Writing: '#7C5CBF',
  Science: '#4CAF7C', History: '#F5A623', Geography: '#5BA4CF',
  Art: '#E8715A', Music: '#7C5CBF', default: '#7C5CBF',
}

export default function TodayPage() {
  const [profile, setProfile] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [dueCount, setDueCount] = useState(0)
  const [challenge, setChallenge] = useState<any>(null)
  const [challengeAnswer, setChallengeAnswer] = useState('')
  const [challengeDone, setChallengeDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pRes, tRes, rRes, cRes] = await Promise.all([
          fetch('/api/profile').then(r => r.json()),
          fetch(`${SB_URL}/rest/v1/topics?order=created_at.desc&limit=3`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch('/api/review-queue').then(r => r.json()),
          fetch('/api/daily-challenge').then(r => r.json()),
        ])
        setProfile(pRes)
        setTopics(Array.isArray(tRes) ? tRes : [])
        setDueCount(Array.isArray(rRes?.cards) ? rRes.cards.length : 0)
        if (cRes?.id) {
          setChallenge(cRes)
          setChallengeDone(cRes.completed || false)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleChallengeSubmit = async () => {
    if (!challengeAnswer.trim() || !challenge?.id) return
    try {
      await fetch('/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: challenge.id, answer: challengeAnswer }),
      })
      setChallengeDone(true)
    } catch {}
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EDE8F9 0%, #FDFBF7 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 48 }}>✨</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#7C5CBF', fontFamily: "'Nunito', sans-serif" }}>Loading your day...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EDE8F9 0%, #FDFBF7 55%)', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 14, color: '#6B6560', fontWeight: 500 }}>{greeting()},</p>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", lineHeight: 1.2 }}>
              {profile?.display_name || 'Nayomi'} ✨
            </h1>
          </div>
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 14, padding: '8px 14px', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 22 }}>🔥</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#E8715A', fontFamily: "'Nunito', sans-serif" }}>{profile?.streak_days || 0}</div>
            <div style={{ fontSize: 10, color: '#6B6560', fontWeight: 500 }}>day streak</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* Review queue card */}
        {dueCount > 0 && (
          <Link href="/review" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', borderRadius: 20, padding: '18px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 20px rgba(124,92,191,0.25)' }}>
              <div style={{ fontSize: 36 }}>🃏</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>{dueCount} cards due for review</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Keep your memory sharp!</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }}>→</div>
            </div>
          </Link>
        )}

        {/* Daily challenge */}
        {challenge && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px 20px', marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '0.8px', marginBottom: 8 }}>💡 TODAY'S CHALLENGE</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: '#2D2A26', lineHeight: 1.5, fontStyle: 'italic' }}>{challenge.question}</p>
            {challengeDone ? (
              <div style={{ background: '#E8F5EF', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#4CAF7C', fontWeight: 600 }}>✅ Challenge complete!</div>
            ) : (
              <div>
                <textarea
                  value={challengeAnswer}
                  onChange={e => setChallengeAnswer(e.target.value)}
                  placeholder="What do you think? Any answer is a good answer..."
                  style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px', fontSize: 13, background: '#FFF7ED', color: '#2D2A26', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', minHeight: 70, resize: 'none' }}
                />
                <button onClick={handleChallengeSubmit} disabled={!challengeAnswer.trim()} style={{ marginTop: 8, width: '100%', background: challengeAnswer.trim() ? '#F5A623' : '#E5E7EB', color: challengeAnswer.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 10, padding: '8px', fontWeight: 700, fontSize: 13, cursor: challengeAnswer.trim() ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif" }}>
                  Submit ✨
                </button>
              </div>
            )}
          </div>
        )}

        {/* I Found Something */}
        <Link href="/found" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #E8715A, #F5A623)',
            borderRadius: 20, padding: '18px 20px', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 4px 20px rgba(232,113,90,0.25)',
          }}>
            <div style={{ fontSize: 36 }}>📸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
                I Found Something
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                Show Aria what caught your eye
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }}>→</div>
          </div>
        </Link>

        {/* Today section */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 12, marginTop: 4 }}>EXPLORE TODAY</div>

        {topics.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(45,42,38,0.06)', marginBottom: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 6 }}>Start your learning journey</div>
            <p style={{ fontSize: 14, color: '#6B6560', margin: '0 0 16px' }}>Create your first learning module to get started</p>
            <Link href="/new-module" style={{ background: '#7C5CBF', color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Create a module ✨</Link>
          </div>
        ) : (
          topics.map(t => {
            const color = SUBJECT_COLORS[t.subject_tag] || SUBJECT_COLORS.default
            return (
              <Link key={t.id} href={`/topic/${t.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', borderLeft: `4px solid ${color}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.4px', marginBottom: 3 }}>{t.subject_tag?.toUpperCase() || 'TOPIC'}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>{t.title}</div>
                    {t.description && <div style={{ fontSize: 13, color: '#6B6560', marginTop: 2, lineHeight: 1.4 }}>{t.description}</div>}
                  </div>
                  <div style={{ color: '#D1C8D8', fontSize: 18 }}>›</div>
                </div>
              </Link>
            )
          })
        )}

        {/* Quick actions */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 12, marginTop: 8 }}>QUICK ACTIONS</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: '🧭', label: 'Explore', href: '/explore', color: '#EDE8F9', text: '#7C5CBF' },
            { icon: '✏️', label: 'Create', href: '/create', color: '#FAEADE', text: '#E8715A' },
            { icon: '📝', label: 'Log', href: '/log', color: '#E8F5EF', text: '#4CAF7C' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ flex: 1, textDecoration: 'none' }}>
              <div style={{ background: a.color, borderRadius: 16, padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.text, fontFamily: "'Nunito', sans-serif" }}>{a.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore all */}
        <Link href="/explore" style={{ display: 'block', marginTop: 14, textAlign: 'center', color: '#7C5CBF', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          See all topics →
        </Link>
      </div>

      <Nav active="today" />
    </div>
  )
}
