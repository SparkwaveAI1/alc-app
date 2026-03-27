'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const EMOJI_OPTIONS = ['🌟', '🚀', '🦄', '🐱', '🐶', '🌈', '⚡', '🎨', '🎵', '🌻', '🦋', '🐢']
const GRADE_OPTIONS = [3, 4, 5, 6]

interface LearnerProfileSetupProps {
  learnerName: string
  setLearnerName: (name: string) => void
  gradeLevel: number
  setGradeLevel: (level: number) => void
  avatarEmoji: string
  setAvatarEmoji: (emoji: string) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}

export function LearnerProfileSetup({
  learnerName,
  setLearnerName,
  gradeLevel,
  setGradeLevel,
  avatarEmoji,
  setAvatarEmoji,
  onNext,
  onBack,
  loading,
}: LearnerProfileSetupProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Add a Learner</h2>
        <p className="text-muted-foreground text-lg">
          Tell us about your child
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="learnerName" className="text-base">Name</Label>
          <Input
            id="learnerName"
            type="text"
            placeholder="Child's name"
            value={learnerName}
            onChange={(e) => setLearnerName(e.target.value)}
            className="text-lg h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base">Grade Level</Label>
          <div className="flex gap-2">
            {GRADE_OPTIONS.map((grade) => (
              <Button
                key={grade}
                type="button"
                variant={gradeLevel === grade ? 'default' : 'outline'}
                onClick={() => setGradeLevel(grade)}
                className="flex-1 h-12 text-lg"
              >
                {grade}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Pick an Avatar</Label>
          <div className="grid grid-cols-6 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatarEmoji(emoji)}
                className={`text-3xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                  avatarEmoji === emoji
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-transparent hover:border-muted'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 text-lg"
          disabled={!learnerName.trim() || loading}
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </div>
    </div>
  )
}
