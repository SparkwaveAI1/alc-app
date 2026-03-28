'use client'

import Link from 'next/link'

export default function TodayPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ===== HERO ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 40%, #4F46E5 75%, #F97316 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '52px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 190,
      }}>
        <div style={{ position: 'absolute', top: 10, left: 30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(168,85,247,0.4)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: -20, right: 50, width: 110, height: 110, borderRadius: '50%', background: 'rgba(249,115,22,0.45)', filter: 'blur(35px)' }} />
        <div style={{ position: 'absolute', top: 44, left: 170, color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>✦</div>
        <div style={{ position: 'absolute', top: 28, right: 130, color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>✦</div>
        <div style={{ position: 'absolute', bottom: 42, right: 60, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>✦</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1.15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Hi, Nayomi! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, fontWeight: 400, margin: '5px 0 0' }}>
              3 adventures waiting for you today
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FBBF24, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}>⭐</div>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>Nayomi</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#065F46',
            borderRadius: 999, padding: '10px 20px',
            boxShadow: '0 4px 14px rgba(6,95,70,0.4)',
          }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Day 7 Streak — You&apos;re on fire!</span>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ padding: '28px 16px 120px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Today&apos;s Adventures ✨
          </h2>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#7C3AED' }}>See all →</span>
        </div>

        {/* Large card: Ancient Egypt */}
        <Link href="/subject/ancient-egypt" style={{ textDecoration: 'none' }}>
          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(135deg, #78350F 0%, #92400E 30%, #C2410C 70%, #EA580C 100%)',
            padding: '18px 18px 16px',
            marginBottom: 13,
            position: 'relative', minHeight: 185,
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(120,53,15,0.35)',
          }}>
            <div style={{ position: 'absolute', bottom: 0, right: 12, opacity: 0.3 }}>
              <div style={{ width: 0, height: 0, borderLeft: '55px solid transparent', borderRight: '55px solid transparent', borderBottom: '75px solid rgba(255,220,150,0.9)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 82, opacity: 0.22 }}>
              <div style={{ width: 0, height: 0, borderLeft: '32px solid transparent', borderRight: '32px solid transparent', borderBottom: '48px solid rgba(255,220,150,0.9)' }} />
            </div>
            <div style={{ position: 'absolute', top: 18, right: 22, fontSize: 22 }}>🌙</div>
            <div style={{ position: 'absolute', top: 44, right: 60, color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>✦</div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '5px 12px', marginBottom: 10,
            }}>
              <span style={{ fontSize: 12 }}>📚</span>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>HISTORY</span>
            </div>

            <div style={{ color: '#fff', fontSize: 25, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 38 }}>
              Ancient Egypt
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '4px 10px',
              }}>
                <span style={{ fontSize: 12 }}>🕐</span>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>20 min</span>
              </div>
              <div style={{
                background: '#22C55E', borderRadius: 9, padding: '4px 10px',
                color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
              }}>NEW</div>
            </div>
          </div>
        </Link>

        {/* Two small cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 28 }}>
          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(145deg, #065F46 0%, #059669 60%, #10B981 100%)',
            padding: '16px 14px', minHeight: 106,
            boxShadow: '0 6px 22px rgba(6,95,70,0.3)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: '4px 9px', marginBottom: 8 }}>
              <span style={{ fontSize: 10 }}>✍️</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>WRITING</span>
            </div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25, marginBottom: 16 }}>Creative Writing</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: '4px 9px' }}>
              <span style={{ fontSize: 10 }}>🕐</span>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>15 min</span>
            </div>
          </div>

          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            padding: '16px 14px', minHeight: 106,
            boxShadow: '0 6px 22px rgba(30,27,75,0.35)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: '4px 9px', marginBottom: 8 }}>
              <span style={{ fontSize: 10 }}>🌍</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>GEOGRAPHY</span>
            </div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25, marginBottom: 16 }}>World Patterns</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: '4px 9px' }}>
              <span style={{ fontSize: 10 }}>🕐</span>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>12 min</span>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Create Something 🧶
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: '📓', label: 'Journal', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#065F46', shadow: 'rgba(6,95,70,0.2)' },
            { icon: '🎨', label: 'Art', bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#7C3AED', shadow: 'rgba(124,58,237,0.2)' },
            { icon: '📝', label: 'Notes', bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#9A3412', shadow: 'rgba(154,52,18,0.2)' },
          ].map(item => (
            <button key={item.label} style={{
              background: item.bg, borderRadius: 20, padding: '16px 8px',
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              boxShadow: `0 6px 18px ${item.shadow}`,
            }}>
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <span style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
