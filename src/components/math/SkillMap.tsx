'use client'

import { SkillGrid } from './SkillGrid'
import type { DomainGroup } from '@/lib/hooks/useSkills'

interface SkillMapProps {
  domains: DomainGroup[]
  loading: boolean
}

// Domain accent colors using Velvet Scrapbook palette — no cold blues
const DOMAIN_CONFIG: Record<string, { color: string; accentClass: string; emoji: string }> = {
  OA:  { color: '#813EA0', accentClass: 'vs-card-accent-lavender', emoji: '✖️' },
  NBT: { color: '#FD7D69', accentClass: 'vs-card-accent-coral',    emoji: '🔢' },
  NF:  { color: '#00694D', accentClass: 'vs-card-accent-mint',     emoji: '½' },
  MD:  { color: '#D97706', accentClass: 'vs-card-accent-amber',    emoji: '📏' },
  G:   { color: '#0891B2', accentClass: 'vs-card-accent-teal',     emoji: '📐' },
}

export function SkillMap({ domains, loading }: SkillMapProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="h-6 rounded-full w-48" style={{ background: '#E8D5C4' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-28 rounded-2xl" style={{ background: '#F5EDE8' }} />
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
        <p className="text-xl" style={{ color: '#8B6A7A' }}>
          No standards loaded yet. Please run the database migrations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {domains.map((domain) => {
        const config = DOMAIN_CONFIG[domain.domain] ?? {
          color: '#813EA0',
          accentClass: 'vs-card-accent-lavender',
          emoji: '📚',
        }
        const progress = domain.total > 0 ? (domain.mastered / domain.total) * 100 : 0

        return (
          <section key={domain.domain} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)', color: config.color }}
                >
                  <span>{config.emoji}</span>
                  {domain.domain_name}
                </h2>
                <span className="vs-chip vs-chip-muted text-xs">
                  {domain.mastered}/{domain.total} mastered
                </span>
              </div>
              {/* Custom progress bar — no cold defaults */}
              <div className="vs-progress-track h-2">
                <div
                  className="vs-progress-fill h-2"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <SkillGrid standards={domain.standards} />
          </section>
        )
      })}
    </div>
  )
}
