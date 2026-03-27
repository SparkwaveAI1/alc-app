'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { MasteryBadge } from './MasteryBadge'
import type { StandardWithSkill } from '@/lib/hooks/useSkills'

interface SkillCardProps {
  standard: StandardWithSkill
}

export function SkillCard({ standard }: SkillCardProps) {
  const status = standard.learner_skill?.status ?? 'not_started'
  const streak = standard.learner_skill?.correct_streak ?? 0

  return (
    <Link href={`/math/${standard.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-sm font-bold text-primary">
              {standard.standard_code}
            </span>
            <MasteryBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {standard.description}
          </p>
          {streak > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: Math.min(streak, 5) }).map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-green-500" />
              ))}
              {streak < 5 &&
                Array.from({ length: 5 - streak }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-muted" />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
