'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function Subject() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #78350F 0%, #92400E 35%, #C2410C 70%, #EA580C 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 32px', position: 'relative', overflow: 'hidden', minHeight: 220 }}>
        <div style={{ position: 'absolute', bottom: 0, right: 14, width: 0, height: 0, borderLeft: '70px solid transparent', borderRight: '70px solid transparent', borderBottom: '96px solid rgba(255,210,120,0.25)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 110, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '60px solid rgba(255,210,120,0.18)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 18, right: 24, fontSize: 28, pointerEvents: 'none' }}>🌙</div>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-block', marginBottom: 12, position: 'relative', zIndex: 1 }}>← Back</Link>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '5px 12px', marginBottom: 12, marginLeft: 12, position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 12 }}>📚</span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>HISTORY</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>Ancient Egypt</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: '6px 0 16px', position: 'relative', zIndex: 1 }}>Pyramids & Pharaohs</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: '#FBBF24', borderRadius: 999 }} />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: 10, padding: '4px 12px' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>40% Explored</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 16px 100px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Choose Your Adventure</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { title: 'Read & Discover', desc: 'Explore stories of pharaohs and gods', icon: '📖', bg: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', shadow: 'rgba(109,40,217,0.3)' },
            { title: 'Watch & Wonder',  desc: 'See how pyramids were really built',   icon: '🎬', bg: 'linear-gradient(135deg, #0F766E, #14B8A6)', shadow: 'rgba(15,118,110,0.3)' },
            { title: 'Create & Imagine',desc: 'Design your own Egyptian artifact',    icon: '🎨', bg: 'linear-gradient(135deg, #EA580C, #F97316)', shadow: 'rgba(234,88,12,0.3)' },
          ].map(item => (
            <div key={item.title} style={{ borderRadius: 22, background: item.bg, padding: '18px 18px', boxShadow: `0 6px 22px ${item.shadow}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, marginTop: 3 }}>{item.desc}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }}>›</span>
            </div>
          ))}
        </div>
      </div>
      <Nav active="home" />
    </div>
  )
}
