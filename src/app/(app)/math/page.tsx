'use client'

import { useLearner } from '@/lib/hooks/useLearner'
import { useSkills } from '@/lib/hooks/useSkills'
import { VelvetCard } from '@/components/alc/VelvetCard'
import { ProgressBar } from '@/components/alc/ProgressBar'
import { StatsChip } from '@/components/alc/StatsChip'
import Link from 'next/link'

const ACTIVITY_TYPES = [
  { emoji: '📖', title: 'Study', color: '#F7D8FF', textColor: '#813EA0' },
  { emoji: '🎯', title: 'Practice', color: '#FFE4E0', textColor: '#A43B2D' },
  { emoji: '✨', title: 'Create', color: '#E6F4F0', textColor: '#00694D' },
]

export default function MathPage() {
  const { activeLearner, loading: learnerLoading } = useLearner()
  const { domains, loading: skillsLoading } = useSkills(activeLearner?.id ?? null)
  const loading = learnerLoading || skillsLoading

  const totalSkills = domains.reduce((sum, d) => sum + d.total, 0)
  const masteredSkills = domains.reduce((sum, d) => sum + d.mastered, 0)
  const progressPct = totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF8F1' }}>

      {/* Hero — lavender gradient */}
      <div
        className="px-4 pt-6 pb-8"
        style={{
          background: 'linear-gradient(160deg, #813EA0 0%, #9C58BB 60%, #C084D4 100%)',
        }}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📐</span>
            <div>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Grade 4 · Common Core
              </p>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Math Skills
              </h1>
            </div>
          </div>

          <div
            className="p-4 space-y-2"
            style={{
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '1.5rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">Skills explored</span>
              <span className="text-sm font-bold text-white">{progressPct}%</span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: '#8DF7CC' }}
              />
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {masteredSkills} of {totalSkills} skills mastered
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Activity type cards */}
        <section className="space-y-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
          >
            How do you want to learn?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {ACTIVITY_TYPES.map((type) => (
              <button
                key={type.title}
                className="flex flex-col items-center gap-2 p-4 transition-all hover:scale-105 active:scale-95"
                style={{
                  background: type.color,
                  borderRadius: '1.5rem',
                  boxShadow: '0px 4px 12px rgba(45, 37, 64, 0.06)',
                }}
              >
                <span className="text-2xl">{type.emoji}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: type.textColor, fontFamily: 'var(--font-heading)' }}
                >
                  {type.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Skill map */}
        <section className="space-y-4">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
          >
            Skill Map
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-[2rem]"
                  style={{ background: '#F7D8FF' }}
                />
              ))}
            </div>
          ) : domains.length === 0 ? (
            <VelvetCard accent="lavender" className="p-6 text-center space-y-2">
              <p className="text-2xl">🌱</p>
              <p style={{ color: '#8B6A7A' }}>
                {activeLearner ? 'Loading your skills…' : 'Sign in to track your math progress!'}
              </p>
            </VelvetCard>
          ) : (
            domains.map((domain) => {
              const pct = domain.total > 0 ? Math.round((domain.mastered / domain.total) * 100) : 0
              return (
                <VelvetCard key={domain.domain} accent="lavender" className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="font-bold text-base"
                        style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
                      >
                        {domain.domain_name}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: '#8B6A7A' }}>
                        {domain.total} skills
                      </p>
                    </div>
                    <StatsChip color="lavender">{pct}%</StatsChip>
                  </div>

                  <ProgressBar value={pct} color="lavender" />

                  <div className="flex flex-wrap gap-1.5">
                    {domain.standards.map((std) => {
                      const status = std.learner_skill?.status ?? 'not_started'
                      return (
                        <Link
                          key={std.id}
                          href={`/math/${std.id}`}
                          className="transition-transform hover:scale-105"
                        >
                          <span
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold"
                            style={{
                              borderRadius: '9999px',
                              background:
                                status === 'mastered'   ? '#8DF7CC' :
                                status === 'practicing' ? '#F7D8FF' : '#F5EDE8',
                              color:
                                status === 'mastered'   ? '#00694D' :
                                status === 'practicing' ? '#813EA0' : '#8B6A7A',
                            }}
                          >
                            {status === 'mastered' ? '✓ ' : ''}{std.standard_code}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </VelvetCard>
              )
            })
          )}
        </section>
      </div>
    </div>
  )
}
