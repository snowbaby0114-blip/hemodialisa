import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { analyzePatientHealth } from '@/lib/ai-prediction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>The requested patient could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patients">
              <Button>Back to Patients</Button>
            </Link>
          </CardContent>
        </Card>
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
      case 'perfect': return 'success'
      case 'optimal': return 'success'
      case 'good': return 'success'
      case 'fair': return 'warning'
      case 'poor': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'secondary'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'secondary'
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
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard/patients">
            <Button variant="ghost" size="sm">← Back to Patients</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{patient.full_name}</h1>
          <p className="text-muted-foreground">
            Patient ID: {patient.id.slice(0, 8)}... | Age: {calculateAge(patient.date_of_birth)} years
          </p>
        </div>

        {aiAnalysis && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Health Status</CardTitle>
                <CardDescription>AI-powered health assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={getHealthStatusColor(aiAnalysis.healthStatus) as any} className="text-lg px-4 py-2">
                  {aiAnalysis.healthStatus.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Confidence: {aiAnalysis.confidenceScore.toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Score</CardTitle>
                <CardDescription>Overall patient risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {aiAnalysis.riskScore.toFixed(1)}<span className="text-xl text-muted-foreground">/100</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Trend: {aiAnalysis.trendDirection}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Session Risk</CardTitle>
                <CardDescription>Predicted risk for next dialysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={getRiskColor(aiAnalysis.predictedNextSessionRisk) as any} className="text-lg px-4 py-2">
                  {aiAnalysis.predictedNextSessionRisk.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Date of Birth:</span>
                <span>{new Date(patient.date_of_birth).toLocaleDateString()}</span>

                <span className="text-muted-foreground">Gender:</span>
                <span className="capitalize">{patient.gender || 'N/A'}</span>

                <span className="text-muted-foreground">Blood Type:</span>
                <span>{patient.blood_type || 'N/A'}</span>

                <span className="text-muted-foreground">Phone:</span>
                <span>{patient.phone || 'N/A'}</span>

                <span className="text-muted-foreground">Email:</span>
                <span>{patient.email || 'N/A'}</span>

                {patient.address && (
                  <>
                    <span className="text-muted-foreground">Address:</span>
                    <span>{patient.address}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{patient.emergency_contact_name || 'N/A'}</span>

                <span className="text-muted-foreground">Phone:</span>
                <span>{patient.emergency_contact_phone || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.diagnosis && (
                <div>
                  <p className="text-sm text-muted-foreground">Diagnosis</p>
                  <p className="font-medium">{patient.diagnosis}</p>
                </div>
              )}
              {patient.comorbidities && patient.comorbidities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Comorbidities</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.comorbidities.map((condition: string, i: number) => (
                      <Badge key={i} variant="outline">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy: string, i: number) => (
                      <Badge key={i} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient.medications && patient.medications.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Medications</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications.map((med: string, i: number) => (
                      <Badge key={i} variant="secondary">{med}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialysis Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Access Type:</span>
                <span className="capitalize">{patient.dialysis_access_type?.replace('_', ' ') || 'N/A'}</span>

                <span className="text-muted-foreground">Access Location:</span>
                <span>{patient.dialysis_access_location || 'N/A'}</span>

                <span className="text-muted-foreground">Dry Weight:</span>
                <span>{patient.dry_weight ? `${patient.dry_weight} kg` : 'N/A'}</span>

                <span className="text-muted-foreground">Target UF:</span>
                <span>{patient.target_ultrafiltration ? `${patient.target_ultrafiltration} L` : 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {aiAnalysis && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Identified health concerns</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-destructive mt-1">⚠</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Suggested actions for care</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Dialysis Sessions</CardTitle>
            <CardDescription>
              {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session: any) => (
                  <div key={session.id} className="border-b pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{new Date(session.session_date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.session_start_time} - {session.session_end_time || 'In progress'}
                        </p>
                      </div>
                      {session.patient_tolerance && (
                        <Badge variant={session.patient_tolerance === 'excellent' ? 'success' : session.patient_tolerance === 'poor' ? 'destructive' : 'secondary'}>
                          {session.patient_tolerance}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Weight Change</p>
                        <p className="font-medium">
                          {session.pre_weight && session.post_weight
                            ? `${(session.pre_weight - session.post_weight).toFixed(2)} kg`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">UF Achieved</p>
                        <p className="font-medium">{session.ultrafiltration_achieved ? `${session.ultrafiltration_achieved} L` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pre BP</p>
                        <p className="font-medium">
                          {session.pre_blood_pressure_systolic && session.pre_blood_pressure_diastolic
                            ? `${session.pre_blood_pressure_systolic}/${session.pre_blood_pressure_diastolic}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href={`/dashboard/sessions?patient=${params.id}`}>
                  <Button variant="outline" className="w-full">View All Sessions</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No sessions recorded yet</p>
                <Link href={`/dashboard/sessions/new?patient=${params.id}`}>
                  <Button>Record First Session</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
