'use client'

import { cn } from '@/lib/utils'

type AccentColor = 'lavender' | 'coral' | 'mint' | 'amber' | 'none'

interface VelvetCardProps {
  children: React.ReactNode
  accent?: AccentColor
  className?: string
  onClick?: () => void
}

const accentStyles: Record<AccentColor, string> = {
  lavender: 'border-l-4 border-l-[#813EA0]',
  coral:    'border-l-4 border-l-[#FD7D69]',
  mint:     'border-l-4 border-l-[#00694D]',
  amber:    'border-l-4 border-l-[#D97706]',
  none:     '',
}

export function VelvetCard({ children, accent = 'none', className, onClick }: VelvetCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[2rem] p-5 cursor-default',
        accentStyles[accent],
        onClick && 'cursor-pointer hover:scale-[1.01] transition-transform',
        className
      )}
      style={{ boxShadow: '0px 8px 24px rgba(45, 37, 64, 0.07)' }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
