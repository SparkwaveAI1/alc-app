'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUBJECTS = ['History', 'Writing', 'Geography', 'Science', 'Math', 'Art', 'Music', 'Life Skills', 'Other']

export default function LogPage() {
  const [what, setWhat] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const toggle = (s: string) => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const save = () => {
    if (!what.trim()) return
    setSaved(true)
    setTimeout(() => { setWhat(''); setSelected([]); setSaved(false) }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 50%, #4F46E5 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(168,85,247,0.4)', filter: 'blur(35px)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'block', marginBottom: 14, position: 'relative', zIndex: 1 }}>← Back</Link>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>I Just Learned Something! 💡</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Capture it before it disappears</p>
      </div>

      <div style={{ padding: '28px 16px 100px' }}>

        {saved ? (
          <div style={{ background: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', borderRadius: 22, padding: '28px', textAlign: 'center', boxShadow: '0 6px 22px rgba(6,95,70,0.25)', marginBottom: 24 }}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#065F46', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 8 }}>Saved! Amazing work, Nayomi!</div>
          </div>
        ) : null}

        {/* What did you learn */}
        <div style={{ background: '#fff', borderRadius: 22, padding: '20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <label style={{ fontSize: 16, fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What did you learn? ✏️
          </label>
          <textarea
            value={what}
            onChange={e => setWhat(e.target.value)}
            placeholder="Describe what you learned in your own words. The more detail, the better!"
            style={{ width: '100%', minHeight: 120, borderRadius: 16, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 15, fontFamily: "'Be Vietnam Pro', sans-serif", background: '#FFF7ED', color: '#1C1917', resize: 'vertical', outline: 'none' }}
          />
        </div>

        {/* Subject tags */}
        <div style={{ background: '#fff', borderRadius: 22, padding: '20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <label style={{ fontSize: 16, fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What subject is it? 🏷️
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUBJECTS.map(s => {
              const active = selected.includes(s)
              return (
                <button key={s} onClick={() => toggle(s)} style={{
                  background: active ? 'linear-gradient(135deg, #7C3AED, #8B5CF6)' : '#F3F4F6',
                  color: active ? '#fff' : '#6B7280',
                  fontWeight: 600, fontSize: 13, padding: '8px 16px',
                  borderRadius: 999, border: 'none', cursor: 'pointer',
                  boxShadow: active ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                }}>
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* How did you learn it */}
        <div style={{ background: '#fff', borderRadius: 22, padding: '20px', marginBottom: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <label style={{ fontSize: 16, fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How did you learn it? 🔍
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Reading', 'Video', 'Conversation', 'Exploring outside', 'Experiment', 'Art project', 'Just figured it out!'].map(s => {
              const active = selected.includes(s)
              return (
                <button key={s} onClick={() => toggle(s)} style={{
                  background: active ? 'linear-gradient(135deg, #EA580C, #F97316)' : '#F3F4F6',
                  color: active ? '#fff' : '#6B7280',
                  fontWeight: 600, fontSize: 13, padding: '8px 16px',
                  borderRadius: 999, border: 'none', cursor: 'pointer',
                  boxShadow: active ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}>
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={save}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #D946EF, #8B5CF6)',
            color: '#fff', fontWeight: 800, fontSize: 16,
            padding: '16px', borderRadius: 999, border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 22px rgba(124,58,237,0.4)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          💾 Save My Learning
        </button>

      </div>
      <Nav active="home" />
    </div>
  )
}
