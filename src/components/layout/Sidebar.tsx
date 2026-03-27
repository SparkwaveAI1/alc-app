'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Triangle, Layers, BookOpen, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/today', label: 'Today', icon: Home, emoji: '🏠' },
  { href: '/math', label: 'Math Skills', icon: Triangle, emoji: '📐' },
  { href: '#', label: 'Flashcards', icon: Layers, emoji: '🗂️', disabled: true },
  { href: '#', label: 'Resources', icon: BookOpen, emoji: '📚', disabled: true },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3, emoji: '📊' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 md:translate-x-0 md:static md:z-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">🎓 ALC</h1>
            <p className="text-sm text-muted-foreground">Learning Companion</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.label}
                  href={item.disabled ? '#' : item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
