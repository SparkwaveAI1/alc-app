'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

type Section = {
  id: string
  emoji: string
  title: string
  color: string
  shadow: string
  items: { title: string; body: string; tip?: string }[]
}

const SECTIONS: Section[] = [
  {
    id: 'start',
    emoji: '🚀',
    title: 'Getting Started',
    color: '#7C3AED',
    shadow: 'rgba(124,58,237,0.3)',
    items: [
      {
        title: 'Signing in',
        body: 'On the login screen, tap your name (Nayomi or Scott), then enter your 4-digit PIN on the number pad. No typing needed — just tap the numbers.',
        tip: 'Nayomi uses the learner account. Scott uses the parent account.',
      },
      {
        title: 'The five tabs',
        body: 'At the bottom of every screen you\'ll see five tabs:\n🏠 Home — your daily dashboard\n🔭 Explore — browse all your modules\n🔍 Search — find anything across your whole wiki\n⭐ Progress — streaks, stats, and portfolio\n👤 Me — profile, settings, and sign out',
      },
      {
        title: 'First-time setup',
        body: 'When you first open the app, you\'ll be guided through a quick setup: enter your name, pick an avatar emoji, select your grade, and choose which subjects you love. You can update this anytime from the Me tab → Edit Profile.',
      },
    ],
  },
  {
    id: 'modules',
    emoji: '📚',
    title: 'Learning Modules',
    color: '#0F766E',
    shadow: 'rgba(15,118,110,0.3)',
    items: [
      {
        title: 'Creating a new module',
        body: 'Tap ✏️ New Module from the home screen or Create tab. Type a topic title — anything you\'re curious about (Ancient Egypt, Black Holes, Fractions, Origami). Add an optional description, then tap ✨ Generate Module.\n\nThe AI will create:\n• An overview of the topic\n• 4–6 subtopics to explore\n• Key vocabulary words\n• Think-first questions\n• Flashcards for review\n• YouTube video suggestions',
        tip: 'The more specific your title, the better. "Life in Ancient Egypt" is better than just "Egypt".',
      },
      {
        title: 'Inside a module (4 tabs)',
        body: '📖 Learn — overview, subtopics, vocabulary, and curiosity connections\n🃏 Cards — flashcards to flip and test yourself (tap to reveal the answer)\n🔗 Links — YouTube videos and websites saved to this topic\n📝 Notes — your personal notes and observations',
      },
      {
        title: 'Adding your own flashcards',
        body: 'In the Cards tab, tap ➕ Add your own flashcard. Type the question on the front and the answer on the back. Your custom cards are added to the review queue alongside the AI-generated ones.',
      },
      {
        title: 'Saving videos and links',
        body: 'In the Links tab, paste any YouTube URL or website link. YouTube videos show a thumbnail with a play button — tap to watch the video right inside the app without leaving.',
        tip: 'Copy the YouTube link from the Share button on any video.',
      },
      {
        title: 'Taking notes',
        body: 'In the Notes tab, write anything you want to remember — questions you still have, things that surprised you, your own explanations. Notes are saved to this module forever.',
      },
      {
        title: '"Where this leads..." — curiosity connections',
        body: 'At the bottom of the Learn tab, tap Discover → to find 3 topics that connect to what you\'re reading. Each suggestion explains why the topics are related.\n\nTap any suggestion to instantly start a new module on that connected idea. This is how your knowledge tree grows!',
      },
      {
        title: 'Going deeper',
        body: 'Tap + Go deeper (top right of the subtopics section) to create a child module branching off from the current topic. For example: Ancient Egypt → New Kingdom → Ramesses II.',
      },
    ],
  },
  {
    id: 'review',
    emoji: '🃏',
    title: 'Flashcard Review',
    color: '#B45309',
    shadow: 'rgba(180,83,9,0.3)',
    items: [
      {
        title: 'How to review',
        body: 'From the home screen, tap the flashcard alert (if cards are due) or go to ⭐ Progress → Start Review. You\'ll see one card at a time — tap to reveal the answer, then rate how well you remembered:\n\n❌ Missed — I didn\'t know it\n😰 Hard — I knew it but it was tough\n✓ Good — I remembered it\n⚡ Easy — I knew it immediately',
        tip: 'Be honest! The system only works if you rate accurately.',
      },
      {
        title: 'Spaced repetition — why it works',
        body: 'The app uses a method called spaced repetition. Cards you know well appear less often. Cards you struggle with appear more often. This means you spend your time practicing what you actually need — and the things you learn stick for much longer.',
      },
      {
        title: 'Streaks',
        body: 'Every day you use the app, your streak grows. The streak badge on your home screen shows how many days in a row you\'ve been learning. Try to review at least a few cards each day to keep it going!',
      },
    ],
  },
  {
    id: 'challenge',
    emoji: '⚡',
    title: 'Daily Challenge',
    color: '#B45309',
    shadow: 'rgba(180,83,9,0.3)',
    items: [
      {
        title: 'What is the Daily Challenge?',
        body: 'Every day, a new thinking question appears on your home screen. There\'s no single right answer — the challenge is to think carefully and explain your reasoning. Aria (your AI coach) responds to every answer with a follow-up question and an interesting fact.',
        tip: 'The questions are based on topics you\'ve been studying — so the more you explore, the more interesting the challenges get.',
      },
      {
        title: 'Using the hint',
        body: 'If you\'re stuck, tap 💡 Hint to get a nudge in the right direction. The hint won\'t give the answer away — it\'s just a starting point.',
      },
    ],
  },
  {
    id: 'aria',
    emoji: '🦋',
    title: 'Aria — Your AI Coach',
    color: '#D946EF',
    shadow: 'rgba(217,70,239,0.3)',
    items: [
      {
        title: 'Who is Aria?',
        body: 'Aria is your AI learning coach. She\'s there to help you think — not to give you answers. When you ask Aria a question, she\'ll ask you what you already think first, then guide you toward figuring it out yourself.',
      },
      {
        title: 'Opening Aria',
        body: 'On any module page (wiki page), tap the 🦋 butterfly button in the bottom corner. A chat window opens. You can ask anything about the topic you\'re reading.',
        tip: 'Aria works best when you\'ve read the module first. She can help you go deeper on anything you found confusing.',
      },
      {
        title: 'How Aria coaches',
        body: 'Aria follows a simple rule: "Try first, then I\'ll help." She always asks what you think before explaining anything. If you\'re still stuck after thinking, she gives a hint. If you\'re still stuck, she explains.\n\nHer goal is to make you a better thinker — not just give you the answer.',
      },
    ],
  },
  {
    id: 'paths',
    emoji: '🗺️',
    title: 'Learning Paths',
    color: '#1D4ED8',
    shadow: 'rgba(29,78,216,0.3)',
    items: [
      {
        title: 'What are Learning Paths?',
        body: 'Paths are step-by-step learning journeys. Each path has 5–6 steps that guide you through a topic in order — from exploring the big picture to creating something of your own.',
        tip: 'Three starter paths are ready to go: Ancient World Explorer, Creative Writer\'s Path, and Math Foundations.',
      },
      {
        title: 'How to use a path',
        body: 'Go to Me tab → My Paths. Tap a path to expand it. Work through each step in order — some steps ask you to learn something, others ask you to create or review. Tap ✓ Mark Complete when you finish a step.',
      },
      {
        title: 'Creating your own path',
        body: 'Tap + New Path to design your own learning journey. Give it a title and add steps one at a time. You can make a path for anything: learning guitar chords, studying for a test, or exploring a new hobby.',
      },
    ],
  },
  {
    id: 'portfolio',
    emoji: '🎨',
    title: 'Portfolio',
    color: '#7C3AED',
    shadow: 'rgba(124,58,237,0.3)',
    items: [
      {
        title: 'What goes in the Portfolio?',
        body: 'The Portfolio is for things you make. Writing, drawings, projects, notes, videos — anything you create while learning. Tap ➕ Add Creation, choose a type, write a title and description, and save it.',
      },
      {
        title: 'Types of creations',
        body: '✍️ Writing — stories, essays, poems\n🎨 Drawing — artwork and diagrams\n📋 Note — extended research notes\n📹 Video — video projects\n📷 Photo — photographs\n🔨 Project — build-something projects\n⭐ Other — anything that doesn\'t fit',
      },
    ],
  },
  {
    id: 'areas',
    emoji: '🌟',
    title: 'Learning Areas',
    color: '#059669',
    shadow: 'rgba(5,150,105,0.3)',
    items: [
      {
        title: 'What are Learning Areas?',
        body: 'Learning Areas are for things you practice outside of school — like guitar, drawing, cooking, photography, or chess. They\'re separate from your academic modules and track practice sessions as a habit.',
      },
      {
        title: 'Logging a session',
        body: 'Tap Log on any area, write a short note about what you practiced, and pick how long you spent (15, 30, 45, or 60 minutes). The app tracks your last practice date and shows all your session notes.',
        tip: 'Even 15 minutes counts! Consistent short sessions build skills faster than occasional long ones.',
      },
    ],
  },
  {
    id: 'parent',
    emoji: '👨‍👩‍👧',
    title: 'Parent Dashboard',
    color: '#1E1B4B',
    shadow: 'rgba(30,27,75,0.3)',
    items: [
      {
        title: 'Accessing the dashboard (Scott only)',
        body: 'Sign in with the Scott account (PIN: 5678), then go to Me tab → Parent Dashboard. This section is only visible to the parent account.',
      },
      {
        title: 'What you can see',
        body: '📊 Overview — retention health score, 7-day activity chart, all-time totals\n📚 Subjects — which subjects have the most modules and activity\n📅 Activity — a day-by-day log of what Nayomi worked on\n⚠️ Gaps — subjects not touched in 30 days (Math gets a special alert)',
      },
      {
        title: 'Grade 4 Skills Tracker',
        body: 'From the Parent Dashboard, tap 📊 Skills Tracker to see all 25 Grade 4 Common Core standards. Update the status of each skill as Nayomi practices — Not started → In progress → Practiced → Mastered. The progress bar shows overall grade-level readiness.',
      },
    ],
  },
]

export default function Guide() {
  const [openSection, setOpenSection] = useState<string | null>('start')
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 40%, #4F46E5 75%, #F97316 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px' }}>
        <Link href="/me" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 12 }}>← Me</Link>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User Guide</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0 }}>Everything you need to know about your AI Learning Companion</p>
      </div>

      {/* Quick nav pills */}
      <div style={{ overflowX: 'auto', padding: '16px 16px 0', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => { setOpenSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            style={{ borderRadius: 999, padding: '7px 14px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: openSection === s.id ? s.color : '#fff', color: openSection === s.id ? '#fff' : '#374151', fontWeight: 700, fontSize: 12, boxShadow: openSection === s.id ? `0 4px 12px ${s.shadow}` : '0 2px 6px rgba(0,0,0,0.07)', flexShrink: 0 }}>
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SECTIONS.map(section => (
          <div key={section.id} id={section.id}>
            {/* Section header */}
            <button onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              style={{ width: '100%', background: '#fff', borderRadius: 20, padding: '16px 18px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 4px 14px rgba(0,0,0,0.06)`, textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${section.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {section.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{section.title}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{section.items.length} topics</div>
              </div>
              <span style={{ fontSize: 18, color: '#D1D5DB', transform: openSection === section.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
            </button>

            {/* Section items */}
            {openSection === section.id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, paddingLeft: 4 }}>
                {section.items.map((item, i) => {
                  const key = `${section.id}-${i}`
                  const isOpen = openItem === key
                  return (
                    <div key={i}>
                      <button onClick={() => setOpenItem(isOpen ? null : key)}
                        style={{ width: '100%', background: isOpen ? section.color : '#FAFAFA', borderRadius: 16, padding: '14px 16px', border: `1.5px solid ${isOpen ? section.color : '#F3F4F6'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOpen ? 'rgba(255,255,255,0.8)' : section.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: isOpen ? '#fff' : '#1C1917' }}>{item.title}</div>
                        <span style={{ fontSize: 14, color: isOpen ? 'rgba(255,255,255,0.7)' : '#D1D5DB', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                      </button>

                      {isOpen && (
                        <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', padding: '16px 18px', borderLeft: `3px solid ${section.color}`, marginTop: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.body}</div>
                          {item.tip && (
                            <div style={{ marginTop: 12, background: `${section.color}12`, borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 8 }}>
                              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                              <div style={{ fontSize: 13, color: section.color, fontWeight: 600, lineHeight: 1.5 }}>{item.tip}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {/* Bottom card */}
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 22, padding: '20px', textAlign: 'center', boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🦋</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#78350F', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>Still have questions?</div>
          <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>Ask Aria! Open any module page and tap the butterfly button. She&apos;s always there to help you learn.</div>
        </div>
      </div>

      <Nav active="me" />
    </div>
  )
}
