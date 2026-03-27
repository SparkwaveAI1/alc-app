'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/types'

export function useLearner() {
  const [learners, setLearners] = useState<Tables<'learners'>[]>([])
  const [activeLearner, setActiveLearner] = useState<Tables<'learners'> | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: households } = await supabase
          .from('households')
          .select('id')
          .eq('parent_id', user.id)

        if (!households?.length) return

        const householdIds = households.map(h => h.id)
        const { data } = await supabase
          .from('learners')
          .select('*')
          .in('household_id', householdIds)

        if (data?.length) {
          setLearners(data)
          setActiveLearner(data[0])
        }
      } catch {
        // Supabase not configured
      } finally {
        setLoading(false)
      }
    }

    fetchLearners()
  }, [supabase])

  return { learners, activeLearner, setActiveLearner, loading }
}
