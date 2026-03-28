'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

type Skill = {
  id: string; subject: string; grade: number; standard_code: string
  skill_name: string; description: string
  status: 'not_started' | 'in_progress' | 'practiced' | 'mastered'
  last_practiced: string | null
}

const STATUS_CONFIG = {
  not_started: { label: 'Not started', color: '#9CA3AF', bg: '#F3F4F6', dot: '#D1D5DB' },
  in_progress:  { label: 'In progress', color: '#D97706', bg: '#FEF3C7', dot: '#F59E0B' },
  practiced:    { label: 'Practiced',   color: '#1D4ED8', bg: '#DBEAFE', dot: '#3B82F6' },
  mastered:     { label: 'Mastered',    color: '#065F46', bg: '#D1FAE5', dot: '#10B981' },
}

const SUBJECT_ICONS: Record<string, string> = {
  Math: '🔢', Reading: '📖', Writing: '✍️', Science: '🔬', 'Social Studies': '🌍'
}
const SUBJECT_COLORS: Record<string, string> = {
  Math: '#1D4ED8', Reading: '#B45309', Writing: '#065F46', Science: '#0F766E', 'Social Studies': '#7C3AED'
}

export default function Standards() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState<string>('All')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/standards')
    const data = await res.json()
    setSkills(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function updateStatus(skill: Skill, newStatus: Skill['status']) {
    setUpdating(skill.id)
    const res = await fetch('/api/standards', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: skill.id, status: newStatus }),
    })
    const data = await res.json()
    if (data.skill) setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, ...data.skill } : s))
    setUpdating(null)
  }

  const subjects = ['All', ...Array.from(new Set(skills.map(s => s.subject)))]
  const filtered = activeSubject === 'All' ? skills : skills.filter(s => s.subject === activeSubject)

  const masteredCount = skills.filter(s => s.status === 'mastered').length
  const practicedCount = skills.filter(s => s.status === 'practiced').length
  const inProgressCount = skills.filter(s => s.status === 'in_progress').length
  const progressPct = skills.length > 0 ? Math.round(((masteredCount + practicedCount * 0.5) / skills.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 50%, #7C3AED 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(99,102,241,0.5)', filter: 'blur(35px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/parent" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 12 }}>← Parent Dashboard</Link>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grade 4 Skills Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 16px' }}>U.S. Common Core · {skills.length} standards tracked</p>

          {/* Progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, height: 10, marginBottom: 8 }}>
            <div style={{ background: '#10B981', borderRadius: 999, height: 10, width: `${progressPct}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{progressPct}% on track</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{masteredCount} mastered · {practicedCount} practiced · {inProgressCount} in progress</span>
          </div>
        </div>
      </div>

      {/* Subject tabs */}
      <div style={{ overflowX: 'auto', padding: '16px 16px 0', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {subjects.map(sub => (
          <button key={sub} onClick={() => setActiveSubject(sub)} style={{
            borderRadius: 999, padding: '8px 16px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            background: activeSubject === sub ? (SUBJECT_COLORS[sub] || '#4F46E5') : '#fff',
            color: activeSubject === sub ? '#fff' : '#374151',
            fontWeight: 700, fontSize: 13,
            boxShadow: activeSubject === sub ? `0 4px 12px ${(SUBJECT_COLORS[sub] || '#4F46E5')}55` : '0 2px 6px rgba(0,0,0,0.07)',
          }}>
            {SUBJECT_ICONS[sub] || ''} {sub}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading skills...</div>}

        {/* Group by subject */}
        {!loading && (() => {
          const grouped: Record<string, Skill[]> = {}
          filtered.forEach(s => { if (!grouped[s.subject]) grouped[s.subject] = []; grouped[s.subject].push(s) })
          return Object.entries(grouped).map(([subject, subSkills]) => (
            <div key={subject} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{SUBJECT_ICONS[subject] || '📚'}</span>
                <div style={{ fontSize: 15, fontWeight: 800, color: SUBJECT_COLORS[subject] || '#374151', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subject}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {subSkills.filter(s => s.status === 'mastered').length}/{subSkills.length} mastered
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {subSkills.map(skill => {
                  const cfg = STATUS_CONFIG[skill.status]
                  return (
                    <div key={skill.id} style={{ background: '#fff', borderRadius: 18, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: cfg.dot, flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{skill.skill_name}</div>
                              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{skill.standard_code}</div>
                            </div>
                            <div style={{ background: cfg.bg, borderRadius: 8, padding: '3px 10px', flexShrink: 0 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 5, lineHeight: 1.5 }}>{skill.description}</div>

                          {/* Status buttons */}
                          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                            {(['not_started', 'in_progress', 'practiced', 'mastered'] as Skill['status'][]).map(s => (
                              <button key={s} onClick={() => updateStatus(skill, s)} disabled={updating === skill.id} style={{
                                borderRadius: 999, padding: '4px 10px', border: skill.status === s ? `2px solid ${STATUS_CONFIG[s].dot}` : '1.5px solid #E2E8F0',
                                background: skill.status === s ? STATUS_CONFIG[s].bg : '#F8FAFC',
                                color: skill.status === s ? STATUS_CONFIG[s].color : '#94A3B8',
                                fontWeight: 600, fontSize: 10, cursor: 'pointer',
                              }}>
                                {s === 'not_started' ? '○' : s === 'in_progress' ? '◑' : s === 'practiced' ? '◕' : '●'} {STATUS_CONFIG[s].label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        })()}
      </div>
      <Nav active="progress" />
    </div>
  )
}
