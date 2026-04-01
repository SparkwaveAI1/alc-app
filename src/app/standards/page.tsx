'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

type Skill = {
  id: string
  subject: string
  skill_code: string
  skill_name: string
  description: string
  status: 'not_started' | 'practicing' | 'mastered'
  updated_at: string
}

type DomainGroup = {
  domain: string
  domain_name: string
  skills: Skill[]
  mastered: number
}

const DOMAIN_NAMES: Record<string, string> = {
  NBT: 'Number & Base Ten',
  NF: 'Fractions',
  OA: 'Operations & Algebra',
  MD: 'Measurement & Data',
  G: 'Geometry',
  RL: 'Reading Literature',
  RI: 'Reading Informational',
  W: 'Writing',
  L: 'Language',
  SS: 'Social Studies',
}

const SUBJECT_TABS = ['Math', 'Reading', 'Writing', 'Science', 'Social Studies']

const SUBJECT_COLORS: Record<string, string> = {
  Math: '#5BA4CF',
  Reading: '#7C5CBF',
  Writing: '#9C7DD4',
  Science: '#4CAF7C',
  'Social Studies': '#F5A623',
}

function getDomain(skillCode: string): string {
  // e.g. "4.NBT.1" → "NBT", "4-ESS1" → "ESS", "4.SS.1" → "SS"
  const parts = skillCode.split('.')
  if (parts.length >= 2) {
    // Remove trailing digits from domain like "NBT" stays "NBT"
    return parts[1].replace(/[0-9]/g, '')
  }
  const dashParts = skillCode.split('-')
  if (dashParts.length >= 2) {
    return dashParts[1].replace(/[0-9]/g, '')
  }
  return 'OTHER'
}

function groupByDomain(skills: Skill[]): DomainGroup[] {
  const map = new Map<string, DomainGroup>()
  for (const skill of skills) {
    const domain = getDomain(skill.skill_code)
    if (!map.has(domain)) {
      map.set(domain, {
        domain,
        domain_name: DOMAIN_NAMES[domain] || domain,
        skills: [],
        mastered: 0,
      })
    }
    const group = map.get(domain)!
    group.skills.push(skill)
    if (skill.status === 'mastered') group.mastered++
  }
  return Array.from(map.values())
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'mastered') {
    return (
      <span style={{ background: '#E8F5EF', color: '#4CAF7C', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
        ⭐ Mastered
      </span>
    )
  }
  if (status === 'practicing') {
    return (
      <span style={{ background: '#FFF3E0', color: '#F5A623', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
        🌱 Practicing
      </span>
    )
  }
  return (
    <span style={{ background: '#F3F0F7', color: '#9E9792', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
      🔘 Not started
    </span>
  )
}

export default function StandardsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Math')

  useEffect(() => {
    fetch('/api/standards')
      .then(r => r.json())
      .then(data => {
        setSkills(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = skills.filter(s => s.subject === activeTab)
  const domains = groupByDomain(filtered)
  const totalMastered = filtered.filter(s => s.status === 'mastered').length
  const accentColor = SUBJECT_COLORS[activeTab] || '#7C5CBF'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 40 }}>⭐</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#7C5CBF', fontFamily: "'Nunito', sans-serif" }}>Loading skills...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`, padding: '48px 20px 20px', borderRadius: '0 0 28px 28px' }}>
        <Link href="/me" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>
          ← Back
        </Link>
        <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
          Standards Tracker ⭐
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          Grade 4 · {totalMastered} of {filtered.length} mastered
        </p>
      </div>

      {/* Subject tabs */}
      <div style={{ overflowX: 'auto', padding: '14px 16px 0', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {SUBJECT_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flexShrink: 0,
              border: 'none',
              borderRadius: 20,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              background: activeTab === tab ? (SUBJECT_COLORS[tab] || '#7C5CBF') : '#F0EBF7',
              color: activeTab === tab ? '#fff' : '#6B6560',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 20px', textAlign: 'center', marginTop: 8, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>No skills yet</div>
            <p style={{ fontSize: 13, color: '#6B6560', margin: '6px 0 0' }}>Skills for this subject are coming soon.</p>
          </div>
        ) : (
          domains.map(group => (
            <div key={group.domain} style={{ marginBottom: 24 }}>
              {/* Domain header */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>
                      {group.domain_name}
                    </span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#9E9792', fontWeight: 600 }}>
                      {group.domain}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#6B6560', fontWeight: 600 }}>
                    {group.mastered}/{group.skills.length}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 5, background: '#E8E2D9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${group.skills.length > 0 ? (group.mastered / group.skills.length) * 100 : 0}%`,
                    background: accentColor,
                    borderRadius: 4,
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* Skill cards */}
              {group.skills.map(skill => (
                <Link key={skill.id} href={`/standards/${skill.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '14px 16px',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 2px 12px rgba(45,42,38,0.06)',
                    borderLeft: `4px solid ${skill.status === 'mastered' ? '#4CAF7C' : skill.status === 'practicing' ? '#F5A623' : '#E8E2D9'}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', marginBottom: 3 }}>
                        {skill.skill_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#9E9792', fontWeight: 600, marginBottom: 5 }}>
                        {skill.skill_code}
                      </div>
                      <StatusBadge status={skill.status} />
                    </div>
                    <div style={{ color: '#D1C8D8', fontSize: 18 }}>›</div>
                  </div>
                </Link>
              ))}
            </div>
          ))
        )}
      </div>

      <Nav active="me" />
    </div>
  )
}
