'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
} from 'lucide-react'

interface SidebarProps {
  user?: { email?: string | null }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Patients',
      href: '/dashboard/patients',
      icon: Users,
    },
    {
      name: 'Sessions',
      href: '/dashboard/sessions',
      icon: Activity,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="bg-sidebar flex h-screen w-60 flex-col">
      {/* Logo/Brand */}
      <div className="border-border flex h-14 items-center border-b px-4">
        <Heart className="text-primary mr-2 h-5 w-5" />
        <span className="text-sm font-semibold">Hemodialysis</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map(item => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'group flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground'
                )}
              >
                <Icon className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-50" />}
              </div>
            </Link>
          )
        })}
      </div>

      {/* User section */}
      {user && (
        <div className="border-border border-t p-3">
          <div className="text-muted-foreground mb-2 rounded-md px-3 py-2 text-xs">
            <div className="text-foreground mb-1 font-medium">{user.email}</div>
            <div className="text-xs">Logged in</div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-muted-foreground hover:bg-sidebar-hover hover:text-foreground flex w-full items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
