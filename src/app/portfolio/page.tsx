'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function PortfolioPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>My Portfolio 🎨</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>All your creations and artifacts</p>
      </div>
      <div style={{ padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 6 }}>Nothing yet</div>
        <p style={{ color: '#6B6560', margin: '0 0 16px' }}>Create something to see it here</p>
        <Link href="/create" style={{ background: '#7C5CBF', color: '#fff', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Start creating ✨</Link>
      </div>
      <Nav active="me" />
    </div>
  )
}
