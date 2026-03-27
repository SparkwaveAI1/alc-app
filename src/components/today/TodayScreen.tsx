'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StreakBadge } from './StreakBadge'
import { DailyPlan } from './DailyPlan'
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
        <p className="text-xl text-muted-foreground">
          No learner profile found. Please complete onboarding first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <p className="text-5xl">{learner.avatar_emoji}</p>
        <h1 className="text-3xl sm:text-4xl font-bold">
          {getGreeting()}, {learner.name}! 🌟
        </h1>
        <StreakBadge days={learner.streak_days} />
      </div>

      <DailyPlan />

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-bold">What did you learn today?</h3>
          <Textarea
            placeholder="I learned about fractions today..."
            value={logEntry}
            onChange={(e) => setLogEntry(e.target.value)}
            className="text-lg min-h-[100px]"
          />
          {submitted ? (
            <p className="text-green-600 font-medium">Great job logging your learning! ✨</p>
          ) : (
            <Button onClick={handleLogSubmit} disabled={!logEntry.trim()} size="lg">
              Save Entry
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-muted-foreground">
            <p className="text-center py-4">
              Activity will appear here as you learn!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
