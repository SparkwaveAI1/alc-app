'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, string> = {
  History: 'linear-gradient(135deg, #78350F, #EA580C)',
  Geography: 'linear-gradient(135deg, #1E1B4B, #4338CA)',
  Science: 'linear-gradient(135deg, #065F46, #10B981)',
  Writing: 'linear-gradient(135deg, #065F46, #059669)',
  Math: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  Art: 'linear-gradient(135deg, #7C3AED, #D946EF)',
  Culture: 'linear-gradient(135deg, #B45309, #F59E0B)',
  'Life Skills': 'linear-gradient(135deg, #0F766E, #14B8A6)',
}

type Topic = { id: string; title: string; slug: string; description: string; subject_tag: string; created_at: string }

export default function Explore() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/topics?order=created_at.desc&select=id,title,slug,description,subject_tag,created_at`, {
      headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    })
      .then(r => r.json())
      .then(data => { setTopics(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(168,85,247,0.4)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>My Modules 🔭</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Your personal learning wiki</p>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {/* Create new module CTA */}
        <Link href="/new-module" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', borderRadius: 22, padding: '20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 22px rgba(124,58,237,0.4)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create a New Module</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 3 }}>Enter a topic — AI builds your learning adventure</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22 }}>›</span>
          </div>
        </Link>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Loading your modules...</div>
        )}

        {!loading && topics.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 22, padding: '32px', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No modules yet</div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>Create your first learning module above!</div>
          </div>
        )}

        {!loading && topics.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Learning Wiki</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {topics.map(topic => {
                const bg = SUBJECT_COLORS[topic.subject_tag] || SUBJECT_COLORS['History']
                return (
                  <Link key={topic.id} href={`/wiki/${topic.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ borderRadius: 22, background: bg, padding: '18px 18px 16px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
                      {topic.subject_tag && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.28)', borderRadius: 9, padding: '4px 10px', marginBottom: 8 }}>
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>{topic.subject_tag.toUpperCase()}</span>
                        </div>
                      )}
                      <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: topic.description ? 4 : 0 }}>{topic.title}</div>
                      {topic.description && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.4 }}>{topic.description}</div>}
                      <div style={{ position: 'absolute', top: 16, right: 18, color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>›</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
      <Nav active="explore" />
    </div>
  )
}
