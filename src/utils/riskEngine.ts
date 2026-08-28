import type { RiskLevel } from '../types';

export interface RiskFactorInput {
  unusualLoginTime?: boolean;
  unusualResource?: boolean;
  newBeneficiary?: boolean;
  transactionLimitIncrease?: boolean;
  largeTransaction?: boolean;
  suspiciousSequence?: boolean;
  priorRiskHistory?: boolean;
  baseScore?: number;
}

export function calculateRiskScore(factors: RiskFactorInput): number {
  let score = factors.baseScore ?? 18;

  if (factors.unusualLoginTime) score += 20;
  if (factors.unusualResource) score += 15;
  if (factors.newBeneficiary) score += 15;
  if (factors.transactionLimitIncrease) score += 10;
  if (factors.largeTransaction) score += 12;
  if (factors.suspiciousSequence) score += 10;
  if (factors.priorRiskHistory) score += 10;

  return Math.min(100, score);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score);
  switch (level) {
    case 'LOW':
      return 'text-green-400';
    case 'MEDIUM':
      return 'text-yellow-400';
    case 'HIGH':
      return 'text-orange-400';
    case 'CRITICAL':
      return 'text-red-400';
  }
}

export function getRiskBgColor(score: number): string {
  const level = getRiskLevel(score);
  switch (level) {
    case 'LOW':
      return 'bg-green-500/10 border-green-500/30 text-green-400';
    case 'MEDIUM':
      return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    case 'HIGH':
      return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    case 'CRITICAL':
      return 'bg-red-500/10 border-red-500/30 text-red-400';
  }
}

export function getRiskBadgeClass(level: RiskLevel | string): string {
  switch (level) {
    case 'LOW':
    case 'NORMAL':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'MEDIUM':
    case 'UNUSUAL':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'HIGH':
    case 'SUSPICIOUS':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
