import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Hemodialysis Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline patient care and dialysis session tracking
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">Sign Up</Button>
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Comprehensive patient records and medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track patient information, medical conditions, and treatment plans in one centralized system.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Tracking</CardTitle>
              <CardDescription>
                Monitor dialysis sessions and vital signs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record and analyze dialysis sessions, including duration, blood pressure, and other vital metrics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>
                Generate insights from treatment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create detailed reports and visualize trends to improve patient outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Supabase, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  );
}
