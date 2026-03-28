'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Link from 'next/link'

type Profile = { id: string; name: string; grade: number; interests: string[]; avatar: string; setup_complete: boolean }
type Stats = { modules: number; cards: number; artifacts: number; streak: number }

const GRADE_LABELS: Record<number, string> = { 1:'1st', 2:'2nd', 3:'3rd', 4:'4th', 5:'5th', 6:'6th', 7:'7th', 8:'8th', 9:'9th' }

export default function Me() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats>({ modules: 0, cards: 0, artifacts: 0, streak: 0 })
  const [loading, setLoading] = useState(true)

  const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    async function load() {
      const h = { 'apikey': ANON!, 'Authorization': `Bearer ${ANON}`, 'Prefer': 'count=exact' }
      const [profileRes, modulesRes, cardsRes, artifactsRes, streakRes] = await Promise.all([
        fetch('/api/profile'),
        fetch(`${SB}/rest/v1/topics?select=id&limit=1`, { headers: h }),
        fetch(`${SB}/rest/v1/topic_flashcards?select=id&limit=1`, { headers: h }),
        fetch(`${SB}/rest/v1/artifacts?select=id&limit=1`, { headers: h }),
        fetch('/api/streak'),
      ])
      const profileData = await profileRes.json()
      const streakData = await streakRes.json()
      setProfile(profileData)
      setStats({
        modules: parseInt(modulesRes.headers.get('content-range')?.split('/')[1] || '0'),
        cards: parseInt(cardsRes.headers.get('content-range')?.split('/')[1] || '0'),
        artifacts: parseInt(artifactsRes.headers.get('content-range')?.split('/')[1] || '0'),
        streak: streakData.streak || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const name = profile?.name || 'Nayomi'
  const avatar = profile?.avatar || '⭐'
  const grade = profile?.grade || 4

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(109,40,217,0.4)', filter: 'blur(35px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>{loading ? '⭐' : avatar}</div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{loading ? '...' : name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '3px 0 0' }}>{GRADE_LABELS[grade] || '4th'} Grade · Explorer</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { value: stats.streak, label: 'Day Streak', bg: 'linear-gradient(135deg, #065F46, #10B981)', emoji: '🔥' },
            { value: stats.modules, label: 'Modules', bg: 'linear-gradient(135deg, #4F46E5, #7C3AED)', emoji: '📚' },
            { value: stats.cards, label: 'Cards', bg: 'linear-gradient(135deg, #7C3AED, #D946EF)', emoji: '🃏' },
            { value: stats.artifacts, label: 'Creations', bg: 'linear-gradient(135deg, #D946EF, #F97316)', emoji: '🎨' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '12px 8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <div style={{ fontSize: 16 }}>{s.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{loading ? '-' : s.value}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 22, padding: '18px 20px', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Interests</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.interests.map(interest => (
                <div key={interest} style={{ background: '#F7D8FF', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#7C3AED', textTransform: 'capitalize' }}>
                  {interest}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile */}
        <Link href="/onboarding" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: 22 }}>✏️</span>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#1C1917' }}>Edit Profile</div>
            <span style={{ color: '#D1D5DB', fontSize: 18 }}>›</span>
          </div>
        </Link>

        {/* Parent Dashboard */}
        <Link href="/parent" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 22px rgba(30,27,75,0.35)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👨‍👩‍👧</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Parent Dashboard</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>Progress, gaps, and activity overview</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 22 }}>›</span>
          </div>
        </Link>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🗺️', label: 'My Paths', href: '/paths' },
            { icon: '🎨', label: 'Portfolio', href: '/portfolio' },
            { icon: '❓', label: 'Help & Support', href: '/' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#1C1917' }}>{item.label}</div>
                <span style={{ color: '#D1D5DB', fontSize: 18 }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Nav active="me" />
    </div>
  )
}
