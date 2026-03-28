'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/'

  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pin })

    if (authError) {
      setError('Wrong email or PIN. Try again.')
      setLoading(false)
      return
    }

    router.replace(nextPath)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FDFBF7',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✨</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>
          AI Learning Companion
        </h1>
        <p style={{ margin: '8px 0 0', color: '#6B6560', fontSize: 15 }}>Your personal learning space</p>
      </div>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', boxShadow: '0 4px 24px rgba(45,42,38,0.08)' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nayomi@alc.local"
              required
              autoComplete="email"
              style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9',
                padding: '12px 14px', fontSize: 15, background: '#FFF7ED',
                color: '#2D2A26', outline: 'none', fontFamily: "'DM Sans', sans-serif",
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>PIN</label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••"
              required
              maxLength={8}
              inputMode="numeric"
              autoComplete="current-password"
              style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9',
                padding: '12px 14px', fontSize: 24, letterSpacing: '6px',
                background: '#FFF7ED', color: '#2D2A26', outline: 'none',
                fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !pin}
            style={{
              width: '100%', background: loading || !email || !pin ? '#E5E7EB' : 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              color: loading || !email || !pin ? '#9E9792' : '#fff',
              border: 'none', borderRadius: 14, padding: '14px',
              fontWeight: 800, fontSize: 16, cursor: loading || !email || !pin ? 'default' : 'pointer',
              fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s',
            }}
          >
            {loading ? 'Logging in...' : 'Let\'s go! 🚀'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: 24, fontSize: 12, color: '#6B6560', textAlign: 'center' }}>
        Nayomi: PIN 1234 · Scott: PIN 5678
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
