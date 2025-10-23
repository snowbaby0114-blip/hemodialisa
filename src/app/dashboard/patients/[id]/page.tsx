import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { analyzePatientHealth } from '@/lib/ai-prediction'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Activity, Heart, TrendingUp } from 'lucide-react'

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !patient) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-border bg-card w-full max-w-md rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">Patient Not Found</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            The requested patient could not be found.
          </p>
          <Link href="/dashboard/patients">
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Fetch dialysis sessions for AI analysis
  const { data: sessions } = await supabase
    .from('dialysis_sessions')
    .select('*')
    .eq('patient_id', params.id)
    .order('session_date', { ascending: false })

  // Perform AI analysis
  let aiAnalysis = null
  if (sessions && sessions.length > 0) {
    const patientAge = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
    aiAnalysis = analyzePatientHealth({
      sessions: sessions.map(s => ({
        sessionDate: new Date(s.session_date),
        preWeight: s.pre_weight,
        postWeight: s.post_weight,
        preBpSystolic: s.pre_blood_pressure_systolic,
        preBpDiastolic: s.pre_blood_pressure_diastolic,
        postBpSystolic: s.post_blood_pressure_systolic,
        postBpDiastolic: s.post_blood_pressure_diastolic,
        preHeartRate: s.pre_heart_rate,
        postHeartRate: s.post_heart_rate,
        ultrafiltrationAchieved: s.ultrafiltration_achieved,
        complications: s.complications,
        patientTolerance: s.patient_tolerance,
        hemoglobin: s.hemoglobin,
        potassium: s.potassium,
        sodium: s.sodium,
        preBun: s.pre_bun,
        postBun: s.post_bun,
      })),
      demographics: {
        age: patientAge,
        comorbidities: patient.comorbidities,
        dryWeight: patient.dry_weight,
      },
    })

    // Update patient with AI analysis
    await supabase
      .from('patients')
      .update({
        health_status: aiAnalysis.healthStatus,
        risk_score: aiAnalysis.riskScore,
        last_analysis_date: new Date().toISOString(),
      })
      .eq('id', params.id)
  }

  const getHealthStatusColor = (status: string) => {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'destructive'
      case 'critical':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const calculateAge = (dob: string) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <DashboardLayout user={user}>
      <div className="h-full">
        {/* Header */}
        <div className="border-border bg-background border-b px-12 py-6">
          <Link
            href="/dashboard/patients"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Link>
          <h1 className="text-2xl font-semibold">{patient.full_name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Patient ID: {patient.id.slice(0, 8)}... · Age: {calculateAge(patient.date_of_birth)}{' '}
            years
          </p>
        </div>

        {/* Content */}
        <div className="px-12 py-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* AI Analysis Stats */}
            {aiAnalysis && (
              <div className="grid gap-5 md:grid-cols-3">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Heart className="text-primary h-4 w-4" />
                      <CardTitle className="text-base">Health Status</CardTitle>
                    </div>
                    <CardDescription className="text-xs">AI-powered assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={getHealthStatusColor(aiAnalysis.healthStatus) as any}
                      className="mb-2 px-3 py-1"
                    >
                      {aiAnalysis.healthStatus.toUpperCase()}
                    </Badge>
                    <p className="text-muted-foreground text-xs">
                      Confidence: {aiAnalysis.confidenceScore.toFixed(0)}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="text-primary h-4 w-4" />
                      <CardTitle className="text-base">Risk Score</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Overall risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold">
                      {aiAnalysis.riskScore.toFixed(1)}
                      <span className="text-muted-foreground text-lg">/100</span>
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Trend: {aiAnalysis.trendDirection}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Activity className="text-primary h-4 w-4" />
                      <CardTitle className="text-base">Next Session Risk</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Predicted dialysis risk</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={getRiskColor(aiAnalysis.predictedNextSessionRisk) as any}
                      className="px-3 py-1"
                    >
                      {aiAnalysis.predictedNextSessionRisk.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Personal & Emergency Contact */}
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth</span>
                      <span className="font-medium">
                        {new Date(patient.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender</span>
                      <span className="font-medium capitalize">{patient.gender || 'N/A'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blood Type</span>
                      <span className="font-medium">{patient.blood_type || 'N/A'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{patient.phone || 'N/A'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{patient.email || 'N/A'}</span>
                    </div>
                    {patient.address && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address</span>
                          <span className="font-medium">{patient.address}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{patient.emergency_contact_name || 'N/A'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">
                        {patient.emergency_contact_phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medical & Dialysis Information */}
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.diagnosis && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">Diagnosis</p>
                      <p className="text-sm font-medium">{patient.diagnosis}</p>
                    </div>
                  )}
                  {patient.comorbidities && patient.comorbidities.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs">Comorbidities</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.comorbidities.map((condition: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.allergies && patient.allergies.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy: string, i: number) => (
                          <Badge key={i} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.medications && patient.medications.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs">Current Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.medications.map((med: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Dialysis Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access Type</span>
                      <span className="font-medium capitalize">
                        {patient.dialysis_access_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access Location</span>
                      <span className="font-medium">
                        {patient.dialysis_access_location || 'N/A'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dry Weight</span>
                      <span className="font-medium">
                        {patient.dry_weight ? `${patient.dry_weight} kg` : 'N/A'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target UF</span>
                      <span className="font-medium">
                        {patient.target_ultrafiltration
                          ? `${patient.target_ultrafiltration} L`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Factors & Recommendations */}
            {aiAnalysis && (
              <div className="grid gap-5 md:grid-cols-2">
                <Card className="border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Risk Factors</CardTitle>
                    <CardDescription className="text-xs">
                      Identified health concerns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiAnalysis.riskFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 text-red-500">⚠</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">AI Recommendations</CardTitle>
                    <CardDescription className="text-xs">
                      Suggested actions for care
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Dialysis Sessions */}
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Recent Dialysis Sessions</CardTitle>
                <CardDescription className="text-xs">
                  {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''} recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session: any) => (
                      <div key={session.id} className="border-border border-b pb-4 last:border-0">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {new Date(session.session_date).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {session.session_start_time} -{' '}
                              {session.session_end_time || 'In progress'}
                            </p>
                          </div>
                          {session.patient_tolerance && (
                            <Badge
                              variant={
                                session.patient_tolerance === 'excellent'
                                  ? 'success'
                                  : session.patient_tolerance === 'poor'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                              className="text-xs"
                            >
                              {session.patient_tolerance}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Weight Change</p>
                            <p className="font-medium">
                              {session.pre_weight && session.post_weight
                                ? `${(session.pre_weight - session.post_weight).toFixed(2)} kg`
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">UF Achieved</p>
                            <p className="font-medium">
                              {session.ultrafiltration_achieved
                                ? `${session.ultrafiltration_achieved} L`
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Pre BP</p>
                            <p className="font-medium">
                              {session.pre_blood_pressure_systolic &&
                              session.pre_blood_pressure_diastolic
                                ? `${session.pre_blood_pressure_systolic}/${session.pre_blood_pressure_diastolic}`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link href={`/dashboard/sessions?patient=${params.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4 text-sm">No sessions recorded yet</p>
                    <Link href={`/dashboard/sessions/new?patient=${params.id}`}>
                      <Button size="sm">Record First Session</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
