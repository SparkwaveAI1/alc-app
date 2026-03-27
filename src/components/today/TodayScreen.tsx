'use client'

import Link from 'next/link'
import type { Tables } from '@/lib/types'

interface TodayScreenProps {
  learner: Tables<'learners'> | null
}

export function TodayScreen({ learner }: TodayScreenProps) {
  const name = learner?.name ?? 'Nayomi'
  const streak = learner?.streak_days ?? 7
  const avatar = learner?.avatar_emoji ?? '🌟'

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        padding: '52px 24px 88px',
        background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 35%, #C026D3 70%, #F97316 100%)',
        overflow: 'hidden',
      }}>
        {/* Blob top-right */}
        <div style={{
          position: 'absolute', top: -70, right: -50,
          width: 240, height: 240,
          background: 'rgba(192,38,211,0.3)',
          borderRadius: '58% 42% 65% 35% / 45% 55% 45% 55%',
        }} />
        {/* Blob bottom-left */}
        <div style={{
          position: 'absolute', bottom: 20, left: -30,
          width: 140, height: 140,
          background: 'rgba(251,191,36,0.22)',
          borderRadius: '42% 58% 35% 65% / 55% 45% 55% 45%',
        }} />
        {/* Confetti dots */}
        {([
          { w:10,h:10,bg:'#FBBF24',top:32,left:70,  right:undefined, op:0.9 },
          { w:6, h:6, bg:'#34D399',top:60,left:155, right:undefined, op:0.8 },
          { w:8, h:8, bg:'#F472B6',top:24,left:undefined,right:110,  op:0.9 },
          { w:5, h:5, bg:'#60A5FA',top:88,left:210, right:undefined, op:0.7 },
          { w:7, h:7, bg:'#FBBF24',top:108,left:undefined,right:90,  op:0.8 },
          { w:9, h:9, bg:'#A78BFA',top:44, left:undefined,right:170, op:0.7 },
          { w:5, h:5, bg:'#F472B6',top:130,left:90, right:undefined, op:0.6 },
        ] as { w:number;h:number;bg:string;top:number;left:number|undefined;right:number|undefined;op:number }[]).map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: d.w, height: d.h,
            background: d.bg,
            borderRadius: '50%',
            top: d.top,
            left: d.left,
            right: d.right,
            opacity: d.op,
          }} />
        ))}
        {/* Star decorations */}
        <span style={{ position:'absolute', top:35, left:48, color:'rgba(255,255,255,0.5)', fontSize:13 }}>✦</span>
        <span style={{ position:'absolute', top:75, right:145, color:'rgba(255,255,255,0.5)', fontSize:10 }}>★</span>
        <span style={{ position:'absolute', top:115, right:55, color:'rgba(255,255,255,0.5)', fontSize:13 }}>✦</span>

        {/* Avatar top-right */}
        <div style={{
          position: 'absolute', top: 48, right: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          zIndex: 3,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FBBF24, #F97316)',
            border: '3px solid rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            {avatar}
          </div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11, fontWeight: 800,
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(0,0,0,0.15)',
            padding: '2px 8px', borderRadius: 999,
          }}>
            {name}
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 38, fontWeight: 900, color: 'white',
            lineHeight: 1.1, letterSpacing: '-0.5px',
            textShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}>
            Hi, {name}! 👋
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 6 }}>
            3 adventures waiting for you today
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FBBF24', color: '#78350F',
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
            padding: '7px 16px', borderRadius: 999, marginTop: 14,
            boxShadow: '0 4px 14px rgba(251,191,36,0.45)',
          }}>
            🔥 Day {streak} Streak — You&apos;re on fire!
          </div>
        </div>
      </div>

      {/* ── WAVE DIVIDER ── */}
      <div style={{ marginTop: -2, lineHeight: 0 }}>
        <svg viewBox="0 0 390 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,28 C50,60 110,5 180,38 C240,65 310,8 390,32 L390,64 L0,64 Z" fill="#FFFBF5" />
        </svg>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ background: '#FFFBF5', padding: '4px 20px 110px' }}>

        {/* Section: Today's Adventures */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 14px' }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 19, color: '#3B0764' }}>
            Today&apos;s Adventures ✨
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }}>See all →</div>
        </div>

        {/* Wide card — Ancient Egypt */}
        <div style={{
          width: '100%', height: 168, borderRadius: 28,
          background: 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #D97706 100%)',
          padding: 20, position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 28px rgba(146,64,14,0.3)',
          marginBottom: 12, cursor: 'pointer',
        }}>
          {/* Desert sky */}
          <div style={{
            position: 'absolute', top:0, left:0, right:0, bottom:0,
            background: 'linear-gradient(180deg, rgba(253,186,116,0.3) 0%, transparent 50%)',
          }} />
          {/* Egypt SVG illustration */}
          <svg style={{ position:'absolute', bottom:0, right:0, width:180, height:110 }}
            viewBox="0 0 180 110" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="80" width="180" height="30" fill="rgba(254,243,199,0.25)" rx="4"/>
            <polygon points="90,10 155,80 25,80" fill="rgba(255,255,255,0.18)"/>
            <polygon points="90,10 155,80 90,80" fill="rgba(255,255,255,0.08)"/>
            <polygon points="30,40 60,80 0,80" fill="rgba(255,255,255,0.12)"/>
            <ellipse cx="120" cy="80" rx="16" ry="8" fill="rgba(255,255,255,0.12)"/>
            <rect x="110" y="70" width="20" height="12" fill="rgba(255,255,255,0.1)" rx="3"/>
            <text x="20" y="25" fill="rgba(255,255,255,0.7)" fontSize="10">★</text>
            <text x="140" y="20" fill="rgba(255,255,255,0.5)" fontSize="7">★</text>
            <text x="65" y="15" fill="rgba(255,255,255,0.6)" fontSize="8">✦</text>
            <circle cx="155" cy="18" r="12" fill="rgba(254,243,199,0.85)"/>
            <circle cx="160" cy="14" r="10" fill="rgba(180,83,9,0.7)"/>
          </svg>
          {/* Card content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
              color: '#FEF3C7', fontSize: 11, fontWeight: 700,
              padding: '3px 10px', borderRadius: 999, marginBottom: 8,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              🏺 History
            </div>
            <div style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: 22, color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.1,
            }}>
              Ancient Egypt
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
                color: 'white', fontSize: 12, fontWeight: 600,
                padding: '4px 12px', borderRadius: 999,
              }}>⏱ 20 min</div>
              <div style={{
                background: '#FBBF24', color: '#78350F',
                fontSize: 11, fontWeight: 800,
                padding: '4px 10px', borderRadius: 999,
              }}>NEW</div>
            </div>
          </div>
        </div>

        {/* Half cards row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Creative Writing */}
          <div style={{
            flex: 1, height: 148, borderRadius: 24,
            background: 'linear-gradient(145deg, #0D9488 0%, #0F766E 40%, #1D4ED8 100%)',
            padding: 16, position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 22px rgba(0,0,0,0.15)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            {/* Diagonal line pattern */}
            <div style={{
              position: 'absolute', top:0, right:0, bottom:0, left:0,
              background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px)',
            }} />
            <div style={{ position:'absolute', bottom:8, right:8, fontSize:42, opacity:0.35 }}>✍️</div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                color: '#FEF3C7', fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 999, marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>✍️ Writing</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: 16, color: 'white', lineHeight: 1.2,
                textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>Creative Writing</div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
              color: 'white', fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 999,
              position: 'relative', zIndex: 2, width: 'fit-content',
            }}>⏱ 15 min</div>
          </div>

          {/* World Patterns */}
          <div style={{
            flex: 1, height: 148, borderRadius: 24,
            background: 'linear-gradient(145deg, #C2410C 0%, #EA580C 50%, #F59E0B 100%)',
            padding: 16, position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 22px rgba(0,0,0,0.15)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{
              position: 'absolute', top:0, right:0, bottom:0, left:0,
              background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px)',
            }} />
            <div style={{ position:'absolute', bottom:6, right:6, fontSize:44, opacity:0.35 }}>🌍</div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                color: '#FEF3C7', fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 999, marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>🌐 Geography</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: 16, color: 'white', lineHeight: 1.2,
                textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>World Patterns</div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
              color: 'white', fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 999,
              position: 'relative', zIndex: 2, width: 'fit-content',
            }}>⏱ 10 min</div>
          </div>
        </div>

        {/* Quick Create */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 14px' }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 19, color: '#3B0764' }}>
            Create Something 🎨
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { label: '✏️ Journal',    bg: 'linear-gradient(135deg, #6D28D9, #8B5CF6)' },
            { label: '🎨 Art Studio', bg: 'linear-gradient(135deg, #C2410C, #F97316)' },
            { label: '🗺️ My Map',     bg: 'linear-gradient(135deg, #0D9488, #14B8A6)' },
            { label: '📝 Notes',      bg: 'linear-gradient(135deg, #B45309, #F59E0B)' },
          ].map((pill) => (
            <button key={pill.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '11px 18px', borderRadius: 999,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
              color: 'white', whiteSpace: 'nowrap',
              background: pill.bg,
              boxShadow: '0 4px 14px rgba(0,0,0,0.14)', cursor: 'pointer',
              border: 'none',
            }}>
              {pill.label}
            </button>
          ))}
        </div>

        {/* Aria teaser */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 14px' }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 19, color: '#3B0764' }}>
            Aria Says 💬
          </div>
        </div>
        <div style={{
          background: 'white', borderRadius: 24, padding: '16px 18px',
          display: 'flex', gap: 14, alignItems: 'center',
          boxShadow: '0 6px 24px rgba(107,33,168,0.08)',
          border: '1.5px solid rgba(167,139,250,0.2)',
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #F97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>⭐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>
              Your AI Guide
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4, fontWeight: 500 }}>
              Did you know the Great Pyramid was the world&apos;s tallest structure for 3,800 years? Start Egypt today! 🏛️
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
