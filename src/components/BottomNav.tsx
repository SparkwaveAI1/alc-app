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
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(209,194,209,0.3)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 76, zIndex: 50,
      boxShadow: '0 -4px 24px rgba(129,62,160,0.08)',
    }}>
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, width: 64, height: 60,
              borderRadius: 16, textDecoration: 'none',
              background: isActive ? 'linear-gradient(135deg, #F7D8FF, #ECC6F5)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: isActive ? 26 : 22, transition: 'font-size 0.2s' }}>{tab.icon}</span>
            <span style={{
              fontSize: 11, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#813EA0' : '#4D4350',
              fontFamily: 'var(--font-body)',
            }}>{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
