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

const statusColors: Record<string, string> = {
  NORMAL: 'bg-green-500/10 border-green-500/30 text-green-400',
  MEDIUM: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  HIGH: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  CRITICAL: 'bg-red-500/10 border-red-500/30 text-red-400',
};

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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Sync loop step with demo stage
  useEffect(() => {
    if (demoState.isRunning) {
      const loopMap: Record<number, number> = { 1: 0, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 };
      if (loopMap[stage] !== undefined) setActiveLoopStep(loopMap[stage]);
    }
  }, [stage, demoState.isRunning]);

  const kpiCards = [
    { label: 'Total Privileged Users', value: '24', icon: Users, color: 'blue' },
    { label: 'Active Sessions', value: '11', icon: Activity, color: 'cyan' },
    {
      label: 'Suspicious Activities',
      value: isDemo && scenarioType === 'suspicious' ? String(7 + Math.max(0, stage - 1)) : '7',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      label: 'High Risk Alerts',
      value: isDemo && scenarioType === 'suspicious' && stage >= 6 ? '4' : '3',
      icon: AlertCircle,
      color: 'red',
    },
    { label: 'Transactions Monitored', value: '1,284', icon: CreditCard, color: 'purple' },
    {
      label: 'Average Risk Score',
      value: isDemo && scenarioType === 'suspicious' ? `${Math.round(34 + stage * 2.5)}/100` : '34/100',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  const unresolvedAlerts = alerts.filter((a) => a.status !== 'RESOLVED').slice(0, 5);

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Security Overview</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
              SOC Console
            </span>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            Real-time monitoring of privileged account behaviour · Continuous Behaviour Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* Core Principle Callout */}
      <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Core Security Principle</p>
            <p className="text-sm font-semibold text-slate-100">
              "Authorised Access ≠ Authorised Behaviour" — Traditional PAM checks permission; SENTINEL evaluates behaviour trust.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Scenario Launchers */}
      {!isDemo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => startDemo('suspicious')}
            className="group text-left p-5 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900 border border-red-500/40 hover:border-red-500/80 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-red-500/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-wide">RUN DEMO SCENARIO</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Suspicious Payment Activity Sequence (Amit Sharma: 18 → 92 Risk)
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all text-red-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </button>

          <button
            onClick={() => startDemo('legitimate')}
            className="group text-left p-5 bg-gradient-to-br from-green-950/30 via-slate-900 to-slate-900 border border-green-500/40 hover:border-green-500/80 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-green-500/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-wide">RUN LEGITIMATE SCENARIO</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                    False Positive Test
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Emergency Maintenance Exception (Rahul Verma: Business Context Validation)
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all text-green-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </button>
        </div>
      )}

      {/* Active Demo Panel */}
      {isDemo && (
        <div
          className={`rounded-2xl border p-6 transition-all duration-300 shadow-2xl ${
            scenarioType === 'legitimate'
              ? 'bg-green-950/20 border-green-500/40 shadow-green-950/20'
              : stage >= 6
              ? 'bg-red-950/20 border-red-500/50 shadow-red-950/20'
              : stage >= 4
              ? 'bg-orange-950/20 border-orange-500/40 shadow-orange-950/20'
              : 'bg-blue-950/20 border-blue-500/40 shadow-blue-950/20'
          }`}
        >
          {/* Demo Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-3.5 h-3.5 rounded-full animate-ping ${
                  scenarioType === 'legitimate' ? 'bg-green-400' : stage >= 6 ? 'bg-red-400' : 'bg-blue-400'
                }`}
              />
              <div>
                <h2 className="text-lg font-bold text-white">
                  {scenarioType === 'suspicious'
                    ? 'Demo Scenario: Suspicious Behaviour Detection'
                    : 'Demo Scenario: Legitimate Exceptional Activity (False Positive Reduction)'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {scenarioType === 'suspicious' ? (
                    <>
                      Target: <span className="text-white font-semibold">Amit Sharma</span> · Role:{' '}
                      <span className="text-slate-300">Payment Administrator</span> · Normal Baseline:{' '}
                      <span className="text-green-400 font-bold">18/100 (🟢 Normal)</span>
                    </>
                  ) : (
                    <>
                      Target: <span className="text-white font-semibold">Rahul Verma</span> · Role:{' '}
                      <span className="text-slate-300">System Administrator</span> · Context:{' '}
                      <span className="text-blue-400 font-semibold">Scheduled Emergency Maintenance</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Live Score Display */}
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 self-start md:self-auto">
              <div className="text-right">
                <p
                  className={`text-2xl font-black ${
                    demoState.currentRisk >= 81
                      ? 'text-red-400'
                      : demoState.currentRisk >= 61
                      ? 'text-orange-400'
                      : demoState.currentRisk >= 31
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >
                  {demoState.currentRisk}/100
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dynamic Risk Score</p>
              </div>
              <div
                className={`text-xs px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wide border ${
                  demoState.currentRisk >= 81
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : demoState.currentRisk >= 61
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : demoState.currentRisk >= 31
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
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

          {/* Dynamic Steps Timeline */}
          <div className="space-y-2.5 mb-5">
            {displayedSteps.map((step, i) => (
              <div
                key={step.stage}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 ${
                  step.stage === stage
                    ? statusColors[step.status] + ' ring-1 ring-white/10 scale-[1.008]'
                    : 'bg-slate-900/60 border-slate-800 opacity-75'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                    step.color === 'green'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : step.color === 'yellow'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : step.color === 'orange'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {step.time}
                    </div>
                    <span className="text-sm font-bold text-white">{step.title}</span>
                    <span
                      className={`ml-auto text-xs font-black px-2 py-0.5 rounded-md ${
                        step.color === 'green'
                          ? 'bg-green-500/20 text-green-400'
                          : step.color === 'yellow'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : step.color === 'orange'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      Risk: {step.risk}/100 ({step.delta})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{step.detail}</p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      step.color === 'green'
                        ? 'text-green-400'
                        : step.color === 'yellow'
                        ? 'text-yellow-400'
                        : step.color === 'orange'
                        ? 'text-orange-400'
                        : 'text-red-400'
                    }`}
                  >
                    💡 "{step.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sequence Correlation Showcase for Suspicious Scenario */}
          {isDemo && stage >= 6 && scenarioType === 'suspicious' && (
            <div className="mt-5 p-5 bg-red-950/30 border border-red-500/50 rounded-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-extrabold text-red-400 tracking-wide">
                  Suspicious Behaviour Sequence Detected
                </h3>
              </div>

              {/* Visual Sequence Map */}
              <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-slate-900/80 rounded-xl border border-red-500/20">
                {[
                  'Login at unusual time (2:15 AM)',
                  'Unusual account access',
                  'Beneficiary changed',
                  'Limit increased 5x',
                  'Large payment (₹18.5L)',
                ].map((item, idx, arr) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 font-semibold">
                      {item}
                    </span>
                    {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-red-400" />}
                  </div>
                ))}
              </div>

              {/* Why is this suspicious explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                <div className="p-3.5 bg-slate-900/80 border border-slate-700 rounded-xl">
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                    ✓ Individual Actions
                  </p>
                  <p className="text-xs text-slate-300">
                    Each action alone is technically authorized in the user's role permissions.
                  </p>
                </div>
                <div className="p-3.5 bg-red-900/30 border border-red-500/40 rounded-xl">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                    ⚠ Combined Behaviour
                  </p>
                  <p className="text-xs text-red-200 font-semibold">
                    When chained together, they form a high-risk sequential insider threat pattern.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/investigation')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/30"
                >
                  Open Investigation Case (INC-2026-0091) <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/response')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700"
                >
                  Go to Response Center
                </button>
              </div>
            </div>
          )}

          {/* Legitimate Scenario Explanation */}
          {isDemo && stage >= 5 && scenarioType === 'legitimate' && (
            <div className="mt-5 p-5 bg-green-950/30 border border-green-500/50 rounded-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-base font-bold text-green-400">
                  Legitimate Exceptional Activity — False Positive Prevented
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                "The activity is unusual but matches an approved business context (Emergency Maintenance #CHG-2026-881).
                Risk remained normal."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                  <span className="text-yellow-400 font-bold">Unusual Action:</span>
                  <p className="text-slate-400 mt-0.5">11:00 PM late night system configuration access.</p>
                </div>
                <div className="p-3 bg-green-950/40 border border-green-500/30 rounded-xl">
                  <span className="text-green-400 font-bold">Business Context Match:</span>
                  <p className="text-slate-300 mt-0.5">Scheduled IT change window approved by leadership.</p>
                </div>
              </div>
            </div>
          )}

          {/* Control Actions */}
          <div className="mt-5 flex items-center gap-3 pt-3 border-t border-slate-800">
            {stage < 8 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Next Step ({stage}/8) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Analytics & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Activity Over Time */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Risk Activity Over Time</h3>
              <p className="text-xs text-slate-400">24-hour privileged action risk trajectory</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-mono">
              Peak: 92 (02:23 AM)
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ fill: '#0284c7', r: 3 }}
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Risk Distribution</h3>
            <p className="text-xs text-slate-400 mb-2">24 Active Privileged Users by Category</p>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={58}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 truncate">{item.name}</p>
                  <p className="text-xs font-bold text-white">{item.value} users</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Alerts & Continuous Security Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Alerts Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Recent Alerts (Top 5)</h3>
              <p className="text-xs text-slate-400">Prioritized by behavioural severity</p>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2.5">
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate(alert.relatedIncidentId ? '/investigation' : '/alerts')}
                className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all flex items-start justify-between gap-3 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-500/10 border-red-500/30'
                    : alert.severity === 'HIGH'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : alert.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{alert.userName}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">{alert.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-black ${
                      alert.riskScore >= 81 ? 'text-red-400' : alert.riskScore >= 61 ? 'text-orange-400' : 'text-yellow-400'
                    }`}
                  >
                    {alert.riskScore}
                  </p>
                  <p className="text-[10px] text-slate-500">Risk</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continuous Security Loop */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Continuous Security Loop</h3>
              <p className="text-xs text-slate-400">Autonomous 8-stage behaviour surveillance model</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
              Active Loop
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {continuousLoopSteps.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  i === activeLoopStep
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/40 border-slate-700/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      i === activeLoopStep ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p
                    className={`text-xs font-bold truncate ${
                      i === activeLoopStep ? 'text-blue-300' : 'text-slate-300'
                    }`}
                  >
                    {label}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DemoControlPanel />
    </div>
  );
}
