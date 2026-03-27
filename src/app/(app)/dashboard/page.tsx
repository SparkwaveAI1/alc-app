'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useLearner } from '@/lib/hooks/useLearner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const { learners, loading: learnersLoading } = useLearner()

  if (authLoading || learnersLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-8 bg-muted rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {profile?.display_name ?? 'Parent'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your family&apos;s learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{learners.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Streak Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {learners.reduce((sum, l) => sum + l.streak_days, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Active</p>
          </CardContent>
        </Card>
      </div>

      {learners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learners.map((learner) => (
                <div
                  key={learner.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <span className="text-2xl">{learner.avatar_emoji}</span>
                  <div>
                    <p className="font-medium">{learner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Grade {learner.grade_level} · 🔥 {learner.streak_days} day streak
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {learners.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No learners yet. Complete onboarding to add your first learner.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
