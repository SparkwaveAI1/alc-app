'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

type Step = 'input' | 'generating' | 'preview' | 'done'

export default function NewModule() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('input')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const t = searchParams.get('title')
    if (t) setTitle(decodeURIComponent(t))
  }, [])
  type AIResult = {
    overview: string
    subject_tag: string
    subtopics: Array<{ title: string; description: string; emoji: string }>
    key_vocabulary: Array<{ word: string; definition: string }>
    try_first_questions: string[]
    youtube_search_suggestions: string[]
    flashcard_seeds: Array<{ front: string; back: string }>
    fun_fact: string
  }
  const [ai, setAi] = useState<AIResult | null>(null)
  const [error, setError] = useState('')

  async function generate() {
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

  async function save() {
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
      setTimeout(() => router.push(`/wiki/${data.topic.slug}`), 1500)
    } catch (e) {
      setError(String(e))
      setStep('preview')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #D946EF 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(217,70,239,0.4)', filter: 'blur(35px)' }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'block', marginBottom: 14, position: 'relative', zIndex: 1 }}>← Back</Link>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>
          {step === 'done' ? '🎉 Module Created!' : 'Create a Learning Module ✨'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>
          {step === 'input' && 'Enter a topic and let AI build your learning adventure'}
          {step === 'generating' && 'AI is building your module...'}
          {step === 'preview' && 'Review your new learning module'}
          {step === 'done' && 'Taking you there now...'}
        </p>
      </div>

      <div style={{ padding: '28px 16px 100px' }}>

        {/* ERROR */}
        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 16, padding: '14px 16px', marginBottom: 20, color: '#991B1B', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP: INPUT */}
        {step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <label style={{ fontSize: 16, fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                What do you want to learn about? 🌟
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Ancient Egypt, Black Holes, The Amazon Rainforest..."
                style={{ width: '100%', borderRadius: 14, border: '1.5px solid #E8D5C4', padding: '14px 16px', fontSize: 16, fontFamily: "'Be Vietnam Pro', sans-serif", background: '#FFF7ED', color: '#1C1917', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && generate()}
              />
            </div>

            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <label style={{ fontSize: 16, fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tell us more (optional) 💬
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. I'm especially interested in the pyramids and how they were built. I watched a documentary about it."
                rows={3}
                style={{ width: '100%', borderRadius: 14, border: '1.5px solid #E8D5C4', padding: '14px 16px', fontSize: 15, fontFamily: "'Be Vietnam Pro', sans-serif", background: '#FFF7ED', color: '#1C1917', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              onClick={generate}
              disabled={!title.trim()}
              style={{
                background: title.trim() ? 'linear-gradient(135deg, #7C3AED, #D946EF)' : '#E5E7EB',
                color: title.trim() ? '#fff' : '#9CA3AF',
                fontWeight: 800, fontSize: 16,
                padding: '16px', borderRadius: 999, border: 'none',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                boxShadow: title.trim() ? '0 6px 22px rgba(124,58,237,0.4)' : 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ✨ Create My Learning Module
            </button>
          </div>
        )}

        {/* STEP: GENERATING */}
        {step === 'generating' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🧠</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>
              Building your module...
            </div>
            <div style={{ fontSize: 15, color: '#6B7280' }}>AI is creating subtopics, flashcards, and learning activities</div>
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: '#7C3AED', opacity: 0.3 + i * 0.35, animation: `pulse ${0.6 + i * 0.2}s ease-in-out infinite alternate` }} />
              ))}
            </div>
          </div>
        )}

        {/* STEP: DONE */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 70, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#065F46', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Module saved! Taking you there...
            </div>
          </div>
        )}

        {/* STEP: PREVIEW */}
        {step === 'preview' && ai && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Fun fact banner */}
            {ai.fun_fact && (
              <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 22, padding: '18px 20px', boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚡ FUN FACT</div>
                <div style={{ fontSize: 15, color: '#78350F', lineHeight: 1.5 }}>{ai.fun_fact}</div>
              </div>
            )}

            {/* Overview */}
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED', marginBottom: 8 }}>📖 OVERVIEW</div>
              <div style={{ fontSize: 15, color: '#1C1917', lineHeight: 1.6 }}>{ai.overview}</div>
            </div>

            {/* Subtopics */}
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED', marginBottom: 12 }}>🗺️ WHAT YOU&apos;LL EXPLORE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ai.subtopics.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F7D8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1C1917' }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{s.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Try First */}
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#EA580C', marginBottom: 12 }}>🧠 TRY FIRST — THINK ABOUT THIS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ai.try_first_questions.map((q, i) => (
                  <div key={i} style={{ background: '#FFF7ED', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1C1917', lineHeight: 1.5, borderLeft: '3px solid #EA580C' }}>
                    {q}
                  </div>
                ))}
              </div>
            </div>

            {/* Flashcard preview */}
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 12 }}>🃏 FLASHCARDS ({ai.flashcard_seeds.length} cards will be created)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ai.flashcard_seeds.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ background: '#F0FDF4', borderRadius: 12, padding: '10px 14px', borderLeft: '3px solid #22C55E' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>Q: {c.front}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>A: {c.back}</div>
                  </div>
                ))}
                {ai.flashcard_seeds.length > 3 && (
                  <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>+{ai.flashcard_seeds.length - 3} more flashcards</div>
                )}
              </div>
            </div>

            {/* YouTube suggestions */}
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 12 }}>▶️ SUGGESTED YOUTUBE SEARCHES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ai.youtube_search_suggestions.map((s, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#FEF2F2', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#DC2626', textDecoration: 'none', fontWeight: 500 }}>
                    🔍 {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={save}
              style={{
                background: 'linear-gradient(135deg, #065F46, #059669)',
                color: '#fff', fontWeight: 800, fontSize: 16,
                padding: '16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 22px rgba(6,95,70,0.4)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              💾 Save This Module
            </button>

            <button onClick={() => setStep('input')} style={{ background: 'transparent', color: '#9CA3AF', fontSize: 14, fontWeight: 500, padding: '10px', border: 'none', cursor: 'pointer' }}>
              ← Start over
            </button>
          </div>
        )}

      </div>
      <Nav active="explore" />
    </div>
  )
}
