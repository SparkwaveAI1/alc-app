'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const ACCOUNTS = [
  {
    role: 'learner',
    name: 'Nayomi',
    emoji: '🦋',
    email: 'nayomi@alc.local',
    label: "I'm Nayomi",
    sublabel: 'Learner',
    gradient: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 40%, #4F46E5 100%)',
    shadow: 'rgba(139,92,246,0.4)',
    bg: 'linear-gradient(135deg, #FAF5FF, #EDE9FE)',
  },
  {
    role: 'parent',
    name: 'Scott',
    emoji: '🏆',
    email: 'scott@alc.local',
    label: "I'm Scott",
    sublabel: 'Parent',
    gradient: 'linear-gradient(135deg, #0F766E, #10B981)',
    shadow: 'rgba(16,185,129,0.4)',
    bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
  },
]

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const supabase = createClient()

  const [selected, setSelected] = useState<typeof ACCOUNTS[0] | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(next)
    })
  }, [])

  async function signIn() {
    if (!selected || pin.length < 4) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: selected.email,
      password: pin,
    })

    if (error) {
      setError('Wrong PIN — try again')
      setPin('')
      setLoading(false)
    } else {
      router.replace(next)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>✨</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Learning Companion</div>
        <div style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>Who&apos;s learning today?</div>
      </div>

      {!selected ? (
        /* Account picker */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 340 }}>
          {ACCOUNTS.map(acc => (
            <button key={acc.role} onClick={() => setSelected(acc)} style={{ background: acc.bg, borderRadius: 24, padding: '24px 20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 6px 24px ${acc.shadow}` }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: acc.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: `0 4px 14px ${acc.shadow}` }}>
                {acc.emoji}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{acc.label}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{acc.sublabel}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 22, color: '#D1D5DB' }}>›</div>
            </button>
          ))}
        </div>
      ) : (
        /* PIN entry */
        <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{selected.emoji}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Hi, {selected.name}!</div>
          <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Enter your PIN to continue</div>

          {/* PIN dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: pin.length > i ? '#7C3AED' : '#E5E7EB', transition: 'background 0.15s', boxShadow: pin.length > i ? '0 2px 8px rgba(124,58,237,0.4)' : 'none' }} />
            ))}
          </div>

          {error && <div style={{ color: '#DC2626', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{error}</div>}

          {/* Number pad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
              <button key={i} onClick={() => {
                if (k === '') return
                if (k === '⌫') { setPin(p => p.slice(0,-1)); return }
                if (pin.length < 4) setPin(p => p + k)
              }} style={{
                height: 64, borderRadius: 18, border: 'none', cursor: k === '' ? 'default' : 'pointer',
                background: k === '' ? 'transparent' : '#fff',
                fontSize: typeof k === 'number' ? 22 : 18,
                fontWeight: 700, color: '#1C1917',
                boxShadow: k === '' ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                {k}
              </button>
            ))}
          </div>

          <button onClick={signIn} disabled={pin.length < 4 || loading} style={{
            width: '100%', background: pin.length === 4 ? selected.gradient : '#E5E7EB',
            color: pin.length === 4 ? '#fff' : '#9CA3AF',
            fontWeight: 800, fontSize: 16, padding: '14px', borderRadius: 999, border: 'none',
            cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
            boxShadow: pin.length === 4 ? `0 6px 22px ${selected.shadow}` : 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {loading ? 'Signing in...' : '✓ Let\'s go!'}
          </button>

          <button onClick={() => { setSelected(null); setPin(''); setError('') }} style={{ marginTop: 12, background: 'none', border: 'none', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
            ← Switch account
          </button>
        </div>
      )}
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>✨</div>}>
      <LoginInner />
    </Suspense>
  )
}
