'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard/patients">
            <Button variant="ghost" size="sm">
              ← Back to Patients
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Patient</CardTitle>
            <CardDescription>Enter patient information to create a new record</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-destructive-foreground bg-destructive/10 border-destructive rounded-md border p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="date_of_birth" className="text-sm font-medium">
                      Date of Birth *
                    </label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none md:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="blood_type" className="text-sm font-medium">
                      Blood Type
                    </label>
                    <Input
                      id="blood_type"
                      name="blood_type"
                      placeholder="e.g., O+"
                      value={formData.blood_type}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="emergency_contact_name" className="text-sm font-medium">
                      Contact Name
                    </label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="emergency_contact_phone" className="text-sm font-medium">
                      Contact Phone
                    </label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                <div className="space-y-2">
                  <label htmlFor="diagnosis" className="text-sm font-medium">
                    Diagnosis
                  </label>
                  <Input
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="e.g., End-Stage Renal Disease"
                    value={formData.diagnosis}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="comorbidities" className="text-sm font-medium">
                    Comorbidities
                  </label>
                  <Input
                    id="comorbidities"
                    name="comorbidities"
                    placeholder="Separate with commas: diabetes, hypertension"
                    value={formData.comorbidities}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="allergies" className="text-sm font-medium">
                    Allergies
                  </label>
                  <Input
                    id="allergies"
                    name="allergies"
                    placeholder="Separate with commas"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="medications" className="text-sm font-medium">
                    Current Medications
                  </label>
                  <Input
                    id="medications"
                    name="medications"
                    placeholder="Separate with commas"
                    value={formData.medications}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dialysis Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="dialysis_access_type" className="text-sm font-medium">
                      Access Type
                    </label>
                    <select
                      id="dialysis_access_type"
                      name="dialysis_access_type"
                      value={formData.dialysis_access_type}
                      onChange={handleChange}
                      className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none md:text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="av_fistula">AV Fistula</option>
                      <option value="av_graft">AV Graft</option>
                      <option value="catheter">Catheter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dialysis_access_location" className="text-sm font-medium">
                      Access Location
                    </label>
                    <Input
                      id="dialysis_access_location"
                      name="dialysis_access_location"
                      placeholder="e.g., Left forearm"
                      value={formData.dialysis_access_location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dry_weight" className="text-sm font-medium">
                      Dry Weight (kg)
                    </label>
                    <Input
                      id="dry_weight"
                      name="dry_weight"
                      type="number"
                      step="0.01"
                      value={formData.dry_weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="target_ultrafiltration" className="text-sm font-medium">
                      Target Ultrafiltration (L)
                    </label>
                    <Input
                      id="target_ultrafiltration"
                      name="target_ultrafiltration"
                      type="number"
                      step="0.01"
                      value={formData.target_ultrafiltration}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Patient'}
                </Button>
                <Link href="/dashboard/patients">
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
