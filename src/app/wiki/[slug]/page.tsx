'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import AriaChat from '@/components/AriaChat'
import RelatedTopics from '@/components/RelatedTopics'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, { bg: string; accent: string; shadow: string }> = {
  History:     { bg: 'linear-gradient(135deg, #78350F, #EA580C)', accent: '#EA580C', shadow: 'rgba(120,53,15,0.4)' },
  Geography:   { bg: 'linear-gradient(135deg, #1E1B4B, #4338CA)', accent: '#4338CA', shadow: 'rgba(30,27,75,0.4)' },
  Science:     { bg: 'linear-gradient(135deg, #065F46, #10B981)', accent: '#10B981', shadow: 'rgba(6,95,70,0.4)' },
  Writing:     { bg: 'linear-gradient(135deg, #065F46, #059669)', accent: '#059669', shadow: 'rgba(6,95,70,0.4)' },
  Math:        { bg: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', accent: '#3B82F6', shadow: 'rgba(29,78,216,0.4)' },
  Art:         { bg: 'linear-gradient(135deg, #7C3AED, #D946EF)', accent: '#D946EF', shadow: 'rgba(124,58,237,0.4)' },
  Culture:     { bg: 'linear-gradient(135deg, #B45309, #F59E0B)', accent: '#F59E0B', shadow: 'rgba(180,83,9,0.4)' },
  'Life Skills': { bg: 'linear-gradient(135deg, #0F766E, #14B8A6)', accent: '#14B8A6', shadow: 'rgba(15,118,110,0.4)' },
}

type Topic = {
  id: string; title: string; slug: string; description: string; overview: string;
  subject_tag: string; subtopics: Array<{title: string; description: string; emoji: string}>;
  try_first_questions: string[]; key_vocabulary: Array<{word: string; definition: string}>;
  fun_fact?: string;
}
type Flashcard = { id: string; front: string; back: string; review_count: number }
type Resource = { id: string; type: string; url: string; title: string; summary: string }
type Note = { id: string; content: string; created_at: string }

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'learn'|'flashcards'|'resources'|'notes'>('learn')
  const [noteText, setNoteText] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [flippedCard, setFlippedCard] = useState<string | null>(null)
  const [newCardFront, setNewCardFront] = useState('')
  const [newCardBack, setNewCardBack] = useState('')
  const [addingCard, setAddingCard] = useState(false)
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)

  useEffect(() => {
    loadTopic()
  }, [slug])

  async function supaFetch(path: string) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    })
    return res.json()
  }

  async function loadTopic() {
    const topics = await supaFetch(`topics?slug=eq.${slug}&limit=1`)
    if (!topics?.[0]) { setLoading(false); return }
    const t = topics[0]
    setTopic(t)
    const [cards, res, nts] = await Promise.all([
      supaFetch(`topic_flashcards?topic_id=eq.${t.id}&order=created_at`),
      supaFetch(`topic_resources?topic_id=eq.${t.id}&order=created_at`),
      supaFetch(`topic_notes?topic_id=eq.${t.id}&order=created_at.desc`),
    ])
    setFlashcards(cards || [])
    setResources(res || [])
    setNotes(nts || [])
    setLoading(false)
  }

  async function saveNote() {
    if (!noteText.trim() || !topic) return
    const res = await fetch('/api/topics/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topic.id, content: noteText }),
    })
    const data = await res.json()
    if (data.note) { setNotes(prev => [data.note, ...prev]); setNoteText('') }
  }

  async function saveResource() {
    if (!resourceUrl.trim() || !topic) return
    const isYouTube = resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be')
    const res = await fetch('/api/topics/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topic.id, url: resourceUrl, title: resourceTitle || resourceUrl, type: isYouTube ? 'youtube' : 'link' }),
    })
    const data = await res.json()
    if (data.resource) { setResources(prev => [...prev, data.resource]); setResourceUrl(''); setResourceTitle('') }
  }

  const colors = SUBJECT_COLORS[topic?.subject_tag || ''] || SUBJECT_COLORS['History']

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🧠</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading module...</div>
    </div>
  )

  if (!topic) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Module not found</div>
      <Link href="/explore" style={{ color: '#7C3AED', fontWeight: 600, fontSize: 15 }}>← Browse modules</Link>
    </div>
  )

  const tabs = [
    { key: 'learn', label: 'Learn', icon: '📖' },
    { key: 'flashcards', label: 'Cards', icon: '🃏' },
    { key: 'resources', label: 'Links', icon: '🔗' },
    { key: 'notes', label: 'Notes', icon: '📝' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: colors.bg, borderRadius: '0 0 28px 28px', padding: '52px 20px 24px', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 32px ${colors.shadow}` }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          <Link href="/explore" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← My Modules</Link>
          {topic.subject_tag && (
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '4px 12px' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>{topic.subject_tag.toUpperCase()}</span>
            </div>
          )}
        </div>
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>{topic.title}</h1>
        {topic.description && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>{topic.description}</p>}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16, position: 'relative', zIndex: 1 }}>
          {[
            { icon: '🃏', value: flashcards.length, label: 'cards' },
            { icon: '🔗', value: resources.length, label: 'resources' },
            { icon: '📝', value: notes.length, label: 'notes' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{s.value} {s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#fff', padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', gap: 4 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
            flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            borderBottom: activeTab === tab.key ? `3px solid ${colors.accent}` : '3px solid transparent',
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: activeTab === tab.key ? colors.accent : '#9CA3AF' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '24px 16px 100px' }}>

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topic.overview && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent, marginBottom: 8 }}>📖 OVERVIEW</div>
                <p style={{ fontSize: 15, color: '#1C1917', lineHeight: 1.65, margin: 0 }}>{topic.overview}</p>
              </div>
            )}

            {topic.try_first_questions?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#EA580C', marginBottom: 12 }}>🧠 THINK ABOUT THIS FIRST</div>
                {topic.try_first_questions.map((q, i) => (
                  <div key={i} style={{ background: '#FFF7ED', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1C1917', lineHeight: 1.5, borderLeft: '3px solid #EA580C', marginBottom: 8 }}>{q}</div>
                ))}
              </div>
            )}

            {topic.subtopics?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent }}>🗺️ EXPLORE THESE TOPICS</div>
                  <Link href={`/new-module?parent=${topic.id}&parentTitle=${encodeURIComponent(topic.title)}`} style={{ fontSize: 12, color: colors.accent, fontWeight: 600, textDecoration: 'none' }}>+ Go deeper</Link>
                </div>
                {topic.subtopics.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, padding: '12px', background: '#F9FAFB', borderRadius: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1C1917' }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {topic.key_vocabulary?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', marginBottom: 12 }}>📚 KEY VOCABULARY</div>
                {topic.key_vocabulary.map((v, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: '#1C1917', fontSize: 14 }}>{v.word}</span>
                    <span style={{ color: '#6B7280', fontSize: 14 }}> — {v.definition}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Related topics / curiosity engine */}
            <RelatedTopics
              topicId={topic.id}
              topicTitle={topic.title}
              overview={topic.overview || ''}
              subjectTag={topic.subject_tag}
              accentColor={colors.accent}
            />
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Add card button */}
            {!addingCard ? (
              <button onClick={() => setAddingCard(true)} style={{ background: colors.bg, borderRadius: 18, padding: '14px 18px', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 4px 14px ${colors.shadow}` }}>
                <span style={{ fontSize: 22 }}>➕</span> Add your own flashcard
              </button>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', marginBottom: 12 }}>New Flashcard</div>
                <input value={newCardFront} onChange={e => setNewCardFront(e.target.value)} placeholder="Question or term..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '10px 14px', fontSize: 14, marginBottom: 8, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
                <input value={newCardBack} onChange={e => setNewCardBack(e.target.value)} placeholder="Answer or definition..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '10px 14px', fontSize: 14, marginBottom: 12, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => {
                    if (!newCardFront.trim() || !newCardBack.trim() || !topic) return
                    const res = await fetch('/api/flashcards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic_id: topic.id, front: newCardFront, back: newCardBack }) })
                    const data = await res.json()
                    if (data.card) { setFlashcards(prev => [...prev, data.card]); setNewCardFront(''); setNewCardBack(''); setAddingCard(false) }
                  }} disabled={!newCardFront.trim() || !newCardBack.trim()} style={{ flex: 1, background: 'linear-gradient(135deg, #065F46, #10B981)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Save Card</button>
                  <button onClick={() => setAddingCard(false)} style={{ background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: 13, padding: '10px 14px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
            {flashcards.length === 0 && !addingCard && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>No flashcards yet — AI cards are added when you create the module, or add your own above</div>
            )}
            {flashcards.map(card => (
              <div key={card.id} onClick={() => setFlippedCard(flippedCard === card.id ? null : card.id)}
                style={{ background: flippedCard === card.id ? colors.bg : '#fff', borderRadius: 20, padding: '20px', boxShadow: `0 4px 16px ${flippedCard === card.id ? colors.shadow : 'rgba(0,0,0,0.07)'}`, cursor: 'pointer', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {flippedCard === card.id ? (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>ANSWER</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{card.back}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>QUESTION — tap to reveal</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1917', lineHeight: 1.5 }}>{card.front}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add a Resource</div>
              <input value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} placeholder="Paste YouTube link or any URL..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, marginBottom: 8, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <input value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} placeholder="Title (optional)" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, marginBottom: 10, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <button onClick={saveResource} disabled={!resourceUrl.trim()} style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>▶️ Add Resource</button>
            </div>
            {resources.map(r => {
              const ytId = r.type === 'youtube' ? getYouTubeId(r.url) : null
              const isExpanded = expandedVideo === r.id
              return (
                <div key={r.id} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                  {/* YouTube embed */}
                  {ytId && isExpanded && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                  )}
                  {/* Thumbnail or icon row */}
                  {ytId && !isExpanded && (
                    <div onClick={() => setExpandedVideo(r.id)} style={{ cursor: 'pointer', position: 'relative' }}>
                      <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={r.title} style={{ width: '100%', display: 'block', borderRadius: '18px 18px 0 0' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '18px 18px 0 0' }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(220,38,38,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    {!ytId && <div style={{ fontSize: 26 }}>🔗</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1C1917', fontSize: 14 }}>{r.title || r.url}</div>
                    </div>
                    {ytId ? (
                      <button onClick={() => setExpandedVideo(isExpanded ? null : r.id)} style={{ background: isExpanded ? '#FEE2E2' : '#FEE2E2', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#DC2626' }}>
                        {isExpanded ? '▼ Close' : '▶ Watch'}
                      </button>
                    ) : (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: '#EFF6FF', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#1D4ED8', textDecoration: 'none' }}>Open →</a>
                    )}
                  </div>
                </div>
              )
            })}
            {resources.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>No resources added yet</div>}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 22, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add a Note</div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write what you learned, questions you have, or interesting thoughts..." rows={3} style={{ width: '100%', borderRadius: 14, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, background: '#FFF7ED', color: '#1C1917', outline: 'none', resize: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <button onClick={saveNote} disabled={!noteText.trim()} style={{ marginTop: 10, background: 'linear-gradient(135deg, #065F46, #059669)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>💾 Save Note</button>
            </div>
            {notes.map(n => (
              <div key={n.id} style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${colors.accent}` }}>
                <div style={{ fontSize: 14, color: '#1C1917', lineHeight: 1.6 }}>{n.content}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {notes.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>No notes yet — start writing!</div>}
          </div>
        )}

      </div>
      <Nav active="explore" />
      <AriaChat
        topic={topic.title}
        context={topic.overview}
        accentColor={colors.accent}
      />
    </div>
  )
}
