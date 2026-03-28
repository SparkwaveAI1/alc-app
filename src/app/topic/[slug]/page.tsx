'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, string> = {
  Math: '#5BA4CF', Reading: '#7C5CBF', Writing: '#7C5CBF',
  Science: '#4CAF7C', History: '#F5A623', Geography: '#5BA4CF',
  Art: '#E8715A', Music: '#7C5CBF', default: '#7C5CBF',
}

export default function TopicPage() {
  const params = useParams()
  const slug = params.slug as string
  const [topic, setTopic] = useState<any>(null)
  const [cards, setCards] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [expandedSection, setExpandedSection] = useState<'read' | 'watch' | 'create' | null>('read')
  const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(null)
  const [newNote, setNewNote] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    async function load() {
      try {
        // Step 1: fetch topic by slug first to get the real UUID
        const tRes = await fetch(`${SB_URL}/rest/v1/topics?slug=eq.${slug}&limit=1`, {
          headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
        }).then(r => r.json())

        if (!Array.isArray(tRes) || !tRes[0]) {
          setLoading(false)
          return
        }

        const t = tRes[0]
        setTopic(t)
        const id = t.id

        // Step 2: fetch all related data using the real UUID
        const [cRes, nRes, linkRes] = await Promise.all([
          fetch(`${SB_URL}/rest/v1/flashcards?topic_id=eq.${id}&order=created_at`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch(`${SB_URL}/rest/v1/topic_notes?topic_id=eq.${id}&order=created_at.desc`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch(`${SB_URL}/rest/v1/resource_topic_links?topic_id=eq.${id}`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
        ])

        setCards(Array.isArray(cRes) ? cRes : [])
        setNotes(Array.isArray(nRes) ? nRes : [])

        // Step 3: fetch actual resource records from link IDs
        if (Array.isArray(linkRes) && linkRes.length > 0) {
          const resourceIds = linkRes.map((l: any) => l.resource_id)
          const resRes = await fetch(`${SB_URL}/rest/v1/resources?id=in.(${resourceIds.join(',')})`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json())
          setResources(Array.isArray(resRes) ? resRes : [])
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    if (slug) load()
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#7C5CBF' }}>Loading...</div>
      </div>
    </div>
  )

  if (!topic) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 18, color: '#2D2A26', marginBottom: 8 }}>Topic not found</div>
        <Link href="/explore" style={{ color: '#7C5CBF', fontWeight: 600, textDecoration: 'none' }}>← Back to explore</Link>
      </div>
    </div>
  )

  const color = SUBJECT_COLORS[topic.subject_tag] || SUBJECT_COLORS.default
  const vocabToShow = topic.key_vocabulary?.slice(0, 4) || []
  const card = cards[currentCard]

  const handleSaveNote = async () => {
    if (!newNote.trim()) return
    try {
      await fetch('/api/topics/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topic.id, content: newNote }),
      })
      setNotes([{ id: Math.random(), content: newNote, created_at: new Date().toISOString(), user_id: null }, ...notes])
      setNewNote('')
    } catch {}
  }

  const handleSaveResource = async () => {
    if (!newUrl.trim()) return
    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newUrl, url: newUrl, topic_id: topic.id }),
      })
      setResources([{ id: Math.random(), title: newUrl, url: newUrl, resource_type: 'link', created_at: new Date().toISOString() }, ...resources])
      setNewUrl('')
    } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Hero */}
      <div style={{ background: color, padding: '20px 16px 32px', display: 'flex', alignItems: 'flex-start', gap: 12, borderRadius: '0 0 24px 24px' }}>
        <Link href="/explore" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22, textDecoration: 'none', lineHeight: 1 }}>←</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.8px', marginBottom: 6 }}>{topic.subject_tag?.toUpperCase() || 'TOPIC'}</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>{topic.title}</h1>
          {topic.description && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{topic.description}</p>}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Activity cards */}

        {/* Card 1: Read & Discover */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'read' ? null : 'read')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>📖 Read & Discover</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'read' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'read' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>
              {topic.try_first_questions && topic.try_first_questions.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F5A623', marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>🤔 Think about this first</div>
                  <div style={{ background: '#FFFBF5', borderLeft: '3px solid #F5A623', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#2D2A26', lineHeight: 1.5 }}>{topic.try_first_questions[0]}</div>
                </div>
              )}
              {topic.overview && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 8 }}>What is this about?</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#2D2A26', lineHeight: 1.6 }}>{topic.overview}</p>
                </div>
              )}
              {topic.subtopics && topic.subtopics.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 10 }}>🗺️ What you will explore</div>
                  {topic.subtopics.map((s: any, i: number) => (
                    <div key={i}>
                      <button onClick={() => setExpandedSubtopic(expandedSubtopic === i ? null : i)} style={{
                        width: '100%', padding: '10px 12px', background: expandedSubtopic === i ? `${color}20` : 'transparent',
                        border: 'none', borderRadius: 12, display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', cursor: 'pointer', marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
                          <div style={{ fontSize: 18 }}>{s.emoji}</div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#2D2A26', textAlign: 'left' }}>{s.title}</div>
                        </div>
                        <div style={{ fontSize: 16, color: '#D1C8D8', transform: expandedSubtopic === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</div>
                      </button>
                      {expandedSubtopic === i && (
                        <div style={{ padding: '0 12px 12px', fontSize: 13, color: '#6B6560', lineHeight: 1.5 }}>{s.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {topic.key_vocabulary && topic.key_vocabulary.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 10 }}>📚 Key vocabulary</div>
                  {vocabToShow.map((v: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: i < vocabToShow.length - 1 ? '1px solid #F3F0EB' : 'none' }}>
                      <div style={{ fontWeight: 700, color: '#2D2A26', minWidth: 80 }}>{v.word}</div>
                      <div style={{ color: '#6B6560', flex: 1 }}>— {v.definition}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Watch & Wonder */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'watch' ? null : 'watch')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>🎬 Watch & Wonder</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'watch' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'watch' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', marginBottom: 10 }}>Paste a YouTube video URL</div>
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://youtu.be/..." style={{
                  width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
                  fontSize: 13, marginBottom: 8, background: '#FFF7ED', color: '#2D2A26',
                  outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                }} />
                <button onClick={handleSaveResource} disabled={!newUrl.trim()} style={{
                  width: '100%', background: newUrl.trim() ? '#4CAF7C' : '#E5E7EB',
                  color: newUrl.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 10,
                  fontWeight: 700, fontSize: 13, padding: '8px', cursor: newUrl.trim() ? 'pointer' : 'default',
                  fontFamily: "'DM Sans', sans-serif",
                }}>Save video</button>
              </div>
              {resources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6B6560', fontSize: 13 }}>No videos yet — paste a link above!</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {resources.map(r => (
                    <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                      background: '#F3F0EB', borderRadius: 14, padding: '12px', display: 'flex',
                      gap: 10, alignItems: 'center', textDecoration: 'none', color: '#2D2A26',
                    }}>
                      <div style={{ fontSize: 24 }}>▶️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title || r.url}</div>
                      </div>
                      <div style={{ color: '#D1C8D8', fontSize: 14 }}>→</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 3: Create & Imagine */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'create' ? null : 'create')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>✨ Create & Imagine</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'create' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'create' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>
              <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
                Write 3-5 sentences explaining what you learned about {topic.title} to a younger child.
              </div>
              <textarea placeholder="Your response..." style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '12px 14px',
                fontSize: 13, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26',
                outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
                minHeight: 100, resize: 'vertical',
              }} />
              <button style={{
                width: '100%', background: color, color: '#fff', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: 13, padding: '10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                💾 Save to Portfolio
              </button>
            </div>
          )}
        </div>

        {/* Flashcards section */}
        {cards.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🃏 Flashcards ({cards.length})</span>
            </div>
            <div style={{ perspective: '1000px', marginBottom: 12 }}>
              <div style={{
                position: 'relative', minHeight: 220,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Front */}
                <div onClick={() => setFlipped(!flipped)} style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#fff', borderRadius: 24, padding: '32px 24px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,42,38,0.1)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6560', letterSpacing: '1px', marginBottom: 16 }}>QUESTION</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#2D2A26' }}>{card?.front}</div>
                  <div style={{ marginTop: 20, fontSize: 26, opacity: 0.6 }}>👆</div>
                </div>
                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                  background: color, borderRadius: 24, padding: '32px 24px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,92,191,0.2)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 16 }}>ANSWER</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{card?.back}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }} disabled={currentCard === 0} style={{
                flex: 1, background: currentCard === 0 ? '#E5E7EB' : '#fff',
                color: currentCard === 0 ? '#9E9792' : '#2D2A26',
                border: 'none', borderRadius: 14, padding: '10px',
                fontWeight: 700, fontSize: 13, cursor: currentCard === 0 ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>← Prev</button>
              <button onClick={() => setFlipped(!flipped)} style={{
                flex: 2, background: color, color: '#fff', border: 'none', borderRadius: 14, padding: '10px',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>👆 Flip</button>
              <button onClick={() => { setCurrentCard(Math.min(cards.length - 1, currentCard + 1)); setFlipped(false); }} disabled={currentCard === cards.length - 1} style={{
                flex: 1, background: currentCard === cards.length - 1 ? '#E5E7EB' : '#fff',
                color: currentCard === cards.length - 1 ? '#9E9792' : '#2D2A26',
                border: 'none', borderRadius: 14, padding: '10px',
                fontWeight: 700, fontSize: 13, cursor: currentCard === cards.length - 1 ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>Next →</button>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
              {cards.map((_, i) => (
                <button key={i} onClick={() => { setCurrentCard(i); setFlipped(false); }} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i === currentCard ? color : '#E5E7EB',
                  border: 'none', cursor: 'pointer', padding: 0,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Notes section */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26', marginBottom: 10 }}>📝 My notes</div>
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write your thoughts..." style={{
            width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
            fontSize: 13, marginBottom: 10, background: '#FFF7ED', color: '#2D2A26',
            outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
            minHeight: 80, resize: 'vertical',
          }} />
          <button onClick={handleSaveNote} disabled={!newNote.trim()} style={{
            width: '100%', background: newNote.trim() ? color : '#E5E7EB',
            color: newNote.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 13, padding: '8px', cursor: newNote.trim() ? 'pointer' : 'default',
            fontFamily: "'DM Sans', sans-serif",
          }}>Save note</button>
          {notes.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notes.map(n => (
                <div key={n.id} style={{ background: '#F9F6F0', borderRadius: 14, padding: '12px', borderLeft: `3px solid ${color}` }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#2D2A26', lineHeight: 1.5 }}>{n.content}</p>
                  <div style={{ fontSize: 11, color: '#6B6560', marginTop: 6 }}>{new Date(n.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Nav active="explore" />
    </div>
  )
}
