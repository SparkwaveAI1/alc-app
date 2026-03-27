'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/types'

export type StandardWithSkill = Tables<'standards'> & {
  learner_skill?: Tables<'learner_skills'> | null
}

export type DomainGroup = {
  domain: string
  domain_name: string
  standards: StandardWithSkill[]
  mastered: number
  total: number
}

export function useSkills(learnerId: string | null) {
  const [domains, setDomains] = useState<DomainGroup[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!learnerId) {
      setLoading(false)
      return
    }

    const fetchSkills = async () => {
      try {
        const { data: standards } = await supabase
          .from('standards')
          .select('*')
          .eq('grade_level', 4)
          .order('order_index')

        const { data: skills } = await supabase
          .from('learner_skills')
          .select('*')
          .eq('learner_id', learnerId)

        if (!standards) return

        const skillMap = new Map(
          skills?.map(s => [s.standard_id, s]) ?? []
        )

        const grouped = new Map<string, DomainGroup>()

        for (const standard of standards) {
          const skill = skillMap.get(standard.id) ?? null
          const withSkill: StandardWithSkill = { ...standard, learner_skill: skill }

          if (!grouped.has(standard.domain)) {
            grouped.set(standard.domain, {
              domain: standard.domain,
              domain_name: standard.domain_name,
              standards: [],
              mastered: 0,
              total: 0,
            })
          }

          const group = grouped.get(standard.domain)!
          group.standards.push(withSkill)
          group.total++
          if (skill?.status === 'mastered') group.mastered++
        }

        setDomains(Array.from(grouped.values()))
      } catch {
        // Supabase not configured
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [learnerId, supabase])

  return { domains, loading }
}
