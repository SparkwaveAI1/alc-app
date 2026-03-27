'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StreakBadge } from './StreakBadge'
import { DailyPlan } from './DailyPlan'
import { AICompanionBubble } from '@/components/alc/AICompanionBubble'
import type { Tables } from '@/lib/types'

interface TodayScreenProps {
  learner: Tables<'learners'> | null
}

export function TodayScreen({ learner }: TodayScreenProps) {
  const [logEntry, setLogEntry] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleLogSubmit = () => {
    if (logEntry.trim()) {
      setSubmitted(true)
      setLogEntry('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  if (!learner) {
    return (
      <div className="text-center py-12">
        <p className="text-xl" style={{ color: '#8B6A7A' }}>
          No learner profile found. Please complete onboarding first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      {/* Greeting */}
      <div className="text-center space-y-3 py-4">
        <p className="text-6xl">{learner.avatar_emoji}</p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: '#813EA0', fontFamily: 'var(--font-heading)' }}
        >
          {getGreeting()}, {learner.name}! 🌟
        </h1>
        <StreakBadge days={learner.streak_days} />
      </div>

      {/* AI Companion bubble */}
      <AICompanionBubble
        message={`Ready to explore something amazing today? You've been on a great learning journey! Keep it up 🌟`}
        emoji="🦋"
      />

      <DailyPlan />

      {/* Journal entry */}
      <div className="vs-card p-6 space-y-4">
        <h3
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
        >
          📝 What did you learn today?
        </h3>
        <Textarea
          placeholder="I learned about fractions today... it was cool because..."
          value={logEntry}
          onChange={(e) => setLogEntry(e.target.value)}
          className="text-base min-h-[100px] vs-journal-input border-0 focus-visible:ring-0"
          style={{ background: '#FFF8F1', resize: 'none', borderRadius: '0.875rem' }}
        />
        {submitted ? (
          <p className="font-semibold" style={{ color: '#00694D' }}>
            Great job logging your learning! ✨
          </p>
        ) : (
          <Button
            onClick={handleLogSubmit}
            disabled={!logEntry.trim()}
            size="lg"
            style={{
              background: '#813EA0',
              color: '#ffffff',
              borderRadius: '0.875rem',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Save Entry 💫
          </Button>
        )}
      </div>

      {/* Recent activity */}
      <div className="vs-card p-6">
        <h3
          className="text-xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
        >
          ⚡ Recent Activity
        </h3>
        <div className="space-y-3">
          <p className="text-center py-4" style={{ color: '#8B6A7A' }}>
            Activity will appear here as you learn! 🌱
          </p>
        </div>
      </div>
    </div>
  )
}
