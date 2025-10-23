import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

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
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Patient Management</h1>
          </div>
          <Link href="/dashboard/patients/new">
            <Button>Add New Patient</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
            <CardDescription>
              {patients?.length || 0} patient{patients?.length !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-destructive bg-destructive/10 mb-4 rounded-md p-4">
                Error loading patients: {error.message}
              </div>
            )}
            {patients && patients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient: any) => (
                    <TableRow key={patient.id}>
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
                          <span className="text-muted-foreground">Not analyzed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.risk_score !== null ? (
                          <span
                            className={
                              patient.risk_score > 60 ? 'text-destructive font-semibold' : ''
                            }
                          >
                            {patient.risk_score}/100
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No patients found</p>
                <Link href="/dashboard/patients/new">
                  <Button>Add Your First Patient</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
