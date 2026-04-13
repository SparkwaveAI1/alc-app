'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, string> = {
  Math: '#5BA4CF', Reading: '#7C5CBF', Writing: '#7C5CBF',
  Science: '#4CAF7C', History: '#F5A623', Geography: '#5BA4CF',
  Art: '#E8715A', Music: '#7C5CBF', default: '#7C5CBF',
}

type Message = { role: 'user' | 'assistant'; content: string }

function TopicPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const isNew = searchParams.get('new') === '1'
  const slug = params.slug as string
  const [topic, setTopic] = useState<any>(null)
  const [cards, setCards] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Flashcard state
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewedCards, setReviewedCards] = useState<Record<string, 'knew' | 'retry'>>({})
  const [retryQueue, setRetryQueue] = useState<any[]>([])

  // UI state
  const [expandedSection, setExpandedSection] = useState<'read' | 'watch' | 'create' | null>('read')
  const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(null)
  const [subtopicDeep, setSubtopicDeep] = useState<Record<number, string>>({})
  const [loadingDeep, setLoadingDeep] = useState<number | null>(null)

  // Add flashcard state
  const [showAddCard, setShowAddCard] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [savingCard, setSavingCard] = useState(false)
  const [learnerId, setLearnerId] = useState<string | null>(null)

  // Notes / resources
  const [newNote, setNewNote] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [urlTitle, setUrlTitle] = useState('')
  const [fetchingTitle, setFetchingTitle] = useState(false)

  // Aria chat
  const [ariaOpen, setAriaOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [generatingCards, setGeneratingCards] = useState<string | null>(null) // 'chat-N' | 'deep-N' | 'vocab-N'
  const [savedFromContent, setSavedFromContent] = useState<Set<string>>(new Set())

  // Related topics
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [relatedGenerated, setRelatedGenerated] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // For newly created topics, retry up to 5x with 800ms delay (Supabase replication lag)
        let tRes = null
        const maxAttempts = isNew ? 5 : 1
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          if (attempt > 0) await new Promise(r => setTimeout(r, 800))
          const res = await fetch(`${SB_URL}/rest/v1/topics?slug=eq.${slug}&limit=1`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json())
          if (Array.isArray(res) && res[0]) { tRes = res; break }
        }
        if (!Array.isArray(tRes) || !tRes[0]) { setLoading(false); return }
        const t = (tRes as any[])[0]
        setTopic(t)
        const id = t.id
        const [cRes, nRes, linkRes, relRes] = await Promise.all([
          fetch(`${SB_URL}/rest/v1/flashcards?topic_id=eq.${id}&order=created_at`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch(`${SB_URL}/rest/v1/topic_notes?topic_id=eq.${id}&order=created_at.desc`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch(`${SB_URL}/rest/v1/resource_topic_links?topic_id=eq.${id}`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json()),
          fetch(`/api/related-topics?topic_id=${id}`).then(r => r.json()),
        ])
        setCards(Array.isArray(cRes) ? cRes : [])
        setNotes(Array.isArray(nRes) ? nRes : [])
        setRelated(Array.isArray(relRes) ? relRes : [])
        if (Array.isArray(linkRes) && linkRes.length > 0) {
          const ids = linkRes.map((l: any) => l.resource_id)
          const resRes = await fetch(`${SB_URL}/rest/v1/resources?id=in.(${ids.join(',')})`, {
            headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` }
          }).then(r => r.json())
          setResources(Array.isArray(resRes) ? resRes : [])
        }
      } catch (e) { console.error(e) }
      setLoading(false)
      // Fetch learner ID for flashcard reviews
      const lr = await fetch('/api/learner-id').then(r => r.json()).catch(() => ({ id: null }))
      if (lr.id) setLearnerId(lr.id)
    }
    if (slug) load()
  }, [slug])

  useEffect(() => {
    if (ariaOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, ariaOpen])

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
  const card = cards[currentCard]

  // ── Go Deeper on subtopic ──
  const handleGoDeeper = async (idx: number, subtopic: any) => {
    if (subtopicDeep[idx]) { setExpandedSubtopic(expandedSubtopic === idx ? null : idx); return }
    setLoadingDeep(idx)
    setExpandedSubtopic(idx)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Tell me more about "${subtopic.title}" as part of learning about ${topic.title}. Give me 2-3 rich paragraphs with interesting details a curious 10-year-old would love. End with one thought-provoking question.` }],
          topic: topic.title,
          context: topic.overview,
        }),
      })
      const data = await res.json()
      setSubtopicDeep(prev => ({ ...prev, [idx]: data.message || 'No content returned.' }))
    } catch { setSubtopicDeep(prev => ({ ...prev, [idx]: 'Something went wrong. Try again.' })) }
    setLoadingDeep(null)
  }

  // ── Flashcard review (knew it / try again) ──
  const handleReview = async (knew_it: boolean) => {
    const card = cards[currentCard]
    if (!card) return
    setReviewedCards(prev => ({ ...prev, [card.id]: knew_it ? 'knew' : 'retry' }))
    if (!knew_it) {
      setRetryQueue(prev => prev.find(c => c.id === card.id) ? prev : [...prev, card])
    }
    // Record to DB (best effort)
    fetch('/api/flashcards', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flashcard_id: card.id, user_id: learnerId, knew_it }), // learnerId fetched from /api/learner-id
    }).catch(() => {})
    // Advance to next card
    if (currentCard < cards.length - 1) {
      setCurrentCard(c => c + 1); setFlipped(false)
    } else if (retryQueue.length > 0) {
      // Cycle through retry queue
      setCurrentCard(cards.indexOf(retryQueue[0])); setFlipped(false)
      setRetryQueue(prev => prev.slice(1))
    }
  }

  // ── Add flashcard ──
  const handleAddCard = async () => {
    if (!newFront.trim() || !newBack.trim()) return
    setSavingCard(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topic.id, front: newFront, back: newBack }),
      })
      const saved = await res.json()
      if (saved?.id) {
        setCards(prev => [...prev, saved])
        setCurrentCard(cards.length)
        setFlipped(false)
      }
      setNewFront(''); setNewBack(''); setShowAddCard(false)
    } catch {}
    setSavingCard(false)
  }

  // ── Save note ──
  const handleSaveNote = async () => {
    if (!newNote.trim()) return
    try {
      await fetch('/api/topics/notes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topic.id, content: newNote }),
      })
      setNotes(prev => [{ id: Math.random(), content: newNote, created_at: new Date().toISOString() }, ...prev])
      setNewNote('')
    } catch {}
  }

  // ── Fetch YouTube title on URL change ──
  const handleUrlChange = async (url: string) => {
    setNewUrl(url)
    setUrlTitle('')
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([\w-]+)/)
    if (!ytMatch) return
    setFetchingTitle(true)
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      if (res.ok) { const d = await res.json(); setUrlTitle(d.title || '') }
    } catch {}
    setFetchingTitle(false)
  }

  // ── Save resource ──
  const handleSaveResource = async () => {
    if (!newUrl.trim()) return
    const title = urlTitle || newUrl
    try {
      await fetch('/api/resources', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url: newUrl, topic_id: topic.id }),
      })
      setResources(prev => [{ id: Math.random(), title, url: newUrl }, ...prev])
      setNewUrl(''); setUrlTitle('')
    } catch {}
  }

  // ── Aria chat ──
  const handleSendChat = async () => {
    const text = chatInput.trim()
    if (!text || chatLoading) return
    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic: topic.title, context: topic.overview }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Hmm, something went wrong. Try again!' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again!' }])
    }
    setChatLoading(false)
  }

  // ── Generate flashcards from content ──
  const handleMakeFlashcards = async (content: string, key: string, count = 2) => {
    setGeneratingCards(key)
    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, topic_id: topic.id, topic_title: topic.title, count }),
      })
      const data = await res.json()
      if (data.cards?.length) {
        setCards(prev => [...prev, ...data.cards])
        setSavedFromContent(prev => new Set([...prev, key]))
      }
    } catch {}
    setGeneratingCards(null)
  }

  // ── Generate related topics ──
  const handleGenerateRelated = async () => {
    setLoadingRelated(true)
    setRelatedGenerated(true)
    try {
      const res = await fetch('/api/related-topics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topic.id, title: topic.title, overview: topic.overview, subject_tag: topic.subject_tag }),
      })
      const data = await res.json()
      setRelated(data.suggestions || [])
    } catch {}
    setLoadingRelated(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{ background: color, padding: '20px 16px 32px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <Link href="/explore" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22, textDecoration: 'none', lineHeight: 1, padding: '8px 12px 8px 4px', marginLeft: -4 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.8px', marginBottom: 4 }}>{topic.subject_tag?.toUpperCase()}</div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>{topic.title}</h1>
            {topic.description && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{topic.description}</p>}
          </div>
        </div>
        {/* Ask Aria button in hero */}
        <button onClick={() => setAriaOpen(true)} style={{
          background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.5)',
          borderRadius: 14, padding: '10px 16px', color: '#fff', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <span>Ask Aria anything about {topic.title}...</span>
        </button>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* Fun fact */}
        {topic.fun_fact && (
          <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF0D6)', borderRadius: 20, padding: '16px 18px', marginBottom: 14, border: '1.5px solid #F5A62340' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', letterSpacing: '0.8px', marginBottom: 6 }}>✨ DID YOU KNOW?</div>
            <p style={{ margin: 0, fontSize: 14, color: '#2D2A26', lineHeight: 1.6 }}>{topic.fun_fact}</p>
          </div>
        )}

        {/* ── READ & DISCOVER ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'read' ? null : 'read')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>📖 Read & Discover</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'read' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'read' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>

              {/* Think first */}
              {topic.try_first_questions?.[0] && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F5A623', marginBottom: 8 }}>🤔 Think about this first</div>
                  <div style={{ background: '#FFFBF5', borderLeft: '3px solid #F5A623', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#2D2A26', lineHeight: 1.6 }}>
                    {topic.try_first_questions[0]}
                  </div>
                </div>
              )}

              {/* Overview */}
              {topic.overview && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 8 }}>What is this about?</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#2D2A26', lineHeight: 1.7 }}>{topic.overview}</p>
                </div>
              )}

              {/* Subtopics — expandable with Go Deeper */}
              {topic.subtopics?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 10 }}>🗺️ Explore deeper</div>
                  {topic.subtopics.map((s: any, i: number) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <button onClick={() => setExpandedSubtopic(expandedSubtopic === i ? null : i)} style={{
                        width: '100%', padding: '12px 14px',
                        background: expandedSubtopic === i ? `${color}18` : '#F9F6F0',
                        border: expandedSubtopic === i ? `1.5px solid ${color}40` : '1.5px solid transparent',
                        borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontSize: 20 }}>{s.emoji}</span>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2A26' }}>{s.title}</div>
                            {s.description && <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>{s.description}</div>}
                          </div>
                        </div>
                        <div style={{ fontSize: 16, color: '#D1C8D8', transform: expandedSubtopic === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</div>
                      </button>

                      {expandedSubtopic === i && (
                        <div style={{ padding: '12px 14px', background: `${color}08`, borderRadius: '0 0 14px 14px', marginTop: -4 }}>
                          {subtopicDeep[i] ? (
                            <div>
                              <div style={{ fontSize: 14, color: '#2D2A26', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 12 }}>{subtopicDeep[i]}</div>
                              {savedFromContent.has(`deep-${i}`) ? (
                                <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>✓ Flashcards saved!</div>
                              ) : (
                                <button onClick={() => handleMakeFlashcards(subtopicDeep[i], `deep-${i}`, 2)} disabled={generatingCards === `deep-${i}`} style={{
                                  background: generatingCards === `deep-${i}` ? '#E5E7EB' : '#F3EEFF', border: 'none', borderRadius: 10,
                                  padding: '8px 14px', fontSize: 12, fontWeight: 700, color: generatingCards === `deep-${i}` ? '#6B6560' : '#7C5CBF',
                                  cursor: generatingCards === `deep-${i}` ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                                }}>
                                  {generatingCards === `deep-${i}` ? '🧠 Creating...' : '🃏 Make flashcards from this'}
                                </button>
                              )}
                            </div>
                          ) : loadingDeep === i ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7C5CBF', fontSize: 13, padding: '8px 0' }}>
                              <span style={{ fontSize: 20 }}>🧠</span> Aria is thinking...
                            </div>
                          ) : (
                            <button onClick={() => handleGoDeeper(i, s)} style={{
                              background: color, color: '#fff', border: 'none', borderRadius: 12,
                              padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                              fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                              🔍 Go deeper on this
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Vocabulary */}
              {topic.key_vocabulary?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 10 }}>📚 Key vocabulary</div>
                  {topic.key_vocabulary.map((v: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: i < topic.key_vocabulary.length - 1 ? '1px solid #F3F0EB' : 'none', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#2D2A26', fontSize: 14 }}>{v.word}</div>
                        <div style={{ color: '#6B6560', fontSize: 13, lineHeight: 1.5, marginTop: 2 }}>— {v.definition}</div>
                      </div>
                      {savedFromContent.has(`vocab-${i}`) ? (
                        <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, flexShrink: 0 }}>✓</div>
                      ) : (
                        <button onClick={() => handleMakeFlashcards(`Word: ${v.word}\nDefinition: ${v.definition}`, `vocab-${i}`, 1)} disabled={generatingCards === `vocab-${i}`} style={{
                          background: '#F3EEFF', border: 'none', borderRadius: 8, padding: '5px 10px',
                          fontSize: 11, fontWeight: 700, color: '#7C5CBF', cursor: 'pointer',
                          flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {generatingCards === `vocab-${i}` ? '...' : '+ card'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── WATCH & WONDER ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'watch' ? null : 'watch')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>🎬 Watch & Wonder</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'watch' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'watch' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', marginBottom: 8 }}>Paste a YouTube video URL</div>
              <input value={newUrl} onChange={e => handleUrlChange(e.target.value)} placeholder="https://youtu.be/..." style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
                fontSize: 13, marginBottom: 8, background: '#FFF7ED', color: '#2D2A26',
                outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
              }} />
              {fetchingTitle && <div style={{ fontSize: 12, color: '#7C5CBF', marginBottom: 8 }}>🔍 Getting title...</div>}
              {urlTitle && (
                <div style={{ background: '#F0EBF8', borderRadius: 10, padding: '8px 12px', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#2D2A26', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>▶️</span> {urlTitle}
                </div>
              )}
              <button onClick={handleSaveResource} disabled={!newUrl.trim()} style={{
                width: '100%', background: newUrl.trim() ? '#4CAF7C' : '#E5E7EB',
                color: newUrl.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: 13, padding: '8px', cursor: newUrl.trim() ? 'pointer' : 'default',
                fontFamily: "'DM Sans', sans-serif", marginBottom: 14,
              }}>Save video</button>
              {resources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', color: '#6B6560', fontSize: 13 }}>No videos yet — paste a link above!</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {resources.map(r => (
                    <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                      background: '#F3F0EB', borderRadius: 14, padding: '14px', display: 'flex',
                      gap: 12, alignItems: 'center', textDecoration: 'none', color: '#2D2A26',
                    }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>▶️</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26', lineHeight: 1.4 }}>
                          {r.title && r.title !== r.url ? r.title : 'Watch video'}
                        </div>
                        <div style={{ fontSize: 11, color: '#7C5CBF', marginTop: 2, fontWeight: 600 }}>Tap to open ↗</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── CREATE & IMAGINE ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <button onClick={() => setExpandedSection(expandedSection === 'create' ? null : 'create')} style={{
            width: '100%', padding: '16px 18px', border: 'none', background: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>✨ Create & Imagine</div>
            <div style={{ fontSize: 18, color: '#D1C8D8', transition: 'transform 0.2s', transform: expandedSection === 'create' ? 'rotate(90deg)' : 'none' }}>›</div>
          </button>
          {expandedSection === 'create' && (
            <div style={{ padding: '0 18px 18px', borderTop: '1px solid #F3F0EB' }}>
              <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
                Write 3–5 sentences explaining what you learned about <strong style={{ fontStyle: 'normal', color: '#2D2A26' }}>{topic.title}</strong> to a younger child.
              </div>
              <textarea placeholder="Your response..." style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '12px 14px',
                fontSize: 13, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26',
                outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
                minHeight: 100, resize: 'vertical',
              }} />
              <button style={{
                width: '100%', background: color, color: '#fff', border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: 13, padding: '10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>💾 Save to Portfolio</button>
            </div>
          )}
        </div>

        {/* ── FLASHCARDS ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(45,42,38,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: cards.length > 0 || showAddCard ? '1px solid #F3F0EB' : 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26' }}>🃏 Flashcards {cards.length > 0 && <span style={{ color: '#6B6560', fontWeight: 400, fontSize: 13 }}>({cards.length})</span>}</div>
            <button onClick={() => setShowAddCard(!showAddCard)} style={{
              background: showAddCard ? '#F3F0EB' : color, color: showAddCard ? '#6B6560' : '#fff',
              border: 'none', borderRadius: 10, padding: '6px 14px', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              {showAddCard ? 'Cancel' : '+ Add card'}
            </button>
          </div>

          {/* Add card form */}
          {showAddCard && (
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #F3F0EB', background: '#FDFBF7' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', marginBottom: 6 }}>QUESTION (front)</div>
              <input value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="e.g. What is a pharaoh?" style={{
                width: '100%', borderRadius: 10, border: '1.5px solid #E8E2D9', padding: '10px 12px',
                fontSize: 13, marginBottom: 12, background: '#fff', color: '#2D2A26',
                outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
              }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B6560', marginBottom: 6 }}>ANSWER (back)</div>
              <input value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="e.g. The all-powerful king or queen of ancient Egypt" style={{
                width: '100%', borderRadius: 10, border: '1.5px solid #E8E2D9', padding: '10px 12px',
                fontSize: 13, marginBottom: 12, background: '#fff', color: '#2D2A26',
                outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
              }} />
              <button onClick={handleAddCard} disabled={!newFront.trim() || !newBack.trim() || savingCard} style={{
                width: '100%', background: newFront.trim() && newBack.trim() ? color : '#E5E7EB',
                color: newFront.trim() && newBack.trim() ? '#fff' : '#9E9792',
                border: 'none', borderRadius: 12, padding: '10px', fontWeight: 700, fontSize: 13,
                cursor: newFront.trim() && newBack.trim() ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif",
              }}>
                {savingCard ? 'Saving...' : '💾 Save flashcard'}
              </button>
            </div>
          )}

          {/* Card viewer */}
          {cards.length > 0 && card && (
            <div style={{ padding: '16px 18px' }}>
              <div style={{ perspective: '1000px', marginBottom: 12 }}>
                <div style={{
                  position: 'relative', minHeight: 200,
                  transformStyle: 'preserve-3d', transition: 'transform 0.5s',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>
                  <div onClick={() => setFlipped(!flipped)} style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: '#F9F6F0', borderRadius: 20, padding: '28px 20px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    textAlign: 'center', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6560', letterSpacing: '1px', marginBottom: 14 }}>QUESTION</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#2D2A26', lineHeight: 1.5 }}>{card.front}</div>
                    <div style={{ marginTop: 16, fontSize: 22, opacity: 0.5 }}>👆 tap to flip</div>
                  </div>
                  <div onClick={() => setFlipped(!flipped)} style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                    background: color, borderRadius: 20, padding: '28px 20px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    textAlign: 'center', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 14 }}>ANSWER</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>{card.back}</div>
                  </div>
                </div>
              </div>
              {/* Review buttons — shown after card is flipped */}
              {flipped ? (
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <button onClick={() => handleReview(false)} style={{
                    flex: 1, background: '#FEE2E2', border: 'none', borderRadius: 14, padding: '12px 8px',
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#DC2626', fontFamily: "'Nunito', sans-serif",
                  }}>✗ Try again</button>
                  <button onClick={() => handleReview(true)} style={{
                    flex: 1, background: '#D1FAE5', border: 'none', borderRadius: 14, padding: '12px 8px',
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#059669', fontFamily: "'Nunito', sans-serif",
                  }}>✓ Got it!</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <button onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false) }} disabled={currentCard === 0} style={{
                    flex: 1, background: currentCard === 0 ? '#E5E7EB' : '#fff', border: '1.5px solid #E8E2D9',
                    color: currentCard === 0 ? '#9E9792' : '#2D2A26', borderRadius: 12, padding: '8px',
                    fontWeight: 700, fontSize: 13, cursor: currentCard === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}>← Prev</button>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#6B6560', fontWeight: 600 }}>
                    {currentCard + 1} / {cards.length}
                    {retryQueue.length > 0 && <span style={{ marginLeft: 6, fontSize: 11, color: '#DC2626', fontWeight: 700 }}>· {retryQueue.length} to retry</span>}
                  </div>
                  <button onClick={() => { setCurrentCard(Math.min(cards.length - 1, currentCard + 1)); setFlipped(false) }} disabled={currentCard === cards.length - 1 && retryQueue.length === 0} style={{
                    flex: 1, background: currentCard === cards.length - 1 && retryQueue.length === 0 ? '#E5E7EB' : '#fff', border: '1.5px solid #E8E2D9',
                    color: currentCard === cards.length - 1 && retryQueue.length === 0 ? '#9E9792' : '#2D2A26', borderRadius: 12, padding: '8px',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}>Next →</button>
                </div>
              )}
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                {cards.map((c, i) => (
                  <button key={i} onClick={() => { setCurrentCard(i); setFlipped(false) }} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: reviewedCards[c.id] === 'knew' ? '#059669' : reviewedCards[c.id] === 'retry' ? '#DC2626' : i === currentCard ? color : '#E5E7EB',
                    border: 'none', cursor: 'pointer', padding: 0,
                  }} />
                ))}
              </div>
            </div>
          )}

          {cards.length === 0 && !showAddCard && (
            <div style={{ padding: '20px 18px', textAlign: 'center', color: '#6B6560', fontSize: 13 }}>
              No flashcards yet — tap "+ Add card" to create your first one!
            </div>
          )}
        </div>

        {/* ── NOTES ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, padding: '16px 18px', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26', marginBottom: 12 }}>📝 My notes</div>
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write your thoughts..." style={{
            width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
            fontSize: 13, marginBottom: 10, background: '#FFF7ED', color: '#2D2A26',
            outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', minHeight: 80, resize: 'vertical',
          }} />
          <button onClick={handleSaveNote} disabled={!newNote.trim()} style={{
            width: '100%', background: newNote.trim() ? color : '#E5E7EB',
            color: newNote.trim() ? '#fff' : '#9E9792', border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 13, padding: '8px', cursor: newNote.trim() ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif",
          }}>Save note</button>
          {notes.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notes.map(n => (
                <div key={n.id} style={{ background: '#F9F6F0', borderRadius: 14, padding: '12px', borderLeft: `3px solid ${color}` }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#2D2A26', lineHeight: 1.5 }}>{n.content}</p>
                  <div style={{ fontSize: 11, color: '#6B6560', marginTop: 6 }}>{new Date(n.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WHERE TO NEXT ── */}
        <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, padding: '16px 18px', boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2A26', marginBottom: 4 }}>🧭 Where to next?</div>
          <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 14 }}>Follow your curiosity</div>
          {related.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map((r: any, i: number) => (
                <Link key={i} href={r.slug ? `/topic/${r.slug}` : `/new-module?title=${encodeURIComponent(r.title)}`}
                  style={{ background: '#F9F6F0', borderRadius: 16, padding: '14px', display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: '#2D2A26' }}>
                  <span style={{ fontSize: 24 }}>🔗</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{r.title || r.topics?.title}</div>
                    {r.note && <div style={{ fontSize: 12, color: '#6B6560', lineHeight: 1.4 }}>{r.note}</div>}
                  </div>
                  <span style={{ color: '#D1C8D8', fontSize: 16 }}>→</span>
                </Link>
              ))}
            </div>
          ) : (
            <button onClick={handleGenerateRelated} disabled={loadingRelated || relatedGenerated} style={{
              width: '100%', background: loadingRelated ? '#E5E7EB' : `${color}15`,
              border: `1.5px dashed ${color}60`, borderRadius: 14, padding: '14px',
              color: loadingRelated ? '#6B6560' : color, fontWeight: 700, fontSize: 13,
              cursor: loadingRelated ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              {loadingRelated ? '🧠 Thinking of connections...' : '✨ Discover related topics'}
            </button>
          )}
        </div>

      </div>

      <Nav active="explore" />

      {/* ── ARIA CHAT DRAWER ── */}
      {ariaOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          {/* Backdrop */}
          <div onClick={() => setAriaOpen(false)} style={{ flex: 1, background: 'rgba(45,42,38,0.4)', backdropFilter: 'blur(2px)' }} />
          {/* Drawer */}
          <div style={{ background: '#FDFBF7', borderRadius: '24px 24px 0 0', maxHeight: '75vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(45,42,38,0.15)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F0EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>Aria</div>
                  <div style={{ fontSize: 11, color: '#6B6560' }}>Ask me anything about {topic.title}</div>
                </div>
              </div>
              <button onClick={() => setAriaOpen(false)} style={{ background: '#F3F0EB', border: 'none', borderRadius: 10, padding: '6px 12px', fontWeight: 700, fontSize: 13, color: '#6B6560', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Done</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6B6560' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🌟</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>Hi Nayomi! I'm Aria. What are you curious about in <strong>{topic.title}</strong>?</div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #7C5CBF, #9C7DD4)' : '#fff',
                    color: m.role === 'user' ? '#fff' : '#2D2A26',
                    fontSize: 14, lineHeight: 1.5, boxShadow: '0 2px 8px rgba(45,42,38,0.08)',
                  }}>
                    {m.content}
                  </div>
                  {m.role === 'assistant' && (
                    <div style={{ marginTop: 4 }}>
                      {savedFromContent.has(`chat-${i}`) ? (
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>✓ Flashcard saved!</span>
                      ) : (
                        <button onClick={() => handleMakeFlashcards(m.content, `chat-${i}`, 1)} disabled={generatingCards === `chat-${i}`} style={{
                          background: 'none', border: 'none', fontSize: 11, color: '#7C5CBF', fontWeight: 700,
                          cursor: 'pointer', padding: '2px 4px', fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {generatingCards === `chat-${i}` ? '🧠 Creating...' : '🃏 Save as flashcard'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
                  <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', fontSize: 20, boxShadow: '0 2px 8px rgba(45,42,38,0.08)' }}>💭</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px 24px', display: 'flex', gap: 10, borderTop: '1px solid #F3F0EB' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                placeholder="Ask anything..."
                style={{
                  flex: 1, borderRadius: 14, border: '1.5px solid #E8E2D9', padding: '11px 14px',
                  fontSize: 14, background: '#fff', color: '#2D2A26', outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button onClick={handleSendChat} disabled={!chatInput.trim() || chatLoading} style={{
                background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg, #7C5CBF, #9C7DD4)' : '#E5E7EB',
                color: chatInput.trim() && !chatLoading ? '#fff' : '#9E9792',
                border: 'none', borderRadius: 14, padding: '11px 16px',
                fontWeight: 700, fontSize: 15, cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'default',
                fontFamily: "'DM Sans', sans-serif",
              }}>→</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function TopicPageWrapper() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div><div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#7C5CBF' }}>Loading...</div></div></div>}><TopicPage /></Suspense>
}
