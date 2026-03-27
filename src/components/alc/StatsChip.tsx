'use client'

type ChipColor = 'mint' | 'lavender' | 'coral' | 'amber' | 'muted'

interface StatsChipProps {
  children: React.ReactNode
  color?: ChipColor
  rotate?: boolean
}

const chipStyles: Record<ChipColor, React.CSSProperties> = {
  mint:     { background: '#8DF7CC', color: '#00694D' },
  lavender: { background: '#F7D8FF', color: '#813EA0' },
  coral:    { background: '#FFE4E0', color: '#A43B2D' },
  amber:    { background: '#FEF3C7', color: '#92400E' },
  muted:    { background: '#F5EDE8', color: '#8B6A7A' },
}

export function StatsChip({ children, color = 'mint', rotate = false }: StatsChipProps) {
  const rotateStyle = rotate
    ? { transform: `rotate(${Math.random() > 0.5 ? 1 : -1}deg)` }
    : {}

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold"
      style={{
        borderRadius: '9999px',
        ...chipStyles[color],
        ...rotateStyle,
      }}
    >
      {children}
    </span>
  )
}
