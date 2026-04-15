'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Mode = 'saw' | 'made' | 'did'
type Step = 'upload' | 'mode' | 'analyzing' | 'response' | 'creating' | 'done'

const MODES: { key: Mode; icon: string; label: string; desc: string }[] = [
  { key: 'saw',  icon: '👁️', label: 'I saw this',  desc: 'Something you noticed in the world' },
  { key: 'made', icon: '🎨', label: 'I made this', desc: 'Something you created' },
  { key: 'did',  icon: '✅', label: 'I did this',  desc: 'An experience or activity' },
]

export default function FoundPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('upload')
  const [imageBase64, setImageBase64] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [mediaType, setMediaType] = useState<string>('image/jpeg')
  const [mode, setMode] = useState<Mode>('saw')
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [createdModuleId, setCreatedModuleId] = useState<string | null>(null)

  // ── Step: upload ──────────────────────────────────────────────────────────

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImagePreview(result)
      setImageBase64(result.split(',')[1])
      setStep('mode')
    }
    reader.readAsDataURL(file)
  }

  // ── Step: mode → analyze ──────────────────────────────────────────────────

  const handleAnalyze = async () => {
    setStep('analyzing')
    setError('')
    try {
      const topicsRes = await fetch(
        `${SB_URL}/rest/v1/topics?select=title&order=created_at.desc&limit=5`,
        { headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` } }
      ).then(r => r.json())
      const recentTopics = Array.isArray(topicsRes) ? topicsRes.map((t: any) => t.title) : []

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageBase64, media_type: mediaType, mode, recent_topics: recentTopics }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data)
      setStep('response')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setStep('mode')
    }
  }

  // ── Step: response → create module ────────────────────────────────────────

  const handleCreateModule = async () => {
    if (!analysis?.suggested_module_title) return
    setStep('creating')
    try {
      const genRes = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analysis.suggested_module_title,
          description: `Sparked by a photo. ${analysis.what_it_is || ''}`,
        }),
      })
      const genData = await genRes.json()
      if (genData.error) throw new Error(genData.error)
      setCreatedModuleId(genData.id || 'done')
      setStep('done')
    } catch (e: any) {
      setError(e.message || 'Module creation failed')
      setStep('response')
    }
  }

  // ── Reusable wrapper ───────────────────────────────────────────────────────

  const wrapper = (children: React.ReactNode) => (
    <div style={{
      minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif",
      paddingBottom: 90, color: '#2D2A26',
    }}>
      {children}
      <Nav />
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: upload
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'upload') {
    return wrapper(
      <div style={{ padding: '52px 20px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🔍</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Nunito', sans-serif", margin: '0 0 8px' }}>I Found Something!</h1>
          <p style={{ fontSize: 14, color: '#6B6560', margin: 0 }}>Take a photo of anything that sparks your curiosity</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(124,92,191,0.35)',
            }}
          >
            <span style={{ fontSize: 44 }}>📷</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>Camera</span>
          </button>
          <p style={{ fontSize: 12, color: '#6B6560', margin: 0 }}>Tap to take a photo</p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px', textAlign: 'left',
          boxShadow: '0 2px 12px rgba(45,42,38,0.06)', maxWidth: 400, margin: '0 auto',
        }}>
          <p style={{ fontSize: 13, color: '#6B6560', margin: 0, lineHeight: 1.6 }}>
            💡 <strong>Snap a photo of anything</strong> — a plant, a building, a drawing, a butterfly, anything at all. Aria will help you turn your discovery into something to learn about!
          </p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: mode selection
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'mode') {
    return wrapper(
      <div style={{ padding: '52px 20px 24px' }}>
        {/* Image preview */}
        <div style={{
          background: '#2D2A26', borderRadius: 20, padding: '16px', marginBottom: 20,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          maxHeight: 260, overflow: 'hidden',
        }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 12 }}
          />
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FEE2E2', borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            fontSize: 13, color: '#B91C1C',
          }}>
            ⚠️ {error}
          </div>
        )}

        <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 4 }}>
          What did you do?
        </h2>
        <p style={{ fontSize: 13, color: '#6B6560', marginBottom: 20 }}>
          Help Aria understand how to respond
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {MODES.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                borderRadius: 16, border: mode === m.key ? '2px solid #7C5CBF' : '2px solid #E8E4DE',
                background: mode === m.key ? '#F5F0FF' : '#fff', cursor: 'pointer', textAlign: 'left',
                boxShadow: mode === m.key ? '0 2px 12px rgba(124,92,191,0.15)' : '0 2px 8px rgba(45,42,38,0.05)',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 32 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#2D2A26' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: '#6B6560' }}>{m.desc}</div>
              </div>
              {mode === m.key && (
                <span style={{ marginLeft: 'auto', fontSize: 18 }}>✅</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          style={{
            width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(124,92,191,0.3)',
          }}
        >
          Ask Aria 👋
        </button>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: analyzing
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'analyzing') {
    return wrapper(
      <div style={{ padding: '52px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' }}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          🔍
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>Aria is looking...</h2>
        <p style={{ fontSize: 14, color: '#6B6560' }}>Taking a close look at your photo</p>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: Aria's response
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'response') {
    const card = analysis
    return wrapper(
      <div style={{ padding: '52px 20px 24px' }}>
        {/* Image + Aria bubble */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
          <img
            src={imagePreview}
            alt="Your photo"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
          />
          <div style={{
            background: '#7C5CBF', borderRadius: '18px 18px 4px 18px',
            padding: '14px 18px', flex: 1,
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Aria 💜</div>
            <p style={{ fontSize: 14, color: '#fff', margin: 0, lineHeight: 1.5 }}>{card?.aria_response || '...'}</p>
          </div>
        </div>

        {/* What it is */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16,
          boxShadow: '0 2px 12px rgba(45,42,38,0.06)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7C5CBF', letterSpacing: '0.8px', marginBottom: 4 }}>WHAT ARIA SAW</div>
          <p style={{ fontSize: 14, color: '#2D2A26', margin: 0, lineHeight: 1.5 }}>{card?.what_it_is || '—'}</p>
        </div>

        {/* Module title suggestion */}
        <div style={{
          background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>COULD BECOME A MODULE</div>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif", margin: '0 0 4px' }}>
            {card?.suggested_module_title || '—'}
          </p>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            Subject: {card?.subject_tag || '—'}
          </div>
        </div>

        {/* Flashcard seeds */}
        {card?.flashcard_seeds?.length > 0 && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 16,
            boxShadow: '0 2px 12px rgba(45,42,38,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7C5CBF', letterSpacing: '0.8px', marginBottom: 10 }}>FLASHCARD IDEAS ✨</div>
            {card.flashcard_seeds.map((fc: any, i: number) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < card.flashcard_seeds.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26' }}>Q: {fc.front}</div>
                <div style={{ fontSize: 12, color: '#6B6560' }}>A: {fc.back}</div>
              </div>
            ))}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FEE2E2', borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            fontSize: 13, color: '#B91C1C',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { setStep('upload'); setImageBase64(''); setImagePreview(''); setAnalysis(null) }}
            style={{
              flex: 1, padding: '14px', borderRadius: 14, background: '#fff',
              border: '2px solid #E8E4DE', color: '#6B6560', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            New photo
          </button>
          <button
            onClick={handleCreateModule}
            style={{
              flex: 2, padding: '14px', borderRadius: 14,
              background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,92,191,0.3)',
            }}
          >
            Create module ✨
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: creating module
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'creating') {
    return wrapper(
      <div style={{ padding: '52px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: 72, marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' }}>⚡</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>Building your module...</h2>
        <p style={{ fontSize: 14, color: '#6B6560' }}>Aria is crafting the learning adventure</p>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP: done
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return wrapper(
      <div style={{ padding: '52px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>Module created!</h2>
        <p style={{ fontSize: 14, color: '#6B6560', marginBottom: 28 }}>
          {analysis?.suggested_module_title} is now in your wiki
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          <button
            onClick={() => router.push('/explore')}
            style={{
              padding: '16px', borderRadius: 16,
              background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,92,191,0.3)',
            }}
          >
            Go to module ✨
          </button>
          <button
            onClick={() => { setStep('upload'); setImageBase64(''); setImagePreview(''); setAnalysis(null); setCreatedModuleId(null) }}
            style={{
              padding: '14px', borderRadius: 14, background: '#fff',
              border: '2px solid #E8E4DE', color: '#6B6560', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Find something else 🔍
          </button>
        </div>
      </div>
    )
  }

  return null
}
