'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const INTERESTS = [
  { label: 'History', emoji: '🏛️' },
  { label: 'Geography', emoji: '🌍' },
  { label: 'Science', emoji: '🔬' },
  { label: 'Math', emoji: '🔢' },
  { label: 'Art', emoji: '🎨' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Writing', emoji: '✏️' },
  { label: 'Life Skills', emoji: '🛠️' },
  { label: 'Culture', emoji: '🎎' },
]

const AVATARS = ['🌟', '🦁', '🦋', '🐉', '🌊', '🔭', '🎨', '🦊', '🌿', '⚡️']

const GRADES = [3, 4, 5, 6, 7, 8]

const STEPS = ['welcome', 'name', 'grade', 'interests', 'avatar', 'done']

function ProgressDots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {STEPS.map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8,
          height: 8,
          borderRadius: 4,
          background: i === current ? '#7C5CBF' : i < current ? '#C4B5E0' : '#E8E2D9',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<number | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [avatar, setAvatar] = useState('🌟')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[step]

  const toggleInterest = (label: string) => {
    setInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const handleFinish = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: name.trim(),
          grade_level: grade,
          avatar_emoji: avatar,
          interests,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      // Full page reload to ensure fresh session state
      window.location.href = '/'
    } catch (e) {
      setError('Something went wrong. Try again.')
      setSaving(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFBF7',
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 24px 40px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {step < 5 && <ProgressDots current={step} />}

      {/* Step 0 — Welcome */}
      {currentStep === 'welcome' && (
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>✨</div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 16, lineHeight: 1.2,
          }}>
            Welcome to ALC
          </h1>
          <p style={{ fontSize: 17, color: '#6B6560', lineHeight: 1.6, marginBottom: 40 }}>
            Your personal learning companion.<br />
            Follow your curiosity, build your knowledge,<br />
            discover connections.
          </p>
          <button onClick={() => setStep(1)} style={{
            width: '100%', maxWidth: 320, padding: '18px 32px',
            background: '#7C5CBF', color: '#fff', border: 'none', borderRadius: 16,
            fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(124,92,191,0.3)',
          }}>
            Let's go! →
          </button>
        </div>
      )}

      {/* Step 1 — Name */}
      {currentStep === 'name' && (
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 26, fontWeight: 800, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 8,
          }}>
            What's your name?
          </h2>
          <p style={{ fontSize: 15, color: '#6B6560', marginBottom: 32 }}>
            Just your first name — so Aria knows who she's talking to.
          </p>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '18px 20px',
              fontSize: 18, border: '2.5px solid #E8E2D9', borderRadius: 16,
              background: '#fff', fontFamily: 'inherit', outline: 'none',
              marginBottom: 24,
            }}
            onFocus={e => e.target.style.borderColor = '#7C5CBF'}
            onBlur={e => e.target.style.borderColor = '#E8E2D9'}
          />
          <button
            onClick={() => name.trim() && setStep(2)}
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '16px 32px',
              background: name.trim() ? '#7C5CBF' : '#C4B5E0',
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Grade */}
      {currentStep === 'grade' && (
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 26, fontWeight: 800, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 8,
          }}>
            What grade are you in?
          </h2>
          <p style={{ fontSize: 15, color: '#6B6560', marginBottom: 32 }}>
            This helps us pick the right level for you.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {GRADES.map(g => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                style={{
                  padding: '20px 8px', borderRadius: 16,
                  border: grade === g ? '2.5px solid #7C5CBF' : '2px solid #E8E2D9',
                  background: grade === g ? '#F3EEFF' : '#fff',
                  fontSize: 22, fontWeight: 800, color: '#2D2A26',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={() => grade && setStep(3)}
            disabled={!grade}
            style={{
              width: '100%', padding: '16px 32px',
              background: grade ? '#7C5CBF' : '#C4B5E0',
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 700, cursor: grade ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 3 — Interests */}
      {currentStep === 'interests' && (
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 26, fontWeight: 800, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 8,
          }}>
            What do you love?
          </h2>
          <p style={{ fontSize: 15, color: '#6B6560', marginBottom: 24 }}>
            Pick as many as you like. You can always explore more later.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10, marginBottom: 32,
          }}>
            {INTERESTS.map(({ label, emoji }) => {
              const selected = interests.includes(label)
              return (
                <button
                  key={label}
                  onClick={() => toggleInterest(label)}
                  style={{
                    padding: '14px 8px', borderRadius: 14,
                    border: selected ? '2.5px solid #7C5CBF' : '2px solid #E8E2D9',
                    background: selected ? '#F3EEFF' : '#fff',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: selected ? '#7C5CBF' : '#2D2A26' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => interests.length > 0 && setStep(4)}
            disabled={interests.length === 0}
            style={{
              width: '100%', padding: '16px 32px',
              background: interests.length > 0 ? '#7C5CBF' : '#C4B5E0',
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 700, cursor: interests.length > 0 ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 4 — Avatar */}
      {currentStep === 'avatar' && (
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 26, fontWeight: 800, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 8,
          }}>
            Pick your avatar
          </h2>
          <p style={{ fontSize: 15, color: '#6B6560', marginBottom: 32 }}>
            This is how Aria will know you.
          </p>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
            marginBottom: 32,
          }}>
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                style={{
                  width: 64, height: 64, borderRadius: 16, fontSize: 32,
                  border: avatar === a ? '2.5px solid #7C5CBF' : '2px solid #E8E2D9',
                  background: avatar === a ? '#F3EEFF' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(5)}
            style={{
              width: '100%', padding: '16px 32px',
              background: '#7C5CBF', color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 5 — Done */}
      {currentStep === 'done' && (
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>{avatar}</div>
          <h2 style={{
            fontSize: 28, fontWeight: 900, color: '#2D2A26',
            fontFamily: "'Nunito', sans-serif", marginBottom: 12,
          }}>
            You're all set, {name}!
          </h2>
          <p style={{ fontSize: 16, color: '#6B6560', marginBottom: 40, lineHeight: 1.6 }}>
            Let's start exploring. Your curiosity awaits.
          </p>
          {error && (
            <p style={{ color: '#E05555', fontSize: 14, marginBottom: 16 }}>{error}</p>
          )}
          <button
            onClick={handleFinish}
            disabled={saving}
            style={{
              width: '100%', padding: '18px 32px',
              background: saving ? '#C4B5E0' : '#7C5CBF',
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 17, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(124,92,191,0.3)',
            }}
          >
            {saving ? 'Saving...' : "Let's explore! 🚀"}
          </button>
        </div>
      )}
    </div>
  )
}
