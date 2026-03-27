'use client'

import { useLearner } from '@/lib/hooks/useLearner'
import { useSkills } from '@/lib/hooks/useSkills'
import { SkillMap } from '@/components/math/SkillMap'

export default function MathPage() {
  const { activeLearner, loading: learnerLoading } = useLearner()
  const { domains, loading: skillsLoading } = useSkills(activeLearner?.id ?? null)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">📐 Math Skills</h1>
        <p className="text-muted-foreground mt-1">
          Grade 4 Common Core Standards
        </p>
      </div>
      <SkillMap domains={domains} loading={learnerLoading || skillsLoading} />
    </div>
  )
}
