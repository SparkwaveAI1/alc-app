'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { HouseholdSetup } from '@/components/onboarding/HouseholdSetup'
import { LearnerProfileSetup } from '@/components/onboarding/LearnerProfileSetup'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [householdName, setHouseholdName] = useState('')
  const [learnerName, setLearnerName] = useState('')
  const [gradeLevel, setGradeLevel] = useState(4)
  const [avatarEmoji, setAvatarEmoji] = useState('🌟')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: household, error: hError } = await supabase
        .from('households')
        .insert({ parent_id: user.id, name: householdName })
        .select()
        .single()

      if (hError) throw hError

      const { error: lError } = await supabase
        .from('learners')
        .insert({
          household_id: household.id,
          name: learnerName,
          grade_level: gradeLevel,
          avatar_emoji: avatarEmoji,
        })

      if (lError) throw lError

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <HouseholdSetup
              householdName={householdName}
              setHouseholdName={setHouseholdName}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <LearnerProfileSetup
              learnerName={learnerName}
              setLearnerName={setLearnerName}
              gradeLevel={gradeLevel}
              setGradeLevel={setGradeLevel}
              avatarEmoji={avatarEmoji}
              setAvatarEmoji={setAvatarEmoji}
              onNext={handleComplete}
              onBack={() => setStep(1)}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
