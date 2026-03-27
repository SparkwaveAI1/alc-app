'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DailyPlan() {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Today&apos;s Suggestion</h3>
        <p className="text-lg text-muted-foreground">
          Ready for math? Let&apos;s practice fractions!
        </p>
        <Link href="/math">
          <Button size="lg" className="text-lg h-12 w-full sm:w-auto">
            Start Math Practice
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
