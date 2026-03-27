'use client'

type SkillStatus = 'not_started' | 'practicing' | 'mastered'

interface MasteryBadgeProps {
  status: SkillStatus
}

const STATUS_CONFIG: Record<SkillStatus, { label: string; icon: string; chipClass: string }> = {
  not_started: { label: 'Not Started', icon: '🔘', chipClass: 'vs-chip vs-chip-muted' },
  practicing:  { label: 'Practicing',  icon: '🟡', chipClass: 'vs-chip vs-chip-amber' },
  mastered:    { label: 'Mastered',    icon: '✅', chipClass: 'vs-chip vs-chip-accent' },
}

export function MasteryBadge({ status }: MasteryBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`${config.chipClass} text-xs`}>
      {config.icon} {config.label}
    </span>
  )
}
