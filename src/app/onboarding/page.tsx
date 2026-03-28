'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AVATARS = ['⭐', '🦋', '🐬', '🦁', '🌟', '🦄', '🐉', '🌈', '🦊', '🐙']
const INTERESTS = [
  { key: 'history', label: 'History', icon: '🏛️' },
  { key: 'geography', label: 'Geography', icon: '🌍' },
  { key: 'science', label: 'Science', icon: '🔬' },
  { key: 'writing', label: 'Writing', icon: '✍️' },
  { key: 'math', label: 'Math', icon: '🔢' },
  { key: 'art', label: 'Art', icon: '🎨' },
  { key: 'music', label: 'Music', icon: '🎵' },
  { key: 'cooking', label: 'Cooking', icon: '🍳' },
  { key: 'nature', label: 'Nature', icon: '🌿' },
  { key: 'animals', label: 'Animals', icon: '🐾' },
  { key: 'space', label: 'Space', icon: '🚀' },
  { key: 'culture', label: 'Cultures', icon: '🌐' },
]

type Step = 'welcome' | 'name' | 'avatar' | 'grade' | 'interests' | 'done'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('⭐')
  const [grade, setGrade] = useState(4)
  const [interests, setInterests] = useState<string[]>(['history', 'writing', 'art'])
  const [saving, setSaving] = useState(false)

  function toggleInterest(key: string) {
    setInterests(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key])
  }

  async function finish() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || 'Nayomi', grade, interests, avatar, setup_complete: true }),
    })
    setSaving(false)
    setStep('done')
    setTimeout(() => router.push('/'), 2000)
  }

  const steps: Step[] = ['welcome', 'name', 'avatar', 'grade', 'interests']
  const stepIndex = steps.indexOf(step)
  const progress = step === 'done' ? 100 : (stepIndex / (steps.length - 1)) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Progress */}
      {step !== 'welcome' && step !== 'done' && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ background: '#E8D5C4', borderRadius: 999, height: 6 }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: 999, height: 6, width: `${progress}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px 48px' }}>

        {/* WELCOME */}
        {step === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>🦋</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#1C1917', margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.2 }}>
              Welcome to your<br />Learning World!
            </h1>
            <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.65, marginBottom: 40 }}>
              This is a place that grows with you — your ideas, your curiosity, your creations. Let&apos;s set it up just for you.
            </p>
            <button onClick={() => setStep('name')} style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 800, fontSize: 18, padding: '18px 48px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(124,58,237,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Let&apos;s go! ✨
            </button>
          </div>
        )}

        {/* NAME */}
        {step === 'name' && (
          <div>
            <div style={{ fontSize: 52, marginBottom: 16, textAlign: 'center' }}>👋</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1C1917', textAlign: 'center', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What&apos;s your name?</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>This is how Aria will greet you every day</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Type your name..."
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('avatar')}
              style={{ width: '100%', borderRadius: 20, border: '2px solid #E8D5C4', padding: '18px 20px', fontSize: 20, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', color: '#1C1917', outline: 'none', textAlign: 'center', marginBottom: 24 }}
            />
            <button onClick={() => setStep('avatar')} disabled={!name.trim()} style={{ width: '100%', background: name.trim() ? 'linear-gradient(135deg, #7C3AED, #D946EF)' : '#E5E7EB', color: name.trim() ? '#fff' : '#9CA3AF', fontWeight: 800, fontSize: 17, padding: '16px', borderRadius: 999, border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Next →
            </button>
          </div>
        )}

        {/* AVATAR */}
        {step === 'avatar' && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1C1917', textAlign: 'center', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pick your avatar</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginBottom: 28 }}>This will show up on your profile</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  fontSize: 36, background: avatar === a ? 'linear-gradient(135deg, #F7D8FF, #ECC6F5)' : '#fff',
                  border: avatar === a ? '3px solid #7C3AED' : '2px solid #E8D5C4',
                  borderRadius: 18, padding: '14px', cursor: 'pointer',
                  boxShadow: avatar === a ? '0 4px 16px rgba(124,58,237,0.3)' : 'none',
                  transform: avatar === a ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}>
                  {a}
                </button>
              ))}
            </div>
            <button onClick={() => setStep('grade')} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 800, fontSize: 17, padding: '16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Next →
            </button>
          </div>
        )}

        {/* GRADE */}
        {step === 'grade' && (
          <div>
            <div style={{ fontSize: 52, marginBottom: 16, textAlign: 'center' }}>🎓</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1C1917', textAlign: 'center', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What grade are you in?</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>This helps Aria explain things at the right level</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                <button key={g} onClick={() => setGrade(g)} style={{
                  padding: '18px', borderRadius: 18, border: grade === g ? '3px solid #7C3AED' : '2px solid #E8D5C4',
                  background: grade === g ? 'linear-gradient(135deg, #F7D8FF, #ECC6F5)' : '#fff',
                  cursor: 'pointer', fontWeight: 800, fontSize: 18, color: grade === g ? '#7C3AED' : '#374151',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: grade === g ? '0 4px 16px rgba(124,58,237,0.25)' : 'none',
                }}>
                  {g}
                </button>
              ))}
            </div>
            <button onClick={() => setStep('interests')} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 800, fontSize: 17, padding: '16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Next →
            </button>
          </div>
        )}

        {/* INTERESTS */}
        {step === 'interests' && (
          <div>
            <div style={{ fontSize: 52, marginBottom: 16, textAlign: 'center' }}>🌟</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1C1917', textAlign: 'center', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What do you love?</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>Pick everything that interests you — you can always change this</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
              {INTERESTS.map(item => {
                const selected = interests.includes(item.key)
                return (
                  <button key={item.key} onClick={() => toggleInterest(item.key)} style={{
                    padding: '14px 8px', borderRadius: 18,
                    border: selected ? '2.5px solid #7C3AED' : '2px solid #E8D5C4',
                    background: selected ? 'linear-gradient(135deg, #F7D8FF, #ECC6F5)' : '#fff',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    boxShadow: selected ? '0 4px 14px rgba(124,58,237,0.25)' : 'none',
                  }}>
                    <span style={{ fontSize: 26 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: selected ? '#7C3AED' : '#6B7280' }}>{item.label}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={finish} disabled={interests.length === 0 || saving} style={{ width: '100%', background: interests.length > 0 ? 'linear-gradient(135deg, #065F46, #10B981)' : '#E5E7EB', color: interests.length > 0 ? '#fff' : '#9CA3AF', fontWeight: 800, fontSize: 17, padding: '16px', borderRadius: 999, border: 'none', cursor: interests.length > 0 ? 'pointer' : 'not-allowed', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {saving ? 'Setting up...' : "I'm ready! Let's learn 🚀"}
            </button>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              You&apos;re all set, {name || 'Nayomi'}!
            </h2>
            <p style={{ fontSize: 16, color: '#6B7280' }}>Taking you to your learning world...</p>
          </div>
        )}

      </div>
    </div>
  )
}
