'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])

  const [formData, setFormData] = useState({
    patient_id: searchParams.get('patient') || '',
    session_date: new Date().toISOString().split('T')[0],
    session_start_time: '',
    session_end_time: '',
    duration_minutes: '',
    pre_weight: '',
    pre_blood_pressure_systolic: '',
    pre_blood_pressure_diastolic: '',
    pre_heart_rate: '',
    pre_temperature: '',
    pre_oxygen_saturation: '',
    post_weight: '',
    post_blood_pressure_systolic: '',
    post_blood_pressure_diastolic: '',
    post_heart_rate: '',
    post_temperature: '',
    post_oxygen_saturation: '',
    blood_flow_rate: '',
    dialysate_flow_rate: '',
    ultrafiltration_goal: '',
    ultrafiltration_achieved: '',
    heparin_dose: '',
    hemoglobin: '',
    potassium: '',
    sodium: '',
    calcium: '',
    phosphorus: '',
    pre_bun: '',
    post_bun: '',
    pre_creatinine: '',
    post_creatinine: '',
    patient_tolerance: '',
    complications: '',
    nurse_notes: '',
  })

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    const { data } = await supabase.from('patients').select('id, full_name').order('full_name')
    if (data) setPatients(data)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('dialysis_sessions').insert({
        user_id: user.id,
        patient_id: formData.patient_id,
        session_date: formData.session_date,
        session_start_time: formData.session_start_time,
        session_end_time: formData.session_end_time || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        pre_weight: formData.pre_weight ? parseFloat(formData.pre_weight) : null,
        pre_blood_pressure_systolic: formData.pre_blood_pressure_systolic
          ? parseInt(formData.pre_blood_pressure_systolic)
          : null,
        pre_blood_pressure_diastolic: formData.pre_blood_pressure_diastolic
          ? parseInt(formData.pre_blood_pressure_diastolic)
          : null,
        pre_heart_rate: formData.pre_heart_rate ? parseInt(formData.pre_heart_rate) : null,
        pre_temperature: formData.pre_temperature ? parseFloat(formData.pre_temperature) : null,
        pre_oxygen_saturation: formData.pre_oxygen_saturation
          ? parseInt(formData.pre_oxygen_saturation)
          : null,
        post_weight: formData.post_weight ? parseFloat(formData.post_weight) : null,
        post_blood_pressure_systolic: formData.post_blood_pressure_systolic
          ? parseInt(formData.post_blood_pressure_systolic)
          : null,
        post_blood_pressure_diastolic: formData.post_blood_pressure_diastolic
          ? parseInt(formData.post_blood_pressure_diastolic)
          : null,
        post_heart_rate: formData.post_heart_rate ? parseInt(formData.post_heart_rate) : null,
        post_temperature: formData.post_temperature ? parseFloat(formData.post_temperature) : null,
        post_oxygen_saturation: formData.post_oxygen_saturation
          ? parseInt(formData.post_oxygen_saturation)
          : null,
        blood_flow_rate: formData.blood_flow_rate ? parseInt(formData.blood_flow_rate) : null,
        dialysate_flow_rate: formData.dialysate_flow_rate
          ? parseInt(formData.dialysate_flow_rate)
          : null,
        ultrafiltration_goal: formData.ultrafiltration_goal
          ? parseFloat(formData.ultrafiltration_goal)
          : null,
        ultrafiltration_achieved: formData.ultrafiltration_achieved
          ? parseFloat(formData.ultrafiltration_achieved)
          : null,
        heparin_dose: formData.heparin_dose ? parseFloat(formData.heparin_dose) : null,
        hemoglobin: formData.hemoglobin ? parseFloat(formData.hemoglobin) : null,
        potassium: formData.potassium ? parseFloat(formData.potassium) : null,
        sodium: formData.sodium ? parseFloat(formData.sodium) : null,
        calcium: formData.calcium ? parseFloat(formData.calcium) : null,
        phosphorus: formData.phosphorus ? parseFloat(formData.phosphorus) : null,
        pre_bun: formData.pre_bun ? parseFloat(formData.pre_bun) : null,
        post_bun: formData.post_bun ? parseFloat(formData.post_bun) : null,
        pre_creatinine: formData.pre_creatinine ? parseFloat(formData.pre_creatinine) : null,
        post_creatinine: formData.post_creatinine ? parseFloat(formData.post_creatinine) : null,
        patient_tolerance: formData.patient_tolerance || null,
        complications: formData.complications
          ? formData.complications.split(',').map(s => s.trim())
          : null,
        nurse_notes: formData.nurse_notes || null,
      })

      if (insertError) throw insertError

      router.push('/dashboard/sessions')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard/sessions">
            <Button variant="ghost" size="sm">
              ← Back to Sessions
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Record Dialysis Session</CardTitle>
            <CardDescription>Enter session details and patient vitals</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-destructive-foreground bg-destructive/10 border-destructive rounded-md border p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="patient_id" className="text-sm font-medium">
                      Patient *
                    </label>
                    <select
                      id="patient_id"
                      name="patient_id"
                      value={formData.patient_id}
                      onChange={handleChange}
                      required
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none md:text-sm"
                    >
                      <option value="">Select patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="session_date" className="text-sm font-medium">
                      Session Date *
                    </label>
                    <Input
                      id="session_date"
                      name="session_date"
                      type="date"
                      value={formData.session_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="session_start_time" className="text-sm font-medium">
                      Start Time *
                    </label>
                    <Input
                      id="session_start_time"
                      name="session_start_time"
                      type="time"
                      value={formData.session_start_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="session_end_time" className="text-sm font-medium">
                      End Time
                    </label>
                    <Input
                      id="session_end_time"
                      name="session_end_time"
                      type="time"
                      value={formData.session_end_time}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="duration_minutes" className="text-sm font-medium">
                      Duration (minutes)
                    </label>
                    <Input
                      id="duration_minutes"
                      name="duration_minutes"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pre-Dialysis Vitals</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="pre_weight" className="text-sm font-medium">
                      Weight (kg)
                    </label>
                    <Input
                      id="pre_weight"
                      name="pre_weight"
                      type="number"
                      step="0.01"
                      value={formData.pre_weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_blood_pressure_systolic" className="text-sm font-medium">
                      BP Systolic
                    </label>
                    <Input
                      id="pre_blood_pressure_systolic"
                      name="pre_blood_pressure_systolic"
                      type="number"
                      value={formData.pre_blood_pressure_systolic}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_blood_pressure_diastolic" className="text-sm font-medium">
                      BP Diastolic
                    </label>
                    <Input
                      id="pre_blood_pressure_diastolic"
                      name="pre_blood_pressure_diastolic"
                      type="number"
                      value={formData.pre_blood_pressure_diastolic}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_heart_rate" className="text-sm font-medium">
                      Heart Rate
                    </label>
                    <Input
                      id="pre_heart_rate"
                      name="pre_heart_rate"
                      type="number"
                      value={formData.pre_heart_rate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_temperature" className="text-sm font-medium">
                      Temperature (°C)
                    </label>
                    <Input
                      id="pre_temperature"
                      name="pre_temperature"
                      type="number"
                      step="0.1"
                      value={formData.pre_temperature}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_oxygen_saturation" className="text-sm font-medium">
                      O2 Saturation (%)
                    </label>
                    <Input
                      id="pre_oxygen_saturation"
                      name="pre_oxygen_saturation"
                      type="number"
                      value={formData.pre_oxygen_saturation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Post-Dialysis Vitals</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="post_weight" className="text-sm font-medium">
                      Weight (kg)
                    </label>
                    <Input
                      id="post_weight"
                      name="post_weight"
                      type="number"
                      step="0.01"
                      value={formData.post_weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="post_blood_pressure_systolic" className="text-sm font-medium">
                      BP Systolic
                    </label>
                    <Input
                      id="post_blood_pressure_systolic"
                      name="post_blood_pressure_systolic"
                      type="number"
                      value={formData.post_blood_pressure_systolic}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="post_blood_pressure_diastolic" className="text-sm font-medium">
                      BP Diastolic
                    </label>
                    <Input
                      id="post_blood_pressure_diastolic"
                      name="post_blood_pressure_diastolic"
                      type="number"
                      value={formData.post_blood_pressure_diastolic}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dialysis Parameters</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="ultrafiltration_goal" className="text-sm font-medium">
                      UF Goal (L)
                    </label>
                    <Input
                      id="ultrafiltration_goal"
                      name="ultrafiltration_goal"
                      type="number"
                      step="0.01"
                      value={formData.ultrafiltration_goal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ultrafiltration_achieved" className="text-sm font-medium">
                      UF Achieved (L)
                    </label>
                    <Input
                      id="ultrafiltration_achieved"
                      name="ultrafiltration_achieved"
                      type="number"
                      step="0.01"
                      value={formData.ultrafiltration_achieved}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="blood_flow_rate" className="text-sm font-medium">
                      Blood Flow (ml/min)
                    </label>
                    <Input
                      id="blood_flow_rate"
                      name="blood_flow_rate"
                      type="number"
                      value={formData.blood_flow_rate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Laboratory Values</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label htmlFor="hemoglobin" className="text-sm font-medium">
                      Hemoglobin (g/dL)
                    </label>
                    <Input
                      id="hemoglobin"
                      name="hemoglobin"
                      type="number"
                      step="0.1"
                      value={formData.hemoglobin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="potassium" className="text-sm font-medium">
                      Potassium (mEq/L)
                    </label>
                    <Input
                      id="potassium"
                      name="potassium"
                      type="number"
                      step="0.1"
                      value={formData.potassium}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="sodium" className="text-sm font-medium">
                      Sodium (mEq/L)
                    </label>
                    <Input
                      id="sodium"
                      name="sodium"
                      type="number"
                      step="0.1"
                      value={formData.sodium}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pre_bun" className="text-sm font-medium">
                      Pre BUN
                    </label>
                    <Input
                      id="pre_bun"
                      name="pre_bun"
                      type="number"
                      step="0.1"
                      value={formData.pre_bun}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Outcome</h3>
                <div className="space-y-2">
                  <label htmlFor="patient_tolerance" className="text-sm font-medium">
                    Patient Tolerance
                  </label>
                  <select
                    id="patient_tolerance"
                    name="patient_tolerance"
                    value={formData.patient_tolerance}
                    onChange={handleChange}
                    className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none md:text-sm"
                  >
                    <option value="">Select tolerance</option>
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="complications" className="text-sm font-medium">
                    Complications
                  </label>
                  <Input
                    id="complications"
                    name="complications"
                    placeholder="Separate with commas if multiple"
                    value={formData.complications}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="nurse_notes" className="text-sm font-medium">
                    Nurse Notes
                  </label>
                  <textarea
                    id="nurse_notes"
                    name="nurse_notes"
                    value={formData.nurse_notes}
                    onChange={handleChange}
                    rows={4}
                    className="border-input focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none md:text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Recording...' : 'Record Session'}
                </Button>
                <Link href="/dashboard/sessions">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
