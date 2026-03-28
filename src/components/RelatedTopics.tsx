'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Suggestion = { title: string; note: string; is_existing: boolean }
type Connection = { id: string; note: string; topics: { id: string; title: string; slug: string; subject_tag: string } }

interface RelatedTopicsProps {
  topicId: string
  topicTitle: string
  overview: string
  subjectTag: string
  accentColor: string
}

export default function RelatedTopics({ topicId, topicTitle, overview, subjectTag, accentColor }: RelatedTopicsProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // Load existing connections
    fetch(`/api/related-topics?topic_id=${topicId}`)
      .then(r => r.json())
      .then(data => setConnections(Array.isArray(data) ? data : []))
  }, [topicId])

  async function discover() {
    setLoading(true)
    setRevealed(true)
    const res = await fetch('/api/related-topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId, title: topicTitle, overview, subject_tag: subjectTag }),
    })
    const data = await res.json()
    setSuggestions(data.suggestions || [])
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 22, padding: '18px 20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>🕸️</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Where this leads...</div>
        </div>
        {!revealed && (
          <button onClick={discover} style={{ background: `${accentColor}22`, border: 'none', borderRadius: 10, padding: '6px 14px', color: accentColor, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            Discover →
          </button>
        )}
      </div>

      {/* Saved connections */}
      {connections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: suggestions.length > 0 ? 12 : 0 }}>
          {connections.map(c => (
            <Link key={c.id} href={`/wiki/${c.topics.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 16 }}>🔗</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1C1917' }}>{c.topics.title}</div>
                  {c.note && <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{c.note}</div>}
                </div>
                <span style={{ color: '#D1D5DB', fontSize: 16 }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: 14 }}>
          🦋 Finding connections...
        </div>
      )}

      {/* AI suggestions */}
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {suggestions.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4 }}>SUGGESTED PATHS</div>}
          {suggestions.map((s, i) => (
            <Link
              key={i}
              href={`/new-module?title=${encodeURIComponent(s.title)}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{ background: `${accentColor}12`, borderRadius: 14, padding: '12px 14px', border: `1.5px dashed ${accentColor}44`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1C1917' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{s.note}</div>
                  <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, marginTop: 4 }}>Tap to create this module →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {revealed && !loading && suggestions.length === 0 && connections.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#9CA3AF', fontSize: 13 }}>
          No connections found yet — keep exploring!
        </div>
      )}
    </div>
  )
}
