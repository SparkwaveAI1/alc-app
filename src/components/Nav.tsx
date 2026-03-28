'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { key: 'today',   label: 'Today',   icon: '🌟', href: '/'        },
  { key: 'explore', label: 'Explore', icon: '🧭', href: '/explore'  },
  { key: 'create',  label: 'Create',  icon: '✏️',  href: '/create'  },
  { key: 'me',      label: 'Me',      icon: '👤', href: '/me'       },
]

export default function Nav({ active }: { active?: string }) {
  const pathname = usePathname()
  const current = active || (
    pathname === '/' ? 'today' :
    pathname.startsWith('/explore') || pathname.startsWith('/topic') || pathname.startsWith('/new-module') ? 'explore' :
    pathname.startsWith('/create') || pathname.startsWith('/log') ? 'create' :
    pathname.startsWith('/me') || pathname.startsWith('/portfolio') || pathname.startsWith('/parent') || pathname.startsWith('/standards') ? 'me' : ''
  )

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#FFFFFF',
      boxShadow: '0 -2px 12px rgba(45,42,38,0.08)',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(tab => {
        const isActive = current === tab.key
        return (
          <Link key={tab.key} href={tab.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '10px 4px 8px', textDecoration: 'none', gap: 3,
            maxHeight: 64, overflow: 'hidden',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#7C5CBF' : '#6B6560',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: '0.2px',
            }}>{tab.label}</span>
            {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#7C5CBF' }} />}
          </Link>
        )
      })}
    </nav>
  )
}
