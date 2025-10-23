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

export default async function PatientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: patients, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })

  const getHealthStatusColor = (status: string | null) => {
    switch (status) {
      case 'perfect':
        return 'success'
      case 'optimal':
        return 'success'
      case 'good':
        return 'success'
      case 'fair':
        return 'warning'
      case 'poor':
        return 'destructive'
      case 'critical':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="h-full">
        {/* Header */}
        <div className="border-border bg-background border-b px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Patients</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {patients?.length || 0} patient{patients?.length !== 1 ? 's' : ''} registered
              </p>
            </div>
            <Link href="/dashboard/patients/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-12 py-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Error loading patients: {error.message}
            </div>
          )}

          {patients && patients.length > 0 ? (
            <div className="border-border bg-card overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Date of Birth</TableHead>
                    <TableHead className="font-medium">Gender</TableHead>
                    <TableHead className="font-medium">Blood Type</TableHead>
                    <TableHead className="font-medium">Health Status</TableHead>
                    <TableHead className="font-medium">Risk Score</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient: any) => (
                    <TableRow key={patient.id} className="cursor-pointer">
                      <TableCell className="font-medium">{patient.full_name}</TableCell>
                      <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{patient.gender || 'N/A'}</TableCell>
                      <TableCell>{patient.blood_type || 'N/A'}</TableCell>
                      <TableCell>
                        {patient.health_status ? (
                          <Badge variant={getHealthStatusColor(patient.health_status) as any}>
                            {patient.health_status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not analyzed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.risk_score !== null ? (
                          <span
                            className={patient.risk_score > 60 ? 'font-semibold text-red-600' : ''}
                          >
                            {patient.risk_score}/100
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
              <p className="text-muted-foreground mb-4 text-sm">No patients found</p>
              <Link href="/dashboard/patients/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Patient
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
