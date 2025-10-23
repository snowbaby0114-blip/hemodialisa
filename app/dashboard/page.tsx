import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch dashboard statistics
  const { data: patients, count: patientCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })

  const { data: sessions, count: sessionCount } = await supabase
    .from('dialysis_sessions')
    .select('*', { count: 'exact', head: true })

  const { count: todaySessionCount } = await supabase
    .from('dialysis_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('session_date', new Date().toISOString().split('T')[0])
    .lt('session_date', new Date(Date.now() + 86400000).toISOString().split('T')[0])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hemodialysis Management</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Patients</CardTitle>
              <CardDescription>Active patients in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{patientCount || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Sessions</CardTitle>
              <CardDescription>All dialysis sessions recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{sessionCount || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
              <CardDescription>Sessions scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{todaySessionCount || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                View and manage patient records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/patients">
                <Button className="w-full">View Patients</Button>
              </Link>
              <Link href="/dashboard/patients/new">
                <Button variant="outline" className="w-full">Add New Patient</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialysis Sessions</CardTitle>
              <CardDescription>
                Track and record dialysis sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/sessions">
                <Button className="w-full">View Sessions</Button>
              </Link>
              <Link href="/dashboard/sessions/new">
                <Button variant="outline" className="w-full">Record New Session</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
