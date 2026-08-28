import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  BarChart2,
  Play,
  RotateCcw,
  ChevronRight,
  Clock,
  Cpu,
  Eye,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { riskChartData, riskDistributionData } from '../../data/mockData';
import DemoControlPanel from '../../components/Demo/DemoControlPanel';
import AnimatedScore from '../../components/UI/AnimatedScore';

const suspiciousSteps = [
  {
    stage: 1,
    time: '10:05 AM',
    title: 'Normal Login',
    detail: 'User logged in during business hours from Office Laptop, Delhi.',
    risk: 20,
    delta: '+2',
    status: 'NORMAL',
    color: 'green',
    message: "Activity is consistent with the user's normal behaviour.",
  },
  {
    stage: 2,
    time: '02:15 AM',
    title: 'Unusual Login Time',
    detail: 'User accessed payment system outside normal hours (9:00 AM – 6:00 PM).',
    risk: 40,
    delta: '+20',
    status: 'MEDIUM',
    color: 'yellow',
    message: 'Login time is unusual for this user.',
  },
  {
    stage: 3,
    time: '02:17 AM',
    title: 'Unusual Resource Access',
    detail: 'Accessed high-value corporate account #CC-8821. User rarely accesses this account.',
    risk: 55,
    delta: '+15',
    status: 'MEDIUM',
    color: 'yellow',
    message: 'Unusual resource access flagged.',
  },
  {
    stage: 4,
    time: '02:19 AM',
    title: 'Beneficiary Change',
    detail: 'Beneficiary modified from ABC Supplies to XYZ Holdings (new beneficiary).',
    risk: 70,
    delta: '+15',
    status: 'HIGH',
    color: 'orange',
    message: 'New unrecognised beneficiary added before transaction.',
  },
  {
    stage: 5,
    time: '02:21 AM',
    title: 'Transaction Limit Change',
    detail: 'Transaction limit increased from ₹5,00,000 to ₹25,00,000.',
    risk: 80,
    delta: '+10',
    status: 'HIGH',
    color: 'red',
    message: 'Sudden 5x limit increase without standard approval chain.',
  },
  {
    stage: 6,
    time: '02:23 AM',
    title: 'Large Payment Initiated',
    detail: 'Payment of ₹18,50,000 initiated to XYZ Holdings.',
    risk: 92,
    delta: '+12',
    status: 'CRITICAL',
    color: 'red',
    message: 'High-value transaction to modified beneficiary completed sequence.',
  },
];

const legitimateSteps = [
  {
    stage: 1,
    time: '11:00 PM',
    title: 'Late Night Login',
    detail: 'Rahul Verma (System Admin) accessed server console at 11:00 PM.',
    risk: 24,
    delta: '+2',
    status: 'NORMAL',
    color: 'green',
    message: 'Login detected outside regular operational hours.',
  },
  {
    stage: 2,
    time: '11:02 PM',
    title: 'Access Server Console',
    detail: 'Access to Core Production Server Console at 11:02 PM.',
    risk: 36,
    delta: '+12',
    status: 'MEDIUM',
    color: 'yellow',
    message: 'Unusual timing flagged. Cross-referencing business context...',
  },
  {
    stage: 3,
    time: '11:05 PM',
    title: 'Approved Maintenance Found',
    detail: 'Verified against Scheduled Change Ticket #CHG-2026-881 (Emergency Maintenance).',
    risk: 28,
    delta: '-8',
    status: 'NORMAL',
    color: 'green',
    message: 'Business context matches approved emergency maintenance window.',
  },
  {
    stage: 4,
    time: '11:15 PM',
    title: 'Configuration Update',
    detail: 'Applied patch to database node as per change ticket scope.',
    risk: 24,
    delta: '-4',
    status: 'NORMAL',
    color: 'green',
    message: 'All executed commands align with authorised maintenance script.',
  },
  {
    stage: 5,
    time: '11:45 PM',
    title: 'Maintenance Completed',
    detail: 'System health verified, session terminated normally.',
    risk: 22,
    delta: '-2',
    status: 'NORMAL',
    color: 'green',
    message: 'Unusual activity detected, but behaviour matches approved business context.',
  },
];

const continuousLoopSteps = [
  { icon: Eye, label: 'Observe', desc: 'Monitor all privileged user actions' },
  { icon: Cpu, label: 'Learn Normal Behaviour', desc: 'Establish peer and user baselines' },
  { icon: Activity, label: 'Correlate Actions', desc: 'Connect multi-step sequence patterns' },
  { icon: AlertTriangle, label: 'Detect Anomaly', desc: 'Flag deviations from baseline' },
  { icon: BarChart2, label: 'Assess Risk', desc: 'Calculate cumulative risk score' },
  { icon: Shield, label: 'Investigate Context', desc: 'Evaluate business purpose & history' },
  { icon: CheckCircle, label: 'Respond', desc: 'Graduated automated / analyst mitigation' },
  { icon: Cpu, label: 'Learn', desc: 'Continuous feedback loop refinement' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { demoState, startDemo, resetDemo, alerts, nextStep } = useApp();
  const [activeLoopStep, setActiveLoopStep] = useState(0);

  const isDemo = demoState.isRunning;
  const stage = demoState.stage;
  const scenarioType = demoState.scenarioType;
  const steps = scenarioType === 'legitimate' ? legitimateSteps : suspiciousSteps;
  const displayedSteps = steps.filter((s) => s.stage <= stage && demoState.isRunning);

  // Animate continuous loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLoopStep((prev) => (prev + 1) % continuousLoopSteps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Sync loop step with demo stage
  useEffect(() => {
    if (demoState.isRunning) {
      const loopMap: Record<number, number> = { 1: 0, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 };
      if (loopMap[stage] !== undefined) setActiveLoopStep(loopMap[stage]);
    }
  }, [stage, demoState.isRunning]);

  const kpiMetrics = [
    { label: 'PRIVILEGED USERS', value: '24', icon: Users, accent: 'text-[#F2F0EA]' },
    { label: 'ACTIVE SESSIONS', value: '11', icon: Activity, accent: 'text-[#5F8669]' },
    {
      label: 'SUSPICIOUS EVENTS',
      value: isDemo && scenarioType === 'suspicious' ? String(7 + Math.max(0, stage - 1)) : '7',
      icon: AlertTriangle,
      accent: 'text-[#C19A5A]',
    },
    {
      label: 'CRITICAL ALERTS',
      value: isDemo && scenarioType === 'suspicious' && stage >= 6 ? '4' : '3',
      icon: AlertCircle,
      accent: 'text-[#A64444]',
    },
    { label: 'TRANSACTIONS (24H)', value: '1,284', icon: CreditCard, accent: 'text-[#F2F0EA]' },
    {
      label: 'AVERAGE RISK',
      value: isDemo && scenarioType === 'suspicious' ? `${Math.round(34 + stage * 2.5)}/100` : '34/100',
      icon: TrendingUp,
      accent: 'text-[#B67842]',
    },
  ];

  const unresolvedAlerts = alerts.filter((a) => a.status !== 'RESOLVED').slice(0, 5);

  return (
    <div className="p-7 pb-24 max-w-7xl mx-auto space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              SECURITY OVERVIEW
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              LIVE MONITORING
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Continuous Behaviour Intelligence & Privileged Account Surveillance
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151617] hover:bg-[#191A1C] border border-[#292B2D] rounded text-xs text-[#9A9A96] hover:text-[#F2F0EA] transition-all btn-tactile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DEMO</span>
          </button>
        </div>
      </div>

      {/* Core Principle Horizontal Strip */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#191A1C] border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A] flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C19A5A] font-semibold">
              CORE PARADIGM
            </span>
            <p className="text-xs text-[#F2F0EA] font-medium tracking-wide">
              "Authorised Access ≠ Authorised Behaviour" — Traditional IAM verifies credentials; SENTINEL evaluates behavioural trust.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-[#686A6B]">
          <span>ENGINE // ACTIVE</span>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiMetrics.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-[#151617] border border-[#292B2D] rounded-lg p-3.5 flex flex-col justify-between hover:border-[#383B3E] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#686A6B] truncate">
                {label}
              </span>
              <Icon className="w-3.5 h-3.5 text-[#686A6B]" />
            </div>
            <p className={`text-lg font-mono font-bold tracking-tight ${accent}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Demo Scenario Launchers (When Not Running) */}
      {!isDemo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => startDemo('suspicious')}
            className="group text-left p-5 bg-[#151617] border border-[#A64444]/40 hover:border-[#A64444] rounded-xl transition-all duration-200 shadow-md flex items-center justify-between btn-tactile"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#A64444]/15 border border-[#A64444]/30 rounded-lg flex items-center justify-center text-[#A64444] group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-[#F2F0EA] tracking-wide">
                    RUN DEMO SCENARIO
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40 font-bold">
                    PRIMARY
                  </span>
                </div>
                <p className="text-xs text-[#9A9A96] mt-0.5">
                  Suspicious Multi-Step Wire Sequence (Amit Sharma: 18 → 92 Risk)
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-md bg-[#191A1C] border border-[#292B2D] flex items-center justify-center group-hover:border-[#A64444] text-[#A64444] transition-all">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </button>

          <button
            onClick={() => startDemo('legitimate')}
            className="group text-left p-5 bg-[#151617] border border-[#5F8669]/40 hover:border-[#5F8669] rounded-xl transition-all duration-200 shadow-md flex items-center justify-between btn-tactile"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#5F8669]/15 border border-[#5F8669]/30 rounded-lg flex items-center justify-center text-[#5F8669] group-hover:scale-105 transition-transform">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-[#F2F0EA] tracking-wide">
                    RUN LEGITIMATE SCENARIO
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#5F8669]/20 text-[#5F8669] border border-[#5F8669]/40 font-bold">
                    FALSE POSITIVE
                  </span>
                </div>
                <p className="text-xs text-[#9A9A96] mt-0.5">
                  Emergency Maintenance Context Validation (Rahul Verma: Ticket #CHG-881)
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-md bg-[#191A1C] border border-[#292B2D] flex items-center justify-center group-hover:border-[#5F8669] text-[#5F8669] transition-all">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </button>
        </div>
      )}

      {/* Active Demo Panel */}
      {isDemo && (
        <div
          className={`rounded-xl border p-5 transition-all duration-300 shadow-lg ${
            scenarioType === 'legitimate'
              ? 'bg-[#151617] border-[#5F8669]/50'
              : stage >= 6
              ? 'bg-[#151617] border-[#A64444]/60'
              : 'bg-[#151617] border-[#C19A5A]/50'
          }`}
        >
          {/* Demo Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3.5 border-b border-[#292B2D]">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  scenarioType === 'legitimate' ? 'bg-[#5F8669]' : stage >= 6 ? 'bg-[#A64444]' : 'bg-[#C19A5A]'
                }`}
              />
              <div>
                <h2 className="text-sm font-mono font-bold text-[#F2F0EA]">
                  {scenarioType === 'suspicious'
                    ? 'LIVE SCENARIO: SUSPICIOUS PAYMENT ACTIVITY'
                    : 'LIVE SCENARIO: EMERGENCY MAINTENANCE (CONTEXT VALIDATED)'}
                </h2>
                <p className="text-xs text-[#9A9A96] mt-0.5">
                  {scenarioType === 'suspicious' ? (
                    <>
                      Target: <span className="text-[#F2F0EA] font-semibold">Amit Sharma</span> · Role:{' '}
                      <span>Payment Administrator</span> · Baseline:{' '}
                      <span className="text-[#5F8669] font-mono font-bold">18/100 (NORMAL)</span>
                    </>
                  ) : (
                    <>
                      Target: <span className="text-[#F2F0EA] font-semibold">Rahul Verma</span> · Role:{' '}
                      <span>System Administrator</span> · Context:{' '}
                      <span className="text-[#C19A5A]">Ticket #CHG-2026-881 Approved</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Dynamic Animated Score Display */}
            <div className="flex items-center gap-4 bg-[#101112] border border-[#292B2D] rounded-lg px-4 py-2 self-start md:self-auto font-mono">
              <div className="text-right">
                <p
                  className={`text-xl font-bold ${
                    demoState.currentRisk >= 81
                      ? 'text-[#A64444]'
                      : demoState.currentRisk >= 61
                      ? 'text-[#B67842]'
                      : demoState.currentRisk >= 31
                      ? 'text-[#C19A5A]'
                      : 'text-[#5F8669]'
                  }`}
                >
                  <AnimatedScore value={demoState.currentRisk} />
                  <span className="text-xs text-[#686A6B]"> / 100</span>
                </p>
                <span className="text-[9px] text-[#686A6B] uppercase tracking-wider block">
                  EVALUATED RISK
                </span>
              </div>
              <div
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                  demoState.currentRisk >= 81
                    ? 'bg-[#A64444]/20 text-[#A64444] border-[#A64444]/40'
                    : demoState.currentRisk >= 61
                    ? 'bg-[#B67842]/20 text-[#B67842] border-[#B67842]/40'
                    : demoState.currentRisk >= 31
                    ? 'bg-[#C19A5A]/20 text-[#C19A5A] border-[#C19A5A]/40'
                    : 'bg-[#5F8669]/20 text-[#5F8669] border-[#5F8669]/40'
                }`}
              >
                {demoState.currentRisk >= 81
                  ? 'CRITICAL'
                  : demoState.currentRisk >= 61
                  ? 'HIGH'
                  : demoState.currentRisk >= 31
                  ? 'MEDIUM'
                  : 'LOW'}
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-2 mb-4">
            {displayedSteps.map((step, i) => (
              <div
                key={step.stage}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  step.stage === stage
                    ? 'bg-[#191A1C] border-[#292B2D] ring-1 ring-[#C19A5A]/40'
                    : 'bg-[#101112]/60 border-[#292B2D]/60 opacity-75'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                    step.color === 'green'
                      ? 'bg-[#5F8669]/20 text-[#5F8669] border border-[#5F8669]/30'
                      : step.color === 'yellow'
                      ? 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/30'
                      : step.color === 'orange'
                      ? 'bg-[#B67842]/20 text-[#B67842] border border-[#B67842]/30'
                      : 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/30'
                  }`}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0 font-mono">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[#686A6B] text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.time}
                    </span>
                    <span className="text-xs font-bold text-[#F2F0EA]">{step.title}</span>
                    <span
                      className={`ml-auto text-[11px] font-bold ${
                        step.color === 'green'
                          ? 'text-[#5F8669]'
                          : step.color === 'yellow'
                          ? 'text-[#C19A5A]'
                          : step.color === 'orange'
                          ? 'text-[#B67842]'
                          : 'text-[#A64444]'
                      }`}
                    >
                      {step.risk}/100 ({step.delta})
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9A96] font-sans">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suspicious Sequence Synthesis */}
          {isDemo && stage >= 6 && scenarioType === 'suspicious' && (
            <div className="mt-4 p-4 bg-[#101112] border border-[#A64444]/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#A64444]" />
                <h3 className="text-xs font-mono font-bold text-[#A64444] uppercase tracking-wider">
                  SUSPICIOUS BEHAVIOUR SEQUENCE IDENTIFIED
                </h3>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-[#151617] rounded border border-[#292B2D] text-[11px] font-mono">
                {[
                  'Unusual Time (02:15 AM)',
                  'Unusual Account',
                  'Beneficiary Modified',
                  'Limit Raised 5×',
                  'Large Wire (₹18.5L)',
                ].map((item, idx, arr) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-[#A64444]/15 border border-[#A64444]/30 rounded text-[#F2F0EA]">
                      {item}
                    </span>
                    {idx < arr.length - 1 && <ChevronRight className="w-3 h-3 text-[#A64444]" />}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#151617] border border-[#292B2D] rounded-lg">
                  <p className="font-mono text-[10px] text-[#5F8669] uppercase font-bold">
                    ✓ Individual Actions
                  </p>
                  <p className="text-[#9A9A96] mt-0.5 text-[11px]">
                    Each single action is technically allowed by role permissions.
                  </p>
                </div>
                <div className="p-3 bg-[#A64444]/10 border border-[#A64444]/30 rounded-lg">
                  <p className="font-mono text-[10px] text-[#A64444] uppercase font-bold">
                    ⚠ Sequential Pattern
                  </p>
                  <p className="text-[#F2F0EA] mt-0.5 text-[11px]">
                    Joint probability of this sequence drops below threshold (P &lt; 0.001).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => navigate('/investigation')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#A64444] hover:bg-[#8f3a3a] text-white text-xs font-mono font-bold rounded-lg transition-all btn-tactile"
                >
                  <span>INVESTIGATE CASE (INC-2026-0091)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/response')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#191A1C] hover:bg-[#242628] text-[#F2F0EA] text-xs font-mono font-bold rounded-lg border border-[#292B2D] transition-all btn-tactile"
                >
                  <span>GO TO RESPONSE CENTER</span>
                </button>
              </div>
            </div>
          )}

          {/* Legitimate Context Verification Complete */}
          {isDemo && stage >= 5 && scenarioType === 'legitimate' && (
            <div className="mt-4 p-4 bg-[#101112] border border-[#5F8669]/40 rounded-xl space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#5F8669]" />
                <h3 className="text-xs font-bold text-[#5F8669] uppercase tracking-wider">
                  BUSINESS CONTEXT VALIDATED — FALSE POSITIVE MITIGATED
                </h3>
              </div>
              <p className="text-xs text-[#9A9A96] font-sans">
                Off-hours activity cross-referenced against Ticket #CHG-2026-881. Risk score remained at baseline (22/100).
              </p>
            </div>
          )}

          {/* Navigation controls */}
          <div className="mt-4 flex items-center gap-2.5 pt-3 border-t border-[#292B2D] font-mono text-xs">
            {stage < 8 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 text-[#F2F0EA] font-semibold rounded-lg transition-all btn-tactile"
              >
                <span>NEXT EVENT ({stage}/8)</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C19A5A]" />
              </button>
            )}
            <button
              onClick={resetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151617] hover:bg-[#191A1C] border border-[#292B2D] text-[#9A9A96] rounded-lg transition-all btn-tactile"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </div>
        </div>
      )}

      {/* Analytics & Alerts Region */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Activity Over Time */}
        <div className="lg:col-span-2 bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#292B2D]">
            <div>
              <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                RISK TRAJECTORY (24H)
              </h3>
              <p className="text-[11px] text-[#9A9A96]">Evaluated continuous anomaly index</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#191A1C] text-[#C19A5A] border border-[#292B2D] rounded">
              PEAK: 92 (02:23 AM)
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242628" />
                <XAxis dataKey="time" tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151617', borderColor: '#292B2D', borderRadius: '8px', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
                  labelStyle={{ color: '#9A9A96' }}
                  itemStyle={{ color: '#C19A5A' }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#C19A5A"
                  strokeWidth={2}
                  dot={{ fill: '#C19A5A', r: 2.5 }}
                  activeDot={{ r: 5, fill: '#F2F0EA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#292B2D]">
              <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                RISK DISTRIBUTION
              </h3>
              <span className="text-[10px] font-mono text-[#686A6B]">24 USERS</span>
            </div>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={34}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Low Risk (0-30)'
                          ? '#5F8669'
                          : entry.name === 'Medium Risk (31-60)'
                          ? '#C19A5A'
                          : entry.name === 'High Risk (61-80)'
                          ? '#B67842'
                          : '#A64444'
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#151617', borderColor: '#292B2D', borderRadius: '8px', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
            <div className="p-1.5 bg-[#101112] rounded border border-[#292B2D] flex items-center justify-between">
              <span className="text-[#5F8669]">NORMAL</span>
              <span className="font-bold text-[#F2F0EA]">18</span>
            </div>
            <div className="p-1.5 bg-[#101112] rounded border border-[#292B2D] flex items-center justify-between">
              <span className="text-[#C19A5A]">MED</span>
              <span className="font-bold text-[#F2F0EA]">3</span>
            </div>
            <div className="p-1.5 bg-[#101112] rounded border border-[#292B2D] flex items-center justify-between">
              <span className="text-[#B67842]">HIGH</span>
              <span className="font-bold text-[#F2F0EA]">2</span>
            </div>
            <div className="p-1.5 bg-[#101112] rounded border border-[#292B2D] flex items-center justify-between">
              <span className="text-[#A64444]">CRIT</span>
              <span className="font-bold text-[#F2F0EA]">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Alerts & Continuous Security Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Alerts Table Strip */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#292B2D]">
            <div>
              <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                RECENT ALERTS (TOP 5)
              </h3>
              <p className="text-[11px] text-[#9A9A96]">Ranked by behavioural anomaly weight</p>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-mono text-[#C19A5A] hover:underline"
            >
              VIEW ALL →
            </button>
          </div>
          <div className="space-y-2">
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate(alert.relatedIncidentId ? '/investigation' : '/alerts')}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-[#191A1C] transition-all flex items-center justify-between gap-3 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-[#151617] border-[#A64444]/30 hover:border-[#A64444]/60'
                    : alert.severity === 'HIGH'
                    ? 'bg-[#151617] border-[#B67842]/30 hover:border-[#B67842]/60'
                    : 'bg-[#151617] border-[#292B2D]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 font-mono">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40'
                          : alert.severity === 'HIGH'
                          ? 'bg-[#B67842]/20 text-[#B67842] border border-[#B67842]/40'
                          : 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/40'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-semibold text-[#F2F0EA] truncate">{alert.userName}</span>
                    <span className="text-[10px] text-[#686A6B] ml-auto">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#9A9A96] truncate">{alert.type}</p>
                </div>
                <div className="text-right flex-shrink-0 font-mono">
                  <p
                    className={`text-sm font-bold ${
                      alert.riskScore >= 81 ? 'text-[#A64444]' : alert.riskScore >= 61 ? 'text-[#B67842]' : 'text-[#C19A5A]'
                    }`}
                  >
                    {alert.riskScore}
                  </p>
                  <span className="text-[9px] text-[#686A6B] uppercase">SCORE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continuous Security Loop */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#292B2D]">
            <div>
              <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                CONTINUOUS SECURITY LOOP
              </h3>
              <p className="text-[11px] text-[#9A9A96]">Autonomous 8-stage surveillance cycle</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#191A1C] text-[#5F8669] rounded border border-[#292B2D]">
              CYCLE ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {continuousLoopSteps.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className={`p-2.5 rounded-lg border transition-all duration-300 ${
                  i === activeLoopStep
                    ? 'bg-[#191A1C] border-[#C19A5A]/50 text-[#F2F0EA]'
                    : 'bg-[#101112]/50 border-[#292B2D]/60 opacity-60 text-[#9A9A96]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      i === activeLoopStep ? 'bg-[#C19A5A]/20 text-[#C19A5A]' : 'bg-[#191A1C] text-[#686A6B]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <p className="text-xs font-mono font-semibold truncate">{label}</p>
                </div>
                <p className="text-[10px] text-[#686A6B] line-clamp-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DemoControlPanel />
    </div>
  );
}
