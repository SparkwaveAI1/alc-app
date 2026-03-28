'use client'

import { use } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function LessonPage({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject, topic } = use(params)
  const topicLabel = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #78350F 0%, #C2410C 70%, #EA580C 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 10, right: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(249,115,22,0.3)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          <Link href={`/subject/${subject}`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← Back</Link>
        </div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>{topicLabel}</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '5px 0 0', position: 'relative', zIndex: 1 }}>Learning adventure • 15 min</p>
      </div>

      <div style={{ padding: '28px 16px 100px' }}>

        {/* Aria AI bubble */}
        <div style={{ background: 'linear-gradient(135deg, #F7D8FF, #ECC6F5)', borderRadius: '20px 20px 20px 6px', padding: '16px 18px', marginBottom: 28, boxShadow: '0 4px 16px rgba(124,58,237,0.15)', display: 'flex', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✨</div>
          <div>
            <p style={{ color: '#4C1D95', fontSize: 14, lineHeight: 1.5, margin: '0 0 10px', fontWeight: 500 }}>
              Hi Nayomi! Let&apos;s explore <strong>{topicLabel}</strong> together. Try to answer the question below before I give you any hints. 🌟
            </p>
            <button style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
              Let&apos;s go →
            </button>
          </div>
        </div>

        {/* Try First prompt */}
        <div style={{ background: '#fff', borderRadius: 22, padding: '20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '4px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E' }}>🧠 TRY FIRST</span>
            </div>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1C1917', lineHeight: 1.5, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What do you already know about {topicLabel}? Write anything that comes to mind.
          </p>
          <textarea
            placeholder="Start writing here... there are no wrong answers!"
            style={{
              width: '100%', minHeight: 100, borderRadius: 16, border: '1.5px solid #E8D5C4',
              padding: '12px 14px', fontSize: 15, fontFamily: "'Be Vietnam Pro', sans-serif",
              background: '#FFF7ED', color: '#1C1917', resize: 'vertical', outline: 'none',
            }}
          />
          <button style={{ marginTop: 12, background: 'linear-gradient(135deg, #EA580C, #F97316)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,88,12,0.35)', width: '100%' }}>
            Submit My Answer →
          </button>
        </div>

        {/* Choose how to learn */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Choose How to Learn</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {[
            { title: 'Read & Discover', desc: 'Explore the topic through stories and explanations', icon: '📖', bg: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', shadow: 'rgba(109,40,217,0.3)' },
            { title: 'Watch & Wonder',  desc: 'See videos and visual explanations',               icon: '🎬', bg: 'linear-gradient(135deg, #0F766E, #14B8A6)', shadow: 'rgba(15,118,110,0.3)' },
            { title: 'Create & Show',   desc: 'Make something to show what you learned',          icon: '🎨', bg: 'linear-gradient(135deg, #EA580C, #F97316)', shadow: 'rgba(234,88,12,0.3)' },
          ].map(item => (
            <Link key={item.title} href="#" style={{ textDecoration: 'none' }}>
              <div style={{ borderRadius: 22, background: item.bg, padding: '18px', boxShadow: `0 6px 22px ${item.shadow}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 3 }}>{item.desc}</div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Save a note */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📝 Your Notes</h2>
        <div style={{ background: '#fff', borderRadius: 22, padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <textarea
            placeholder="Jot down anything interesting you discovered..."
            style={{ width: '100%', minHeight: 80, borderRadius: 14, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, fontFamily: "'Be Vietnam Pro', sans-serif", background: '#FFF7ED', color: '#1C1917', resize: 'vertical', outline: 'none' }}
          />
          <button style={{ marginTop: 10, background: 'linear-gradient(135deg, #065F46, #059669)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(6,95,70,0.3)' }}>
            💾 Save Note
          </button>
        </div>

      </div>
      <Nav active="home" />
    </div>
  )
}
