'use client'

import Link from 'next/link'
import { MasteryBadge } from './MasteryBadge'
import type { StandardWithSkill } from '@/lib/hooks/useSkills'

interface SkillCardProps {
  standard: StandardWithSkill
}

// Domain accent classes for left border strip
const DOMAIN_ACCENT: Record<string, string> = {
  OA:  'vs-card-accent-lavender',
  NBT: 'vs-card-accent-coral',
  NF:  'vs-card-accent-mint',
  MD:  'vs-card-accent-amber',
  G:   'vs-card-accent-teal',
}

export function SkillCard({ standard }: SkillCardProps) {
  const status = standard.learner_skill?.status ?? 'not_started'
  const streak = standard.learner_skill?.correct_streak ?? 0
  const accentClass = DOMAIN_ACCENT[standard.domain] ?? 'vs-card-accent-lavender'

  return (
    <Link href={`/math/${standard.id}`} className="block h-full" style={{ textDecoration: 'none' }}>
      <div
        className={`vs-card ${accentClass} p-4 h-full flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer`}
      >
        {/* Code + badge row */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="font-mono text-sm font-bold"
            style={{ color: '#813EA0' }}
          >
            {standard.standard_code}
          </span>
          <MasteryBadge status={status} />
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed flex-1 line-clamp-3"
          style={{ color: '#8B6A7A' }}
        >
          {standard.description}
        </p>

        {/* Streak dots */}
        {streak > 0 && (
          <div className="flex gap-1 items-center">
            {Array.from({ length: Math.min(streak, 5) }).map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: '#00694D' }}
              />
            ))}
            {streak < 5 &&
              Array.from({ length: 5 - streak }).map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#E8D5C4' }}
                />
              ))}
          </div>
        )}
      </div>
    </Link>
  )
}
