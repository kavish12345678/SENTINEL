// SENTINEL Response Center Simulation Engine

export type UserHistoryTier = 'NORMAL' | 'CONCERNING' | 'HIGH_RISK';
export type TransactionContextTier = 'NORMAL' | 'UNUSUAL' | 'UNKNOWN';

export type SecurityResponseProtocol =
  | 'REQUIRE_VERIFICATION'
  | 'RESTRICT_USER'
  | 'SUSPEND_TRANSACTION'
  | 'ESCALATE_TO_TEAM'
  | 'NORMAL_NO_CONTAINMENT';

export type AuthorityTier =
  | 'STANDARD_PROCESSING'
  | 'HIGHER_LEVEL_REVIEW'
  | 'SENIOR_AUTHORITY'
  | 'HIGHEST_AUTHORITY'
  | 'NO_APPROVAL_REQUIRED';

export interface SimulationState {
  presetName: string;
  baseRisk: number;
  transactionAmount: number;
  transactionActive: boolean;
  unusualLogin: boolean;
  unusualResource: boolean;
  newBeneficiary: boolean;
  privilegeChange: boolean;
  suspiciousSequence: boolean;
  multipleFailedAttempts: boolean;
  contextVerified: boolean;
  userHistory: UserHistoryTier;
  transactionContext: TransactionContextTier;
  standardLimit: number;
}

export interface RiskBreakdown {
  baseRisk: number;
  factorTotal: number;
  contextReduction: number;
  finalRisk: number;
  factors: Array<{ label: string; points: number }>;
}

export interface SecurityDecision {
  recommendedAction: SecurityResponseProtocol;
  tierLabel: string;
  headline: string;
  reasonBullets: string[];
  decisionSummary: string;
  isActionRecommended: (actionKey: string) => boolean;
}

export interface GovernanceDecision {
  authorityTier: AuthorityTier;
  authorityTitle: string;
  limitStatus: 'WITHIN_LIMIT' | 'EXCEEDED' | 'CRITICAL_EXCEEDANCE' | 'NOT_APPLICABLE';
  approvalRequired: boolean;
  description: string;
  ladderIndex: number; // 0: Standard, 1: Higher, 2: Senior, 3: Highest, -1: None
}

export const DEFAULT_SIMULATION_STATE: SimulationState = {
  presetName: 'CRITICAL_FINANCIAL_THREAT',
  baseRisk: 50,
  transactionAmount: 1850000,
  transactionActive: true,
  unusualLogin: true,
  unusualResource: true,
  newBeneficiary: true,
  privilegeChange: true,
  suspiciousSequence: true,
  multipleFailedAttempts: false,
  contextVerified: false,
  userHistory: 'HIGH_RISK',
  transactionContext: 'UNUSUAL',
  standardLimit: 100000,
};

export const PRESET_SCENARIOS: Array<{
  id: string;
  name: string;
  description: string;
  state: SimulationState;
}> = [
  {
    id: 'NORMAL_ACTIVITY',
    name: 'Normal Activity',
    description: 'Baseline business operations within standard limits and verified context',
    state: {
      presetName: 'NORMAL_ACTIVITY',
      baseRisk: 20,
      transactionAmount: 75000,
      transactionActive: true,
      unusualLogin: false,
      unusualResource: false,
      newBeneficiary: false,
      privilegeChange: false,
      suspiciousSequence: false,
      multipleFailedAttempts: false,
      contextVerified: true,
      userHistory: 'NORMAL',
      transactionContext: 'NORMAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'UNUSUAL_LOGIN',
    name: 'Unusual Login',
    description: 'Off-hours login detected, no active financial transaction',
    state: {
      presetName: 'UNUSUAL_LOGIN',
      baseRisk: 25,
      transactionAmount: 50000,
      transactionActive: false,
      unusualLogin: true,
      unusualResource: false,
      newBeneficiary: false,
      privilegeChange: false,
      suspiciousSequence: false,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'NORMAL',
      transactionContext: 'NORMAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'SUSPICIOUS_ACCESS',
    name: 'Suspicious Access',
    description: 'Rare corporate account accessed outside working hours with higher transaction',
    state: {
      presetName: 'SUSPICIOUS_ACCESS',
      baseRisk: 28,
      transactionAmount: 200000,
      transactionActive: true,
      unusualLogin: true,
      unusualResource: true,
      newBeneficiary: false,
      privilegeChange: false,
      suspiciousSequence: false,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'NORMAL',
      transactionContext: 'UNUSUAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'PRIVILEGE_MISUSE',
    name: 'Privilege Misuse',
    description: 'Sudden role permission boost combined with sequential suspicious access',
    state: {
      presetName: 'PRIVILEGE_MISUSE',
      baseRisk: 30,
      transactionAmount: 500000,
      transactionActive: true,
      unusualLogin: true,
      unusualResource: true,
      newBeneficiary: false,
      privilegeChange: true,
      suspiciousSequence: true,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'CONCERNING',
      transactionContext: 'UNUSUAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'HIGH_VALUE_TXN',
    name: 'High Value Transaction',
    description: 'Demonstrates financial authority escalation (₹18.5L) while security risk is moderate',
    state: {
      presetName: 'HIGH_VALUE_TXN',
      baseRisk: 30,
      transactionAmount: 1850000,
      transactionActive: true,
      unusualLogin: true,
      unusualResource: true,
      newBeneficiary: false,
      privilegeChange: false,
      suspiciousSequence: false,
      multipleFailedAttempts: false,
      contextVerified: true,
      userHistory: 'NORMAL',
      transactionContext: 'UNUSUAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'CRITICAL_FINANCIAL_THREAT',
    name: 'Critical Financial Threat',
    description: 'Multi-factor insider threat with active high-value wire to modified beneficiary',
    state: {
      presetName: 'CRITICAL_FINANCIAL_THREAT',
      baseRisk: 42,
      transactionAmount: 1850000,
      transactionActive: true,
      unusualLogin: true,
      unusualResource: true,
      newBeneficiary: true,
      privilegeChange: true,
      suspiciousSequence: true,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'HIGH_RISK',
      transactionContext: 'UNUSUAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'VERY_HIGH_VALUE',
    name: 'Very High Value (>₹50L)',
    description: 'Extreme transaction value requiring highest board authority independently',
    state: {
      presetName: 'VERY_HIGH_VALUE',
      baseRisk: 45,
      transactionAmount: 7500000,
      transactionActive: true,
      unusualLogin: true,
      unusualResource: false,
      newBeneficiary: false,
      privilegeChange: true,
      suspiciousSequence: true,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'CONCERNING',
      transactionContext: 'UNUSUAL',
      standardLimit: 100000,
    },
  },
  {
    id: 'COORDINATED_THREAT',
    name: 'Coordinated Threat',
    description: 'Severe privilege manipulation without active wire (Escalate to SOC Team)',
    state: {
      presetName: 'COORDINATED_THREAT',
      baseRisk: 40,
      transactionAmount: 0,
      transactionActive: false,
      unusualLogin: true,
      unusualResource: true,
      newBeneficiary: true,
      privilegeChange: true,
      suspiciousSequence: true,
      multipleFailedAttempts: false,
      contextVerified: false,
      userHistory: 'HIGH_RISK',
      transactionContext: 'UNKNOWN',
      standardLimit: 100000,
    },
  },
];

export function calculateSimulationRisk(sim: SimulationState): RiskBreakdown {
  const factors: Array<{ label: string; points: number }> = [];

  if (sim.unusualLogin) factors.push({ label: 'Unusual Login Time', points: 10 });
  if (sim.unusualResource) factors.push({ label: 'Unusual Resource Access', points: 10 });
  if (sim.newBeneficiary) factors.push({ label: 'New Unverified Beneficiary', points: 15 });
  if (sim.privilegeChange) factors.push({ label: 'Privilege Escalation / Limit 5×', points: 15 });
  if (sim.suspiciousSequence) factors.push({ label: 'Coordinated Multi-Step Sequence', points: 20 });
  if (sim.multipleFailedAttempts) factors.push({ label: 'Multiple Failed Authentication', points: 10 });

  if (sim.userHistory === 'HIGH_RISK') {
    factors.push({ label: 'User History: High Risk Profile', points: 15 });
  } else if (sim.userHistory === 'CONCERNING') {
    factors.push({ label: 'User History: Concerning Past Variance', points: 7 });
  }

  const factorTotal = factors.reduce((sum, f) => sum + f.points, 0);
  const contextReduction = sim.contextVerified ? 15 : 0;

  const rawRisk = sim.baseRisk + factorTotal - contextReduction;
  const finalRisk = Math.min(100, Math.max(0, rawRisk));

  return {
    baseRisk: sim.baseRisk,
    factorTotal,
    contextReduction,
    finalRisk,
    factors,
  };
}

export function evaluateSecurityResponse(sim: SimulationState, risk: number): SecurityDecision {
  const isFinancialThreat =
    sim.transactionActive &&
    sim.transactionAmount > 0 &&
    risk >= 80 &&
    (sim.newBeneficiary || sim.privilegeChange || sim.suspiciousSequence || sim.unusualResource);

  // 1. Suspend Transaction (Financial Guard)
  if (isFinancialThreat) {
    return {
      recommendedAction: 'SUSPEND_TRANSACTION',
      tierLabel: 'FINANCIAL GUARD',
      headline: 'Immediate Transaction Containment Recommended',
      reasonBullets: [
        'Risk score exceeds critical threshold (≥ 80/100)',
        'Active outward wire in progress',
        `High transaction value (₹${sim.transactionAmount.toLocaleString('en-IN')})`,
        sim.newBeneficiary ? 'New unverified beneficiary attached' : '',
        sim.privilegeChange ? 'Recent 5× transaction limit increase' : '',
        sim.suspiciousSequence ? 'Coordinated multi-step temporal sequence' : '',
      ].filter(Boolean),
      decisionSummary:
        'Critical behavioural risk is associated with an active high-value transaction. Immediate financial containment is recommended.',
      isActionRecommended: (actionKey) => actionKey === 'SUSPEND_TRANSACTION',
    };
  }

  // 2. Escalate to Team (Tier 3 Escalation)
  if (risk >= 80) {
    return {
      recommendedAction: 'ESCALATE_TO_TEAM',
      tierLabel: 'TIER 3 ESCALATION',
      headline: 'SOC Team Escalation Recommended',
      reasonBullets: [
        'Risk score exceeds critical threshold (≥ 80/100)',
        'Multiple correlated high-risk behavioural indicators present',
        !sim.transactionActive || sim.transactionAmount === 0
          ? 'No active financial wire requiring immediate gateway halt'
          : 'Severe account compromise indicators require human forensics',
      ],
      decisionSummary:
        'Multiple correlated high-risk activities require security-team investigation.',
      isActionRecommended: (actionKey) => actionKey === 'ESCALATE_TO_TEAM',
    };
  }

  // 3. Restrict User (Tier 2 Containment)
  const isPrivilegeOrSevereMisuse =
    (risk >= 60 && risk <= 79) ||
    (sim.privilegeChange && (sim.suspiciousSequence || sim.unusualResource));

  if (isPrivilegeOrSevereMisuse && !sim.contextVerified) {
    return {
      recommendedAction: 'RESTRICT_USER',
      tierLabel: 'TIER 2 CONTAINMENT',
      headline: 'Privilege Revocation & Account Freeze Recommended',
      reasonBullets: [
        `Evaluated risk in elevated tier (${risk}/100)`,
        sim.privilegeChange ? 'Unauthorized or sudden privilege limit change' : '',
        sim.suspiciousSequence ? 'Multi-step action sequence deviation detected' : '',
        'No immediate critical transaction halt required',
      ].filter(Boolean),
      decisionSummary:
        'Repeated behavioural deviations combined with privileged access changes indicate possible account misuse.',
      isActionRecommended: (actionKey) => actionKey === 'RESTRICT_USER',
    };
  }

  // 4. Require Verification (Tier 1 Containment)
  if (
    risk > 30 ||
    sim.unusualLogin ||
    sim.unusualResource ||
    sim.transactionContext !== 'NORMAL' ||
    sim.contextVerified
  ) {
    return {
      recommendedAction: 'REQUIRE_VERIFICATION',
      tierLabel: 'TIER 1 CONTAINMENT',
      headline: 'Step-Up MFA / Manager Verification Recommended',
      reasonBullets: [
        `Moderate risk score (${risk}/100)`,
        sim.unusualLogin ? 'Unusual login timestamp or off-hours session' : '',
        sim.contextVerified ? 'Business context partially mitigates threat level' : '',
        'Evidence does not justify full account lockout or transaction freeze',
      ].filter(Boolean),
      decisionSummary:
        'Behaviour is unusual, but available evidence does not indicate a critical threat. Additional verification is recommended before stronger containment.',
      isActionRecommended: (actionKey) => actionKey === 'REQUIRE_VERIFICATION',
    };
  }

  // 5. Normal / No Containment
  return {
    recommendedAction: 'NORMAL_NO_CONTAINMENT',
    tierLabel: 'BASELINE MONITORING',
    headline: 'Standard Privileged Access Permitted',
    reasonBullets: [
      'Risk within normal 95% baseline confidence interval',
      'No critical anomaly flags active',
      'Operational activity aligns with peer profile',
    ],
    decisionSummary: 'Activity matches baseline parameters. No containment action needed.',
    isActionRecommended: () => false,
  };
}

export function evaluateTransactionGovernance(
  amount: number,
  active: boolean,
  standardLimit = 100000
): GovernanceDecision {
  if (!active || amount <= 0) {
    return {
      authorityTier: 'NO_APPROVAL_REQUIRED',
      authorityTitle: 'NO TRANSACTION APPROVAL',
      limitStatus: 'NOT_APPLICABLE',
      approvalRequired: false,
      description: 'No active transaction in progress.',
      ladderIndex: -1,
    };
  }

  if (amount <= standardLimit) {
    return {
      authorityTier: 'STANDARD_PROCESSING',
      authorityTitle: 'STANDARD PROCESSING',
      limitStatus: 'WITHIN_LIMIT',
      approvalRequired: false,
      description: `Transaction amount is within the standard demo limit (≤ ₹${(standardLimit / 100000).toFixed(1)}L).`,
      ladderIndex: 0,
    };
  }

  if (amount <= 1000000) {
    return {
      authorityTier: 'HIGHER_LEVEL_REVIEW',
      authorityTitle: 'HIGHER-LEVEL REVIEW',
      limitStatus: 'EXCEEDED',
      approvalRequired: true,
      description: 'Transaction exceeds standard limit (₹1L – ₹10L tier). Higher-level review required.',
      ladderIndex: 1,
    };
  }

  if (amount <= 5000000) {
    return {
      authorityTier: 'SENIOR_AUTHORITY',
      authorityTitle: 'SENIOR AUTHORITY APPROVAL',
      limitStatus: 'EXCEEDED',
      approvalRequired: true,
      description: 'Transaction exceeds ₹10L threshold (₹10L – ₹50L tier). Senior Authority Approval Required.',
      ladderIndex: 2,
    };
  }

  return {
    authorityTier: 'HIGHEST_AUTHORITY',
    authorityTitle: 'HIGHEST AUTHORITY APPROVAL',
    limitStatus: 'CRITICAL_EXCEEDANCE',
    approvalRequired: true,
    description: 'Transaction exceeds ₹50L threshold. Highest Executive Authority Approval Required.',
    ladderIndex: 3,
  };
}
