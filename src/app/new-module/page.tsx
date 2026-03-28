'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

export default function NewModulePage() {
  const router = useRouter()
  const [step, setStep] = useState<'input' | 'generating' | 'preview' | 'done'>('input')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ai, setAi] = useState<any>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!title.trim()) return
    setStep('generating')
    setError('')
    try {
      const res = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAi(data)
      setStep('preview')
    } catch (e) {
      setError(String(e))
      setStep('input')
    }
  }

  const handleSave = async () => {
    setStep('generating')
    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), ai }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStep('done')
      setTimeout(() => router.push(`/topic/${data.topic.slug}`), 1500)
    } catch (e) {
      setError(String(e))
      setStep('preview')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <Link href="/explore" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 12 }}>← Back</Link>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
          {step === 'done' ? '🎉 Module Created!' : 'Create a Module ✨'}
        </h1>
      </div>

      <div style={{ padding: '24px 16px' }}>
        {step === 'input' && (
          <div style={{ maxWidth: 500 }}>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="What do you want to learn about?"
              style={{
                width: '100%', borderRadius: 14, border: '1.5px solid #E8E2D9', padding: '14px 16px',
                fontSize: 16, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
                fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
              }}
            />
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Tell me more (optional)..."
              style={{
                width: '100%', borderRadius: 14, border: '1.5px solid #E8E2D9', padding: '14px 16px',
                fontSize: 14, marginBottom: 14, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
                fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', minHeight: 100, resize: 'vertical',
              }}
            />
            <button onClick={handleGenerate} disabled={!title.trim()} style={{
              width: '100%', background: title.trim() ? '#7C5CBF' : '#E5E7EB',
              color: title.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 12,
              padding: '12px', fontWeight: 700, fontSize: 15, cursor: title.trim() ? 'pointer' : 'default',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Generate with AI ✨
            </button>
            {error && <div style={{ color: '#E05555', marginTop: 12, fontSize: 13 }}>Error: {error}</div>}
          </div>
        )}

        {step === 'generating' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>✨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#7C5CBF', fontFamily: "'Nunito', sans-serif" }}>Creating your module...</div>
            <p style={{ color: '#6B6560', fontSize: 14, marginTop: 8 }}>AI is generating content, flashcards, and activities</p>
          </div>
        )}

        {step === 'preview' && ai && (
          <div style={{ maxWidth: 500 }}>
            {ai.fun_fact && (
              <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, fontSize: 13, color: '#78350F' }}>
                ✨ {ai.fun_fact}
              </div>
            )}
            {ai.overview && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7C5CBF', marginBottom: 8 }}>OVERVIEW</div>
                <p style={{ margin: 0, fontSize: 13, color: '#2D2A26', lineHeight: 1.6 }}>{ai.overview}</p>
              </div>
            )}
            {ai.subtopics?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7C5CBF', marginBottom: 8 }}>SUBTOPICS ({ai.subtopics.length})</div>
                {ai.subtopics.slice(0, 3).map((s: any, i: number) => (
                  <div key={i} style={{ fontSize: 12, color: '#6B6560', marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid #F3F0EB' }}>
                    <strong>{s.emoji} {s.title}</strong> — {s.description}
                  </div>
                ))}
              </div>
            )}
            {ai.flashcard_seeds?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7C5CBF', marginBottom: 8 }}>🃏 FLASHCARDS ({ai.flashcard_seeds.length})</div>
                {ai.flashcard_seeds.slice(0, 2).map((c: any, i: number) => (
                  <div key={i} style={{ fontSize: 11, color: '#6B6560', marginBottom: 8, padding: '8px', background: '#F9F6F0', borderRadius: 10 }}>
                    <strong>Q:</strong> {c.front} <br /> <strong>A:</strong> {c.back}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep('input')} style={{
                flex: 1, background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 12,
                padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>Back</button>
              <button onClick={handleSave} style={{
                flex: 1, background: '#7C5CBF', color: '#fff', border: 'none', borderRadius: 12,
                padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>Save module</button>
            </div>
            {error && <div style={{ color: '#E05555', marginTop: 12, fontSize: 13 }}>Error: {error}</div>}
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>Module created!</div>
            <p style={{ color: '#6B6560', margin: 0 }}>Redirecting to your new module...</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Nav active="explore" />
    </div>
  )
}
