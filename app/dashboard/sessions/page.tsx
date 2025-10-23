import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function SessionsPage({ searchParams }: { searchParams: { patient?: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('dialysis_sessions')
    .select(`
      *,
      patients (
        id,
        full_name
      )
    `)
    .order('session_date', { ascending: false })

  if (searchParams.patient) {
    query = query.eq('patient_id', searchParams.patient)
  }

  const { data: sessions, error } = await query

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">← Back to Dashboard</Button>
            </Link>
            <h1 className="text-2xl font-bold">Dialysis Sessions</h1>
          </div>
          <Link href="/dashboard/sessions/new">
            <Button>Record New Session</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>
              {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 text-destructive bg-destructive/10 rounded-md mb-4">
                Error loading sessions: {error.message}
              </div>
            )}
            {sessions && sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Pre BP</TableHead>
                    <TableHead>Post BP</TableHead>
                    <TableHead>UF Achieved</TableHead>
                    <TableHead>Tolerance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {new Date(session.session_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/patients/${session.patients?.id}`}
                          className="text-primary hover:underline"
                        >
                          {session.patients?.full_name || 'Unknown'}
                        </Link>
                      </TableCell>
                      <TableCell>{session.session_start_time}</TableCell>
                      <TableCell>{session.duration_minutes ? `${session.duration_minutes} min` : 'N/A'}</TableCell>
                      <TableCell>
                        {session.pre_blood_pressure_systolic && session.pre_blood_pressure_diastolic
                          ? `${session.pre_blood_pressure_systolic}/${session.pre_blood_pressure_diastolic}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {session.post_blood_pressure_systolic && session.post_blood_pressure_diastolic
                          ? `${session.post_blood_pressure_systolic}/${session.post_blood_pressure_diastolic}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{session.ultrafiltration_achieved ? `${session.ultrafiltration_achieved} L` : 'N/A'}</TableCell>
                      <TableCell>
                        {session.patient_tolerance ? (
                          <Badge
                            variant={
                              session.patient_tolerance === 'excellent'
                                ? 'success'
                                : session.patient_tolerance === 'poor'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {session.patient_tolerance}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No sessions found</p>
                <Link href="/dashboard/sessions/new">
                  <Button>Record Your First Session</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
