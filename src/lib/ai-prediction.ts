/**
 * AI-Powered Patient Health Analysis and Prediction System
 *
 * This module analyzes patient dialysis data to predict health outcomes
 * and classify patient conditions.
 */

export interface PatientData {
  sessions: DialysisSession[]
  demographics: {
    age: number
    comorbidities?: string[]
    dryWeight?: number
  }
}

export interface DialysisSession {
  sessionDate: Date
  preWeight?: number
  postWeight?: number
  preBpSystolic?: number
  preBpDiastolic?: number
  postBpSystolic?: number
  postBpDiastolic?: number
  preHeartRate?: number
  postHeartRate?: number
  ultrafiltrationAchieved?: number
  complications?: string[]
  patientTolerance?: string
  hemoglobin?: number
  potassium?: number
  sodium?: number
  preBun?: number
  postBun?: number
}

export interface HealthAnalysis {
  healthStatus: 'critical' | 'poor' | 'fair' | 'good' | 'optimal' | 'perfect'
  riskScore: number // 0-100
  trendDirection: 'improving' | 'stable' | 'declining' | 'critical'
  confidenceScore: number // 0-100
  riskFactors: string[]
  recommendations: string[]
  predictedNextSessionRisk: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Calculate health status based on multiple parameters
 */
export function analyzePatientHealth(patientData: PatientData): HealthAnalysis {
  const { sessions, demographics } = patientData

  if (sessions.length === 0) {
    return {
      healthStatus: 'fair',
      riskScore: 50,
      trendDirection: 'stable',
      confidenceScore: 30,
      riskFactors: ['Insufficient data for analysis'],
      recommendations: ['Record more dialysis sessions for accurate analysis'],
      predictedNextSessionRisk: 'medium',
    }
  }

  // Get recent sessions (last 30 days)
  const recentSessions = getRecentSessions(sessions, 30)

  // Calculate various health metrics
  const vitalsTrend = analyzeVitalsTrend(recentSessions)
  const labTrend = analyzeLabTrend(recentSessions)
  const adherenceScore = calculateAdherenceScore(sessions)
  const complicationScore = calculateComplicationScore(recentSessions)
  const hemodynamicStability = assessHemodynamicStability(recentSessions)

  // Calculate overall risk score (0-100, higher is worse)
  const riskScore = calculateOverallRiskScore({
    vitalsTrend,
    labTrend,
    adherenceScore,
    complicationScore,
    hemodynamicStability,
    demographics,
  })

  // Determine health status
  const healthStatus = determineHealthStatus(riskScore)

  // Determine trend direction
  const trendDirection = determineTrendDirection(sessions)

  // Calculate confidence based on data availability
  const confidenceScore = calculateConfidence(sessions)

  // Identify risk factors
  const riskFactors = identifyRiskFactors({
    sessions: recentSessions,
    demographics,
    vitalsTrend,
    labTrend,
  })

  // Generate recommendations
  const recommendations = generateRecommendations({
    healthStatus,
    riskFactors,
    vitalsTrend,
    labTrend,
    sessions: recentSessions,
  })

  // Predict next session risk
  const predictedNextSessionRisk = predictNextSessionRisk(riskScore, trendDirection)

  return {
    healthStatus,
    riskScore: Math.round(riskScore * 100) / 100,
    trendDirection,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    riskFactors,
    recommendations,
    predictedNextSessionRisk,
  }
}

function getRecentSessions(sessions: DialysisSession[], days: number): DialysisSession[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return sessions.filter(s => new Date(s.sessionDate) >= cutoffDate)
}

function analyzeVitalsTrend(sessions: DialysisSession[]) {
  if (sessions.length < 3) return { score: 0, trend: 'insufficient_data' }

  let issues = 0
  let total = 0

  sessions.forEach(session => {
    // Check blood pressure
    if (session.preBpSystolic) {
      total++
      if (session.preBpSystolic > 160 || session.preBpSystolic < 90) issues++
    }
    if (session.postBpSystolic) {
      total++
      if (session.postBpSystolic > 140 || session.postBpSystolic < 90) issues++
    }

    // Check heart rate
    if (session.preHeartRate) {
      total++
      if (session.preHeartRate > 100 || session.preHeartRate < 60) issues++
    }
  })

  const issueRate = total > 0 ? issues / total : 0
  return {
    score: issueRate,
    trend: issueRate < 0.2 ? 'stable' : issueRate < 0.4 ? 'concerning' : 'critical',
  }
}

function analyzeLabTrend(sessions: DialysisSession[]) {
  if (sessions.length < 2) return { score: 0, trend: 'insufficient_data' }

  let issues = 0
  let total = 0

  sessions.forEach(session => {
    if (session.hemoglobin) {
      total++
      if (session.hemoglobin < 10 || session.hemoglobin > 12) issues++
    }
    if (session.potassium) {
      total++
      if (session.potassium < 3.5 || session.potassium > 5.5) issues++
    }
    if (session.sodium) {
      total++
      if (session.sodium < 135 || session.sodium > 145) issues++
    }
  })

  const issueRate = total > 0 ? issues / total : 0
  return {
    score: issueRate,
    trend: issueRate < 0.3 ? 'normal' : issueRate < 0.6 ? 'concerning' : 'abnormal',
  }
}

function calculateAdherenceScore(sessions: DialysisSession[]): number {
  // Expected: 3 sessions per week
  const weeksSinceFirst =
    sessions.length > 0
      ? Math.ceil(
          (Date.now() - new Date(sessions[0].sessionDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
        )
      : 1

  const expectedSessions = weeksSinceFirst * 3
  const adherenceRate = Math.min(sessions.length / expectedSessions, 1)

  return adherenceRate
}

function calculateComplicationScore(sessions: DialysisSession[]): number {
  if (sessions.length === 0) return 0

  const sessionsWithComplications = sessions.filter(
    s => s.complications && s.complications.length > 0
  ).length

  return sessionsWithComplications / sessions.length
}

function assessHemodynamicStability(sessions: DialysisSession[]) {
  if (sessions.length < 3) return { stable: true, score: 0 }

  let unstableCount = 0

  sessions.forEach(session => {
    // Check for significant BP drops
    if (session.preBpSystolic && session.postBpSystolic) {
      const bpDrop = session.preBpSystolic - session.postBpSystolic
      if (bpDrop > 30) unstableCount++
    }

    // Check tolerance
    if (session.patientTolerance === 'poor') unstableCount++
  })

  return {
    stable: unstableCount < sessions.length * 0.3,
    score: unstableCount / sessions.length,
  }
}

function calculateOverallRiskScore(factors: any): number {
  let score = 0

  // Vitals contribution (0-30 points)
  score += factors.vitalsTrend.score * 30

  // Lab results contribution (0-25 points)
  score += factors.labTrend.score * 25

  // Adherence contribution (0-20 points)
  score += (1 - factors.adherenceScore) * 20

  // Complications contribution (0-15 points)
  score += factors.complicationScore * 15

  // Hemodynamic stability contribution (0-10 points)
  score += factors.hemodynamicStability.score * 10

  // Comorbidities contribution (0-10 points)
  if (factors.demographics.comorbidities) {
    score += Math.min(factors.demographics.comorbidities.length * 2, 10)
  }

  return Math.min(score, 100)
}

function determineHealthStatus(riskScore: number): HealthAnalysis['healthStatus'] {
  if (riskScore >= 80) return 'critical'
  if (riskScore >= 60) return 'poor'
  if (riskScore >= 40) return 'fair'
  if (riskScore >= 20) return 'good'
  if (riskScore >= 10) return 'optimal'
  return 'perfect'
}

function determineTrendDirection(sessions: DialysisSession[]): HealthAnalysis['trendDirection'] {
  if (sessions.length < 6) return 'stable'

  const recent = sessions.slice(-3)
  const previous = sessions.slice(-6, -3)

  const recentAvgBP = average(recent.map(s => s.preBpSystolic).filter(Boolean))
  const previousAvgBP = average(previous.map(s => s.preBpSystolic).filter(Boolean))

  const recentComplications = recent.filter(s => s.complications?.length).length
  const previousComplications = previous.filter(s => s.complications?.length).length

  if (recentComplications > previousComplications + 1) return 'declining'
  if (recentAvgBP && previousAvgBP && Math.abs(recentAvgBP - previousAvgBP) > 20) {
    return recentAvgBP > previousAvgBP ? 'declining' : 'improving'
  }
  if (recentComplications < previousComplications) return 'improving'

  return 'stable'
}

function calculateConfidence(sessions: DialysisSession[]): number {
  let dataPoints = 0
  const maxPoints = sessions.length * 10 // Assume 10 key data points per session

  sessions.forEach(session => {
    if (session.preBpSystolic) dataPoints++
    if (session.postBpSystolic) dataPoints++
    if (session.preWeight) dataPoints++
    if (session.postWeight) dataPoints++
    if (session.hemoglobin) dataPoints++
    if (session.potassium) dataPoints++
    if (session.sodium) dataPoints++
    if (session.preBun) dataPoints++
    if (session.ultrafiltrationAchieved) dataPoints++
    if (session.patientTolerance) dataPoints++
  })

  const baseConfidence = (dataPoints / maxPoints) * 100
  const sessionCountBonus = Math.min(sessions.length / 12, 1) * 20 // Bonus for having enough sessions

  return Math.min(baseConfidence + sessionCountBonus, 100)
}

function identifyRiskFactors(data: any): string[] {
  const factors: string[] = []

  if (data.vitalsTrend.trend === 'critical') {
    factors.push('Unstable vital signs detected')
  }
  if (data.labTrend.trend === 'abnormal') {
    factors.push('Abnormal laboratory values')
  }

  const recentComplications = data.sessions.filter(
    (s: DialysisSession) => s.complications && s.complications.length > 0
  ).length

  if (recentComplications > data.sessions.length * 0.3) {
    factors.push('Frequent complications during dialysis')
  }

  if (data.demographics.comorbidities?.includes('diabetes')) {
    factors.push('Diabetes comorbidity')
  }
  if (data.demographics.comorbidities?.includes('hypertension')) {
    factors.push('Hypertension requiring close monitoring')
  }

  // Check for poor tolerance
  const poorTolerance = data.sessions.filter(
    (s: DialysisSession) => s.patientTolerance === 'poor'
  ).length

  if (poorTolerance > data.sessions.length * 0.2) {
    factors.push('Poor tolerance to dialysis sessions')
  }

  return factors.length > 0 ? factors : ['No significant risk factors identified']
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = []

  if (data.vitalsTrend.trend === 'critical' || data.vitalsTrend.trend === 'concerning') {
    recommendations.push('Monitor blood pressure closely before and after sessions')
    recommendations.push('Consider adjusting dry weight or medication regimen')
  }

  if (data.labTrend.trend === 'abnormal') {
    recommendations.push('Review and adjust dietary restrictions')
    recommendations.push('Schedule follow-up laboratory tests')
  }

  if (data.healthStatus === 'critical' || data.healthStatus === 'poor') {
    recommendations.push('Increase monitoring frequency')
    recommendations.push('Schedule consultation with nephrologist')
  }

  if (data.riskFactors.some((f: string) => f.includes('complications'))) {
    recommendations.push('Review dialysis access and consider intervention if needed')
  }

  const avgUF = average(
    data.sessions.map((s: DialysisSession) => s.ultrafiltrationAchieved).filter(Boolean)
  )
  if (avgUF && avgUF > 3) {
    recommendations.push('High ultrafiltration volume - assess for fluid overload causes')
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue current treatment plan')
    recommendations.push('Maintain regular dialysis schedule')
  }

  return recommendations
}

function predictNextSessionRisk(
  riskScore: number,
  trendDirection: HealthAnalysis['trendDirection']
): HealthAnalysis['predictedNextSessionRisk'] {
  let adjustedScore = riskScore

  if (trendDirection === 'declining') adjustedScore += 10
  if (trendDirection === 'improving') adjustedScore -= 10
  if (trendDirection === 'critical') adjustedScore += 20

  if (adjustedScore >= 70) return 'critical'
  if (adjustedScore >= 50) return 'high'
  if (adjustedScore >= 30) return 'medium'
  return 'low'
}

function average(numbers: (number | undefined)[]): number | null {
  const validNumbers = numbers.filter((n): n is number => n !== undefined)
  if (validNumbers.length === 0) return null
  return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length
}
