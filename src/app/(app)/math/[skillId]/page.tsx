'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLearner } from '@/lib/hooks/useLearner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MasteryBadge } from '@/components/math/MasteryBadge'
import { ArrowLeft } from 'lucide-react'
import type { Tables } from '@/lib/types'

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { activeLearner } = useLearner()
  const [standard, setStandard] = useState<Tables<'standards'> | null>(null)
  const [skill, setSkill] = useState<Tables<'learner_skills'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: std } = await supabase
          .from('standards')
          .select('*')
          .eq('id', params.skillId as string)
          .single()

        setStandard(std)

        if (activeLearner && std) {
          const { data: sk } = await supabase
            .from('learner_skills')
            .select('*')
            .match({ learner_id: activeLearner.id, standard_id: std.id })
            .single()

          setSkill(sk)
        }
      } catch {
        // Supabase not configured
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.skillId, activeLearner, supabase])

  const handleMarkPracticed = async () => {
    if (!activeLearner || !standard) return
    setMarking(true)

    try {
      if (skill) {
        await supabase
          .from('learner_skills')
          .update({
            status: 'practicing',
            attempts: skill.attempts + 1,
            correct_streak: skill.correct_streak + 1,
            last_practiced_at: new Date().toISOString(),
          })
          .eq('id', skill.id)

        setSkill({
          ...skill,
          status: 'practicing',
          attempts: skill.attempts + 1,
          correct_streak: skill.correct_streak + 1,
          last_practiced_at: new Date().toISOString(),
        })
      } else {
        const { data } = await supabase
          .from('learner_skills')
          .insert({
            learner_id: activeLearner.id,
            standard_id: standard.id,
            status: 'practicing',
            attempts: 1,
            correct_streak: 1,
            last_practiced_at: new Date().toISOString(),
          })
          .select()
          .single()

        setSkill(data)
      }
    } catch {
      // Handle error silently
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="animate-pulse h-8 bg-muted rounded w-48" />
        <div className="animate-pulse h-48 bg-muted rounded-lg" />
      </div>
    )
  }

  if (!standard) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">Standard not found.</p>
        <Button variant="ghost" onClick={() => router.push('/math')} className="mt-4">
          Back to Math Skills
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push('/math')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Math Skills
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base font-mono">
            {standard.standard_code}
          </Badge>
          <MasteryBadge status={skill?.status ?? 'not_started'} />
        </div>
        <h1 className="text-2xl font-bold">{standard.domain_name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standard Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{standard.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            AI-powered practice problems are coming in Phase 2! For now, you can mark this skill as practiced.
          </p>
          <Button
            onClick={handleMarkPracticed}
            disabled={marking}
            size="lg"
            className="w-full"
          >
            {marking ? 'Saving...' : 'Mark as Practiced Today'}
          </Button>
        </CardContent>
      </Card>

      {skill && (
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{skill.attempts}</p>
                <p className="text-sm text-muted-foreground">Attempts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{skill.correct_streak}</p>
                <p className="text-sm text-muted-foreground">Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{skill.status.replace('_', ' ')}</p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
