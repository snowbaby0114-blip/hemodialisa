# Hemodialysis Management System

An advanced web application for managing hemodialysis patients with AI-powered health analysis and risk prediction.

## Features

### Core Features
- **Patient Management**: Comprehensive patient records with medical history, demographics, and dialysis information
- **Session Tracking**: Detailed dialysis session recording with pre/post vitals and outcomes
- **Authentication**: Secure user authentication powered by Supabase
- **Responsive UI**: Beautiful, accessible interface built with shadcn/ui components

### AI-Powered Analysis
- **Health Status Classification**: Automated patient health assessment (Perfect, Optimal, Good, Fair, Poor, Critical)
- **Risk Score Calculation**: 0-100 risk scoring based on multiple health parameters
- **Trend Analysis**: Track patient health trends (Improving, Stable, Declining, Critical)
- **Next Session Risk Prediction**: Predict risk levels for upcoming dialysis sessions
- **Smart Recommendations**: AI-generated care recommendations based on patient data
- **Risk Factor Identification**: Automated detection of health concerns and complications

### Analytics
- Dashboard with real-time statistics
- Patient health trends visualization
- Session history and analysis
- Complication tracking

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui with Tailwind CSS
- **AI/ML**: Custom prediction algorithms for health analysis

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hemodialisa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be set up

#### Run Database Migrations
1. In your Supabase project dashboard, go to the SQL Editor
2. Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`

This will create:
- `patients` table with AI analysis fields
- `dialysis_sessions` table with comprehensive session data
- `patient_health_analytics` table for trend tracking
- `ai_prediction_logs` table for prediction accuracy tracking
- Row Level Security (RLS) policies
- Necessary indexes and triggers

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under API.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup
1. Navigate to the home page
2. Click "Sign Up" to create an account
3. Fill in your credentials and sign up
4. You'll be redirected to the dashboard

### Adding Patients
1. From the dashboard, click "View Patients" or "Add New Patient"
2. Fill in patient information including:
   - Personal details (name, DOB, contact info)
   - Medical information (diagnosis, comorbidities, allergies)
   - Dialysis information (access type, dry weight, target UF)
3. Click "Create Patient"

### Recording Dialysis Sessions
1. Navigate to "Dialysis Sessions" from the dashboard
2. Click "Record New Session"
3. Select the patient
4. Enter session details:
   - Session date and time
   - Pre-dialysis vitals (weight, BP, heart rate, etc.)
   - Post-dialysis vitals
   - Dialysis parameters (UF goal/achieved, blood flow rate)
   - Laboratory values (hemoglobin, potassium, sodium, BUN, etc.)
   - Session outcome (tolerance, complications, notes)
4. Click "Record Session"

### Viewing AI Analysis
1. Go to the patient detail page by clicking on a patient
2. The system will automatically analyze all session data and display:
   - Current health status
   - Risk score (0-100)
   - Health trend direction
   - Predicted next session risk
   - Identified risk factors
   - AI-generated recommendations

## AI Analysis Algorithm

The system uses a multi-factor analysis approach:

### Input Parameters
- Vital signs trends (BP, heart rate, temperature, O2 saturation)
- Laboratory values (hemoglobin, electrolytes, BUN, creatinine)
- Treatment adherence (session frequency)
- Complication history
- Hemodynamic stability
- Patient demographics and comorbidities

### Scoring Components
- **Vitals Trend Score** (0-30 points): Analyzes abnormal vital signs patterns
- **Lab Trend Score** (0-25 points): Evaluates laboratory value deviations
- **Adherence Score** (0-20 points): Measures treatment compliance
- **Complication Score** (0-15 points): Tracks adverse events
- **Hemodynamic Stability** (0-10 points): Assesses BP stability during dialysis
- **Comorbidity Score** (0-10 points): Accounts for existing conditions

### Output Classifications
- **Health Status**: Perfect → Optimal → Good → Fair → Poor → Critical
- **Risk Score**: 0-100 (higher = more risk)
- **Trend Direction**: Improving, Stable, Declining, Critical
- **Next Session Risk**: Low, Medium, High, Critical
- **Confidence Score**: Based on data completeness and session count

## Database Schema

### Main Tables
- **patients**: Patient demographic and medical information
- **dialysis_sessions**: Detailed session records with vitals and outcomes
- **patient_health_analytics**: Calculated health trends and predictions
- **ai_prediction_logs**: Track prediction accuracy over time

See `supabase/migrations/001_initial_schema.sql` for complete schema details.

## Project Structure

```
hemodialisa/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard pages
│   │   ├── patients/       # Patient management
│   │   └── sessions/       # Session tracking
│   ├── login/              # Authentication pages
│   ├── signup/
│   └── auth/
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/          # Supabase client setup
│   ├── ai-prediction.ts   # AI analysis algorithms
│   └── utils.ts           # Utility functions
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own patients and sessions
- Authentication required for all dashboard routes
- Middleware protection for sensitive routes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database and auth by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
