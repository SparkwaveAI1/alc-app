'use client'

import Link from 'next/link'
import { VelvetCard } from '@/components/alc/VelvetCard'
import { VelvetButton } from '@/components/alc/VelvetButton'
import { ProgressBar } from '@/components/alc/ProgressBar'
import { StatsChip } from '@/components/alc/StatsChip'
import type { Tables } from '@/lib/types'

interface TodayScreenProps {
  learner: Tables<'learners'> | null
}

const DEMO_ACTIVITIES = [
  {
    emoji: '📜',
    title: 'Ancient Egypt',
    subtitle: 'History & Culture',
    time: '~20 min',
    progress: 40,
    color: 'coral' as const,
    href: '#',
  },
  {
    emoji: '✏️',
    title: 'Creative Writing',
    subtitle: 'Story Workshop',
    time: '~15 min',
    progress: 65,
    color: 'lavender' as const,
    href: '#',
  },
  {
    emoji: '🔢',
    title: 'Math Patterns',
    subtitle: 'Grade 4 · Fractions',
    time: '~25 min',
    progress: 20,
    color: 'mint' as const,
    href: '/math',
  },
]

const QUICK_CREATE = [
  { label: '📔 Journal', color: 'lavender' as const },
  { label: '🎨 Sketch', color: 'coral' as const },
  { label: '📝 Note', color: 'mint' as const },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function TodayScreen({ learner }: TodayScreenProps) {
  const name = learner?.name ?? 'Zoe'
  const streak = learner?.streak_days ?? 7
  const avatar = learner?.avatar_emoji ?? '🌟'
  const isDemo = !learner

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#FFF8F1' }}
    >
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">

        {/* Header greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: '#8B6A7A' }}>
              {getGreeting()}
            </p>
            <h1
              className="text-3xl font-bold mt-0.5"
              style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
            >
              Hi, {name}! {avatar}
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
            style={{ background: '#F0E6F6' }}
          >
            👤
          </div>
        </div>

        {/* Streak chip */}
        <div className="flex items-center gap-3">
          <StatsChip color="coral">🔥 {streak}-day streak!</StatsChip>
          {isDemo && (
            <StatsChip color="muted">Demo · Sign up to save progress</StatsChip>
          )}
        </div>

        {/* AI Companion bubble — Aria */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 mt-1"
            style={{ background: '#F7D8FF' }}
          >
            🦋
          </div>
          <div
            className="flex-1 p-4 space-y-2"
            style={{
              background: '#F7D8FF',
              borderRadius: '1.25rem 1.25rem 1.25rem 0.375rem',
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#2D1B35' }}>
              Ready to explore something amazing today? You&apos;ve been on a great learning streak! ✨
            </p>
            <VelvetButton variant="primary" className="text-xs px-4 py-2">
              Let&apos;s go →
            </VelvetButton>
          </div>
        </div>

        {/* Today's Activities */}
        <section className="space-y-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
          >
            Today&apos;s Activities
          </h2>
          {DEMO_ACTIVITIES.map((activity) => (
            <Link key={activity.title} href={activity.href} className="block">
              <VelvetCard accent={activity.color} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background:
                        activity.color === 'coral' ? '#FFF0EE' :
                        activity.color === 'lavender' ? '#F0E6F6' : '#E6F4F0',
                    }}
                  >
                    {activity.emoji}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base truncate" style={{ color: '#2D1B35', fontFamily: 'var(--font-heading)' }}>
                        {activity.title}
                      </h3>
                      <span className="text-xs flex-shrink-0" style={{ color: '#8B6A7A' }}>
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#8B6A7A' }}>
                      {activity.subtitle}
                    </p>
                    <ProgressBar value={activity.progress} color={activity.color} />
                  </div>
                </div>
              </VelvetCard>
            </Link>
          ))}
        </section>

        {/* Quick Create */}
        <section className="space-y-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
          >
            Quick Create
          </h2>
          <div className="flex gap-2 flex-wrap">
            {QUICK_CREATE.map((item) => (
              <button
                key={item.label}
                className="px-4 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  borderRadius: '9999px',
                  background:
                    item.color === 'lavender' ? '#F0E6F6' :
                    item.color === 'coral' ? '#FFF0EE' : '#E6F4F0',
                  color:
                    item.color === 'lavender' ? '#813EA0' :
                    item.color === 'coral' ? '#A43B2D' : '#00694D',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* Log learning section */}
        <VelvetCard accent="lavender" className="p-5 space-y-3">
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
          >
            📝 What did you learn today?
          </h3>
          <textarea
            placeholder="I learned about fractions today... it was cool because..."
            rows={3}
            className="w-full text-sm resize-none outline-none p-3 vs-journal-input"
            style={{
              background: '#FFF8F1',
              borderRadius: '1rem',
              border: '1.5px solid #E8D5C4',
              color: '#2D1B35',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <VelvetButton variant="primary">Save Entry 💫</VelvetButton>
        </VelvetCard>

      </div>
    </div>
  )
}
