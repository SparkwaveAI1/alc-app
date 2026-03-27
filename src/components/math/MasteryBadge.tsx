'use client'

import { Badge } from '@/components/ui/badge'

type SkillStatus = 'not_started' | 'practicing' | 'mastered'

interface MasteryBadgeProps {
  status: SkillStatus
}

const STATUS_CONFIG: Record<SkillStatus, { label: string; icon: string; variant: 'default' | 'secondary' | 'outline' }> = {
  not_started: { label: 'Not Started', icon: '🔘', variant: 'outline' },
  practicing: { label: 'Practicing', icon: '🟡', variant: 'secondary' },
  mastered: { label: 'Mastered', icon: '✅', variant: 'default' },
}

export function MasteryBadge({ status }: MasteryBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} className="gap-1 text-xs">
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  )
}
