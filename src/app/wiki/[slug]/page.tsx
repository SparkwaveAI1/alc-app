'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import AriaChat from '@/components/AriaChat'
import RelatedTopics from '@/components/RelatedTopics'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUBJECT_COLORS: Record<string, { bg: string; accent: string; shadow: string; light: string }> = {
  History:      { bg: 'linear-gradient(135deg, #78350F, #EA580C)', accent: '#EA580C', shadow: 'rgba(120,53,15,0.4)', light: '#FFF7ED' },
  Geography:    { bg: 'linear-gradient(135deg, #1E1B4B, #4338CA)', accent: '#4338CA', shadow: 'rgba(30,27,75,0.4)',  light: '#EEF2FF' },
  Science:      { bg: 'linear-gradient(135deg, #065F46, #10B981)', accent: '#10B981', shadow: 'rgba(6,95,70,0.4)',   light: '#ECFDF5' },
  Writing:      { bg: 'linear-gradient(135deg, #065F46, #059669)', accent: '#059669', shadow: 'rgba(6,95,70,0.4)',   light: '#ECFDF5' },
  Math:         { bg: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', accent: '#3B82F6', shadow: 'rgba(29,78,216,0.4)', light: '#EFF6FF' },
  Art:          { bg: 'linear-gradient(135deg, #7C3AED, #D946EF)', accent: '#D946EF', shadow: 'rgba(124,58,237,0.4)', light: '#FDF4FF' },
  Culture:      { bg: 'linear-gradient(135deg, #B45309, #F59E0B)', accent: '#F59E0B', shadow: 'rgba(180,83,9,0.4)',  light: '#FFFBEB' },
  'Life Skills':{ bg: 'linear-gradient(135deg, #0F766E, #14B8A6)', accent: '#14B8A6', shadow: 'rgba(15,118,110,0.4)', light: '#F0FDFA' },
}
const DEFAULT_COLORS = { bg: 'linear-gradient(135deg, #4F46E5, #7C3AED)', accent: '#7C3AED', shadow: 'rgba(79,70,229,0.4)', light: '#F5F3FF' }

type Topic = {
  id: string; title: string; slug: string; description: string; overview: string
  subject_tag: string; subtopics: Array<{title: string; description: string; emoji: string}>
  try_first_questions: string[]; key_vocabulary: Array<{word: string; definition: string}>
  fun_fact?: string
}
type Flashcard = { id: string; front: string; back: string; review_count: number; next_review: string | null }
type Resource  = { id: string; type: string; url: string; title: string; summary: string }
type Note      = { id: string; content: string; created_at: string }

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'learn'|'cards'|'links'|'notes'>('learn')

  // Flashcard state
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [addingCard, setAddingCard] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [savingCard, setSavingCard] = useState(false)

  // Resources state
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)

  // Notes state
  const [noteText, setNoteText] = useState('')

  // Learn tab — vocabulary toggle
  const [showAllVocab, setShowAllVocab] = useState(false)
  const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(null)

  useEffect(() => { loadTopic() }, [slug])

  async function supaFetch(path: string) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    })
    if (!res.ok) return []
    return res.json()
  }

  async function loadTopic() {
    setLoading(true)
    const topics = await supaFetch(`topics?slug=eq.${slug}&limit=1`)
    if (!topics?.[0]) { setLoading(false); return }
    const t = topics[0]
    setTopic(t)
    const [cards, res, nts] = await Promise.all([
      supaFetch(`topic_flashcards?topic_id=eq.${t.id}&order=created_at`),
      supaFetch(`topic_resources?topic_id=eq.${t.id}&order=created_at`),
      supaFetch(`topic_notes?topic_id=eq.${t.id}&order=created_at.desc`),
    ])
    setFlashcards(Array.isArray(cards) ? cards : [])
    setResources(Array.isArray(res) ? res : [])
    setNotes(Array.isArray(nts) ? nts : [])
    setLoading(false)
  }

  async function saveNote() {
    if (!noteText.trim() || !topic) return
    const data = await fetch('/api/topics/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic_id: topic.id, content: noteText }) }).then(r => r.json())
    if (data.note) { setNotes(prev => [data.note, ...prev]); setNoteText('') }
  }

  async function saveResource() {
    if (!resourceUrl.trim() || !topic) return
    const data = await fetch('/api/topics/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic_id: topic.id, url: resourceUrl, title: resourceTitle || resourceUrl }) }).then(r => r.json())
    if (data.resource) { setResources(prev => [...prev, data.resource]); setResourceUrl(''); setResourceTitle('') }
  }

  async function saveNewCard() {
    if (!newFront.trim() || !newBack.trim() || !topic) return
    setSavingCard(true)
    const data = await fetch('/api/flashcards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic_id: topic.id, front: newFront, back: newBack }) }).then(r => r.json())
    if (data.card) { setFlashcards(prev => [...prev, data.card]); setNewFront(''); setNewBack(''); setAddingCard(false) }
    setSavingCard(false)
  }

  const colors = SUBJECT_COLORS[topic?.subject_tag || ''] || DEFAULT_COLORS
  const card = flashcards[currentCard]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 52 }}>🧠</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading module...</div>
    </div>
  )

  if (!topic) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 52 }}>🔍</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Module not found</div>
      <p style={{ color: '#6B7280', fontSize: 14 }}>This module may not have saved correctly. Try creating it again.</p>
      <Link href="/new-module" style={{ background: '#7C3AED', color: '#fff', padding: '12px 24px', borderRadius: 999, fontWeight: 700, textDecoration: 'none' }}>Create a module</Link>
    </div>
  )

  const tabs = [
    { key: 'learn',  label: 'Learn',  icon: '📖' },
    { key: 'cards',  label: `Cards (${flashcards.length})`, icon: '🃏' },
    { key: 'links',  label: 'Links',  icon: '🔗' },
    { key: 'notes',  label: 'Notes',  icon: '📝' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: colors.bg, borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 32px ${colors.shadow}` }}>
        <div style={{ position: 'absolute', top: -20, right: 20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, position: 'relative', zIndex: 1, alignItems: 'center' }}>
          <Link href="/explore" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>← Modules</Link>
          <span style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '3px 10px', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>{topic.subject_tag?.toUpperCase() || 'GENERAL'}</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>{topic.title}</h1>
        {topic.description && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, position: 'relative', zIndex: 1 }}>{topic.description}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, position: 'relative', zIndex: 1 }}>
          {[{ v: flashcards.length, l: 'cards' }, { v: resources.length, l: 'links' }, { v: notes.length, l: 'notes' }].map(s => (
            <div key={s.l} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 10, padding: '5px 12px', color: '#fff', fontSize: 12, fontWeight: 600 }}>{s.v} {s.l}</div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
            flex: 1, padding: '13px 4px 11px', border: 'none', cursor: 'pointer', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            borderBottom: activeTab === tab.key ? `3px solid ${colors.accent}` : '3px solid transparent',
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: activeTab === tab.key ? colors.accent : '#9CA3AF' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '20px 16px 110px' }}>

        {/* ══════════════ LEARN TAB ══════════════ */}
        {activeTab === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Fun fact banner */}
            {topic.fun_fact && (
              <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 18, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>✨</span>
                <div style={{ fontSize: 14, color: '#78350F', lineHeight: 1.6, fontWeight: 500 }}>{topic.fun_fact}</div>
              </div>
            )}

            {/* Overview */}
            {topic.overview && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: colors.accent, marginBottom: 10, letterSpacing: '0.5px' }}>📖 WHAT IS THIS ABOUT?</div>
                <p style={{ fontSize: 15, color: '#1C1917', lineHeight: 1.75, margin: 0 }}>{topic.overview}</p>
              </div>
            )}

            {/* Think-first questions */}
            {topic.try_first_questions?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#EA580C', marginBottom: 12, letterSpacing: '0.5px' }}>🧠 THINK ABOUT THIS FIRST</div>
                {topic.try_first_questions.map((q, i) => (
                  <div key={i} style={{ background: '#FFF7ED', borderRadius: 14, padding: '14px 16px', fontSize: 14, color: '#1C1917', lineHeight: 1.6, borderLeft: '4px solid #EA580C', marginBottom: 8 }}>
                    {q}
                  </div>
                ))}
              </div>
            )}

            {/* Subtopics — expandable */}
            {topic.subtopics?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: colors.accent, letterSpacing: '0.5px' }}>🗺️ WHAT YOU&apos;LL EXPLORE ({topic.subtopics.length} topics)</div>
                  <Link href={`/new-module?parent=${topic.id}&parentTitle=${encodeURIComponent(topic.title)}`} style={{ fontSize: 12, color: colors.accent, fontWeight: 700, textDecoration: 'none', background: `${colors.accent}15`, borderRadius: 8, padding: '4px 10px' }}>+ Go deeper</Link>
                </div>
                {topic.subtopics.map((s, i) => (
                  <div key={i} onClick={() => setExpandedSubtopic(expandedSubtopic === i ? null : i)}
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px', background: expandedSubtopic === i ? colors.light : '#F9FAFB', borderRadius: 16, marginBottom: 8, cursor: 'pointer', border: expandedSubtopic === i ? `1.5px solid ${colors.accent}40` : '1.5px solid transparent' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: `${colors.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1C1917' }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>{s.description}</div>
                      {expandedSubtopic === i && (
                        <Link href={`/new-module?title=${encodeURIComponent(s.title)}&parent=${topic.id}`}
                          style={{ display: 'inline-block', marginTop: 10, background: colors.accent, color: '#fff', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}
                          onClick={e => e.stopPropagation()}>
                          ✨ Create a module on this →
                        </Link>
                      )}
                    </div>
                    <span style={{ color: '#D1D5DB', fontSize: 16, transform: expandedSubtopic === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                  </div>
                ))}
              </div>
            )}

            {/* Vocabulary */}
            {topic.key_vocabulary?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', marginBottom: 14, letterSpacing: '0.5px' }}>📚 KEY VOCABULARY ({topic.key_vocabulary.length} words)</div>
                {(showAllVocab ? topic.key_vocabulary : topic.key_vocabulary.slice(0, 4)).map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < topic.key_vocabulary.length - 1 ? '1px solid #F3F4F6' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <span style={{ fontWeight: 800, color: '#1C1917', fontSize: 15 }}>{v.word}</span>
                      <span style={{ color: '#6B7280', fontSize: 14 }}> — {v.definition}</span>
                    </div>
                  </div>
                ))}
                {topic.key_vocabulary.length > 4 && (
                  <button onClick={() => setShowAllVocab(!showAllVocab)} style={{ marginTop: 10, background: 'none', border: 'none', color: colors.accent, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                    {showAllVocab ? '▲ Show less' : `▼ Show all ${topic.key_vocabulary.length} words`}
                  </button>
                )}
              </div>
            )}

            {/* Curiosity engine */}
            <RelatedTopics topicId={topic.id} topicTitle={topic.title} overview={topic.overview || ''} subjectTag={topic.subject_tag} accentColor={colors.accent} />
          </div>
        )}

        {/* ══════════════ CARDS TAB ══════════════ */}
        {activeTab === 'cards' && (
          <div>
            {flashcards.length === 0 && !addingCard ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🃏</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>No flashcards yet</div>
                <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Flashcards are created when you save a module. You can also add your own below.</p>
                <button onClick={() => setAddingCard(true)} style={{ background: colors.bg, color: '#fff', borderRadius: 999, padding: '12px 24px', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${colors.shadow}` }}>➕ Add a flashcard</button>
              </div>
            ) : (
              <>
                {/* Big card flip UI */}
                {flashcards.length > 0 && !addingCard && (
                  <div style={{ marginBottom: 20 }}>
                    {/* Card counter */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Card {currentCard + 1} of {flashcards.length}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {flashcards.map((_, i) => (
                          <div key={i} onClick={() => { setCurrentCard(i); setFlipped(false) }} style={{ width: 8, height: 8, borderRadius: '50%', background: i === currentCard ? colors.accent : '#E5E7EB', cursor: 'pointer' }} />
                        ))}
                      </div>
                    </div>

                    {/* The card itself — tap to flip */}
                    <div onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px', cursor: 'pointer', minHeight: 200 }}>
                      <div style={{
                        position: 'relative', minHeight: 200, transformStyle: 'preserve-3d',
                        transition: 'transform 0.5s ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        {/* FRONT */}
                        <div style={{
                          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                          background: '#fff', borderRadius: 24, padding: '32px 24px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 200,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', letterSpacing: '1px', marginBottom: 16 }}>QUESTION — tap to flip</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', lineHeight: 1.5 }}>{card?.front}</div>
                          <div style={{ marginTop: 20, fontSize: 24 }}>👆</div>
                        </div>
                        {/* BACK */}
                        <div style={{
                          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                          background: colors.bg, borderRadius: 24, padding: '32px 24px',
                          boxShadow: `0 8px 32px ${colors.shadow}`,
                          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 200,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 16 }}>ANSWER</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>{card?.back}</div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation + flip hint */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <button onClick={() => { setCurrentCard(c => Math.max(0, c - 1)); setFlipped(false) }} disabled={currentCard === 0}
                        style={{ flex: 1, background: currentCard === 0 ? '#F3F4F6' : '#fff', color: currentCard === 0 ? '#D1D5DB' : '#374151', border: 'none', borderRadius: 14, padding: '12px', fontWeight: 700, fontSize: 14, cursor: currentCard === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        ← Prev
                      </button>
                      <button onClick={() => setFlipped(f => !f)}
                        style={{ flex: 2, background: colors.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 14px ${colors.shadow}` }}>
                        {flipped ? '🔄 See question' : '👆 Flip card'}
                      </button>
                      <button onClick={() => { setCurrentCard(c => Math.min(flashcards.length - 1, c + 1)); setFlipped(false) }} disabled={currentCard === flashcards.length - 1}
                        style={{ flex: 1, background: currentCard === flashcards.length - 1 ? '#F3F4F6' : '#fff', color: currentCard === flashcards.length - 1 ? '#D1D5DB' : '#374151', border: 'none', borderRadius: 14, padding: '12px', fontWeight: 700, fontSize: 14, cursor: currentCard === flashcards.length - 1 ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        Next →
                      </button>
                    </div>

                    {/* Review all button */}
                    <Link href="/review" style={{ display: 'block', marginTop: 10, background: 'linear-gradient(135deg, #065F46, #10B981)', color: '#fff', borderRadius: 16, padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 14px rgba(6,95,70,0.3)' }}>
                      🧠 Practice all {flashcards.length} cards with spaced repetition →
                    </Link>
                  </div>
                )}

                {/* Card list (scroll through all) */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', marginBottom: 10, letterSpacing: '0.5px' }}>ALL CARDS</div>
                  {flashcards.map((c, i) => (
                    <div key={c.id} onClick={() => { setCurrentCard(i); setFlipped(false) }}
                      style={{ background: i === currentCard ? colors.light : '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 8, cursor: 'pointer', border: `1.5px solid ${i === currentCard ? colors.accent + '60' : 'transparent'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>Q</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1917', marginTop: 2 }}>{c.front}</div>
                    </div>
                  ))}
                </div>

                {/* Add card */}
                {!addingCard ? (
                  <button onClick={() => setAddingCard(true)} style={{ width: '100%', background: `${colors.accent}15`, border: `2px dashed ${colors.accent}50`, borderRadius: 16, padding: '14px', fontWeight: 700, fontSize: 14, color: colors.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    ➕ Add your own flashcard
                  </button>
                ) : (
                  <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1C1917', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New flashcard</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>QUESTION / TERM</div>
                    <input value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="e.g. What is the Amazon?" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E5E7EB', padding: '12px 14px', fontSize: 14, marginBottom: 14, background: '#F9FAFB', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>ANSWER / DEFINITION</div>
                    <input value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="e.g. The world's largest tropical rainforest" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E5E7EB', padding: '12px 14px', fontSize: 14, marginBottom: 16, background: '#F9FAFB', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={saveNewCard} disabled={!newFront.trim() || !newBack.trim() || savingCard}
                        style={{ flex: 1, background: newFront.trim() && newBack.trim() ? 'linear-gradient(135deg, #065F46, #10B981)' : '#E5E7EB', color: newFront.trim() && newBack.trim() ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
                        {savingCard ? 'Saving...' : '💾 Save card'}
                      </button>
                      <button onClick={() => { setAddingCard(false); setNewFront(''); setNewBack('') }}
                        style={{ background: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: 14, padding: '12px 16px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ══════════════ LINKS TAB ══════════════ */}
        {activeTab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1C1917', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add a video or link</div>
              <input value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} placeholder="Paste a YouTube URL or website link..." style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, marginBottom: 8, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <input value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} placeholder="Title (optional)" style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, marginBottom: 12, background: '#FFF7ED', color: '#1C1917', outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <button onClick={saveResource} disabled={!resourceUrl.trim()} style={{ background: resourceUrl.trim() ? 'linear-gradient(135deg, #DC2626, #EF4444)' : '#E5E7EB', color: resourceUrl.trim() ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
                ▶️ Save link
              </button>
            </div>
            {resources.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF', fontSize: 14 }}>No links saved yet — paste a YouTube URL above to add a video!</div>}
            {resources.map(r => {
              const ytId = getYouTubeId(r.url)
              const isExpanded = expandedVideo === r.id
              return (
                <div key={r.id} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                  {ytId && isExpanded && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                  )}
                  {ytId && !isExpanded && (
                    <div onClick={() => setExpandedVideo(r.id)} style={{ cursor: 'pointer', position: 'relative' }}>
                      <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={r.title} style={{ width: '100%', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(220,38,38,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>▶</div>
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    {!ytId && <div style={{ fontSize: 24 }}>🔗</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1C1917', fontSize: 14 }}>{r.title || r.url}</div>
                    </div>
                    {ytId ? (
                      <button onClick={() => setExpandedVideo(isExpanded ? null : r.id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{isExpanded ? '▼ Close' : '▶ Watch'}</button>
                    ) : (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: '#EFF6FF', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#1D4ED8', textDecoration: 'none' }}>Open →</a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ══════════════ NOTES TAB ══════════════ */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1C1917', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Write a note</div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write what you learned, questions you have, or interesting thoughts..." rows={4} style={{ width: '100%', borderRadius: 14, border: '1.5px solid #E8D5C4', padding: '12px 14px', fontSize: 14, background: '#FFF7ED', color: '#1C1917', outline: 'none', resize: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              <button onClick={saveNote} disabled={!noteText.trim()} style={{ marginTop: 10, background: noteText.trim() ? 'linear-gradient(135deg, #065F46, #059669)' : '#E5E7EB', color: noteText.trim() ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>💾 Save note</button>
            </div>
            {notes.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF', fontSize: 14 }}>No notes yet — start writing your thoughts above!</div>}
            {notes.map(n => (
              <div key={n.id} style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${colors.accent}` }}>
                <div style={{ fontSize: 14, color: '#1C1917', lineHeight: 1.7 }}>{n.content}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>{new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            ))}
          </div>
        )}

      </div>

      <Nav active="explore" />
      <AriaChat topic={topic.title} context={topic.overview} accentColor={colors.accent} />
    </div>
  )
}
