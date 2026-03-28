'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type AreaLog = { date: string; note: string; duration: number }
type Area = { id: string; title: string; description: string; category: string; icon: string; color: string; logs: AreaLog[]; total_sessions: number; last_practiced: string | null }

const STARTER_AREAS = [
  { title: 'Guitar', icon: '🎸', color: '#B45309', category: 'Music', description: 'Learning to play guitar' },
  { title: 'Drawing', icon: '✏️', color: '#7C3AED', category: 'Art', description: 'Sketching and illustration' },
  { title: 'Cooking', icon: '🍳', color: '#065F46', category: 'Life Skills', description: 'Learning to cook and bake' },
  { title: 'Photography', icon: '📸', color: '#1D4ED8', category: 'Art', description: 'Taking and editing photos' },
]

const CATEGORY_SUGGESTIONS: Record<string, { icon: string; color: string }> = {
  Music: { icon: '🎵', color: '#B45309' }, Art: { icon: '🎨', color: '#7C3AED' },
  Sport: { icon: '⚽', color: '#065F46' }, 'Life Skills': { icon: '🏠', color: '#0F766E' },
  Language: { icon: '🌐', color: '#1D4ED8' }, Technology: { icon: '💻', color: '#374151' },
  Other: { icon: '⭐', color: '#D946EF' },
}

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [logging, setLogging] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [logNote, setLogNote] = useState('')
  const [logDuration, setLogDuration] = useState(30)
  const [newArea, setNewArea] = useState({ title: '', description: '', category: 'Other', icon: '⭐' })

  const h = { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/learning_areas?order=created_at`, { headers: h })
    const data = await res.json()
    setAreas(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function seedAreas() {
    for (const a of STARTER_AREAS) {
      await fetch('/api/areas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a) })
    }
    await load()
  }

  async function logSession(area: Area) {
    if (!logNote.trim()) return
    const newLog: AreaLog = { date: new Date().toISOString(), note: logNote, duration: logDuration }
    const updatedLogs = [...(area.logs || []), newLog]
    await fetch('/api/areas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: area.id, logs: updatedLogs, total_sessions: area.total_sessions + 1, last_practiced: new Date().toISOString() }),
    })
    setLogNote(''); setLogDuration(30); setLogging(null)
    await load()
  }

  async function createArea() {
    if (!newArea.title.trim()) return
    const cat = newArea.category
    const defaults = CATEGORY_SUGGESTIONS[cat] || CATEGORY_SUGGESTIONS['Other']
    await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newArea, icon: defaults.icon, color: defaults.color }),
    })
    setNewArea({ title: '', description: '', category: 'Other', icon: '⭐' })
    setAdding(false)
    await load()
  }

  function daysSince(dateStr: string | null) {
    if (!dateStr) return null
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(245,158,11,0.5)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>Learning Areas 🌟</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Skills beyond school — guitar, art, cooking, and more</p>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {/* Add area */}
        {!adding ? (
          <button onClick={() => areas.length === 0 ? seedAreas() : setAdding(true)}
            style={{ width: '100%', background: 'linear-gradient(135deg, #B45309, #F59E0B)', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(180,83,9,0.35)', textAlign: 'left' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>➕</div>
            <div>
              <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {areas.length === 0 ? 'Add Starter Areas' : 'Add a Learning Area'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }}>
                {areas.length === 0 ? 'Guitar, Drawing, Cooking, Photography' : 'Guitar, cooking, chess, language — anything you practice'}
              </div>
            </div>
          </button>
        ) : (
          <div style={{ background: '#fff', borderRadius: 22, padding: '20px', marginBottom: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Learning Area</div>
            <input value={newArea.title} onChange={e => setNewArea(p => ({ ...p, title: e.target.value }))} placeholder="What do you practice? (Guitar, Chess, Cooking...)" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 15, marginBottom: 10, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            <input value={newArea.description} onChange={e => setNewArea(p => ({ ...p, description: e.target.value }))} placeholder="Tell me more (optional)" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, marginBottom: 10, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(CATEGORY_SUGGESTIONS).map(cat => (
                  <button key={cat} onClick={() => setNewArea(p => ({ ...p, category: cat }))} style={{ borderRadius: 999, padding: '6px 14px', border: newArea.category === cat ? '2px solid #B45309' : '1.5px solid #E8D5C4', background: newArea.category === cat ? '#FEF3C7' : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: newArea.category === cat ? '#B45309' : '#6B7280' }}>{cat}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createArea} disabled={!newArea.title.trim()} style={{ flex: 1, background: 'linear-gradient(135deg, #B45309, #F59E0B)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Add Area</button>
              <button onClick={() => setAdding(false)} style={{ background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: 13, padding: '12px 16px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading...</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {areas.map(area => (
            <div key={area.id} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
              <div style={{ background: `linear-gradient(135deg, ${area.color}, ${area.color}bb)`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{area.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{area.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>
                    {area.total_sessions} session{area.total_sessions !== 1 ? 's' : ''} · {area.last_practiced ? daysSince(area.last_practiced) : 'Not yet practiced'}
                  </div>
                </div>
                <button onClick={() => setLogging(logging === area.id ? null : area.id)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '8px 14px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  {logging === area.id ? '✕' : '+ Log'}
                </button>
              </div>

              {/* Recent logs */}
              {area.logs && area.logs.length > 0 && (
                <div style={{ padding: '12px 18px', borderBottom: logging === area.id ? '1px solid #F3F4F6' : 'none' }}>
                  {(area.logs as AreaLog[]).slice(-3).reverse().map((log, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#374151', padding: '6px 0', borderBottom: i < 2 ? '1px solid #F9FAFB' : 'none', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ flex: 1 }}>{log.note}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 11, flexShrink: 0 }}>{log.duration}min · {new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Log session form */}
              {logging === area.id && (
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', marginBottom: 10 }}>Log today&apos;s session</div>
                  <textarea value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="What did you work on? What did you learn or practice?" rows={2} style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '10px 12px', fontSize: 13, background: '#FFF7ED', color: '#1C1917', outline: 'none', resize: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Duration:</span>
                    {[15, 30, 45, 60].map(m => (
                      <button key={m} onClick={() => setLogDuration(m)} style={{ borderRadius: 999, padding: '5px 12px', border: logDuration === m ? '2px solid #B45309' : '1.5px solid #E8D5C4', background: logDuration === m ? '#FEF3C7' : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: logDuration === m ? '#B45309' : '#6B7280' }}>{m}m</button>
                    ))}
                  </div>
                  <button onClick={() => logSession(area)} disabled={!logNote.trim()} style={{ width: '100%', background: 'linear-gradient(135deg, #065F46, #10B981)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>💾 Save Session</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Nav active="me" />
    </div>
  )
}
