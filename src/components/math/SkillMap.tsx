'use client'

import { Progress } from '@/components/ui/progress'
import { SkillGrid } from './SkillGrid'
import type { DomainGroup } from '@/lib/hooks/useSkills'

interface SkillMapProps {
  domains: DomainGroup[]
  loading: boolean
}

const DOMAIN_COLORS: Record<string, string> = {
  OA: 'text-blue-600',
  NBT: 'text-purple-600',
  NF: 'text-orange-600',
  MD: 'text-green-600',
  G: 'text-red-600',
}

export function SkillMap({ domains, loading }: SkillMapProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-28 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">
          No standards loaded yet. Please run the database migrations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {domains.map((domain) => {
        const progress = domain.total > 0 ? (domain.mastered / domain.total) * 100 : 0
        return (
          <section key={domain.domain} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${DOMAIN_COLORS[domain.domain] ?? 'text-foreground'}`}>
                  {domain.domain_name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {domain.mastered}/{domain.total} mastered
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <SkillGrid standards={domain.standards} />
          </section>
        )
      })}
    </div>
  )
}
