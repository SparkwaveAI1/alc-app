'use client'

type ProgressColor = 'lavender' | 'coral' | 'mint'

interface ProgressBarProps {
  value: number  // 0–100
  color?: ProgressColor
  label?: string
  showPercent?: boolean
  height?: string
}

const fillColors: Record<ProgressColor, string> = {
  lavender: 'linear-gradient(90deg, #813EA0, #9C58BB)',
  coral:    'linear-gradient(90deg, #FD7D69, #FFA594)',
  mint:     'linear-gradient(90deg, #00694D, #2EA87A)',
}

export function ProgressBar({ value, color = 'lavender', label, showPercent, height = '0.5rem' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className="space-y-1">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs font-medium" style={{ color: '#4D4350' }}>
          {label && <span>{label}</span>}
          {showPercent && <span>{pct}%</span>}
        </div>
      )}
      <div
        className="w-full overflow-hidden"
        style={{
          height,
          borderRadius: '9999px',
          background: '#E8D5C4',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: '9999px',
            background: fillColors[color],
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
