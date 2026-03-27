'use client'

import { useLearner } from '@/lib/hooks/useLearner'
import { TodayScreen } from '@/components/today/TodayScreen'

export default function TodayPage() {
  const { activeLearner, loading } = useLearner()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 bg-muted rounded w-12 mx-auto rounded-full" />
          <div className="h-10 bg-muted rounded w-64 mx-auto" />
          <div className="h-6 bg-muted rounded w-32 mx-auto" />
        </div>
      </div>
    )
  }

  return <TodayScreen learner={activeLearner} />
}
