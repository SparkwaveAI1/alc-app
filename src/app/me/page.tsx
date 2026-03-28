'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

export default function MePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ topics: 0, created: 0, reviewed: 0 })

  useEffect(() => {
    async function load() {
      try {
        const [pRes, tRes, aRes] = await Promise.all([
          fetch('/api/profile').then(r => r.json()),
          fetch('/api/topics').then(r => r.json()),
          fetch('/api/artifacts').then(r => r.json()),
        ])
        setProfile(pRes)
        setStats({
          topics: Array.isArray(tRes) ? tRes.length : 0,
          created: Array.isArray(aRes) ? aRes.length : 0,
          reviewed: 0,
        })
      } catch {}
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.replace('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 48, background: 'rgba(255,255,255,0.2)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile?.avatar_emoji || '🌟'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>{profile?.display_name || 'Nayomi'}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Grade {profile?.grade_level || 4}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { icon: '📚', label: 'Topics', value: String(stats.topics) },
            { icon: '🎨', label: 'Created', value: String(stats.created) },
            { icon: '🃏', label: 'Reviewed', value: String(stats.reviewed) },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '14px 8px', textAlign: 'center', boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#6B6560', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 12 }}>LEARNING</div>
        {[
          { icon: '📚', label: 'My Portfolio', href: '/portfolio' },
          { icon: '🌍', label: 'Learning Areas', href: '/areas' },
          { icon: '⭐', label: 'Standards Tracker', href: '/standards' },
          { icon: '🎯', label: 'My Paths', href: '/paths' },
        ].map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
              <div style={{ fontSize: 20 }}>{m.icon}</div>
              <div style={{ flex: 1, fontWeight: 600, color: '#2D2A26' }}>{m.label}</div>
              <div style={{ color: '#D1C8D8', fontSize: 16 }}>›</div>
            </div>
          </Link>
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 12, marginTop: 18 }}>OTHER</div>
        {[
          { icon: '❓', label: 'Help Guide', href: '/guide' },
          { icon: '👨‍👩‍👧', label: 'Parent Dashboard', href: '/parent' },
        ].map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(45,42,38,0.06)' }}>
              <div style={{ fontSize: 20 }}>{m.icon}</div>
              <div style={{ flex: 1, fontWeight: 600, color: '#2D2A26' }}>{m.label}</div>
              <div style={{ color: '#D1C8D8', fontSize: 16 }}>›</div>
            </div>
          </Link>
        ))}

        <button onClick={handleSignOut} style={{
          width: '100%', background: '#E05555', color: '#fff', border: 'none',
          borderRadius: 14, padding: '12px 16px', marginTop: 18, fontWeight: 700,
          fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          Sign out
        </button>
      </div>

      <Nav active="me" />
    </div>
  )
}
