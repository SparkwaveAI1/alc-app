'use client'

import { use } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUBJECTS: Record<string, {
  name: string
  subtitle: string
  subject: string
  icon: string
  emoji: string
  bg: string
  shadow: string
  accent: string
  topics: { title: string; desc: string; icon: string; duration: string; status: 'new' | 'inprogress' | 'done' }[]
  skills: { name: string; pct: number }[]
}> = {
  'ancient-egypt': {
    name: 'Ancient Egypt',
    subtitle: 'Pyramids & Pharaohs',
    subject: 'HISTORY',
    icon: '📚',
    emoji: '🏛️',
    bg: 'linear-gradient(135deg, #78350F 0%, #92400E 35%, #C2410C 70%, #EA580C 100%)',
    shadow: 'rgba(120,53,15,0.4)',
    accent: '#EA580C',
    topics: [
      { title: 'The Great Pyramid', desc: 'How was it built and why?', icon: '🔺', duration: '15 min', status: 'done' },
      { title: 'Life Along the Nile', desc: 'Farming, flooding, and daily life', icon: '🌊', duration: '12 min', status: 'inprogress' },
      { title: 'Gods & Mythology', desc: 'Ra, Osiris, and the afterlife', icon: '⚡', duration: '18 min', status: 'new' },
      { title: 'Hieroglyphics', desc: 'Write your name in ancient Egyptian', icon: '✍️', duration: '20 min', status: 'new' },
      { title: 'Cleopatra & the Ptolemies', desc: 'The final dynasty of Egypt', icon: '👑', duration: '15 min', status: 'new' },
    ],
    skills: [
      { name: 'Ancient Civilizations', pct: 45 },
      { name: 'Historical Timelines', pct: 30 },
      { name: 'Geography of Africa', pct: 20 },
    ],
  },
  'creative-writing': {
    name: 'Creative Writing',
    subtitle: 'Stories & Expression',
    subject: 'WRITING',
    icon: '✍️',
    emoji: '📖',
    bg: 'linear-gradient(145deg, #065F46 0%, #059669 55%, #10B981 100%)',
    shadow: 'rgba(6,95,70,0.4)',
    accent: '#059669',
    topics: [
      { title: 'Story Starters', desc: 'Begin a new adventure', icon: '🚀', duration: '10 min', status: 'inprogress' },
      { title: 'Character Building', desc: 'Create unforgettable characters', icon: '🎭', duration: '15 min', status: 'new' },
      { title: 'Setting the Scene', desc: 'Paint a world with words', icon: '🌅', duration: '12 min', status: 'new' },
      { title: 'Dialogue & Voice', desc: 'Make your characters talk', icon: '💬', duration: '15 min', status: 'new' },
      { title: 'Plot & Tension', desc: 'Keep readers turning pages', icon: '📈', duration: '18 min', status: 'new' },
    ],
    skills: [
      { name: 'Narrative Writing', pct: 60 },
      { name: 'Descriptive Language', pct: 45 },
      { name: 'Story Structure', pct: 35 },
    ],
  },
  'world-patterns': {
    name: 'World Patterns',
    subtitle: 'Geography & Cultures',
    subject: 'GEOGRAPHY',
    icon: '🌍',
    emoji: '🗺️',
    bg: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)',
    shadow: 'rgba(30,27,75,0.4)',
    accent: '#4338CA',
    topics: [
      { title: 'Continents & Oceans', desc: 'The big picture of our planet', icon: '🌏', duration: '12 min', status: 'done' },
      { title: 'Climate Zones', desc: 'Why different places feel different', icon: '☀️', duration: '15 min', status: 'inprogress' },
      { title: 'Human Migration', desc: 'How people moved around the world', icon: '🚶', duration: '18 min', status: 'new' },
      { title: 'World Capitals', desc: 'Cities that run their countries', icon: '🏙️', duration: '15 min', status: 'new' },
      { title: 'Cultural Traditions', desc: 'Celebrations from around the world', icon: '🎉', duration: '20 min', status: 'new' },
    ],
    skills: [
      { name: 'Physical Geography', pct: 30 },
      { name: 'Human Geography', pct: 20 },
      { name: 'Map Reading', pct: 50 },
    ],
  },
}

const STATUS_COLORS = {
  done:       { bg: '#22C55E', label: 'Done' },
  inprogress: { bg: '#F59E0B', label: 'In Progress' },
  new:        { bg: '#7C3AED', label: 'New' },
}

export default function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const subject = SUBJECTS[slug] || SUBJECTS['ancient-egypt']

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* HERO */}
      <div style={{ background: subject.bg, borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden', minHeight: 230 }}>
        {/* Decorations */}
        <div style={{ position: 'absolute', bottom: 0, right: 14, width: 0, height: 0, borderLeft: '70px solid transparent', borderRight: '70px solid transparent', borderBottom: '96px solid rgba(255,210,120,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 110, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '60px solid rgba(255,210,120,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 16, right: 22, fontSize: 40, opacity: 0.3, pointerEvents: 'none' }}>{subject.emoji}</div>

        {/* Back + chip row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← Back</Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.32)', borderRadius: 10, padding: '5px 12px' }}>
            <span style={{ fontSize: 12 }}>{subject.icon}</span>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>{subject.subject}</span>
          </div>
        </div>

        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>{subject.name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: '5px 0 16px', position: 'relative', zIndex: 1 }}>{subject.subtitle}</p>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: '#FBBF24', borderRadius: 999 }} />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: 10, padding: '4px 12px' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>40% Explored</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px 16px 100px' }}>

        {/* Choose Your Adventure */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Choose Your Adventure</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          {(['new','inprogress','done'] as const).map(s => (
            <div key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: STATUS_COLORS[s].bg + '22', borderRadius: 999, padding: '3px 10px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[s].bg }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[s].bg }}>{STATUS_COLORS[s].label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {subject.topics.map((topic) => {
            const s = STATUS_COLORS[topic.status]
            return (
              <Link key={topic.title} href={`/lesson/${slug}/${topic.title.toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '16px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{topic.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{topic.title}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{topic.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>🕐 {topic.duration}</span>
                      <div style={{ background: s.bg, borderRadius: 999, padding: '2px 8px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{s.label.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: '#D1D5DB', fontSize: 20 }}>›</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Skills progress */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skills Building 📈</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {subject.skills.map(skill => (
            <div key={skill.name} style={{ background: '#fff', borderRadius: 18, padding: '14px 16px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', borderLeft: `4px solid ${subject.accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1C1917' }}>{skill.name}</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{skill.pct}%</span>
              </div>
              <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${skill.pct}%`, height: '100%', background: subject.accent, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

      </div>
      <Nav active="home" />
    </div>
  )
}
