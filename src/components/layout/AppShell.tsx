'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/today',    label: 'Home',     icon: '🏠' },
  { href: '/explore',  label: 'Explore',  icon: '🔭' },
  { href: '/create',   label: 'Create',   icon: '✏️' },
  { href: '/progress', label: 'Progress', icon: '⭐' },
  { href: '/me',       label: 'Me',       icon: '👤' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <main style={{ paddingBottom: 80 }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#FFFFFF',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: 70, zIndex: 50,
      }}>
        {NAV_ITEMS.map((tab) => {
          const isActive = tab.href === '/today'
            ? pathname === '/today' || pathname === '/'
            : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, width: 60 }}>
              <div style={{
                width: 48, height: 32, borderRadius: 12,
                background: isActive ? '#7C3AED' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {tab.icon}
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#7C3AED' : '#9CA3AF',
              }}>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
