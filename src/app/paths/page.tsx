'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type PathStep = { title: string; description: string; type: 'learn' | 'create' | 'review' | 'explore'; done: boolean }
type LearningPath = {
  id: string; title: string; description: string; subject_tag: string
  steps: PathStep[]; current_step: number; completed: boolean; created_at: string
}

const SUBJECT_COLORS: Record<string, string> = {
  History: 'linear-gradient(135deg, #78350F, #EA580C)',
  Geography: 'linear-gradient(135deg, #1E1B4B, #4338CA)',
  Science: 'linear-gradient(135deg, #065F46, #10B981)',
  Writing: 'linear-gradient(135deg, #065F46, #059669)',
  Math: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  Art: 'linear-gradient(135deg, #7C3AED, #D946EF)',
  'Life Skills': 'linear-gradient(135deg, #0F766E, #14B8A6)',
}

const STEP_ICONS: Record<string, string> = { learn: '📖', create: '🎨', review: '🃏', explore: '🔭' }

// Starter paths to seed if none exist
const STARTER_PATHS = [
  {
    title: 'Ancient World Explorer',
    description: 'Journey through the great civilizations of the ancient world',
    subject_tag: 'History',
    steps: [
      { title: 'Create an Ancient Egypt module', description: 'Use the module creator to build your Egypt knowledge base', type: 'learn', done: false },
      { title: 'Learn about the Nile River', description: 'Add a child module about the Nile — why was it so important?', type: 'explore', done: false },
      { title: 'Draw a map of ancient Egypt', description: 'Add your map to your portfolio', type: 'create', done: false },
      { title: 'Explore Ancient Greece', description: 'Create a new module and find connections to Egypt', type: 'explore', done: false },
      { title: 'Review your flashcards', description: 'Do a full review session of all history cards', type: 'review', done: false },
      { title: 'Write a story', description: 'Write a short story set in the ancient world — add it to your portfolio', type: 'create', done: false },
    ],
  },
  {
    title: 'Creative Writer\'s Path',
    description: 'Build your writing skills through storytelling and creative expression',
    subject_tag: 'Writing',
    steps: [
      { title: 'Create a Writing Techniques module', description: 'Learn about the tools great writers use', type: 'learn', done: false },
      { title: 'Write a descriptive paragraph', description: 'Pick any object near you and describe it in detail', type: 'create', done: false },
      { title: 'Explore your favorite genre', description: 'Create a module about a genre you love (fantasy, mystery, etc.)', type: 'explore', done: false },
      { title: 'Write a short story', description: 'At least 200 words — save it to your portfolio', type: 'create', done: false },
      { title: 'Review writing vocabulary', description: 'Review your writing flashcards', type: 'review', done: false },
    ],
  },
  {
    title: 'Math Foundations',
    description: 'Build solid math skills step by step — fractions, decimals, and more',
    subject_tag: 'Math',
    steps: [
      { title: 'Create a Fractions module', description: 'What are fractions? When do we use them?', type: 'learn', done: false },
      { title: 'Real-world fractions', description: 'Find 3 examples of fractions in real life — add a note', type: 'explore', done: false },
      { title: 'Create a Decimals module', description: 'How do decimals connect to fractions?', type: 'learn', done: false },
      { title: 'Review your math flashcards', description: 'Do a review session focusing on math cards', type: 'review', done: false },
      { title: 'Math in cooking', description: 'Find a recipe and identify all the math in it — write a note', type: 'create', done: false },
    ],
  },
]

export default function Paths() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { loadPaths() }, [])

  async function loadPaths() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/learning_paths?order=created_at`, {
      headers: { 'apikey': SUPABASE_ANON!, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    })
    const data = await res.json()
    setPaths(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function seedStarterPaths() {
    setSeeding(true)
    for (const p of STARTER_PATHS) {
      await fetch('/api/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      })
    }
    await loadPaths()
    setSeeding(false)
  }

  async function markStepDone(path: LearningPath, stepIndex: number) {
    const newSteps = path.steps.map((s, i) => i === stepIndex ? { ...s, done: true } : s)
    const doneCount = newSteps.filter(s => s.done).length
    const nextStep = doneCount
    const completed = doneCount === newSteps.length

    await fetch('/api/paths', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: path.id, steps: newSteps, current_step: nextStep, completed }),
    })

    // Log activity
    await fetch('/api/streak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ modules_created: 0 }) })

    setPaths(prev => prev.map(p => p.id === path.id ? { ...p, steps: newSteps, current_step: nextStep, completed } : p))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 40 }}>🗺️</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#7C3AED', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading your paths...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(16,185,129,0.5)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>My Paths 🗺️</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Guided learning journeys, step by step</p>
      </div>

      <div style={{ padding: '24px 16px 100px' }}>

        {paths.length === 0 && !loading && (
          <div style={{ background: '#fff', borderRadius: 22, padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🗺️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No paths yet</div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Start with 3 ready-made learning journeys — Ancient World, Creative Writing, and Math Foundations</div>
            <button onClick={seedStarterPaths} disabled={seeding} style={{ background: 'linear-gradient(135deg, #065F46, #10B981)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(6,95,70,0.35)' }}>
              {seeding ? 'Creating paths...' : '✨ Add Starter Paths'}
            </button>
          </div>
        )}

        {paths.map(path => {
          const bg = SUBJECT_COLORS[path.subject_tag] || SUBJECT_COLORS['History']
          const donSteps = path.steps.filter(s => s.done).length
          const progress = path.steps.length > 0 ? (donSteps / path.steps.length) * 100 : 0
          const isExpanded = expanded === path.id
          const currentStep = path.steps.find(s => !s.done)

          return (
            <div key={path.id} style={{ marginBottom: 16 }}>
              {/* Path header card */}
              <div
                onClick={() => setExpanded(isExpanded ? null : path.id)}
                style={{ borderRadius: 22, background: bg, padding: '18px 18px 16px', cursor: 'pointer', boxShadow: '0 6px 22px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: -5, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(20px)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: 9, padding: '3px 10px', marginBottom: 7 }}>
                      <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>{path.subject_tag?.toUpperCase()}</span>
                    </div>
                    <div style={{ color: '#fff', fontSize: 19, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.25 }}>{path.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>{path.description}</div>
                  </div>
                  <div style={{ color: '#fff', fontSize: 22, marginLeft: 10, opacity: 0.7, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</div>
                </div>

                {/* Progress bar */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}>
                      {path.completed ? '🎉 Complete!' : `Step ${donSteps + 1} of ${path.steps.length}`}
                    </span>
                    <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, height: 7 }}>
                    <div style={{ background: '#fff', borderRadius: 999, height: 7, width: `${progress}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>

              {/* Expanded steps */}
              {isExpanded && (
                <div style={{ background: '#fff', borderRadius: '0 0 22px 22px', padding: '16px 18px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', marginTop: -8, paddingTop: 24 }}>
                  {!currentStep && !path.completed && (
                    <div style={{ textAlign: 'center', padding: '8px 0 16px', color: '#6B7280', fontSize: 14 }}>All steps complete — great work! 🎉</div>
                  )}
                  {path.steps.map((step, i) => {
                    const isActive = !step.done && path.steps.slice(0, i).every(s => s.done)
                    return (
                      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start', opacity: step.done ? 0.55 : 1 }}>
                        {/* Step icon */}
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                          background: step.done ? '#D1FAE5' : isActive ? 'linear-gradient(135deg, #7C3AED, #D946EF)' : '#F3F4F6',
                          boxShadow: isActive ? '0 3px 12px rgba(124,58,237,0.35)' : 'none',
                        }}>
                          {step.done ? '✅' : STEP_ICONS[step.type]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: step.done ? '#6B7280' : '#1C1917', textDecoration: step.done ? 'line-through' : 'none' }}>{step.title}</div>
                          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, lineHeight: 1.4 }}>{step.description}</div>
                          {isActive && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                              {step.type === 'learn' || step.type === 'explore' ? (
                                <Link href="/new-module" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 999 }}>
                                  Go →
                                </Link>
                              ) : step.type === 'review' ? (
                                <Link href="/review" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #065F46, #10B981)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 999 }}>
                                  Start Review →
                                </Link>
                              ) : (
                                <Link href="/portfolio" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #7C3AED, #D946EF)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 999 }}>
                                  Add to Portfolio →
                                </Link>
                              )}
                              <button onClick={() => markStepDone(path, i)} style={{ background: '#F0FDF4', color: '#065F46', fontWeight: 700, fontSize: 12, padding: '8px 14px', borderRadius: 999, border: '1.5px solid #BBF7D0', cursor: 'pointer' }}>
                                ✓ Done
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {paths.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Link href="/new-module" style={{ color: '#7C3AED', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>+ Create your own module to add to a path</Link>
          </div>
        )}
      </div>
      <Nav active="explore" />
    </div>
  )
}
