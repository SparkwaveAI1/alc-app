'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function AreasPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: '#4CAF7C', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Learning Areas 🌍</h1>
      </div>
      <div style={{ padding: '20px 16px' }}>
        <Link href="/" style={{ color: '#7C5CBF', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>← Back</Link>
        <p style={{ color: '#6B6560', marginTop: 10 }}>Coming soon</p>
      </div>
      <Nav active="me" />
    </div>
  )
}
