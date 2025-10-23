import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: { patient?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('dialysis_sessions')
    .select(
      `
      *,
      patients (
        id,
        full_name
      )
    `
    )
    .order('session_date', { ascending: false })

  if (searchParams.patient) {
    query = query.eq('patient_id', searchParams.patient)
  }

  const { data: sessions, error } = await query

  return (
    <DashboardLayout user={user}>
      <div className="h-full">
        {/* Header */}
        <div className="border-border bg-background border-b px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dialysis Sessions</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            <Link href="/dashboard/sessions/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Session
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-12 py-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Error loading sessions: {error.message}
            </div>
          )}

          {sessions && sessions.length > 0 ? (
            <div className="border-border bg-card overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Patient</TableHead>
                    <TableHead className="font-medium">Start Time</TableHead>
                    <TableHead className="font-medium">Duration</TableHead>
                    <TableHead className="font-medium">Pre BP</TableHead>
                    <TableHead className="font-medium">Post BP</TableHead>
                    <TableHead className="font-medium">UF Achieved</TableHead>
                    <TableHead className="font-medium">Tolerance</TableHead>
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
                      <TableCell>
                        {session.duration_minutes ? `${session.duration_minutes} min` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {session.pre_blood_pressure_systolic && session.pre_blood_pressure_diastolic
                          ? `${session.pre_blood_pressure_systolic}/${session.pre_blood_pressure_diastolic}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {session.post_blood_pressure_systolic &&
                        session.post_blood_pressure_diastolic
                          ? `${session.post_blood_pressure_systolic}/${session.post_blood_pressure_diastolic}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {session.ultrafiltration_achieved
                          ? `${session.ultrafiltration_achieved} L`
                          : 'N/A'}
                      </TableCell>
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
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
              <p className="text-muted-foreground mb-4 text-sm">No sessions found</p>
              <Link href="/dashboard/sessions/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Record Your First Session
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
