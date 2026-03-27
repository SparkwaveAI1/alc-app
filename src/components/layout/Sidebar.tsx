'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/today', label: 'Today', emoji: '🏠' },
  { href: '/math', label: 'Math Skills', emoji: '📐' },
  { href: '#', label: 'Flashcards', emoji: '🗂️', disabled: true },
  { href: '#', label: 'Resources', emoji: '📚', disabled: true },
  { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        style={{ color: '#813EA0' }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(45, 27, 53, 0.4)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 md:translate-x-0 md:static md:z-0 flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: '#FFFAF5',
          borderRight: '1px solid #E8D5C4',
        }}
      >
        {/* Brand */}
        <div
          className="p-6"
          style={{ borderBottom: '1px solid #E8D5C4' }}
        >
          <h1
            className="text-xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#813EA0',
            }}
          >
            🌱 ALC
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B6A7A' }}>
            Learning Companion
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '#' && pathname.startsWith(item.href + '/'))

            return (
              <Link
                key={item.label}
                href={item.disabled ? '#' : item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  borderRadius: '0.875rem',
                  background: isActive ? '#F0E6F6' : 'transparent',
                  color: isActive ? '#813EA0' : '#8B6A7A',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !item.disabled) {
                    e.currentTarget.style.background = '#F5EDE8'
                    e.currentTarget.style.color = '#2D1B35'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#8B6A7A'
                  }
                }}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.label}</span>
                {item.disabled && (
                  <span
                    className="ml-auto text-xs font-semibold vs-chip vs-chip-muted"
                    style={{ padding: '0.125rem 0.5rem', fontSize: '0.7rem' }}
                  >
                    Soon
                  </span>
                )}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#813EA0' }} />
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
