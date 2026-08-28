import { useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  ArrowRight,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { riskChartData } from '../../data/mockData';
import DemoControlPanel from '../../components/Demo/DemoControlPanel';

const suspiciousSteps = [
  {
    stage: 1,
    time: '10:05 AM',
    title: 'Normal Business Login',
    detail: 'User logged in during business hours from Office Laptop, Delhi.',
    risk: 20,
    delta: '+2',
    status: 'NORMAL',
    color: '#26734D',
    reason: 'Activity is consistent with established 9AM-6PM baseline.',
  },
  {
    stage: 2,
    time: '02:15 AM',
    title: 'Unusual Off-Hours Login',
    detail: 'User accessed payment system outside normal operational band.',
    risk: 40,
    delta: '+20',
    status: 'MEDIUM',
    color: '#A87516',
    reason: 'Login time is a 3.4σ deviation from typical user hours.',
  },
  {
    stage: 3,
    time: '02:17 AM',
    title: 'Unusual Resource Access',
    detail: 'Accessed high-value corporate treasury account #CC-8821.',
    risk: 55,
    delta: '+15',
    status: 'MEDIUM',
    color: '#A87516',
    reason: 'First access to corporate treasury account in 90 days.',
  },
  {
    stage: 4,
    time: '02:19 AM',
    title: 'Beneficiary Modified',
    detail: 'Beneficiary changed from ABC Supplies → XYZ Holdings.',
    risk: 70,
    delta: '+15',
    status: 'HIGH',
    color: '#C65D21',
    reason: 'New unverified beneficiary modified prior to disbursement.',
  },
  {
    stage: 5,
    time: '02:21 AM',
    title: 'Transaction Limit Increased',
    detail: 'Limit raised 5x from ₹5,00,000 → ₹25,00,000.',
    risk: 80,
    delta: '+10',
    status: 'HIGH',
    color: '#C65D21',
    reason: 'Single-analyst limit elevation without second-approver quorum.',
  },
  {
    stage: 6,
    time: '02:23 AM',
    title: 'Large Payment Initiated',
    detail: 'Outward wire transfer of ₹18,50,000 to XYZ Holdings initiated.',
    risk: 92,
    delta: '+12',
    status: 'CRITICAL',
    color: '#C62828',
    reason: 'High-value wire matching 5-step suspicious insider pattern.',
  },
];

const legitimateSteps = [
  {
    stage: 1,
    time: '11:00 PM',
    title: 'Off-Hours Console Access',
    detail: 'Rahul Verma accessed server console at 11:00 PM.',
    risk: 24,
    delta: '+2',
    status: 'NORMAL',
    color: '#26734D',
    reason: 'Session initiated outside standard day shift.',
  },
  {
    stage: 2,
    time: '11:02 PM',
    title: 'Unusual Access Time Flagged',
    detail: 'Evaluating against corporate change calendar...',
    risk: 36,
    delta: '+12',
    status: 'MEDIUM',
    color: '#A87516',
    reason: 'Initial time anomaly detected; validating ITSM ticket.',
  },
  {
    stage: 3,
    time: '11:05 PM',
    title: 'Business Context Verified',
    detail: 'Approved emergency change ticket #CHG-2026-881 confirmed.',
    risk: 30,
    delta: '-6',
    status: 'NORMAL',
    color: '#26734D',
    reason: 'Scheduled maintenance window in place. Anomaly discounted.',
  },
  {
    stage: 4,
    time: '11:10 PM',
    title: 'Configuration Update',
    detail: 'Server updates strictly match approved change scope.',
    risk: 28,
    delta: '-2',
    status: 'NORMAL',
    color: '#26734D',
    reason: 'Commands executed correlate with maintenance runbook.',
  },
  {
    stage: 5,
    time: '11:45 PM',
    title: 'Maintenance Complete',
    detail: 'Session terminated normally. No policy violations.',
    risk: 22,
    delta: '-6',
    status: 'NORMAL',
    color: '#26734D',
    reason: 'Legitimate exception confirmed — risk score normalized.',
  },
];

const activeThreatsList = [
  {
    severity: 'CRITICAL',
    name: 'Amit Sharma',
    role: 'Payment Administrator',
    description: 'Suspicious payment sequence (#CC-8821)',
    risk: 92,
    color: '#C62828',
    actionPath: '/investigation',
  },
  {
    severity: 'HIGH',
    name: 'Arjun Kapoor',
    role: 'Senior Database Admin',
    description: 'Bulk customer table export (14,200 rows)',
    risk: 74,
    color: '#C65D21',
    actionPath: '/users',
  },
  {
    severity: 'MEDIUM',
    name: 'Rahul Verma',
    role: 'System Administrator',
    description: 'Off-hours SSH session (Ticket Verified)',
    risk: 48,
    color: '#A87516',
    actionPath: '/activity',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { demoState, startDemo, resetDemo, nextStep } = useApp();

  const isDemo = demoState.isRunning;
  const stage = demoState.stage;
  const scenarioType = demoState.scenarioType;
  const steps = scenarioType === 'legitimate' ? legitimateSteps : suspiciousSteps;
  const displayedSteps = steps.filter((s) => s.stage <= stage && demoState.isRunning);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Compact Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'SYSTEM STATUS', value: 'Operational', highlight: 'text-[#26734D]' },
          { label: 'LAST ANALYSIS', value: 'Just now', highlight: 'text-[#171717]' },
          { label: 'ACTIVE INCIDENTS', value: '3 Active', highlight: 'text-[#C62828]' },
          { label: 'PROTECTED IDENTITIES', value: '24 Identities', highlight: 'text-[#171717]' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-[#E5E3DE] rounded-xl px-4 py-3 shadow-2xs"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              {item.label}
            </p>
            <p className={`text-xs font-semibold mt-0.5 ${item.highlight}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 2. Key Metrics Row */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E3DE]">
          {[
            { label: 'Privileged identities', value: '24' },
            { label: 'Active sessions', value: '11' },
            {
              label: 'Suspicious activities',
              value: isDemo && scenarioType === 'suspicious' ? String(7 + Math.max(0, stage - 1)) : '7',
            },
            {
              label: 'Critical incidents',
              value: isDemo && scenarioType === 'suspicious' && stage >= 6 ? '4' : '3',
            },
            { label: 'Transactions analysed', value: '1,284' },
            {
              label: 'Average risk score',
              value: isDemo && scenarioType === 'suspicious' ? `${Math.round(34 + stage * 3)}/100` : '34/100',
            },
          ].map((m, idx) => (
            <div key={m.label} className={idx === 0 ? '' : 'pt-3 sm:pt-0 sm:pl-6'}>
              <p className="text-2xl font-bold tracking-tight text-[#171717]">{m.value}</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Demo Simulation Triggers (Clean Charcoal & Neutral Buttons) */}
      {!isDemo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 flex items-center justify-between shadow-2xs hover:border-[#171717]/40 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider">
                  Primary Threat Scenario
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171717] mt-1">
                Suspicious Payment Sequence (Amit Sharma)
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Simulates 5-step off-hours wire fraud elevating risk from 18 → 92.
              </p>
            </div>
            <button
              onClick={() => startDemo('suspicious')}
              className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#2E2E2E] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Scenario</span>
            </button>
          </div>

          <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 flex items-center justify-between shadow-2xs hover:border-[#171717]/40 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#26734D] uppercase tracking-wider">
                  Context Validation
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171717] mt-1">
                Legitimate Emergency Maintenance (Rahul Verma)
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Demonstrates false-positive mitigation using change ticket cross-referencing.
              </p>
            </div>
            <button
              onClick={() => startDemo('legitimate')}
              className="flex items-center gap-2 px-4 py-2 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] text-xs font-semibold rounded-lg transition-all flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 text-[#26734D]" />
              <span>Run Scenario</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Simulation Panel */
        <div className="bg-white border border-[#171717] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E3DE]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C62828] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Running Behavioural Simulation:
                </span>
                <span className="text-xs font-semibold text-[#6B6B6B]">
                  {scenarioType === 'suspicious' ? 'Amit Sharma (Payment Admin)' : 'Rahul Verma (SysAdmin)'}
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                {scenarioType === 'suspicious'
                  ? 'High-value treasury account access & unauthorized payee modification'
                  : 'Scheduled emergency server maintenance with verified ITSM context'}
              </p>
            </div>

            {/* Horizontal Risk Bar */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-[#6B6B6B]">Current Risk Score:</span>
                <span className={`ml-2 text-base font-bold ${
                  demoState.currentRisk >= 81 ? 'text-[#C62828]' :
                  demoState.currentRisk >= 61 ? 'text-[#C65D21]' :
                  demoState.currentRisk >= 31 ? 'text-[#A87516]' : 'text-[#26734D]'
                }`}>
                  {demoState.currentRisk} / 100
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {stage < 8 && (
                  <button
                    onClick={nextStep}
                    className="px-3 py-1.5 bg-[#171717] hover:bg-[#2E2E2E] text-white text-xs font-semibold rounded-md shadow-2xs"
                  >
                    Next Event →
                  </button>
                )}
                <button
                  onClick={resetDemo}
                  className="p-1.5 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#6B6B6B] rounded-md"
                  title="Reset Demo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Events Reveal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedSteps.map((step) => (
              <div
                key={step.stage}
                className={`p-3.5 rounded-lg border text-xs transition-all ${
                  step.stage === stage
                    ? 'bg-[#F6F5F2] border-[#171717]'
                    : 'bg-white border-[#E5E3DE] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-[#6B6B6B] mb-1">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-[#8A8A8A]" /> {step.time}
                  </span>
                  <span
                    className="font-bold text-[11px]"
                    style={{ color: step.color }}
                  >
                    {step.delta} ({step.risk}/100)
                  </span>
                </div>
                <p className="font-semibold text-[#171717]">{step.title}</p>
                <p className="text-[#6B6B6B] text-[11px] mt-0.5">{step.detail}</p>
              </div>
            ))}
          </div>

          {/* Navigation Prompt after Threat Detection */}
          {stage >= 6 && scenarioType === 'suspicious' && (
            <div className="p-3.5 bg-[#C62828]/5 border border-[#C62828]/25 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider">
                  🚨 Critical Threat Sequence Correlated
                </span>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  5 actions combined indicate intentional privileged account misuse.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/investigation')}
                  className="px-3 py-1.5 bg-white border border-[#E5E3DE] text-[#171717] text-xs font-semibold rounded-md hover:bg-[#F6F5F2]"
                >
                  View Case
                </button>
                <button
                  onClick={() => navigate('/response')}
                  className="px-3 py-1.5 bg-[#C62828] hover:bg-[#A31D1D] text-white text-xs font-semibold rounded-md shadow-2xs"
                >
                  Mitigate Incident →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Main Charts & Active Threats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: BEHAVIOUR RISK Line Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DE]">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Behaviour Risk Activity
              </h2>
              <p className="text-xs text-[#6B6B6B]">Continuous telemetry risk trajectory over the last 24 hours</p>
            </div>
            <span className="text-xs font-semibold text-[#26734D] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 98.4% Normal baseline
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DE" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={{ stroke: '#E5E3DE' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E3DE',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                  labelStyle={{ color: '#171717', fontWeight: 600 }}
                  itemStyle={{ color: '#171717' }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#171717"
                  strokeWidth={2}
                  dot={{ fill: '#171717', r: 3 }}
                  activeDot={{ r: 5, fill: '#C62828' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#E5E3DE] flex items-center justify-between text-xs text-[#6B6B6B]">
            <span>Low Risk Band (0–30)</span>
            <span>Medium Variance (31–60)</span>
            <span>High Risk (61–80)</span>
            <span className="text-[#C62828] font-semibold">Critical Threat (81–100)</span>
          </div>
        </div>

        {/* Right: ACTIVE THREATS Table */}
        <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DE]">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Active Threats
              </h2>
              <p className="text-xs text-[#6B6B6B]">Prioritised by assessed risk score</p>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs text-[#6B6B6B] hover:text-[#171717] font-medium"
            >
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {activeThreatsList.map((threat) => (
              <div
                key={threat.name}
                onClick={() => navigate(threat.actionPath)}
                className="p-3 rounded-lg border border-[#E5E3DE] hover:border-[#171717]/40 bg-[#FAFAF8] cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      backgroundColor: `${threat.color}15`,
                      color: threat.color,
                      border: `1px solid ${threat.color}30`,
                    }}
                  >
                    {threat.severity}
                  </span>
                  <span className="text-xs font-bold text-[#171717]">{threat.risk}/100</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#171717]">{threat.name}</p>
                  <p className="text-[11px] text-[#6B6B6B] truncate">{threat.description}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] pt-1">
                  <span>{threat.role}</span>
                  <ChevronRight className="w-3 h-3 text-[#8A8A8A]" />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/response')}
            className="w-full py-2 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open Incident Response Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <DemoControlPanel />
    </div>
  );
}
