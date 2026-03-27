'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function DailyPlan() {
  return (
    <div className="vs-card vs-card-accent-lavender p-6 space-y-4">
      <h3
        className="text-xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: '#2D1B35' }}
      >
        🎯 Today&apos;s Suggestion
      </h3>
      <p className="text-base" style={{ color: '#8B6A7A' }}>
        Ready for math? Let&apos;s practice fractions!
      </p>
      <Link href="/math">
        <Button
          size="lg"
          className="text-base h-12 w-full sm:w-auto hover:opacity-90 transition-opacity"
          style={{
            background: '#813EA0',
            color: '#ffffff',
            borderRadius: '0.875rem',
          }}
        >
          Start Math Practice 📐
        </Button>
      </Link>
    </div>
  )
}
