'use client'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ===== HERO SECTION ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #7B2FF2 0%, #9B4DFF 25%, #C74BF7 55%, #FF6B35 85%, #FF8C42 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '52px 24px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -30, right: 60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(232, 64, 251, 0.35)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: 20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255, 112, 67, 0.5)', filter: 'blur(25px)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', filter: 'blur(15px)' }} />
        {/* Small decorative dots */}
        <div style={{ position: 'absolute', top: 48, left: 180, width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', top: 30, right: 120, width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 48, right: 80, width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />

        {/* Top row: greeting + avatar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Hi, Nayomi! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, margin: '4px 0 0' }}>
              3 adventures waiting for you today
            </p>
          </div>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FFB300, #FF8C00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>⭐</div>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>Nayomi</span>
          </div>
        </div>

        {/* Streak badge */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)',
            borderRadius: 999, padding: '9px 20px',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Day 7 Streak — You&apos;re on fire!</span>
          </div>
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div style={{ padding: '24px 20px 120px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Today&apos;s Adventures ✨
          </h2>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#FF8C42', cursor: 'pointer' }}>See all →</span>
        </div>

        {/* ===== LARGE CARD: Ancient Egypt ===== */}
        <div style={{
          width: '100%', borderRadius: 22, overflow: 'hidden',
          background: 'linear-gradient(135deg, #A67B3D 0%, #C4944A 40%, #D4A355 70%, #C8924A 100%)',
          padding: '18px 18px 16px',
          marginBottom: 13, position: 'relative', minHeight: 180,
          boxShadow: '0 8px 28px rgba(166,123,61,0.35)',
        }}>
          {/* Pyramid illustration (CSS) */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 140, height: 90, opacity: 0.25 }}>
            {/* Large pyramid */}
            <div style={{
              position: 'absolute', bottom: 0, right: 20,
              width: 0, height: 0,
              borderLeft: '50px solid transparent',
              borderRight: '50px solid transparent',
              borderBottom: '70px solid rgba(255,255,255,0.8)',
            }} />
            {/* Small pyramid */}
            <div style={{
              position: 'absolute', bottom: 0, right: 90,
              width: 0, height: 0,
              borderLeft: '28px solid transparent',
              borderRight: '28px solid transparent',
              borderBottom: '42px solid rgba(255,255,255,0.6)',
            }} />
          </div>
          {/* Moon */}
          <div style={{ position: 'absolute', top: 18, right: 22, fontSize: 22, opacity: 0.8 }}>🌙</div>

          {/* Chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.25)', borderRadius: 9, padding: '4px 10px', marginBottom: 10,
          }}>
            <span style={{ fontSize: 11 }}>📜</span>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>HISTORY</span>
          </div>

          {/* Title */}
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 32 }}>
            Ancient Egypt
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>⏱</div>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>20 min</span>
            </div>
            <div style={{
              background: '#fff', borderRadius: 7, padding: '3px 8px',
              color: '#5D4E37', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
            }}>NEW</div>
          </div>
        </div>

        {/* ===== TWO SMALL CARDS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 28 }}>

          {/* Creative Writing */}
          <div style={{
            borderRadius: 22, overflow: 'hidden',
            background: 'linear-gradient(145deg, #4CAF50 0%, #2E7D32 50%, #1B6B2F 100%)',
            padding: '16px 14px', minHeight: 148,
            boxShadow: '0 8px 24px rgba(46,125,50,0.3)',
            position: 'relative',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.25)', borderRadius: 9, padding: '4px 8px', marginBottom: 8,
            }}>
              <span style={{ fontSize: 10 }}>✍️</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>WRITING</span>
            </div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25 }}>
              Creative Writing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 28 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>⏱</div>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>15 min</span>
            </div>
          </div>

          {/* World Patterns / Geography */}
          <div style={{
            borderRadius: 22, overflow: 'hidden',
            background: 'linear-gradient(145deg, #FF8A65 0%, #F4511E 50%, #E64A19 100%)',
            padding: '16px 14px', minHeight: 148,
            boxShadow: '0 8px 24px rgba(244,81,30,0.3)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.25)', borderRadius: 9, padding: '4px 8px', marginBottom: 8,
            }}>
              <span style={{ fontSize: 10 }}>🌍</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>GEOGRAPHY</span>
            </div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25 }}>
              World Patterns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 28 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>⏱</div>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>12 min</span>
            </div>
          </div>
        </div>

        {/* ===== CREATE SOMETHING ===== */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Create Something 🎨
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: '📓', label: 'Journal', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#00694D', shadow: 'rgba(0,105,77,0.2)' },
            { icon: '🎨', label: 'Art', bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#813EA0', shadow: 'rgba(129,62,160,0.2)' },
            { icon: '📝', label: 'Notes', bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#A43B2D', shadow: 'rgba(164,59,45,0.2)' },
          ].map(item => (
            <button key={item.label} style={{
              background: item.bg, borderRadius: 20, padding: '16px 8px',
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              boxShadow: `0 6px 18px ${item.shadow}`,
            }}>
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <span style={{ color: item.color, fontWeight: 700, fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{item.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
