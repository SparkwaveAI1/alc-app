'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function TopBar() {
  const { profile, signOut } = useAuth()

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden w-10" />
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {profile && (
          <span className="text-sm text-muted-foreground hidden sm:block">
            {profile.display_name}
          </span>
        )}
        <Button variant="ghost" size="icon-sm" onClick={signOut} title="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
