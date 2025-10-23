import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="from-background to-secondary min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-foreground mb-4 text-5xl font-bold">
            Hemodialysis Management System
          </h1>
          <p className="text-muted-foreground mb-8 text-xl">
            Streamline patient care and dialysis session tracking
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </header>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Comprehensive patient records and medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Track patient information, medical conditions, and treatment plans in one
                centralized system.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Tracking</CardTitle>
              <CardDescription>Monitor dialysis sessions and vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Record and analyze dialysis sessions, including duration, blood pressure, and other
                vital metrics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate insights from treatment data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Create detailed reports and visualize trends to improve patient outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="text-muted-foreground text-center text-sm">
          <p>Built with Next.js, Supabase, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  )
}
