'use client'

import Link from 'next/link'
import { Landmark, PenLine, Calculator, BookOpen, Paintbrush, FileText, User } from 'lucide-react'
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
    Icon: Landmark,
    iconBg: '#FFF0EE',
    iconColor: '#FD7D69',
    title: 'Ancient Egypt',
    subtitle: 'History & Culture',
    time: '~20 min',
    progress: 40,
    color: 'coral' as const,
    href: '#',
  },
  {
    Icon: PenLine,
    iconBg: '#F0E6F6',
    iconColor: '#813EA0',
    title: 'Creative Writing',
    subtitle: 'Story Workshop',
    time: '~15 min',
    progress: 65,
    color: 'lavender' as const,
    href: '#',
  },
  {
    Icon: Calculator,
    iconBg: '#E6F4F0',
    iconColor: '#00694D',
    title: 'Math Patterns',
    subtitle: 'Grade 4 · Fractions',
    time: '~25 min',
    progress: 20,
    color: 'mint' as const,
    href: '/math',
  },
]

const QUICK_CREATE = [
  { label: 'Journal',  Icon: BookOpen,   color: 'lavender' as const, iconColor: '#813EA0', bg: '#F0E6F6' },
  { label: 'Sketch',   Icon: Paintbrush, color: 'coral' as const,    iconColor: '#A43B2D', bg: '#FFF0EE' },
  { label: 'Note',     Icon: FileText,   color: 'mint' as const,     iconColor: '#00694D', bg: '#E6F4F0' },
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
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: '#F0E6F6' }}
          >
            <User size={20} color="#813EA0" strokeWidth={2} />
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
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: activity.iconBg }}
                  >
                    <activity.Icon size={24} color={activity.iconColor} strokeWidth={2} />
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
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  borderRadius: '9999px',
                  background: item.bg,
                  color: item.iconColor,
                }}
              >
                <item.Icon size={15} color={item.iconColor} strokeWidth={2} />
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
            What did you learn today?
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
          <VelvetButton variant="primary">Save Entry ✨</VelvetButton>
        </VelvetCard>

      </div>
    </div>
  )
}
