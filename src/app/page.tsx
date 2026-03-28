'use client'
import Nav from '@/components/Nav'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 40%, #4F46E5 75%, #F97316 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 10, left: 20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(168,85,247,0.45)', filter: 'blur(45px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(249,115,22,0.5)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 50, left: 160, color: 'rgba(255,255,255,0.7)', fontSize: 11, pointerEvents: 'none' }}>✦</div>
        <div style={{ position: 'absolute', top: 32, right: 120, color: 'rgba(255,255,255,0.5)', fontSize: 8, pointerEvents: 'none' }}>✦</div>
        <div style={{ position: 'absolute', bottom: 46, right: 55, color: 'rgba(255,255,255,0.4)', fontSize: 13, pointerEvents: 'none' }}>✦</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1.15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hi, Nayomi! 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, fontWeight: 400, margin: '5px 0 0' }}>3 adventures waiting for you today</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>⭐</div>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>Nayomi</span>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#065F46', borderRadius: 999, padding: '10px 20px', boxShadow: '0 4px 14px rgba(6,95,70,0.5)' }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Day 7 Streak — You&apos;re on fire!</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px 16px 100px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Today&apos;s Adventures ✨</h2>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#7C3AED' }}>See all →</span>
        </div>

        {/* Large card: Ancient Egypt */}
        <Link href="/subject/ancient-egypt" style={{ textDecoration: 'none', display: 'block', marginBottom: 13 }}>
          <div style={{ borderRadius: 22, background: 'linear-gradient(135deg, #78350F 0%, #92400E 35%, #C2410C 70%, #EA580C 100%)', padding: '18px 18px 16px', position: 'relative', minHeight: 185, overflow: 'hidden', boxShadow: '0 8px 28px rgba(120,53,15,0.4)' }}>
            <div style={{ position: 'absolute', bottom: 0, right: 14, width: 0, height: 0, borderLeft: '55px solid transparent', borderRight: '55px solid transparent', borderBottom: '76px solid rgba(255,210,120,0.28)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 88, width: 0, height: 0, borderLeft: '32px solid transparent', borderRight: '32px solid transparent', borderBottom: '48px solid rgba(255,210,120,0.2)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 18, right: 22, fontSize: 22, pointerEvents: 'none' }}>🌙</div>
            <div style={{ position: 'absolute', top: 46, right: 62, color: 'rgba(255,255,255,0.55)', fontSize: 10, pointerEvents: 'none' }}>✦</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '5px 12px', marginBottom: 10 }}>
              <span style={{ fontSize: 12 }}>📚</span>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>HISTORY</span>
            </div>
            <div style={{ color: '#fff', fontSize: 25, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 40 }}>Ancient Egypt</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '4px 10px' }}>
                <span style={{ fontSize: 12 }}>🕐</span>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>20 min</span>
              </div>
              <div style={{ background: '#22C55E', borderRadius: 9, padding: '4px 10px', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>NEW</div>
            </div>
          </div>
        </Link>

        {/* Two small cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 20 }}>
          <Link href="/subject/creative-writing" style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: 22, background: 'linear-gradient(145deg, #065F46 0%, #059669 55%, #10B981 100%)', padding: '16px 14px', minHeight: 112, boxShadow: '0 6px 22px rgba(6,95,70,0.32)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 9px', marginBottom: 8 }}>
                <span style={{ fontSize: 10 }}>✍️</span>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>WRITING</span>
              </div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25, marginBottom: 18 }}>Creative Writing</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 9px' }}>
                <span style={{ fontSize: 10 }}>🕐</span>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>15 min</span>
              </div>
            </div>
          </Link>
          <Link href="/subject/world-patterns" style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: 22, background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)', padding: '16px 14px', minHeight: 112, boxShadow: '0 6px 22px rgba(30,27,75,0.38)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 9px', marginBottom: 8 }}>
                <span style={{ fontSize: 10 }}>🌍</span>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>GEOGRAPHY</span>
              </div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25, marginBottom: 18 }}>World Patterns</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 9px' }}>
                <span style={{ fontSize: 10 }}>🕐</span>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>12 min</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick log */}
        <Link href="/log" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
          <div style={{ background: 'linear-gradient(135deg, #F7D8FF, #ECC6F5)', borderRadius: 22, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(124,58,237,0.18)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4C1D95', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>I just learned something!</div>
              <div style={{ fontSize: 13, color: '#6D28D9', opacity: 0.8 }}>Tap to log a new discovery</div>
            </div>
            <span style={{ color: '#7C3AED', fontSize: 20 }}>›</span>
          </div>
        </Link>

        {/* Create Something */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Something 🧶</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: '📓', label: 'Journal', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#065F46', href: '/create' },
            { icon: '🎨', label: 'Art',     bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#7C3AED', href: '/create' },
            { icon: '📝', label: 'Notes',   bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#9A3412', href: '/create' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: item.bg, borderRadius: 20, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: 26 }}>{item.icon}</span>
                <span style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
      <Nav active="home" />
    </div>
  )
}
