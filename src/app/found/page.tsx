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
  const [creatingModule, setCreatingModule] = useState(false)

  // Handle image selection
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

  // Analyze the image
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
        body: JSON.stringify({
          image_base64: imageBase64,
          media_type: mediaType,
          mode,
          recent_topics: recentTopics,
        }),
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

  // Create a module from the analysis
  const handleCreateModule = async () => {
    if (!analysis?.suggested_module_title) return
    setCreatingModule(true)
    setStep('creating')
    try {
      // Generate full module content
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

      // Save the module
      const saveRes = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analysis.suggested_module_title,
          description: analysis.what_it_is || '',
          ai: {
            ...genData,
            // Seed extra flashcards from image analysis
            flashcard_seeds: [
              ...(genData.flashcard_seeds || []),
              ...(analysis.flashcard_seeds || []),
            ].slice(0, 7),
          },
        }),
      })
      const saveData = await saveRes.json()
      if (saveData.error) throw new Error(saveData.error)

      setStep('done')
      // Redirect to the new module
      router.push(`/topic/${saveData.topic.slug}?new=1`)
    } catch (e: any) {
      setError(e.message || 'Module creation failed')
      setStep('response')
      setCreatingModule(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif",
      paddingBottom: 90, color: '#2D2A26',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #E8715A, #F5A623)',
        padding: '48px 20px 28px', borderRadius: '0 0 28px 28px',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
            fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 12,
          }}
        >
          ← Back
        </button>
        <h1 style={{
          margin: 0, fontSize: 26, fontWeight: 800, color: '#fff',
          fontFamily: "'Nunito', sans-serif",
        }}>
          I Found Something 📸
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          Show Aria what caught your eye
        </p>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: 500, margin: '0 auto' }}>

        {/* STEP: Upload */}
        {step === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: '#fff', borderRadius: 24, padding: '48px 20px',
                textAlign: 'center', cursor: 'pointer',
                border: '2px dashed #E8E2D9',
                boxShadow: '0 2px 12px rgba(45,42,38,0.06)',
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
              <div style={{
                fontSize: 18, fontWeight: 700, color: '#2D2A26',
                fontFamily: "'Nunito', sans-serif", marginBottom: 8,
              }}>
                Take a photo or choose one
              </div>
              <p style={{ fontSize: 14, color: '#6B6560', margin: 0 }}>
                A rock, a bug, something broken, something beautiful — anything that made you wonder
              </p>
            </div>
          </div>
        )}

        {/* STEP: Pick mode */}
        {step === 'mode' && (
          <div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Your photo"
                style={{
                  width: '100%', borderRadius: 20, marginBottom: 20,
                  maxHeight: 280, objectFit: 'cover',
                }}
              />
            )}

            <div style={{
              fontSize: 16, fontWeight: 700, color: '#2D2A26',
              fontFamily: "'Nunito', sans-serif", marginBottom: 16,
            }}>
              What&apos;s this about?
            </div>

            {MODES.map(m => (
              <div
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  background: mode === m.key ? '#EDE8F9' : '#fff',
                  border: `2px solid ${mode === m.key ? '#7C5CBF' : '#E8E2D9'}`,
                  borderRadius: 16, padding: '14px 16px', marginBottom: 10,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 28 }}>{m.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#2D2A26', fontSize: 15 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>{m.desc}</div>
                </div>
              </div>
            ))}

            {error && (
              <div style={{ color: '#E05555', fontSize: 13, marginBottom: 12 }}>{error}</div>
            )}

            <button
              onClick={handleAnalyze}
              style={{
                width: '100%', background: '#E8715A', color: '#fff', border: 'none',
                borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 8,
              }}
            >
              Ask Aria about this ✨
            </button>
          </div>
        )}

        {/* STEP: Analyzing */}
        {step === 'analyzing' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#7C5CBF',
              fontFamily: "'Nunito', sans-serif", marginBottom: 8,
            }}>
              Aria is looking...
            </div>
            <p style={{ fontSize: 14, color: '#6B6560', margin: 0 }}>
              Give her a moment to take it all in
            </p>
          </div>
        )}

        {/* STEP: Aria's response */}
        {step === 'response' && analysis && (
          <div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Your photo"
                style={{
                  width: '100%', borderRadius: 20, marginBottom: 16,
                  maxHeight: 240, objectFit: 'cover',
                }}
              />
            )}

            {/* Aria response bubble */}
            <div style={{
              background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              borderRadius: 20, padding: '20px', marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.8px', marginBottom: 10,
              }}>
                ARIA SAYS
              </div>
              <p style={{
                margin: 0, fontSize: 15, color: '#fff', lineHeight: 1.6, fontStyle: 'italic',
              }}>
                &ldquo;{analysis.aria_response}&rdquo;
              </p>
            </div>

            {/* What it is */}
            {analysis.what_it_is && (
              <div style={{
                background: '#fff', borderRadius: 16, padding: '14px 16px',
                marginBottom: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#6B6560',
                  letterSpacing: '0.8px', marginBottom: 6,
                }}>
                  WHAT IS IT?
                </div>
                <div style={{ fontSize: 14, color: '#2D2A26' }}>{analysis.what_it_is}</div>
              </div>
            )}

            {/* Suggested module */}
            {analysis.suggested_module_title && (
              <div style={{
                background: '#FFF7ED', borderRadius: 16, padding: '16px',
                marginBottom: 16, border: '1.5px solid #F5A623',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#F5A623',
                  letterSpacing: '0.8px', marginBottom: 8,
                }}>
                  💡 WANT TO LEARN MORE?
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: '#2D2A26',
                  fontFamily: "'Nunito', sans-serif", marginBottom: 12,
                }}>
                  {analysis.suggested_module_title}
                </div>
                <button
                  onClick={handleCreateModule}
                  disabled={creatingModule}
                  style={{
                    width: '100%', background: '#F5A623', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14,
                    cursor: creatingModule ? 'default' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Create this module ✨
                </button>
              </div>
            )}

            {error && (
              <div style={{ color: '#E05555', fontSize: 13, marginBottom: 12 }}>{error}</div>
            )}

            {/* Take another photo */}
            <button
              onClick={() => {
                setStep('upload'); setAnalysis(null); setImagePreview(''); setImageBase64('')
              }}
              style={{
                width: '100%', background: '#F3F4F6', color: '#6B7280', border: 'none',
                borderRadius: 12, padding: '12px', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              📷 Try another photo
            </button>
          </div>
        )}

        {/* STEP: Creating module */}
        {step === 'creating' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#7C5CBF',
              fontFamily: "'Nunito', sans-serif",
            }}>
              Building your module...
            </div>
          </div>
        )}

      </div>

      <Nav active="" />
    </div>
  )
}
