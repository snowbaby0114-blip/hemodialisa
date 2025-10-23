'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

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
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-border bg-background border-b px-12 py-6">
        <Link
          href="/dashboard/sessions"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Link>
        <h1 className="text-2xl font-semibold">New Dialysis Session</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Record session details and patient vitals
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-12 py-8">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Session Information */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Session Information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="patient_id">
                    Patient <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                  <Label htmlFor="session_date">
                    Session Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="session_date"
                    name="session_date"
                    type="date"
                    value={formData.session_date}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_start_time">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="session_start_time"
                    name="session_start_time"
                    type="time"
                    value={formData.session_start_time}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_end_time">End Time</Label>
                  <Input
                    id="session_end_time"
                    name="session_end_time"
                    type="time"
                    value={formData.session_end_time}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    name="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Pre-Dialysis Vitals */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Pre-Dialysis Vitals</h2>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pre_weight">Weight (kg)</Label>
                  <Input
                    id="pre_weight"
                    name="pre_weight"
                    type="number"
                    step="0.01"
                    value={formData.pre_weight}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_blood_pressure_systolic">BP Systolic</Label>
                  <Input
                    id="pre_blood_pressure_systolic"
                    name="pre_blood_pressure_systolic"
                    type="number"
                    value={formData.pre_blood_pressure_systolic}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_blood_pressure_diastolic">BP Diastolic</Label>
                  <Input
                    id="pre_blood_pressure_diastolic"
                    name="pre_blood_pressure_diastolic"
                    type="number"
                    value={formData.pre_blood_pressure_diastolic}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_heart_rate">Heart Rate</Label>
                  <Input
                    id="pre_heart_rate"
                    name="pre_heart_rate"
                    type="number"
                    value={formData.pre_heart_rate}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_temperature">Temperature (°C)</Label>
                  <Input
                    id="pre_temperature"
                    name="pre_temperature"
                    type="number"
                    step="0.1"
                    value={formData.pre_temperature}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_oxygen_saturation">O2 Saturation (%)</Label>
                  <Input
                    id="pre_oxygen_saturation"
                    name="pre_oxygen_saturation"
                    type="number"
                    value={formData.pre_oxygen_saturation}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Post-Dialysis Vitals */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Post-Dialysis Vitals</h2>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="post_weight">Weight (kg)</Label>
                  <Input
                    id="post_weight"
                    name="post_weight"
                    type="number"
                    step="0.01"
                    value={formData.post_weight}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post_blood_pressure_systolic">BP Systolic</Label>
                  <Input
                    id="post_blood_pressure_systolic"
                    name="post_blood_pressure_systolic"
                    type="number"
                    value={formData.post_blood_pressure_systolic}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post_blood_pressure_diastolic">BP Diastolic</Label>
                  <Input
                    id="post_blood_pressure_diastolic"
                    name="post_blood_pressure_diastolic"
                    type="number"
                    value={formData.post_blood_pressure_diastolic}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Dialysis Parameters */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Dialysis Parameters</h2>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ultrafiltration_goal">UF Goal (L)</Label>
                  <Input
                    id="ultrafiltration_goal"
                    name="ultrafiltration_goal"
                    type="number"
                    step="0.01"
                    value={formData.ultrafiltration_goal}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ultrafiltration_achieved">UF Achieved (L)</Label>
                  <Input
                    id="ultrafiltration_achieved"
                    name="ultrafiltration_achieved"
                    type="number"
                    step="0.01"
                    value={formData.ultrafiltration_achieved}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_flow_rate">Blood Flow (ml/min)</Label>
                  <Input
                    id="blood_flow_rate"
                    name="blood_flow_rate"
                    type="number"
                    value={formData.blood_flow_rate}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Laboratory Values */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Laboratory Values</h2>
              <div className="grid gap-5 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input
                    id="hemoglobin"
                    name="hemoglobin"
                    type="number"
                    step="0.1"
                    value={formData.hemoglobin}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (mEq/L)</Label>
                  <Input
                    id="potassium"
                    name="potassium"
                    type="number"
                    step="0.1"
                    value={formData.potassium}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sodium">Sodium (mEq/L)</Label>
                  <Input
                    id="sodium"
                    name="sodium"
                    type="number"
                    step="0.1"
                    value={formData.sodium}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre_bun">Pre BUN</Label>
                  <Input
                    id="pre_bun"
                    name="pre_bun"
                    type="number"
                    step="0.1"
                    value={formData.pre_bun}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Session Outcome */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Session Outcome</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_tolerance">Patient Tolerance</Label>
                  <select
                    id="patient_tolerance"
                    name="patient_tolerance"
                    value={formData.patient_tolerance}
                    onChange={handleChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <option value="">Select tolerance</option>
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complications">Complications</Label>
                  <Input
                    id="complications"
                    name="complications"
                    placeholder="Separate with commas if multiple"
                    value={formData.complications}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nurse_notes">Nurse Notes</Label>
                  <textarea
                    id="nurse_notes"
                    name="nurse_notes"
                    value={formData.nurse_notes}
                    onChange={handleChange}
                    rows={4}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-border flex gap-3 border-t pt-6">
              <Button type="submit" disabled={loading} className="h-10">
                {loading ? 'Recording...' : 'Record Session'}
              </Button>
              <Link href="/dashboard/sessions">
                <Button type="button" variant="ghost" className="h-10">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
