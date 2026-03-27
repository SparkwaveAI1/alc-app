'use client'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#FFF8F1', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* === HERO HEADER === */}
      <div style={{
        background: 'linear-gradient(145deg, #813EA0 0%, #9C58BB 40%, #C084DB 100%)',
        padding: '0 0 48px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: 60, right: 30, width: 80, height: 80,
          borderRadius: '50%', background: 'rgba(253,125,105,0.25)',
        }} />
        <div style={{
          position: 'absolute', bottom: 20, left: -20, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(141,247,204,0.15)',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FD7D69, #FFB3A7)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>👧</div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500 }}>Good morning,</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Zoe! 👋</div>
            </div>
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: 'none', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>⚙️</button>
        </div>

        {/* Streak badge */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #FD7D69, #FF9A8A)',
            padding: '10px 20px', borderRadius: 999,
            boxShadow: '0 4px 20px rgba(253,125,105,0.45)',
          }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>7 Day Streak!</span>
          </div>
        </div>

        {/* Wavy bottom edge */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 390 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40 }}>
            <path d="M0,20 C80,40 160,0 240,20 C320,40 360,10 390,20 L390,40 L0,40 Z" fill="#FFF8F1" />
          </svg>
        </div>
      </div>

      {/* === CONTENT === */}
      <div style={{ padding: '8px 20px 24px' }}>

        {/* Aria AI Bubble */}
        <div style={{
          background: 'linear-gradient(135deg, #F7D8FF, #ECC6F5)',
          borderRadius: '20px 20px 20px 6px',
          padding: '16px 18px',
          marginBottom: 28,
          boxShadow: '0 6px 24px rgba(129,62,160,0.12)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #813EA0, #9C58BB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>✨</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#4D4350', fontSize: 14, lineHeight: 1.5, margin: '0 0 10px' }}>
              Ready to explore something amazing today, Zoe? Your Ancient Egypt adventure continues! 🏛️
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #813EA0, #9C58BB)',
              color: '#fff', fontWeight: 700, fontSize: 13,
              padding: '8px 18px', borderRadius: 999, border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(129,62,160,0.35)',
            }}>Let's go →</button>
          </div>
        </div>

        {/* Today's Learning */}
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: '#1E1B17',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginBottom: 14,
        }}>Today's Learning</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>

          {/* Card: Ancient Egypt */}
          <div style={{
            background: '#fff', borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(253,125,105,0.14)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FD7D69, #FFB89E)',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🏛️</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ancient Egypt</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Pyramids & Pharaohs</div>
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 999, padding: '4px 10px',
                color: '#fff', fontSize: 12, fontWeight: 600,
              }}>20 min</div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#4D4350' }}>
                <span>In progress</span><span>35%</span>
              </div>
              <div style={{ height: 8, background: '#F4EDE5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #FD7D69, #FF9A8A)', borderRadius: 999 }} />
              </div>
            </div>
          </div>

          {/* Card: Creative Writing */}
          <div style={{
            background: '#fff', borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(129,62,160,0.13)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #813EA0, #A56CBB)',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>✍️</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Creative Writing</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Story Starter</div>
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 999, padding: '4px 10px',
                color: '#fff', fontSize: 12, fontWeight: 600,
              }}>15 min</div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#4D4350' }}>
                <span>In progress</span><span>60%</span>
              </div>
              <div style={{ height: 8, background: '#F4EDE5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #813EA0, #A56CBB)', borderRadius: 999 }} />
              </div>
            </div>
          </div>

          {/* Card: Math Patterns */}
          <div style={{
            background: '#fff', borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,105,77,0.12)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #00694D, #00A478)',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🔢</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Math Patterns</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Number Sequences</div>
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 999, padding: '4px 10px',
                color: '#fff', fontSize: 12, fontWeight: 600,
              }}>10 min</div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#4D4350' }}>
                <span>Just started</span><span>25%</span>
              </div>
              <div style={{ height: 8, background: '#F4EDE5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #00694D, #00A478)', borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Create & Save */}
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: '#1E1B17',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginBottom: 14,
        }}>Create & Save</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[
            { icon: '📓', label: 'Journal', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#00694D', shadow: 'rgba(0,105,77,0.2)' },
            { icon: '🎨', label: 'Art', bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#813EA0', shadow: 'rgba(129,62,160,0.2)' },
            { icon: '📝', label: 'Notes', bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#A43B2D', shadow: 'rgba(164,59,45,0.2)' },
          ].map(item => (
            <button key={item.label} style={{
              background: item.bg,
              borderRadius: 20, padding: '16px 8px',
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              boxShadow: `0 6px 20px ${item.shadow}`,
              transition: 'transform 0.15s',
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
