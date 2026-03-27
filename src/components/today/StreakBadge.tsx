'use client'

interface StreakBadgeProps {
  days: number
}

export function StreakBadge({ days }: StreakBadgeProps) {
  if (days === 0) {
    return (
      <span className="vs-chip vs-chip-muted text-sm font-semibold">
        ✨ Start your streak today!
      </span>
    )
  }

  return (
    <span className="vs-chip vs-chip-secondary text-sm font-bold">
      🔥 {days} day streak
    </span>
  )
}
