'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function NewPatientPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    diagnosis: '',
    comorbidities: '',
    allergies: '',
    medications: '',
    dialysis_access_type: '',
    dialysis_access_location: '',
    dry_weight: '',
    target_ultrafiltration: '',
  })

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

      const { error: insertError } = await supabase.from('patients').insert({
        user_id: user.id,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender || null,
        blood_type: formData.blood_type || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        diagnosis: formData.diagnosis || null,
        comorbidities: formData.comorbidities
          ? formData.comorbidities.split(',').map(s => s.trim())
          : null,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : null,
        medications: formData.medications
          ? formData.medications.split(',').map(s => s.trim())
          : null,
        dialysis_access_type: formData.dialysis_access_type || null,
        dialysis_access_location: formData.dialysis_access_location || null,
        dry_weight: formData.dry_weight ? parseFloat(formData.dry_weight) : null,
        target_ultrafiltration: formData.target_ultrafiltration
          ? parseFloat(formData.target_ultrafiltration)
          : null,
      })

      if (insertError) throw insertError

      router.push('/dashboard/patients')
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
          href="/dashboard/patients"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Link>
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter patient information to create a new record
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

            {/* Personal Information */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Personal Information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_type">Blood Type</Label>
                  <Input
                    id="blood_type"
                    name="blood_type"
                    placeholder="e.g., O+"
                    value={formData.blood_type}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Emergency Contact</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Medical Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="e.g., End-Stage Renal Disease"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comorbidities">Comorbidities</Label>
                  <Input
                    id="comorbidities"
                    name="comorbidities"
                    placeholder="Separate with commas: diabetes, hypertension"
                    value={formData.comorbidities}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    placeholder="Separate with commas"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Input
                    id="medications"
                    name="medications"
                    placeholder="Separate with commas"
                    value={formData.medications}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Dialysis Information */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold">Dialysis Information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dialysis_access_type">Access Type</Label>
                  <select
                    id="dialysis_access_type"
                    name="dialysis_access_type"
                    value={formData.dialysis_access_type}
                    onChange={handleChange}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="av_fistula">AV Fistula</option>
                    <option value="av_graft">AV Graft</option>
                    <option value="catheter">Catheter</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialysis_access_location">Access Location</Label>
                  <Input
                    id="dialysis_access_location"
                    name="dialysis_access_location"
                    placeholder="e.g., Left forearm"
                    value={formData.dialysis_access_location}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dry_weight">Dry Weight (kg)</Label>
                  <Input
                    id="dry_weight"
                    name="dry_weight"
                    type="number"
                    step="0.01"
                    value={formData.dry_weight}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_ultrafiltration">Target Ultrafiltration (L)</Label>
                  <Input
                    id="target_ultrafiltration"
                    name="target_ultrafiltration"
                    type="number"
                    step="0.01"
                    value={formData.target_ultrafiltration}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-border flex gap-3 border-t pt-6">
              <Button type="submit" disabled={loading} className="h-10">
                {loading ? 'Creating...' : 'Create Patient'}
              </Button>
              <Link href="/dashboard/patients">
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
