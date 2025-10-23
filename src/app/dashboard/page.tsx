import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Users, Activity, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch dashboard statistics
  const { count: patientCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })

  const { count: sessionCount } = await supabase
    .from('dialysis_sessions')
    .select('*', { count: 'exact', head: true })

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split('T')[0]

  const { count: todaySessionCount } = await supabase
    .from('dialysis_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('session_date', today)
    .lt('session_date', tomorrow)

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user.email?.split('@')[0]}</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/patients">
            <Card className="group border-border bg-card cursor-pointer transition-all hover:shadow-md">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <ArrowRight className="text-muted-foreground h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="text-muted-foreground mb-1 text-sm font-medium">Total Patients</div>
                <div className="text-3xl font-semibold">{patientCount || 0}</div>
                <p className="text-muted-foreground mt-2 text-xs">Active in system</p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/sessions">
            <Card className="group border-border bg-card cursor-pointer transition-all hover:shadow-md">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-success/10 text-success flex h-12 w-12 items-center justify-center rounded-lg">
                    <Activity className="h-6 w-6" />
                  </div>
                  <ArrowRight className="text-muted-foreground h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="text-muted-foreground mb-1 text-sm font-medium">Total Sessions</div>
                <div className="text-3xl font-semibold">{sessionCount || 0}</div>
                <p className="text-muted-foreground mt-2 text-xs">All time recorded</p>
              </div>
            </Card>
          </Link>

          <Card className="border-border bg-card">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="bg-warning/10 text-warning flex h-12 w-12 items-center justify-center rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="text-muted-foreground mb-1 text-sm font-medium">Today's Sessions</div>
              <div className="text-3xl font-semibold">{todaySessionCount || 0}</div>
              <p className="text-muted-foreground mt-2 text-xs">Scheduled for today</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/patients/new">
              <Card className="group border-border bg-card cursor-pointer transition-all hover:shadow-md">
                <div className="flex items-center p-6">
                  <div className="bg-primary/10 text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1 font-medium">Add New Patient</div>
                    <p className="text-muted-foreground text-xs">Create a new patient record</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/sessions/new">
              <Card className="group border-border bg-card cursor-pointer transition-all hover:shadow-md">
                <div className="flex items-center p-6">
                  <div className="bg-success/10 text-success mr-4 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1 font-medium">Record Session</div>
                    <p className="text-muted-foreground text-xs">Log a dialysis session</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        {patientCount === 0 && (
          <Card className="border-border bg-accent/30">
            <div className="p-6">
              <h3 className="mb-2 font-semibold">Get Started</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Welcome to your hemodialysis management system. Start by adding your first patient.
              </p>
              <Link href="/dashboard/patients/new">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Patient
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
