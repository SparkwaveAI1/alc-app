'use client'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'coral' | 'mint' | 'ghost'

interface VelvetButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #813EA0 0%, #9C58BB 100%)',
    color: '#ffffff',
  },
  coral: {
    background: '#FD7D69',
    color: '#ffffff',
  },
  mint: {
    background: '#00694D',
    color: '#ffffff',
  },
  ghost: {
    background: 'transparent',
    color: '#813EA0',
    border: '2px solid #813EA0',
  },
}

export function VelvetButton({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled,
  className,
  fullWidth,
}: VelvetButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 transition-all',
        'hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        fullWidth && 'w-full',
        className
      )}
      style={{
        borderRadius: '3rem',
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  )
}
