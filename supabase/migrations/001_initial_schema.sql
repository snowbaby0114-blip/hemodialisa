-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_type TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  -- Medical Information
  diagnosis TEXT,
  comorbidities TEXT[], -- Array of conditions (diabetes, hypertension, etc.)
  allergies TEXT[],
  medications TEXT[],

  -- Dialysis Information
  dialysis_access_type TEXT CHECK (dialysis_access_type IN ('av_fistula', 'av_graft', 'catheter')),
  dialysis_access_location TEXT,
  dry_weight DECIMAL(5,2), -- in kg
  target_ultrafiltration DECIMAL(5,2), -- in liters

  -- AI Analysis Fields
  health_status TEXT CHECK (health_status IN ('critical', 'poor', 'fair', 'good', 'optimal', 'perfect')),
  risk_score DECIMAL(5,2), -- 0-100 score
  last_analysis_date TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dialysis Sessions table
CREATE TABLE dialysis_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Details
  session_date DATE NOT NULL,
  session_start_time TIME NOT NULL,
  session_end_time TIME,
  duration_minutes INTEGER,

  -- Pre-Dialysis Vitals
  pre_weight DECIMAL(5,2), -- kg
  pre_blood_pressure_systolic INTEGER,
  pre_blood_pressure_diastolic INTEGER,
  pre_heart_rate INTEGER,
  pre_temperature DECIMAL(4,2), -- celsius
  pre_oxygen_saturation INTEGER, -- percentage

  -- Post-Dialysis Vitals
  post_weight DECIMAL(5,2),
  post_blood_pressure_systolic INTEGER,
  post_blood_pressure_diastolic INTEGER,
  post_heart_rate INTEGER,
  post_temperature DECIMAL(4,2),
  post_oxygen_saturation INTEGER,

  -- Dialysis Parameters
  blood_flow_rate INTEGER, -- ml/min
  dialysate_flow_rate INTEGER, -- ml/min
  ultrafiltration_goal DECIMAL(5,2), -- liters
  ultrafiltration_achieved DECIMAL(5,2),
  heparin_dose DECIMAL(5,2), -- units

  -- Laboratory Results
  pre_bun DECIMAL(6,2), -- blood urea nitrogen
  post_bun DECIMAL(6,2),
  pre_creatinine DECIMAL(5,2),
  post_creatinine DECIMAL(5,2),
  hemoglobin DECIMAL(4,2),
  potassium DECIMAL(4,2),
  sodium DECIMAL(5,2),
  calcium DECIMAL(4,2),
  phosphorus DECIMAL(4,2),

  -- Session Outcomes
  complications TEXT[],
  adverse_events TEXT,
  patient_tolerance TEXT CHECK (patient_tolerance IN ('poor', 'fair', 'good', 'excellent')),

  -- AI Analysis
  session_quality_score DECIMAL(5,2), -- 0-100
  predicted_next_session_risk TEXT CHECK (predicted_next_session_risk IN ('low', 'medium', 'high', 'critical')),
  ai_recommendations TEXT[],

  -- Notes
  nurse_notes TEXT,
  physician_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Health Analytics table (for tracking trends)
CREATE TABLE patient_health_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,

  -- Analysis Period
  analysis_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Calculated Metrics
  average_pre_bp_systolic DECIMAL(6,2),
  average_pre_bp_diastolic DECIMAL(6,2),
  average_post_bp_systolic DECIMAL(6,2),
  average_post_bp_diastolic DECIMAL(6,2),
  average_weight_change DECIMAL(5,2),
  average_uf_achieved DECIMAL(5,2),
  session_count INTEGER,
  missed_sessions INTEGER,

  -- AI Predictions
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining', 'critical')),
  predicted_outcome TEXT,
  confidence_score DECIMAL(5,2), -- 0-100
  risk_factors TEXT[],
  recommendations TEXT[],

  -- Health Status Classification
  overall_health_status TEXT CHECK (overall_health_status IN ('critical', 'poor', 'fair', 'good', 'optimal', 'perfect')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Prediction Logs table (for tracking prediction accuracy)
CREATE TABLE ai_prediction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  session_id UUID REFERENCES dialysis_sessions(id) ON DELETE CASCADE,

  prediction_type TEXT NOT NULL,
  predicted_value TEXT,
  actual_value TEXT,
  confidence_score DECIMAL(5,2),

  prediction_date TIMESTAMPTZ NOT NULL,
  outcome_date TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_health_status ON patients(health_status);
CREATE INDEX idx_sessions_patient_id ON dialysis_sessions(patient_id);
CREATE INDEX idx_sessions_date ON dialysis_sessions(session_date);
CREATE INDEX idx_sessions_user_id ON dialysis_sessions(user_id);
CREATE INDEX idx_analytics_patient_id ON patient_health_analytics(patient_id);
CREATE INDEX idx_analytics_date ON patient_health_analytics(analysis_date);

-- Row Level Security (RLS) Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_health_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prediction_logs ENABLE ROW LEVEL SECURITY;

-- Policies for patients
CREATE POLICY "Users can view their own patients"
  ON patients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients"
  ON patients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients"
  ON patients FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for dialysis_sessions
CREATE POLICY "Users can view their own sessions"
  ON dialysis_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON dialysis_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON dialysis_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for patient_health_analytics
CREATE POLICY "Users can view analytics for their patients"
  ON patient_health_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = patient_health_analytics.patient_id AND patients.user_id = auth.uid()
  ));

-- Policies for ai_prediction_logs
CREATE POLICY "Users can view their prediction logs"
  ON ai_prediction_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM patients WHERE patients.id = ai_prediction_logs.patient_id AND patients.user_id = auth.uid()
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dialysis_sessions_updated_at BEFORE UPDATE ON dialysis_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
