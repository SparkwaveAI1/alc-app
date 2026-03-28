'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default function StandardsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: '#F5A623', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Standards Tracker ⭐</h1>
      </div>
      <div style={{ padding: '20px 16px' }}>
        <Link href="/me" style={{ color: '#7C5CBF', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>← Back</Link>
        <p style={{ color: '#6B6560', marginTop: 10 }}>Coming soon</p>
      </div>
      <Nav active="me" />
    </div>
  )
}
