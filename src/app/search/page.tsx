'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Result = {
  id: string; title: string; slug: string; subject_tag: string
  overview: string; type: 'topic' | 'flashcard' | 'note'
  topic_slug?: string; topic_title?: string
}

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

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); setSearched(false); return }
    debounceRef.current = setTimeout(() => search(query), 350)
  }, [query])

  async function search(q: string) {
    setLoading(true)
    const h = { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    const enc = encodeURIComponent(`%${q}%`)

    const [topicsRes, cardsRes, notesRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/topics?or=(title.ilike.${enc},overview.ilike.${enc})&limit=10&select=id,title,slug,subject_tag,overview`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_flashcards?or=(front.ilike.${enc},back.ilike.${enc})&limit=8&select=id,front,back,topic_id,topics(title,slug)`, { headers: h }),
      fetch(`${SUPABASE_URL}/rest/v1/topic_notes?content=ilike.${enc}&limit=6&select=id,content,topic_id,topics(title,slug)`, { headers: h }),
    ])

    const [topics, cards, notes] = await Promise.all([topicsRes.json(), cardsRes.json(), notesRes.json()])

    const combined: Result[] = [
      ...(Array.isArray(topics) ? topics.map((t: { id: string; title: string; slug: string; subject_tag: string; overview: string }) => ({
        id: t.id, title: t.title, slug: t.slug, subject_tag: t.subject_tag,
        overview: t.overview, type: 'topic' as const,
      })) : []),
      ...(Array.isArray(cards) ? cards.map((c: { id: string; front: string; back: string; topics?: { title: string; slug: string } }) => ({
        id: c.id, title: c.front, slug: c.topics?.slug || '', subject_tag: '',
        overview: c.back, type: 'flashcard' as const,
        topic_slug: c.topics?.slug, topic_title: c.topics?.title,
      })) : []),
      ...(Array.isArray(notes) ? notes.map((n: { id: string; content: string; topics?: { title: string; slug: string } }) => ({
        id: n.id, title: n.content.slice(0, 60) + (n.content.length > 60 ? '...' : ''),
        slug: '', subject_tag: '', overview: n.content, type: 'note' as const,
        topic_slug: n.topics?.slug, topic_title: n.topics?.title,
      })) : []),
    ]

    setResults(combined)
    setSearched(true)
    setLoading(false)
  }

  const TYPE_ICON: Record<string, string> = { topic: '📚', flashcard: '🃏', note: '📝' }
  const TYPE_LABEL: Record<string, string> = { topic: 'Module', flashcard: 'Flashcard', note: 'Note' }
  const TYPE_BG: Record<string, string> = { topic: '#EDE9FE', flashcard: '#D1FAE5', note: '#DBEAFE' }
  const TYPE_COLOR: Record<string, string> = { topic: '#7C3AED', flashcard: '#065F46', note: '#1D4ED8' }

  function highlight(text: string, q: string) {
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text.length > 100 ? text.slice(0, 100) + '...' : text
    const start = Math.max(0, idx - 20)
    const end = Math.min(text.length, idx + q.length + 60)
    const snippet = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '')
    const matchIdx = snippet.toLowerCase().indexOf(q.toLowerCase())
    if (matchIdx === -1) return snippet
    return (
      <>
        {snippet.slice(0, matchIdx)}
        <mark style={{ background: '#FDE68A', borderRadius: 3, padding: '0 2px' }}>{snippet.slice(matchIdx, matchIdx + q.length)}</mark>
        {snippet.slice(matchIdx + q.length)}
      </>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1C1917 0%, #374151 100%)', padding: '52px 16px 20px' }}>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Search 🔍</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', borderRadius: 16, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, flashcards, notes..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: "'Be Vietnam Pro', sans-serif", color: '#1C1917', background: 'transparent' }}
          />
          {query && <button onClick={() => setQuery('')} style={{ background: '#E5E7EB', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12, color: '#6B7280' }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: '20px 16px 100px' }}>
        {loading && <div style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>Searching...</div>}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤔</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No results for &ldquo;{query}&rdquo;</div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>Try a different word, or create a module about it!</div>
            <Link href="/new-module" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 999 }}>
              ✨ Create a Module
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 14, fontWeight: 600 }}>{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(r => {
                const href = r.type === 'topic' ? `/wiki/${r.slug}` : `/wiki/${r.topic_slug || ''}`
                const bg = SUBJECT_COLORS[r.subject_tag]
                return (
                  <Link key={`${r.type}-${r.id}`} href={href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.07)' }}>
                      {r.type === 'topic' && bg && (
                        <div style={{ background: bg, height: 6 }} />
                      )}
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ background: TYPE_BG[r.type], borderRadius: 8, padding: '3px 9px', display: 'flex', gap: 4, alignItems: 'center' }}>
                            <span style={{ fontSize: 12 }}>{TYPE_ICON[r.type]}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: TYPE_COLOR[r.type] }}>{TYPE_LABEL[r.type]}</span>
                          </div>
                          {r.topic_title && (
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>in {r.topic_title}</span>
                          )}
                          {r.subject_tag && (
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{r.subject_tag}</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#1C1917', marginBottom: 5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {highlight(r.title, query)}
                        </div>
                        {r.overview && (
                          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>
                            {highlight(r.overview, query)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {!query && !searched && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Search your learning wiki</div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>Find anything across modules, flashcards, and notes</div>
          </div>
        )}
      </div>
      <Nav active="explore" />
    </div>
  )
}
