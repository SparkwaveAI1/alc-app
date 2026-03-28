'use client'
import Nav from '@/components/Nav'
import Link from 'next/link'

export default function Me() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(109,40,217,0.4)', filter: 'blur(35px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>⭐</div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nayomi</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '3px 0 0' }}>Grade 4 · Explorer</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[
            { value: '7',  label: 'Day Streak', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#065F46' },
            { value: '43', label: 'Adventures', bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#7C3AED' },
            { value: '12', label: 'Creations',  bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#9A3412' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '14px 10px', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: s.color, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Parent Dashboard */}
        <Link href="/parent" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 22px rgba(30,27,75,0.35)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👨‍👩‍👧</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Parent Dashboard</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>Progress, gaps, and activity overview</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 22 }}>›</span>
          </div>
        </Link>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['⚙️ Preferences', '🔔 Notifications', '❓ Help & Support'].map(item => (
            <button key={item} style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#1C1917', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>{item}</button>
          ))}
        </div>
      </div>
      <Nav active="me" />
    </div>
  )
}
