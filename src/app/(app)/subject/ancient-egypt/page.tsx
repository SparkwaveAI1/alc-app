'use client'

import Link from 'next/link'

export default function AncientEgypt() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ===== HERO ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #92400E 0%, #B45309 35%, #D97706 65%, #F59E0B 100%)',
        padding: '52px 20px 32px',
        position: 'relative', overflow: 'hidden', minHeight: 200,
      }}>
        {/* Stars */}
        <div style={{ position: 'absolute', top: 30, right: 80, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>✦</div>
        <div style={{ position: 'absolute', top: 55, left: 160, color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>✦</div>
        <div style={{ position: 'absolute', bottom: 40, right: 40, color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>✦</div>

        {/* Pyramid decorations */}
        <div style={{ position: 'absolute', bottom: 0, right: 20, opacity: 0.25 }}>
          <div style={{ width: 0, height: 0, borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: '80px solid rgba(255,220,150,0.9)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 100, opacity: 0.18 }}>
          <div style={{ width: 0, height: 0, borderLeft: '35px solid transparent', borderRight: '35px solid transparent', borderBottom: '50px solid rgba(255,220,150,0.9)' }} />
        </div>

        {/* Back + chip row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '6px 12px',
              color: '#fff', fontSize: 13, fontWeight: 600,
            }}>← Back</div>
          </Link>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '6px 12px',
          }}>
            <span style={{ fontSize: 12 }}>📚</span>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>HISTORY</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 6px',
          fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1,
          position: 'relative', zIndex: 1,
        }}>Ancient Egypt</h1>
        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, fontWeight: 400, margin: '0 0 18px', position: 'relative', zIndex: 1 }}>
          Pyramids & Pharaohs
        </p>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 130, height: 9, background: 'rgba(255,255,255,0.3)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: '#FBBF24', borderRadius: 999 }} />
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '4px 12px',
            color: '#fff', fontSize: 12, fontWeight: 600,
          }}>40% Explored</div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ padding: '32px 16px 120px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Choose Your Adventure
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

          {/* Read & Discover */}
          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
            padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 6px 22px rgba(109,40,217,0.3)', cursor: 'pointer',
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>📖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3 }}>
                Read & Discover
              </div>
              <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
                Explore stories of pharaohs and gods
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 300 }}>›</span>
          </div>

          {/* Watch & Wonder */}
          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
            padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 6px 22px rgba(15,118,110,0.3)', cursor: 'pointer',
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>🎬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3 }}>
                Watch & Wonder
              </div>
              <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
                See how pyramids were really built
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 300 }}>›</span>
          </div>

          {/* Create & Imagine */}
          <div style={{
            borderRadius: 22,
            background: 'linear-gradient(135deg, #EA580C 0%, #F97316 60%, #FB923C 100%)',
            padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 6px 22px rgba(234,88,12,0.3)', cursor: 'pointer',
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>🎨</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3 }}>
                Create & Imagine
              </div>
              <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
                Draw, write, and make it your own
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 300 }}>›</span>
          </div>
        </div>

        {/* Your Notes */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', margin: '32px 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your Notes 📝
        </h2>
        <div style={{
          background: '#fff', borderRadius: 18, padding: '16px',
          border: '1.5px dashed #DDD6FE',
          color: '#9CA3AF', fontSize: 14, fontStyle: 'italic',
          minHeight: 80, display: 'flex', alignItems: 'center',
        }}>
          Nothing yet — start reading and add your first note!
        </div>
      </div>
    </div>
  )
}
