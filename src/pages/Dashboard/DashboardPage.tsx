import { useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  SkipForward,
  User,
  LogIn,
  FolderOpen,
  Gauge,
  CreditCard,
  Users,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { demoState, startDemo, resetDemo, nextStep } = useApp();

  const isDemo = demoState.isRunning;
  const stage = demoState.stage;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* Simulation Controls Bar */}
      <div className="bg-[#1c1c16] border border-[#464742] p-3 rounded-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#e5e2d9] uppercase tracking-wider">
            Behaviour Simulation:
          </span>
          {!isDemo ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => startDemo('suspicious')}
                className="px-3 py-1 bg-[#812627] hover:bg-[#93000a] text-[#ffdad6] font-mono text-[11px] font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3 h-3" />
                <span>Run Threat Scenario</span>
              </button>
              <button
                onClick={() => startDemo('legitimate')}
                className="px-3 py-1 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#c7c7bf] hover:text-[#e5e2d9] font-mono text-[11px] font-semibold uppercase rounded-xs transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3 text-[#e8c178]" />
                <span>Legitimate Maintenance</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#e8c178]">
                Step {stage} of 8: {demoState.scenarioType === 'suspicious' ? 'Amit Sharma (Threat)' : 'Rahul Verma (Legitimate)'}
              </span>
              {stage < 8 && (
                <button
                  onClick={nextStep}
                  className="px-2.5 py-1 bg-[#e8c178] hover:bg-[#ffdea4] text-[#261900] font-mono text-[11px] font-bold uppercase rounded-xs transition-all flex items-center gap-1"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>Next Step</span>
                </button>
              )}
              <button
                onClick={resetDemo}
                className="p-1 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#c7c7bf] rounded-xs"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/investigation')}
            className="px-3 py-1 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#e5e2d9] font-mono text-[11px] uppercase rounded-xs transition-all flex items-center gap-1"
          >
            <span>Case Workspace</span>
            <ArrowRight className="w-3 h-3 text-[#e8c178]" />
          </button>
          <button
            onClick={() => navigate('/response')}
            className="px-3 py-1 bg-[#ffb4ab] hover:bg-white text-[#690005] font-mono text-[11px] font-bold uppercase rounded-xs transition-all flex items-center gap-1"
          >
            <span>Tactical Response</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Risk Scale Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
        {/* Left: Behavior Constellation Canvas (9 cols) */}
        <div className="lg:col-span-9 bg-[#0e0e0a] border border-[#464742] rounded-xs relative overflow-hidden flex flex-col micro-grid">
          {/* Global Risk Badge Overlay */}
          <div className="absolute top-6 left-6 z-30 flex flex-col gap-1.5">
            <div className="bg-[#93000a]/40 text-[#ffdad6] border border-[#ffb4ab]/60 px-3 py-1 font-mono text-[11px] tracking-widest uppercase inline-flex items-center gap-2 rounded-xs shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
              <span>CRITICAL THREAT</span>
            </div>
            <div className="font-mono text-5xl font-bold leading-none text-[#ffb4ab] tracking-tighter">
              {isDemo ? demoState.currentRisk : 92}
              <span className="text-xl text-[#91918a] font-normal"> / 100</span>
            </div>
            <p className="font-mono text-[10px] text-[#c7c7bf] uppercase tracking-wider">
              Anomalous Sequence Detected
            </p>
          </div>

          {/* Canvas Interactive Nodes Area */}
          <div className="flex-1 relative w-full h-full">
            {/* SVG Connecting Threads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Marching Ants Thread */}
              <path
                className="marching-ants"
                d="M 320 280 Q 420 180 500 200 T 640 240 T 680 380 T 520 440 Z"
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="1.5"
              />
              {/* Secondary static lines */}
              <line stroke="#464742" strokeWidth="0.75" x1="320" y1="280" x2="200" y2="380" />
              <line stroke="#464742" strokeWidth="0.75" x1="320" y1="280" x2="240" y2="160" />
            </svg>

            {/* Center Node: AMIT SHARMA */}
            <div
              className="absolute top-[280px] left-[320px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer group"
              onClick={() => navigate('/investigation')}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#ffb4ab] bg-[#35352f] flex items-center justify-center relative shadow-[0_0_20px_rgba(255,180,171,0.2)] group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 rounded-full border border-[#ffb4ab] animate-ping opacity-25" />
                <User className="w-7 h-7 text-[#ffb4ab]" />
              </div>
              <div className="bg-[#0e0e0a] border border-[#464742] px-3 py-1 font-mono text-xs font-bold text-[#e5e2d9] uppercase tracking-wider group-hover:border-[#e8c178] transition-colors">
                AMIT SHARMA
              </div>
            </div>

            {/* Node 1: LOGIN (02:15 AM) */}
            <div className="absolute top-[200px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <div className="w-9 h-9 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shadow-md">
                <LogIn className="w-4 h-4 text-[#c7c7bf]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#c7c7bf] bg-[#0e0e0a] px-1.5 border border-[#464742]">
                02:15 LOGIN
              </span>
            </div>

            {/* Node 2: RESOURCE (02:17 AM) */}
            <div className="absolute top-[240px] left-[640px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <div className="w-9 h-9 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shadow-md">
                <FolderOpen className="w-4 h-4 text-[#c7c7bf]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#c7c7bf] bg-[#0e0e0a] px-1.5 border border-[#464742]">
                02:17 RESOURCE
              </span>
            </div>

            {/* Node 3: LIMIT (02:21 AM) */}
            <div className="absolute top-[380px] left-[680px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <div className="w-9 h-9 rounded-full border border-[#ffb4ab] bg-[#2a2a24] flex items-center justify-center shadow-md">
                <Gauge className="w-4 h-4 text-[#ffb4ab]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffb4ab] bg-[#0e0e0a] px-1.5 border border-[#812627]">
                02:21 5X LIMIT
              </span>
            </div>

            {/* Node 4: PAYMENT (02:23 AM) - Interactive Hover Card */}
            <div
              className="absolute top-[440px] left-[520px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-30 group cursor-pointer"
              onClick={() => navigate('/response')}
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#e8c178] bg-[#35352f] flex items-center justify-center shadow-[0_0_20px_rgba(232,193,120,0.25)] transition-transform group-hover:scale-110">
                <CreditCard className="w-6 h-6 text-[#e8c178]" />
              </div>
              <span className="font-mono text-[11px] font-bold text-[#e8c178] bg-[#0e0e0a] px-2 py-0.5 border border-[#e8c178] uppercase tracking-wider">
                02:23 PAYMENT
              </span>

              {/* Hover Details Popover */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-56 bg-[#3a3933] border border-[#e8c178] p-3 shadow-2xl flex flex-col gap-1 z-40 rounded-xs pointer-events-none">
                <span className="font-mono text-sm font-bold text-[#e5e2d9]">₹18,50,000 INR</span>
                <div className="w-full h-px bg-[#464742] my-1" />
                <span className="font-mono text-[11px] text-[#ffb4ab] font-semibold">
                  Risk Delta: +12 (Total: 92)
                </span>
                <span className="font-mono text-[10px] text-[#c7c7bf] mt-0.5">
                  Target: XYZ Holdings (Unrecognised offshore entity)
                </span>
              </div>
            </div>

            {/* Node 5: BENEFICIARY (02:19 AM) */}
            <div className="absolute top-[380px] left-[200px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <div className="w-9 h-9 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-[#c7c7bf]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#c7c7bf] bg-[#0e0e0a] px-1.5 border border-[#464742]">
                02:19 BENEFICIARY
              </span>
            </div>
          </div>

          {/* Bottom Canvas Strip */}
          <div className="p-3 border-t border-[#464742] bg-[#14140f] flex items-center justify-between text-xs font-mono text-[#91918a]">
            <span>Active Thread: 5 Correlated Events (02:15 – 02:23 AM)</span>
            <span className="text-[#e8c178]">● Marching Ants: High Velocity Anomaly</span>
          </div>
        </div>

        {/* Right: Risk Pressure Scale (3 cols) */}
        <aside className="lg:col-span-3 bg-[#0e0e0a] border border-[#464742] rounded-xs p-5 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs font-bold tracking-widest text-[#c7c7bf] uppercase mb-4 border-b border-[#464742] pb-2">
              RISK PRESSURE SCALE
            </div>

            <div className="flex gap-4 h-64 mt-4">
              {/* Vertical Scale Bar */}
              <div className="w-5 h-full bg-[#20201a] border border-[#464742] rounded-xs overflow-hidden relative flex flex-col justify-end">
                <div className="w-full h-[20%] bg-[#35352f]" />
                <div className="w-full h-[30%] bg-[#e8c178] opacity-70" />
                <div className="w-full h-[42%] bg-[#ffb4ab] animate-pulse" />
                {/* Marker line at 92% */}
                <div className="absolute bottom-[92%] left-0 w-full h-1 bg-[#e5e2d9] shadow-[0_0_8px_white]" />
              </div>

              {/* Factors Breakdown */}
              <div className="flex-1 flex flex-col justify-end gap-2 pb-2">
                {[
                  { score: '+42', label: 'VELOCITY', color: 'text-[#ffb4ab]' },
                  { score: '+20', label: 'TIME ANOMALY', color: 'text-[#e8c178]' },
                  { score: '+15', label: 'RESOURCE', color: 'text-[#e8c178]' },
                  { score: '+10', label: 'LOCATION', color: 'text-[#c7c7bf]' },
                  { score: '+05', label: 'DEVICE', color: 'text-[#c7c7bf]' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between font-mono text-xs border-b border-[#464742]/50 pb-1 ${item.color}`}
                  >
                    <span className="font-bold">{item.score}</span>
                    <span className="text-[10px] text-[#91918a]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#464742]">
            <button
              onClick={() => navigate('/investigation')}
              className="w-full py-2 border border-[#464742] bg-[#20201a] hover:bg-[#2a2a24] text-[#e5e2d9] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              [ VIEW CASE DOSSIER ]
            </button>
            <button
              onClick={() => navigate('/response')}
              className="w-full py-2 bg-[#e5e2df] text-[#1c1c1a] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              [ MITIGATE INCIDENT ]
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
