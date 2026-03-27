'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Explore', href: '/explore', icon: '🔭' },
  { name: 'Create', href: '/create', icon: '✏️' },
  { name: 'Progress', href: '/progress', icon: '⭐' },
  { name: 'Me', href: '/me', icon: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#FFFFFF',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 70, zIndex: 50, paddingBottom: 4,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2,
              textDecoration: 'none', width: 60,
            }}
          >
            {/* Icon with active pill */}
            <div style={{
              width: 48, height: 32, borderRadius: 12,
              background: isActive ? '#5B2FD4' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, transition: 'all 0.2s',
            }}>
              {tab.icon}
            </div>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 500,
              color: isActive ? '#5B2FD4' : '#9E9E9E',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}>{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
