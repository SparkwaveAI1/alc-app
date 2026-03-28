'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Topic = { id: string; title: string; slug: string; subject_tag: string; created_at: string; overview: string }
type Artifact = { id: string; title: string; type: string; created_at: string }
type Card = { id: string; review_count: number; interval_days: number; next_review: string }

type DashStats = {
  topics: Topic[]
  artifacts: Artifact[]
  cards: Card[]
  notesCount: number
  resourcesCount: number
}

const SUBJECT_COLORS: Record<string, { bg: string; light: string; text: string }> = {
  History:     { bg: '#78350F', light: '#FEF3C7', text: '#92400E' },
  Geography:   { bg: '#1E1B4B', light: '#EDE9FE', text: '#4338CA' },
  Science:     { bg: '#065F46', light: '#D1FAE5', text: '#065F46' },
  Writing:     { bg: '#065F46', light: '#D1FAE5', text: '#065F46' },
  Math:        { bg: '#1D4ED8', light: '#DBEAFE', text: '#1D4ED8' },
  Art:         { bg: '#7C3AED', light: '#EDE9FE', text: '#7C3AED' },
  Culture:     { bg: '#B45309', light: '#FEF3C7', text: '#B45309' },
  'Life Skills':{ bg: '#0F766E', light: '#CCFBF1', text: '#0F766E' },
}

export default function ParentDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'overview' | 'subjects' | 'activity' | 'gaps'>('overview')

  useEffect(() => { load() }, [])

  async function load() {
    const h = { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Prefer': 'count=exact' }
    const [topicsRes, artifactsRes, cardsRes, notesRes, resourcesRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/topics?order=created_at.desc&select=id,title,slug,subject_tag,created_at,overview`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/artifacts?order=created_at.desc&limit=20&select=id,title,type,created_at`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?select=id,review_count,interval_days,next_review`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_notes?select=id&limit=1`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_resources?select=id&limit=1`, { headers: h }),
    ])
    const [topics, artifacts, cards] = await Promise.all([topicsRes.json(), artifactsRes.json(), cardsRes.json()])
    const notesCount = parseInt(notesRes.headers.get('content-range')?.split('/')[1] || '0')
    const resourcesCount = parseInt(resourcesRes.headers.get('content-range')?.split('/')[1] || '0')
    setStats({
      topics: Array.isArray(topics) ? topics : [],
      artifacts: Array.isArray(artifacts) ? artifacts : [],
      cards: Array.isArray(cards) ? cards : [],
      notesCount,
      resourcesCount,
    })
    setLoading(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 40 }}>📊</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading dashboard...</div>
    </div>
  )

  const s = stats!
  const now = new Date()
  const dueCards = s.cards.filter(c => new Date(c.next_review) <= now)
  const masteredCards = s.cards.filter(c => c.interval_days >= 14)
  const reviewedCards = s.cards.filter(c => c.review_count > 0)

  // Subject breakdown
  const subjectMap: Record<string, number> = {}
  s.topics.forEach(t => { subjectMap[t.subject_tag] = (subjectMap[t.subject_tag] || 0) + 1 })
  const subjects = Object.entries(subjectMap).sort((a, b) => b[1] - a[1])

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recentTopics = s.topics.filter(t => new Date(t.created_at) >= sevenDaysAgo)
  const recentArtifacts = s.artifacts.filter(a => new Date(a.created_at) >= sevenDaysAgo)

  // Gaps — subjects with 0 modules in last 30 days
  const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const activeSubjects = new Set(s.topics.filter(t => new Date(t.created_at) >= thirtyAgo).map(t => t.subject_tag))
  const allSubjects = ['Math', 'Science', 'Writing', 'History', 'Geography', 'Art', 'Life Skills']
  const gaps = allSubjects.filter(sub => !activeSubjects.has(sub))

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'subjects', label: 'Subjects', icon: '📚' },
    { key: 'activity', label: 'Activity', icon: '🗓️' },
    { key: 'gaps', label: 'Gaps', icon: '🔍' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)', padding: '40px 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(99,102,241,0.5)', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, marginBottom: 6 }}>
          <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>← App</Link>
          <Link href="/standards" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '3px 10px', fontWeight: 600 }}>📊 Skills Tracker</Link>
        </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '5px 12px', color: '#fff', fontSize: 12, fontWeight: 600 }}>Parent View</div>
        </div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '8px 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nayomi&apos;s Learning Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>4th Grade · Advanced Reader · {s.topics.length} modules explored</p>

        {/* Quick health indicators */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Modules', value: s.topics.length, good: s.topics.length > 0 },
            { label: 'Cards Due', value: dueCards.length, good: dueCards.length === 0 },
            { label: 'This Week', value: recentTopics.length, good: recentTopics.length > 0 },
            { label: 'Creations', value: s.artifacts.length, good: s.artifacts.length > 0 },
          ].map(item => (
            <div key={item.label} style={{ background: item.good ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)', borderRadius: 12, padding: '7px 14px', border: `1px solid ${item.good ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>{item.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #E2E8F0', gap: 0 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key as typeof activeSection)} style={{
            flex: 1, padding: '14px 6px', border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            borderBottom: activeSection === tab.key ? '3px solid #4F46E5' : '3px solid transparent',
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: activeSection === tab.key ? '#4F46E5' : '#94A3B8' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px 40px' }}>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Retention health */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🧠 Retention Health</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { value: s.cards.length, label: 'Total Cards', color: '#4F46E5', bg: '#EDE9FE' },
                  { value: reviewedCards.length, label: 'Reviewed', color: '#059669', bg: '#D1FAE5' },
                  { value: masteredCards.length, label: 'Mastered', color: '#D97706', bg: '#FEF3C7' },
                ].map(m => (
                  <div key={m.label} style={{ background: m.bg, borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                    <div style={{ color: m.color, fontSize: 24, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</div>
                    <div style={{ color: m.color, fontSize: 10, fontWeight: 600, marginTop: 3, opacity: 0.85 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              {dueCards.length > 0 && (
                <div style={{ marginTop: 12, background: '#FEF2F2', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>⏰</span>
                  <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{dueCards.length} flashcard{dueCards.length !== 1 ? 's' : ''} overdue for review</span>
                </div>
              )}
            </div>

            {/* Activity summary */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📅 Last 7 Days</div>
              {recentTopics.length === 0 && recentArtifacts.length === 0 ? (
                <div style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>No activity in the last 7 days</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentTopics.map(t => (
                    <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: SUBJECT_COLORS[t.subject_tag]?.bg || '#6B7280', flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 14, color: '#374151' }}>Created module: <strong>{t.title}</strong></div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {recentArtifacts.map(a => (
                    <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 14, color: '#374151' }}>Created: <strong>{a.title}</strong> ({a.type})</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{new Date(a.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning totals */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📈 All-Time Totals</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Learning modules', value: s.topics.length, icon: '📚' },
                  { label: 'Flashcard notes', value: s.cards.length, icon: '🃏' },
                  { label: 'Portfolio creations', value: s.artifacts.length, icon: '🎨' },
                  { label: 'Personal notes', value: s.notesCount, icon: '📝' },
                  { label: 'Saved resources', value: s.resourcesCount, icon: '🔗' },
                  { label: 'Subjects explored', value: subjects.length, icon: '🌍' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 12 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.value}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {activeSection === 'subjects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {subjects.length === 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '32px', textAlign: 'center', color: '#94A3B8' }}>No modules yet</div>
            )}
            {subjects.map(([subject, count]) => {
              const sc = SUBJECT_COLORS[subject] || { bg: '#6B7280', light: '#F1F5F9', text: '#374151' }
              const subTopics = s.topics.filter(t => t.subject_tag === subject)
              return (
                <div key={subject} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ background: `linear-gradient(135deg, ${sc.bg}, ${sc.bg}cc)`, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subject}</div>
                    <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '4px 12px', color: '#fff', fontWeight: 700, fontSize: 14 }}>{count} module{count !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ padding: '14px 18px' }}>
                    {subTopics.map(t => (
                      <div key={t.id} style={{ fontSize: 13, color: '#374151', padding: '6px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 500 }}>{t.title}</span>
                        <span style={{ color: '#94A3B8' }}>{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ACTIVITY */}
        {activeSection === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>All Modules (newest first)</div>
              {s.topics.length === 0 ? (
                <div style={{ color: '#94A3B8', textAlign: 'center', padding: 20 }}>No modules created yet</div>
              ) : (
                s.topics.map(t => {
                  const sc = SUBJECT_COLORS[t.subject_tag] || { bg: '#6B7280', light: '#F1F5F9', text: '#374151' }
                  return (
                    <div key={t.id} style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: sc.bg, marginTop: 4, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{t.title}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <span style={{ background: sc.light, color: sc.text, fontSize: 10, fontWeight: 600, borderRadius: 6, padding: '2px 8px' }}>{t.subject_tag}</span>
                          <span style={{ color: '#94A3B8', fontSize: 11 }}>{new Date(t.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {s.artifacts.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Portfolio Creations</div>
                {s.artifacts.map(a => (
                  <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, color: '#1E293B', fontWeight: 500 }}>{a.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: 10, fontWeight: 600, borderRadius: 6, padding: '2px 8px' }}>{a.type}</span>
                      <span style={{ color: '#94A3B8', fontSize: 11 }}>{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GAPS */}
        {activeSection === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FEF2F2', borderRadius: 16, padding: '14px 18px', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#991B1B' }}>🔍 Subjects with no activity in 30 days</div>
            </div>
            {gaps.length === 0 ? (
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: '20px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, color: '#065F46', fontSize: 15 }}>All subjects active!</div>
                <div style={{ color: '#059669', fontSize: 13, marginTop: 4 }}>Nayomi has explored every subject area in the last 30 days</div>
              </div>
            ) : (
              gaps.map(subject => {
                const sc = SUBJECT_COLORS[subject] || { bg: '#6B7280', light: '#F1F5F9', text: '#374151' }
                return (
                  <div key={subject} style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: sc.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: sc.bg }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subject}</div>
                      <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Not explored in 30+ days</div>
                    </div>
                    <Link href="/new-module" style={{ textDecoration: 'none', background: `${sc.bg}`, borderRadius: 10, padding: '7px 14px', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      + Add module
                    </Link>
                  </div>
                )
              })
            )}

            {/* Math flag */}
            {!activeSubjects.has('Math') && (
              <div style={{ background: '#FEF3C7', borderRadius: 16, padding: '16px 18px', border: '1px solid #FDE68A' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14 }}>Math needs attention</div>
                    <div style={{ color: '#B45309', fontSize: 13, marginTop: 4 }}>Math is a priority subject for grade-level readiness. Nayomi hasn&apos;t explored any math modules recently. Consider adding one this week.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
