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
      return 'text-[#5F8669]';
    case 'MEDIUM':
      return 'text-[#C19A5A]';
    case 'HIGH':
      return 'text-[#B67842]';
    case 'CRITICAL':
      return 'text-[#A64444]';
  }
}

export function getRiskBgColor(score: number): string {
  const level = getRiskLevel(score);
  switch (level) {
    case 'LOW':
      return 'bg-[#5F8669]/10 border-[#5F8669]/30 text-[#5F8669]';
    case 'MEDIUM':
      return 'bg-[#C19A5A]/10 border-[#C19A5A]/30 text-[#C19A5A]';
    case 'HIGH':
      return 'bg-[#B67842]/10 border-[#B67842]/30 text-[#B67842]';
    case 'CRITICAL':
      return 'bg-[#A64444]/15 border-[#A64444]/40 text-[#A64444]';
  }
}

export function getRiskBadgeClass(level: RiskLevel | string): string {
  switch (level) {
    case 'LOW':
    case 'NORMAL':
      return 'bg-[#5F8669]/15 text-[#5F8669] border border-[#5F8669]/30';
    case 'MEDIUM':
    case 'UNUSUAL':
      return 'bg-[#C19A5A]/15 text-[#C19A5A] border border-[#C19A5A]/30';
    case 'HIGH':
    case 'SUSPICIOUS':
      return 'bg-[#B67842]/15 text-[#B67842] border border-[#B67842]/30';
    case 'CRITICAL':
      return 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40';
    default:
      return 'bg-[#292B2D]/40 text-[#9A9A96] border border-[#292B2D]';
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
