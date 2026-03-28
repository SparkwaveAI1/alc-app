'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Topic = { id: string; title: string; slug: string; subject_tag: string; created_at: string }

const SUBJECT_COLORS: Record<string, { bg: string; shadow: string }> = {
  History:      { bg: 'linear-gradient(135deg, #78350F 0%, #92400E 35%, #C2410C 70%, #EA580C 100%)', shadow: 'rgba(120,53,15,0.4)' },
  Geography:    { bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)', shadow: 'rgba(30,27,75,0.38)' },
  Science:      { bg: 'linear-gradient(135deg, #065F46 0%, #059669 55%, #10B981 100%)', shadow: 'rgba(6,95,70,0.32)' },
  Writing:      { bg: 'linear-gradient(135deg, #065F46 0%, #059669 55%, #10B981 100%)', shadow: 'rgba(6,95,70,0.32)' },
  Math:         { bg: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 55%, #3B82F6 100%)', shadow: 'rgba(29,78,216,0.38)' },
  Art:          { bg: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #D946EF 100%)', shadow: 'rgba(124,58,237,0.38)' },
  Culture:      { bg: 'linear-gradient(135deg, #B45309 0%, #D97706 55%, #F59E0B 100%)', shadow: 'rgba(180,83,9,0.35)' },
  'Life Skills':{ bg: 'linear-gradient(135deg, #0F766E 0%, #0D9488 55%, #14B8A6 100%)', shadow: 'rgba(15,118,110,0.35)' },
}

const SUBJECT_EMOJI: Record<string, string> = {
  History: '🏛️', Geography: '🌍', Science: '🔬', Writing: '✍️',
  Math: '🔢', Art: '🎨', Culture: '🌐', 'Life Skills': '🏠',
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [streak, setStreak] = useState(0)
  const [dueCards, setDueCards] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
    // Log today's activity (ensures streak counts this session)
    fetch('/api/streak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ modules_created: 0 }) })
  }, [])

  async function loadAll() {
    const now = new Date().toISOString()
    const h = { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Prefer': 'count=exact' }

    const [topicsRes, dueRes, streakRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/topics?order=created_at.desc&limit=3&select=id,title,slug,subject_tag,created_at`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?next_review=lte.${now}&select=id&limit=1`, { headers: h }),
      fetch('/api/streak'),
    ])

    const topicsData = await topicsRes.json()
    const dueCount = parseInt(dueRes.headers.get('content-range')?.split('/')[1] || '0')
    const streakData = await streakRes.json()

    setTopics(Array.isArray(topicsData) ? topicsData : [])
    setDueCards(dueCount)
    setStreak(streakData.streak || 0)
    setLoading(false)
  }

  // Determine card layout based on topics available
  const mainTopic = topics[0]
  const smallTopics = topics.slice(1, 3)

  // Fallback topics if none saved yet
  const fallbackMain = { slug: 'new', title: 'Start Exploring!', subject_tag: 'History' }
  const fallbackSmall = [
    { slug: 'new', title: 'Create a module', subject_tag: 'Writing' },
    { slug: 'new', title: 'Try a path', subject_tag: 'Math' },
  ]

  const displayMain = mainTopic || fallbackMain
  const displaySmall = smallTopics.length >= 2 ? smallTopics : fallbackSmall
  const mainColors = SUBJECT_COLORS[displayMain.subject_tag] || SUBJECT_COLORS['History']
  const targetHref = (slug: string) => slug === 'new' ? '/explore' : `/wiki/${slug}`

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 40%, #4F46E5 75%, #F97316 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 10, left: 20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(168,85,247,0.45)', filter: 'blur(45px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(249,115,22,0.5)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1.15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hi, Nayomi! 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, fontWeight: 400, margin: '5px 0 0' }}>
              {loading ? 'Loading your day...' : topics.length > 0 ? `${topics.length} module${topics.length !== 1 ? 's' : ''} in your wiki` : 'Ready to start exploring?'}
            </p>
          </div>
          <Link href="/me" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>⭐</div>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>Nayomi</span>
          </Link>
        </div>

        {/* Streak badge */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
          {streak > 0 ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#065F46', borderRadius: 999, padding: '10px 20px', boxShadow: '0 4px 14px rgba(6,95,70,0.5)' }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Day {streak} Streak — Keep it up!</span>
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,0.25)', borderRadius: 999, padding: '10px 20px' }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Start your learning streak today!</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '24px 16px 100px' }}>

        {/* Due cards alert */}
        {dueCards > 0 && (
          <Link href="/review" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: 18, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
              <span style={{ fontSize: 24 }}>🃏</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{dueCards} flashcard{dueCards !== 1 ? 's' : ''} ready to review!</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>Tap to start your review session</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }}>›</span>
            </div>
          </Link>
        )}

        {/* Adventures header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {topics.length > 0 ? 'Your Wiki ✨' : 'Start Exploring ✨'}
          </h2>
          <Link href="/explore" style={{ fontSize: 14, fontWeight: 600, color: '#7C3AED', textDecoration: 'none' }}>See all →</Link>
        </div>

        {/* Large card */}
        <Link href={targetHref(displayMain.slug)} style={{ textDecoration: 'none', display: 'block', marginBottom: 13 }}>
          <div style={{ borderRadius: 22, background: mainColors.bg, padding: '18px 18px 16px', position: 'relative', minHeight: 185, overflow: 'hidden', boxShadow: `0 8px 28px ${mainColors.shadow}` }}>
            <div style={{ position: 'absolute', bottom: 0, right: 14, width: 0, height: 0, borderLeft: '55px solid transparent', borderRight: '55px solid transparent', borderBottom: '76px solid rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 18, right: 22, fontSize: 28, pointerEvents: 'none' }}>{SUBJECT_EMOJI[displayMain.subject_tag] || '📚'}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '5px 12px', marginBottom: 10 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>{(displayMain.subject_tag || 'EXPLORE').toUpperCase()}</span>
            </div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 40, lineHeight: 1.25 }}>{displayMain.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '4px 12px' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{mainTopic ? 'Continue learning' : 'Create your first module'}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Two small cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 20 }}>
          {displaySmall.map((topic, i) => {
            const colors = SUBJECT_COLORS[topic.subject_tag] || (i === 0 ? SUBJECT_COLORS['Writing'] : SUBJECT_COLORS['Geography'])
            return (
              <Link key={topic.slug + i} href={targetHref(topic.slug)} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: 22, background: colors.bg, padding: '16px 14px', minHeight: 112, boxShadow: `0 6px 22px ${colors.shadow}` }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 9px', marginBottom: 8 }}>
                    <span style={{ fontSize: 12 }}>{SUBJECT_EMOJI[topic.subject_tag] || '📚'}</span>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>{(topic.subject_tag || 'EXPLORE').toUpperCase()}</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>{topic.title}</div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick log */}
        <Link href="/log" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, #F7D8FF, #ECC6F5)', borderRadius: 22, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(124,58,237,0.18)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4C1D95', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>I just learned something!</div>
              <div style={{ fontSize: 13, color: '#6D28D9', opacity: 0.8 }}>Tap to log a new discovery</div>
            </div>
            <span style={{ color: '#7C3AED', fontSize: 20 }}>›</span>
          </div>
        </Link>

        {/* Quick actions */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Actions 🚀</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '✨', label: 'New Module', sub: 'AI-powered', href: '/new-module', bg: 'linear-gradient(135deg, #7C3AED, #D946EF)' },
            { icon: '🗺️', label: 'My Paths', sub: 'Step by step', href: '/paths', bg: 'linear-gradient(135deg, #065F46, #10B981)' },
            { icon: '🃏', label: 'Review', sub: `${dueCards} due`, href: '/review', bg: dueCards > 0 ? 'linear-gradient(135deg, #DC2626, #F97316)' : 'linear-gradient(135deg, #6B7280, #9CA3AF)' },
            { icon: '🎨', label: 'Portfolio', sub: 'My creations', href: '/portfolio', bg: 'linear-gradient(135deg, #D946EF, #F97316)' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: item.bg, borderRadius: 20, padding: '16px 14px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
                <span style={{ fontSize: 26 }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Create Something */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Something 🧶</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: '📓', label: 'Journal', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#065F46', href: '/portfolio' },
            { icon: '🎨', label: 'Art',     bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#7C3AED', href: '/portfolio' },
            { icon: '📝', label: 'Notes',   bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#9A3412', href: '/portfolio' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: item.bg, borderRadius: 20, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: 26 }}>{item.icon}</span>
                <span style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Nav active="home" />
    </div>
  )
}
