'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

const USERS = [
  { label: 'Nayomi', emoji: '🌟', email: 'nayomi@alc.local' },
  { label: 'Scott', emoji: '👤', email: 'scott@alc.local' },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/'

  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: selectedUser.email,
      password: pin,
    })

    if (authError) {
      setError('Wrong PIN. Try again.')
      setLoading(false)
      return
    }

    router.replace(nextPath)
  }

  const handleDemo = async () => {
    setLoading(true)
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    try {
      const res = await fetch(`${SB_URL}/rest/v1/learner_profile?select=id,display_name&limit=1&order=created_at.desc`, {
        headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` },
      })
      const profiles = await res.json()
      if (profiles?.[0]?.id) {
        // Set demo cookie and go home
        document.cookie = `demo_learner_id=${profiles[0].id}; path=/; max-age=86400`
        window.location.href = nextPath
      } else {
        window.location.href = '/onboarding'
      }
    } catch {
      window.location.href = '/onboarding'
    }
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

          {/* Who are you? */}
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#6B6560', letterSpacing: '0.5px' }}>WHO ARE YOU?</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {USERS.map(u => (
              <button
                key={u.label}
                type="button"
                onClick={() => { setSelectedUser(u); setPin(''); setError(''); }}
                style={{
                  flex: 1, padding: '16px 8px', borderRadius: 16,
                  border: selectedUser?.label === u.label ? '2.5px solid #7C5CBF' : '2px solid #E8E2D9',
                  background: selectedUser?.label === u.label ? '#F3EEFF' : '#FFF7ED',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 32 }}>{u.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: selectedUser?.label === u.label ? '#7C5CBF' : '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>{u.label}</span>
              </button>
            ))}
          </div>

          {/* PIN entry — only shown after selecting user */}
          {selectedUser && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                ENTER YOUR PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="••••"
                required
                inputMode="numeric"
                autoComplete="current-password"
                autoFocus
                style={{
                  width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9',
                  padding: '12px 14px', fontSize: 28, letterSpacing: '8px',
                  background: '#FFF7ED', color: '#2D2A26', outline: 'none',
                  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
                  textAlign: 'center',
                }}
              />
            </div>
          )}

          {error && (
            <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedUser || !pin}
            style={{
              width: '100%',
              background: loading || !selectedUser || !pin ? '#E5E7EB' : 'linear-gradient(135deg, #7C5CBF, #9C7DD4)',
              color: loading || !selectedUser || !pin ? '#9E9792' : '#fff',
              border: 'none', borderRadius: 14, padding: '14px',
              fontWeight: 800, fontSize: 16, cursor: loading || !selectedUser || !pin ? 'default' : 'pointer',
              fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s',
            }}
          >
            {loading ? 'Logging in...' : "Let's go! 🚀"}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              style={{
                background: 'none', border: 'none', color: '#6B6560',
                fontSize: 13, cursor: loading ? 'default' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline',
              }}
            >
              Continue as Demo →
            </button>
          </div>
        </div>
      </form>
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
