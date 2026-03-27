'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface HouseholdSetupProps {
  householdName: string
  setHouseholdName: (name: string) => void
  onNext: () => void
}

export function HouseholdSetup({ householdName, setHouseholdName, onNext }: HouseholdSetupProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Welcome to ALC!</h2>
        <p className="text-muted-foreground text-lg">
          Let&apos;s set up your family&apos;s learning space
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="householdName" className="text-base">
            What should we call your household?
          </Label>
          <Input
            id="householdName"
            type="text"
            placeholder="e.g., The Johnson Family"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            className="text-lg h-12"
          />
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 text-lg"
        disabled={!householdName.trim()}
      >
        Next Step
      </Button>
    </div>
  )
}
