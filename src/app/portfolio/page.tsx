'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Artifact = {
  id: string
  title: string
  description: string
  type: string
  content: string
  topic_id: string | null
  topic_title?: string
  created_at: string
}

const TYPE_ICONS: Record<string, string> = {
  writing: '✍️', drawing: '🎨', note: '📝', video: '🎬',
  photo: '📸', project: '🔧', other: '⭐',
}

const TYPE_COLORS: Record<string, string> = {
  writing: 'linear-gradient(135deg, #065F46, #059669)',
  drawing: 'linear-gradient(135deg, #7C3AED, #D946EF)',
  note: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  video: 'linear-gradient(135deg, #DC2626, #EF4444)',
  photo: 'linear-gradient(135deg, #B45309, #F59E0B)',
  project: 'linear-gradient(135deg, #78350F, #EA580C)',
  other: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
}

export default function Portfolio() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', type: 'writing', content: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadArtifacts() }, [])

  async function loadArtifacts() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/artifacts?order=created_at.desc&select=*,topics(title)`,
      { headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
    )
    const data = await res.json()
    const mapped = (Array.isArray(data) ? data : []).map((a: Artifact & { topics?: { title: string } }) => ({
      ...a, topic_title: a.topics?.title,
    }))
    setArtifacts(mapped)
    setLoading(false)
  }

  async function saveArtifact() {
    if (!form.title.trim()) return
    setSaving(true)
    const res = await fetch('/api/artifacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.artifact) {
      setArtifacts(prev => [data.artifact, ...prev])
      setForm({ title: '', description: '', type: 'writing', content: '' })
      setAdding(false)
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #D946EF 60%, #F97316 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(249,115,22,0.4)', filter: 'blur(30px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>My Portfolio 🎨</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Everything I&apos;ve made and created</p>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {/* Add creation CTA */}
        {!adding ? (
          <button onClick={() => setAdding(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: 22, padding: '20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, border: 'none', cursor: 'pointer', boxShadow: '0 6px 22px rgba(124,58,237,0.35)', textAlign: 'left' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>➕</div>
            <div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add a Creation</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 3 }}>Writing, drawing, project, video, or anything you made</div>
            </div>
          </button>
        ) : (
          <div style={{ background: '#fff', borderRadius: 22, padding: '24px', marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add a Creation ✨</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What did you make?" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 15, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(TYPE_ICONS).map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{
                    borderRadius: 999, padding: '7px 14px', border: 'none', cursor: 'pointer',
                    background: form.type === t ? TYPE_COLORS[t] : '#F3F4F6',
                    color: form.type === t ? '#fff' : '#374151',
                    fontWeight: 600, fontSize: 13,
                  }}>
                    {TYPE_ICONS[t]} {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Description</label>
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell me about what you made..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 15, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Content (optional) — paste text, link, or describe it</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Paste your writing, a link to your artwork, or describe what you created..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, background: '#FFF7ED', color: '#1C1917', outline: 'none', resize: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveArtifact} disabled={!form.title.trim() || saving} style={{ flex: 1, background: 'linear-gradient(135deg, #065F46, #059669)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {saving ? 'Saving...' : '💾 Save to Portfolio'}
              </button>
              <button onClick={() => setAdding(false)} style={{ background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: 14, padding: '13px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading portfolio...</div>}

        {!loading && artifacts.length === 0 && !adding && (
          <div style={{ background: '#fff', borderRadius: 22, padding: '32px', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Portfolio is empty</div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>Save your first creation above!</div>
          </div>
        )}

        {artifacts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {artifacts.map(a => (
              <div key={a.id} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
                <div style={{ background: TYPE_COLORS[a.type] || TYPE_COLORS.other, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{TYPE_ICONS[a.type] || '⭐'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</div>
                    {a.topic_title && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>Related to: {a.topic_title}</div>}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{new Date(a.created_at).toLocaleDateString()}</div>
                </div>
                {(a.description || a.content) && (
                  <div style={{ padding: '14px 18px' }}>
                    {a.description && <div style={{ fontSize: 14, color: '#374151', marginBottom: a.content ? 8 : 0 }}>{a.description}</div>}
                    {a.content && <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, borderTop: a.description ? '1px solid #F3F4F6' : 'none', paddingTop: a.description ? 8 : 0 }}>{a.content.length > 200 ? a.content.slice(0, 200) + '...' : a.content}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav active="create" />
    </div>
  )
}
