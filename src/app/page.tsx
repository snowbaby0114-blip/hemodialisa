import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, Activity, BarChart3, Shield, Sparkles, ArrowRight, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Heart className="text-primary h-6 w-6" />
            <span className="text-lg font-semibold">Hemodialysis</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Health Analysis
          </div>
          <h1 className="mb-6 text-5xl font-semibold tracking-tight">
            Hemodialysis Management
            <br />
            <span className="text-muted-foreground">Made Simple</span>
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Streamline patient care with intelligent dialysis tracking, AI-powered health
            predictions, and comprehensive session management.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-border bg-sidebar/30 border-t py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold">Everything you need</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools for modern hemodialysis management
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Patient Management</h3>
              <p className="text-muted-foreground text-sm">
                Comprehensive patient records with medical history, demographics, and treatment
                plans in one place.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="bg-success/10 text-success mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Session Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Record detailed dialysis sessions including vitals, lab values, and treatment
                outcomes with ease.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="bg-warning/10 text-warning mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">AI Health Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Intelligent predictions and risk scoring based on patient data, trends, and
                treatment history.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="bg-info/10 text-info mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Row-level security ensures each user only accesses their own patient data with
                complete privacy.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Smart Recommendations</h3>
              <p className="text-muted-foreground text-sm">
                Get AI-generated care recommendations based on patient health status and trends.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="bg-success/10 text-success mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Analytics Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Visualize trends, track outcomes, and generate insights from treatment data over
                time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <Card className="border-border bg-accent/30 p-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join healthcare professionals using our platform to improve patient care.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Built with Next.js, Supabase, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}
