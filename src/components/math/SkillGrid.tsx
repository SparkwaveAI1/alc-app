'use client'

import { SkillCard } from './SkillCard'
import type { StandardWithSkill } from '@/lib/hooks/useSkills'

interface SkillGridProps {
  standards: StandardWithSkill[]
}

export function SkillGrid({ standards }: SkillGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {standards.map((standard) => (
        <SkillCard key={standard.id} standard={standard} />
      ))}
    </div>
  )
}
