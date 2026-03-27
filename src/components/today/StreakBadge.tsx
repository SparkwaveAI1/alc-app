'use client'

interface StreakBadgeProps {
  days: number
}

export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-700">
      <span className="text-xl">🔥</span>
      <span className="font-bold text-lg">{days} day streak</span>
    </div>
  )
}
