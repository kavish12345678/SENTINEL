// TypeScript interfaces for SENTINEL

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserStatus = 'NORMAL' | 'SUSPICIOUS' | 'RESTRICTED' | 'CRITICAL';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'UNRESOLVED' | 'INVESTIGATING' | 'RESOLVED';
export type IncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'VERIFICATION_REQUIRED'
  | 'RESTRICTED'
  | 'TRANSACTION_SUSPENDED'
  | 'ESCALATED'
  | 'CLOSED';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  accessLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  normalWorkingHours: { start: string; end: string };
  normalTransactionRange: { min: number; max: number };
  riskScore: number;
  baselineRiskScore: number;
  status: UserStatus;
  lastActivity: string;
  typicalResources: string[];
  typicalBeneficiaries: string[];
  avatar: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  action: string;
  resource: string;
  amount?: number;
  beneficiary?: string;
  location: string;
  riskScore: number;
  riskReason: string;
  status: 'NORMAL' | 'UNUSUAL' | 'SUSPICIOUS' | 'CRITICAL';
  ipAddress: string;
  device: string;
}

export interface Alert {
  id: string;
  userId: string;
  userName: string;
  type: string;
  severity: AlertSeverity;
  riskScore: number;
  description: string;
  timestamp: string;
  status: AlertStatus;
  relatedIncidentId?: string;
}

export interface RiskFactor {
  label: string;
  score: number;
  description: string;
}

export interface TimelineEvent {
  time: string;
  action: string;
  detail: string;
  riskDelta: number;
  cumulativeRisk: number;
  status: 'NORMAL' | 'UNUSUAL' | 'SUSPICIOUS' | 'CRITICAL';
}

export interface Incident {
  id: string;
  caseId: string;
  alertId: string;
  userId: string;
  userName: string;
  riskScore: number;
  status: IncidentStatus;
  timeline: TimelineEvent[];
  riskFactors: RiskFactor[];
  recommendedAction: string;
  behaviourAnalysis: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRecord {
  id: string;
  incidentId: string;
  action: string;
  actionTitle: string;
  user: string;
  riskScore: number;
  timestamp: string;
  executedBy: string;
  telegramStatus: 'SENT' | 'FAILED' | 'SENDING';
  error?: string;
}

export type DemoStage =
  | 0 // Initial
  | 1 // Normal Login
  | 2 // Unusual Login Time
  | 3 // Unusual Resource Access
  | 4 // Beneficiary Change
  | 5 // Transaction Limit Change
  | 6 // Large Payment
  | 7 // Threat Detected
  | 8; // Response

export interface DemoState {
  isRunning: boolean;
  isPaused: boolean;
  stage: DemoStage;
  currentRisk: number;
  scenarioType: 'suspicious' | 'legitimate' | null;
  completedStages: DemoStage[];
}

export interface Settings {
  riskThresholds: {
    low: { min: number; max: number };
    medium: { min: number; max: number };
    high: { min: number; max: number };
    critical: { min: number; max: number };
  };
  notifications: {
    emailAlerts: boolean;
    securityTeamAlerts: boolean;
    criticalAlerts: boolean;
    additionalVerification: boolean;
  };
  demoMode: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
