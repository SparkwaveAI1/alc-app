'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Skill = {
  id: string
  subject: string
  skill_code: string
  skill_name: string
  description: string
  status: 'not_started' | 'practicing' | 'mastered'
  updated_at: string
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'mastered') {
    return (
      <span style={{ background: '#E8F5EF', color: '#4CAF7C', borderRadius: 10, padding: '5px 12px', fontSize: 13, fontWeight: 700 }}>
        ⭐ Mastered
      </span>
    )
  }
  if (status === 'practicing') {
    return (
      <span style={{ background: '#FFF3E0', color: '#F5A623', borderRadius: 10, padding: '5px 12px', fontSize: 13, fontWeight: 700 }}>
        🌱 Practicing
      </span>
    )
  }
  return (
    <span style={{ background: '#F3F0F7', color: '#9E9792', borderRadius: 10, padding: '5px 12px', fontSize: 13, fontWeight: 700 }}>
      🔘 Not started yet
    </span>
  )
}

function StreakDots({ streak, max = 3 }: { streak: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: i < streak ? '#F5A623' : '#E8E2D9',
            transition: 'background 0.2s',
          }}
        />
      ))}
      <span style={{ fontSize: 12, color: '#6B6560', marginLeft: 4 }}>
        {streak}/3 toward mastery
      </span>
    </div>
  )
}

export default function SkillDetailPage() {
  const params = useParams()
  const skillId = params?.skillId as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [practiced, setPracticed] = useState(false)
  const [celebration, setCelebration] = useState('')
  const [patching, setPatching] = useState(false)

  useEffect(() => {
    fetch('/api/standards')
      .then(r => r.json())
      .then((data: Skill[]) => {
        if (!Array.isArray(data)) return
        setAllSkills(data)
        const found = data.find(s => s.id === skillId)
        if (found) {
          setSkill(found)
          // Load streak from localStorage
          const storedStreak = parseInt(localStorage.getItem(`alc_streak_${found.skill_code}`) || '0', 10)
          setStreak(storedStreak)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [skillId])

  const handlePractice = async (level: 'tried' | 'getting' | 'got') => {
    if (!skill || practiced || patching) return
    setPatching(true)

    let newStreak = streak
    let newStatus: string = skill.status

    if (level === 'tried') {
      newStatus = 'practicing'
      // Don't increment streak for just trying
    } else if (level === 'getting') {
      newStreak = Math.min(streak + 1, 3)
      newStatus = 'practicing'
    } else if (level === 'got') {
      newStreak = Math.min(streak + 1, 3)
      newStatus = newStreak >= 2 ? 'mastered' : 'practicing'
    }

    // Save streak to localStorage
    localStorage.setItem(`alc_streak_${skill.skill_code}`, String(newStreak))
    setStreak(newStreak)

    // If mastered threshold met, force mastered
    if (newStreak >= 3) newStatus = 'mastered'

    try {
      const res = await fetch('/api/standards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: skill.id, status: newStatus }),
      })
      const data = await res.json()
      if (data?.skill) {
        setSkill(data.skill)
      } else {
        // Optimistic update
        setSkill(prev => prev ? { ...prev, status: newStatus as any } : prev)
      }
    } catch {
      setSkill(prev => prev ? { ...prev, status: newStatus as any } : prev)
    }

    const messages: Record<string, string> = {
      tried: "Great for trying! Every attempt builds understanding. 🌱",
      getting: "You're making progress! Keep practicing. 💪",
      got: newStatus === 'mastered' ? "🎉 AMAZING! You've mastered this skill! ⭐" : "Awesome effort! One more session and you've got it! 🔥",
    }
    setCelebration(messages[level])
    setPracticed(true)
    setPatching(false)
  }

  // Find prev/next skills in same domain
  const sameDomainSkills = (() => {
    if (!skill) return []
    const getDomain = (code: string) => {
      const parts = code.split('.')
      if (parts.length >= 2) return parts[1].replace(/[0-9]/g, '')
      const dash = code.split('-')
      if (dash.length >= 2) return dash[1].replace(/[0-9]/g, '')
      return 'OTHER'
    }
    const myDomain = getDomain(skill.skill_code)
    return allSkills
      .filter(s => s.subject === skill.subject && getDomain(s.skill_code) === myDomain)
      .sort((a, b) => a.skill_code.localeCompare(b.skill_code))
  })()

  const myIndex = sameDomainSkills.findIndex(s => s.id === skillId)
  const prevSkill = myIndex > 0 ? sameDomainSkills[myIndex - 1] : null
  const nextSkill = myIndex < sameDomainSkills.length - 1 ? sameDomainSkills[myIndex + 1] : null

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 40 }}>⭐</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#7C5CBF', fontFamily: "'Nunito', sans-serif" }}>Loading...</div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, padding: '20px' }}>
        <div style={{ fontSize: 40 }}>😕</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2D2A26', fontFamily: "'Nunito', sans-serif" }}>Skill not found</div>
        <Link href="/standards" style={{ color: '#7C5CBF', fontWeight: 600 }}>← Back to Standards</Link>
      </div>
    )
  }

  const masteryColor = skill.status === 'mastered' ? '#4CAF7C' : skill.status === 'practicing' ? '#F5A623' : '#7C5CBF'

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${masteryColor}, ${masteryColor}CC)`, padding: '48px 20px 24px' }}>
        <Link href="/standards" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
          ← Standards
        </Link>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>
          {skill.skill_code} · {skill.subject}
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif", lineHeight: 1.2 }}>
          {skill.skill_name}
        </h1>
        <StatusBadge status={skill.status} />
      </div>

      <div style={{ padding: '20px 16px' }}>

        {/* Description */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px 18px', marginBottom: 16, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 8 }}>WHAT YOU LEARN</div>
          <p style={{ margin: 0, fontSize: 14, color: '#2D2A26', lineHeight: 1.6 }}>{skill.description}</p>
        </div>

        {/* Streak progress */}
        {skill.status !== 'mastered' && (
          <div style={{ background: '#fff', borderRadius: 18, padding: '18px 18px', marginBottom: 16, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 10 }}>MASTERY PROGRESS</div>
            <StreakDots streak={streak} />
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#9E9792' }}>
              Practice consistently to earn mastery. You need 3 good sessions! 
            </p>
          </div>
        )}

        {/* Mastered celebration */}
        {skill.status === 'mastered' && (
          <div style={{ background: 'linear-gradient(135deg, #E8F5EF, #F0FAF4)', borderRadius: 18, padding: '20px 18px', marginBottom: 16, textAlign: 'center', border: '2px solid #4CAF7C' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#2D7A4C', fontFamily: "'Nunito', sans-serif", marginBottom: 4 }}>Skill Mastered!</div>
            <p style={{ margin: 0, fontSize: 13, color: '#4CAF7C' }}>You&apos;ve mastered {skill.skill_name}. Amazing work!</p>
          </div>
        )}

        {/* Practice buttons */}
        {!celebration ? (
          <div style={{ background: '#fff', borderRadius: 18, padding: '18px 18px', marginBottom: 16, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6560', letterSpacing: '0.8px', marginBottom: 14 }}>
              {skill.status === 'mastered' ? 'KEEP SHARP' : 'PRACTICE TODAY'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => handlePractice('tried')}
                disabled={patching}
                style={{
                  border: '2px solid #E8E2D9', borderRadius: 14, padding: '14px 18px',
                  background: '#FDFBF7', cursor: patching ? 'default' : 'pointer',
                  textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                  opacity: patching ? 0.7 : 1,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', marginBottom: 2 }}>🌱 Just tried it</div>
                <div style={{ fontSize: 12, color: '#6B6560' }}>I looked at it and gave it a shot</div>
              </button>
              <button
                onClick={() => handlePractice('getting')}
                disabled={patching}
                style={{
                  border: '2px solid #FFF3E0', borderRadius: 14, padding: '14px 18px',
                  background: '#FFFAF4', cursor: patching ? 'default' : 'pointer',
                  textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                  opacity: patching ? 0.7 : 1,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', marginBottom: 2 }}>💪 Getting it!</div>
                <div style={{ fontSize: 12, color: '#6B6560' }}>I worked through it and mostly understand</div>
              </button>
              <button
                onClick={() => handlePractice('got')}
                disabled={patching}
                style={{
                  border: '2px solid #E8F5EF', borderRadius: 14, padding: '14px 18px',
                  background: '#F5FBF8', cursor: patching ? 'default' : 'pointer',
                  textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                  opacity: patching ? 0.7 : 1,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: '#2D2A26', marginBottom: 2 }}>⭐ I got it!</div>
                <div style={{ fontSize: 12, color: '#6B6560' }}>I can do this confidently — ready to move on</div>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #EDE8F9, #F5F0FF)',
            borderRadius: 18, padding: '24px 18px', marginBottom: 16,
            textAlign: 'center', boxShadow: '0 4px 20px rgba(124,92,191,0.15)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>
              {skill.status === 'mastered' ? '🏆' : '🎉'}
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", lineHeight: 1.5 }}>
              {celebration}
            </p>
            {skill.status !== 'mastered' && streak > 0 && (
              <div style={{ marginTop: 14 }}>
                <StreakDots streak={streak} />
              </div>
            )}
          </div>
        )}

        {/* Navigation between skills */}
        {(prevSkill || nextSkill) && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {prevSkill ? (
              <Link href={`/standards/${prevSkill.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', boxShadow: '0 2px 10px rgba(45,42,38,0.06)', textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: '#9E9792', fontWeight: 600, marginBottom: 3 }}>← PREVIOUS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26' }}>{prevSkill.skill_name}</div>
                  <div style={{ fontSize: 11, color: '#9E9792' }}>{prevSkill.skill_code}</div>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}
            {nextSkill ? (
              <Link href={`/standards/${nextSkill.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', boxShadow: '0 2px 10px rgba(45,42,38,0.06)', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#9E9792', fontWeight: 600, marginBottom: 3 }}>NEXT →</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2D2A26' }}>{nextSkill.skill_name}</div>
                  <div style={{ fontSize: 11, color: '#9E9792' }}>{nextSkill.skill_code}</div>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}
          </div>
        )}

        <Link href="/standards" style={{ display: 'block', textAlign: 'center', color: '#7C5CBF', fontWeight: 600, fontSize: 14, textDecoration: 'none', padding: '10px' }}>
          ← Back to all standards
        </Link>
      </div>
    </div>
  )
}
