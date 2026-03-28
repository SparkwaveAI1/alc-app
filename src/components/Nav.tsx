'use client'
import Link from 'next/link'

const tabs = [
  { label: 'home',     icon: '🏠', href: '/',        display: 'Home' },
  { label: 'explore',  icon: '🔭', href: '/explore', display: 'Explore' },
  { label: 'search',   icon: '🔍', href: '/search',  display: 'Search' },
  { label: 'progress', icon: '⭐', href: '/progress',display: 'Progress' },
  { label: 'me',       icon: '👤', href: '/me',      display: 'Me' },
]

export default function Nav({ active }: { active: string }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 70, zIndex: 100,
    }}>
      {tabs.map(tab => {
        const isActive = tab.label === active
        return (
          <Link key={tab.href} href={tab.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 60 }}>
            <div style={{
              width: 48, height: 32, borderRadius: 12,
              background: isActive ? '#7C3AED' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, transition: 'background 0.2s',
            }}>{tab.icon}</div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? '#7C3AED' : '#9CA3AF' }}>{tab.display}</span>
          </Link>
        )
      })}
    </nav>
  )
}
