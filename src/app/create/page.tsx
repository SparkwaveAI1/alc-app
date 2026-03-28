'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function CreatePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: 'linear-gradient(135deg, #E8715A 0%, #F59E0B 100%)', padding: '52px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Create Something ✨</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>Turn what you learn into something real</p>
      </div>

      <div style={{ padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '✍️', label: 'Write', desc: 'Express your thoughts', href: '/log' as const, color: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)' },
            { icon: '🎨', label: 'Draw', desc: 'Coming soon', disabled: true, color: 'linear-gradient(135deg, #E8715A, #F59E0B)' },
            { icon: '📹', label: 'Record', desc: 'Coming soon', disabled: true, color: 'linear-gradient(135deg, #A0AEC0, #CBD5E0)' },
            { icon: '📝', label: 'Log', desc: 'Quick note', href: '/log' as const, color: 'linear-gradient(135deg, #4CAF7C, #68D391)' },
          ].map((c: any) => {
            const inner = (
              <div style={{
                background: c.color, borderRadius: 20, padding: '24px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                color: '#fff', cursor: c.disabled ? 'not-allowed' : 'pointer', opacity: c.disabled ? 0.6 : 1,
                boxShadow: '0 4px 16px rgba(45,42,38,0.08)', transition: 'transform 0.15s',
              }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{c.desc}</div>
              </div>
            )
            return c.disabled ? inner : (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
                {inner}
              </Link>
            )
          })}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9792', letterSpacing: '0.8px', marginBottom: 12 }}>RECENT CREATIONS</div>
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', textAlign: 'center', color: '#9E9792', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎨</div>
          <p style={{ margin: 0, fontSize: 14 }}>Nothing created yet. Start making something!</p>
        </div>
      </div>

      <Nav active="create" />
    </div>
  )
}
