import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  user?: { email?: string | null }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
