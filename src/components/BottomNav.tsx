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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8D5C4] flex justify-around items-center h-20 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href === '/' && pathname === '/')
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg transition-all ${
              isActive
                ? 'text-[#813EA0] scale-110'
                : 'text-[#4D4350] hover:text-[#813EA0]'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
