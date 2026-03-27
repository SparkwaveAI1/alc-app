'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/today',     label: 'Home',     emoji: '🏠' },
  { href: '/math',      label: 'Explore',  emoji: '🔭' },
  { href: '#',          label: 'Create',   emoji: '✏️' },
  { href: '/dashboard', label: 'Progress', emoji: '⭐' },
  { href: '/dashboard', label: 'Me',       emoji: '👤' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8F1' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(255, 248, 241, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E8D5C4',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦋</span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: '#813EA0' }}
          >
            My Learning
          </span>
        </div>
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: '#F0E6F6', color: '#813EA0' }}
        >
          👤
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom nav — Velvet Scrapbook style */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 max-w-lg mx-auto"
        style={{
          background: 'rgba(255, 250, 245, 0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #E8D5C4',
          borderRadius: '1.5rem 1.5rem 0 0',
          left: 0,
          right: 0,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.href !== '#' && (
            pathname === item.href || pathname.startsWith(item.href + '/')
          )
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all',
                isActive
                  ? 'bg-[#F0E6F6]'
                  : 'hover:bg-[#F9F3EB]',
                item.href === '#' && 'opacity-50 pointer-events-none'
              )}
            >
              <span
                className={cn('text-xl transition-transform', isActive && 'scale-110')}
              >
                {item.emoji}
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? '#813EA0' : '#8B6A7A' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
