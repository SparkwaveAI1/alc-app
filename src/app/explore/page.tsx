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

export default function ExplorePage() {
  const [areas, setAreas] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [saveLater, setSaveLater] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [aRes, tRes] = await Promise.all([
        fetch(`${SB_URL}/rest/v1/learning_areas?order=title`, {
          headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
        }).then(r => r.json()),
        fetch(`${SB_URL}/rest/v1/topics?order=created_at.desc`, {
          headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
        }).then(r => r.json()),
      ])
      setAreas(Array.isArray(aRes) ? aRes : [])
      setTopics(Array.isArray(tRes) ? tRes : [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = topics.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || '').toLowerCase().includes(search.toLowerCase())
    const matchArea = !selectedArea || t.learning_area_id === selectedArea
    return matchSearch && matchArea
  })

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF 0%, #9C7DD4 100%)', padding: '52px 20px 24px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: '0 0 14px', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Explore 🧭</h1>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search topics..."
          style={{ width: '100%', borderRadius: 12, border: 'none', padding: '12px 16px', fontSize: 15, background: 'rgba(255,255,255,0.95)', color: '#2D2A26', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Learning areas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9792', letterSpacing: '0.8px' }}>LEARNING AREAS</div>
          {selectedArea && <button onClick={() => setSelectedArea(null)} style={{ background: 'none', border: 'none', color: '#7C5CBF', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Show all</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {areas.map(a => (
            <button key={a.id} onClick={() => setSelectedArea(selectedArea === a.id ? null : a.id)} style={{
              background: selectedArea === a.id ? a.color : '#fff',
              borderRadius: 16, padding: '14px 8px', border: selectedArea === a.id ? `2px solid ${a.color}` : '2px solid transparent',
              cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 10px rgba(45,42,38,0.06)', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: selectedArea === a.id ? '#fff' : '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>{a.title}</div>
            </button>
          ))}
        </div>

        {/* Topics grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9792', letterSpacing: '0.8px' }}>
            {selectedArea ? areas.find(a => a.id === selectedArea)?.title?.toUpperCase() + ' TOPICS' : 'MY TOPICS'}
            {filtered.length > 0 && <span style={{ marginLeft: 6, color: '#C4BCC8' }}>({filtered.length})</span>}
          </div>
          <Link href="/new-module" style={{ background: '#7C5CBF', color: '#fff', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>+ New Module</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#9E9792' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 6 }}>No topics yet</div>
            <p style={{ fontSize: 14, color: '#6B6560', margin: '0 0 16px' }}>Create your first learning module to get started</p>
            <Link href="/new-module" style={{ background: '#7C5CBF', color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Create a module ✨</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(t => {
              const color = SUBJECT_COLORS[t.subject_tag] || SUBJECT_COLORS.default
              return (
                <Link key={t.id} href={`/topic/${t.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 12px rgba(45,42,38,0.06)', borderLeft: `4px solid ${color}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.5px', marginBottom: 3 }}>{t.subject_tag?.toUpperCase() || 'TOPIC'}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: 13, color: '#6B6560', marginTop: 2, lineHeight: 1.4 }}>{t.description}</div>}
                    </div>
                    <div style={{ color: '#D1C8D8', fontSize: 18 }}>›</div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Nav active="explore" />
    </div>
  )
}
