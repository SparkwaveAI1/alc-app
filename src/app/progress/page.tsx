'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Stats = {
  totalModules: number
  totalCards: number
  dueCards: number
  totalNotes: number
  totalResources: number
  totalArtifacts: number
  recentTopics: Array<{ title: string; slug: string; subject_tag: string; created_at: string }>
}

export default function Progress() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const now = new Date().toISOString()
    const headers = { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Prefer': 'count=exact' }

    const [topics, cards, dueCards, notes, resources, artifacts] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/topics?select=id,title,slug,subject_tag,created_at&order=created_at.desc&limit=5`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?select=id&limit=1`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?next_review=lte.${now}&select=id&limit=1`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_notes?select=id&limit=1`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_resources?select=id&limit=1`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/artifacts?select=id&limit=1`, { headers }),
    ])

    const topicsData = await topics.json()
    const getCount = (res: Response) => parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

    setStats({
      totalModules: parseInt(topics.headers.get('content-range')?.split('/')[1] || '0'),
      totalCards: getCount(cards),
      dueCards: getCount(dueCards),
      totalNotes: getCount(notes),
      totalResources: getCount(resources),
      totalArtifacts: getCount(artifacts),
      recentTopics: Array.isArray(topicsData) ? topicsData : [],
    })
    setLoading(false)
  }

  const SUBJECT_BG: Record<string, string> = {
    History: 'linear-gradient(135deg, #78350F, #EA580C)',
    Geography: 'linear-gradient(135deg, #1E1B4B, #4338CA)',
    Science: 'linear-gradient(135deg, #065F46, #10B981)',
    Writing: 'linear-gradient(135deg, #065F46, #059669)',
    Math: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
    Art: 'linear-gradient(135deg, #7C3AED, #D946EF)',
    Culture: 'linear-gradient(135deg, #B45309, #F59E0B)',
    'Life Skills': 'linear-gradient(135deg, #0F766E, #14B8A6)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #DC2626 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(249,115,22,0.5)', filter: 'blur(30px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>My Progress ⭐</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>See how far you&apos;ve come</p>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading your progress...</div>}

        {stats && (
          <>
            {/* Flashcard review CTA */}
            <Link href="/review" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
              <div style={{
                background: stats.dueCards > 0
                  ? 'linear-gradient(135deg, #7C3AED, #D946EF)'
                  : 'linear-gradient(135deg, #065F46, #059669)',
                borderRadius: 22, padding: '20px', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: stats.dueCards > 0 ? '0 6px 22px rgba(124,58,237,0.4)' : '0 6px 22px rgba(6,95,70,0.35)',
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
                  {stats.dueCards > 0 ? '🃏' : '✅'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stats.dueCards > 0 ? `${stats.dueCards} card${stats.dueCards !== 1 ? 's' : ''} to review!` : 'All caught up!'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 3 }}>
                    {stats.dueCards > 0 ? 'Tap to start your flashcard session' : 'No cards due — check back later'}
                  </div>
                </div>
                {stats.dueCards > 0 && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24 }}>›</span>}
              </div>
            </Link>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { value: stats.totalModules, label: 'Modules', icon: '📚', bg: 'linear-gradient(135deg, #4F46E5, #7C3AED)' },
                { value: stats.totalCards, label: 'Flashcards', icon: '🃏', bg: 'linear-gradient(135deg, #065F46, #10B981)' },
                { value: stats.totalArtifacts, label: 'Creations', icon: '🎨', bg: 'linear-gradient(135deg, #7C3AED, #D946EF)' },
                { value: stats.totalNotes, label: 'Notes', icon: '📝', bg: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' },
                { value: stats.totalResources, label: 'Resources', icon: '🔗', bg: 'linear-gradient(135deg, #DC2626, #F97316)' },
                { value: stats.dueCards, label: 'Due Today', icon: '⏰', bg: stats.dueCards > 0 ? 'linear-gradient(135deg, #B45309, #F59E0B)' : 'linear-gradient(135deg, #6B7280, #9CA3AF)' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '16px 12px', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ color: '#fff', fontSize: 26, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent modules */}
            {stats.recentTopics.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recently Explored</div>
                  <Link href="/explore" style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>See all →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.recentTopics.map(t => (
                    <Link key={t.slug} href={`/wiki/${t.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#F9FAFB', borderRadius: 14 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: SUBJECT_BG[t.subject_tag] || SUBJECT_BG['History'], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#1C1917', fontSize: 14 }}>{t.title}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{t.subject_tag} · {new Date(t.created_at).toLocaleDateString()}</div>
                        </div>
                        <span style={{ color: '#D1D5DB', fontSize: 18 }}>›</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Standards tracker */}
            <Link href="/standards" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
              <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #4338CA)', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 22px rgba(29,78,216,0.3)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grade 4 Skills Tracker</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>Track progress against U.S. Common Core standards</div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 22 }}>›</span>
              </div>
            </Link>

            {/* Portfolio link */}
            <Link href="/portfolio" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: 'linear-gradient(135deg, #F7D8FF, #ECC6F5)', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 14px rgba(124,58,237,0.15)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #D946EF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🎨</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#4C1D95', fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Portfolio</div>
                  <div style={{ fontSize: 13, color: '#6D28D9', opacity: 0.8, marginTop: 2 }}>{stats.totalArtifacts} creation{stats.totalArtifacts !== 1 ? 's' : ''} saved</div>
                </div>
                <span style={{ color: '#7C3AED', fontSize: 20 }}>›</span>
              </div>
            </Link>
          </>
        )}
      </div>
      <Nav active="progress" />
    </div>
  )
}
