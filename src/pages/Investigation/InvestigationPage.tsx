import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  User,
  History,
  LogIn,
  FolderOpen,
  Edit3,
  Repeat,
  ArrowRight,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InvestigationPage() {
  const navigate = useNavigate();
  const { incident } = useApp();

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* Top Workspace Header (Incident Context) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c1c16] border border-[#464742] p-4 rounded-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#e5e2d9] px-2 py-0.5 bg-[#20201a] border border-[#464742]">
              {incident.caseId}
            </span>
            <div className="h-3 w-px bg-[#464742]" />
            <span className="font-mono text-xs font-bold text-[#ffb4ab] tracking-widest uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              CRITICAL THREAT
            </span>
          </div>
          <h1 className="font-mono text-lg font-bold text-[#e5e2d9] flex items-center gap-2 mt-0.5">
            <User className="w-4 h-4 text-[#c7c7bf]" />
            {incident.userName}
            <span className="text-[#91918a] text-xs font-normal ml-2">SUBJECT ID: U-99281-AS · PAM LEVEL 4</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/response')}
            className="px-4 py-2 border border-[#464742] bg-[#20201a] hover:bg-[#2a2a24] text-[#e5e2d9] font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            [ ESCALATE ]
          </button>
          <button
            onClick={() => navigate('/response')}
            className="px-4 py-2 bg-[#e5e2df] text-[#1c1c1a] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-sm"
          >
            [ LOCK ACCOUNT / MITIGATE ]
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Incident Story Timeline (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-[#1c1c16] border border-[#464742] p-6 relative overflow-hidden rounded-xs flex flex-col">
          {/* Tactical Corner Marks */}
          <div className="tactical-corner-tl" />
          <div className="tactical-corner-br" />

          {/* Title Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#464742]">
            <h2 className="font-mono text-xs font-bold tracking-widest text-[#e5e2d9] uppercase flex items-center gap-2">
              <History className="w-4 h-4 text-[#e8c178]" />
              INCIDENT STORY // THE BEHAVIORAL THREAD
            </h2>
            <span className="font-mono text-[11px] text-[#91918a]">TIMEFRAME: -8 MINS</span>
          </div>

          {/* Correlation Banner */}
          <div className="mb-6 p-3 border border-[#ffb4ab]/40 bg-[#93000a]/15 flex items-start gap-3 rounded-xs">
            <ShieldAlert className="w-4 h-4 text-[#ffb4ab] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-mono text-xs font-bold text-[#ffb4ab] uppercase mb-0.5">
                CORRELATION DETECTED
              </h3>
              <p className="text-xs text-[#c7c7bf]">
                5 correlated events within 8 minutes. Significant deviation from historical 90-day baseline.
              </p>
            </div>
          </div>

          {/* Vertical Timeline Nodes */}
          <div className="relative pl-3 space-y-6 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-px before:border-l before:border-dashed before:border-[#ffb4ab]/50">
            {/* Node 1 */}
            <div className="relative flex gap-4 z-10 group">
              <div className="w-7 h-7 rounded-full bg-[#20201a] border border-[#464742] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#e8c178] transition-colors">
                <LogIn className="w-3.5 h-3.5 text-[#c7c7bf]" />
              </div>
              <div className="flex-1 bg-[#20201a] border border-[#464742] p-3 rounded-xs group-hover:border-[#e8c178] transition-colors">
                <div className="flex justify-between items-center mb-1 font-mono text-xs">
                  <span className="font-bold text-[#e5e2d9]">01. UNUSUAL LOGIN</span>
                  <span className="text-[#91918a]">02:15:04Z</span>
                </div>
                <p className="text-xs text-[#c7c7bf]">
                  Authentication successful outside normal 9AM–6PM shift window. Novel device fingerprint.
                </p>
              </div>
            </div>

            {/* Node 2 */}
            <div className="relative flex gap-4 z-10 group">
              <div className="w-7 h-7 rounded-full bg-[#20201a] border border-[#464742] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#e8c178] transition-colors">
                <FolderOpen className="w-3.5 h-3.5 text-[#c7c7bf]" />
              </div>
              <div className="flex-1 bg-[#20201a] border border-[#464742] p-3 rounded-xs group-hover:border-[#e8c178] transition-colors">
                <div className="flex justify-between items-center mb-1 font-mono text-xs">
                  <span className="font-bold text-[#e5e2d9]">02. RESOURCE ACCESS</span>
                  <span className="text-[#91918a]">02:17:22Z</span>
                </div>
                <p className="text-xs text-[#c7c7bf]">
                  Accessed corporate treasury account #CC-8821 without standard navigation path.
                </p>
              </div>
            </div>

            {/* Node 3 */}
            <div className="relative flex gap-4 z-10 group">
              <div className="w-7 h-7 rounded-full bg-[#5f4504]/40 border border-[#e8c178] flex items-center justify-center shrink-0 mt-0.5">
                <Edit3 className="w-3.5 h-3.5 text-[#e8c178]" />
              </div>
              <div className="flex-1 bg-[#20201a] border border-[#e8c178]/50 p-3 rounded-xs">
                <div className="flex justify-between items-center mb-1 font-mono text-xs">
                  <span className="font-bold text-[#e8c178]">03. BENEFICIARY MODIFIED</span>
                  <span className="text-[#e8c178]">02:19:10Z</span>
                </div>
                <p className="text-xs text-[#c7c7bf]">
                  Pre-existing vendor 'ABC Supplies' modified to unrecognised beneficiary 'XYZ Holdings'.
                </p>
              </div>
            </div>

            {/* Node 4 */}
            <div className="relative flex gap-4 z-10 group">
              <div className="w-7 h-7 rounded-full bg-[#93000a]/40 border border-[#ffb4ab] flex items-center justify-center shrink-0 mt-0.5">
                <Repeat className="w-3.5 h-3.5 text-[#ffb4ab]" />
              </div>
              <div className="flex-1 bg-[#20201a] border border-[#ffb4ab]/50 p-3 rounded-xs">
                <div className="flex justify-between items-center mb-1 font-mono text-xs">
                  <span className="font-bold text-[#ffb4ab]">04. LIMIT CHANGED (5X)</span>
                  <span className="text-[#ffb4ab]">02:21:45Z</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs mt-1">
                  <span className="text-[#91918a] line-through">₹5,00,000</span>
                  <ArrowRight className="w-3 h-3 text-[#91918a]" />
                  <span className="text-[#ffb4ab] font-bold">₹25,00,000</span>
                </div>
                <p className="text-xs text-[#c7c7bf] mt-1 pt-1 border-t border-[#464742]/40">
                  Single-analyst authorization elevation without second approver quorum.
                </p>
              </div>
            </div>

            {/* Node 5 */}
            <div className="relative flex gap-4 z-10 group">
              <div className="w-7 h-7 rounded-full bg-[#ffb4ab] flex items-center justify-center shrink-0 mt-0.5 relative shadow-[0_0_12px_rgba(255,180,171,0.6)]">
                <span className="font-mono text-xs font-bold text-[#690005]">!</span>
              </div>
              <div className="flex-1 bg-[#20201a] border-2 border-[#ffb4ab] p-4 rounded-xs relative">
                <div className="flex justify-between items-center mb-1 font-mono text-xs">
                  <span className="font-bold text-[#ffb4ab] uppercase">05. PAYMENT INITIATED</span>
                  <span className="text-[#ffb4ab] font-bold">02:23:01Z</span>
                </div>
                <h4 className="font-mono text-xl font-bold text-[#e5e2d9] my-1">₹18,50,000 INR</h4>
                <p className="text-xs text-[#c7c7bf]">
                  Wire transfer to 'XYZ Holdings' pending settlement gateway.
                </p>
                <div className="mt-3 pt-2 border-t border-[#464742] flex justify-end">
                  <button
                    onClick={() => navigate('/response')}
                    className="px-3 py-1 bg-[#93000a] text-[#ffdad6] font-mono text-[11px] font-bold uppercase hover:bg-[#ffb4ab] hover:text-[#690005] transition-colors rounded-xs"
                  >
                    HALT TRANSACTION →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Context & Spatial Divergence (Spans 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Top Widget: Risk Posture */}
          <div className="bg-[#1c1c16] border border-[#464742] p-5 rounded-xs space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#c7c7bf] border-b border-[#464742] pb-2">
              RISK POSTURE ATTRIBUTION
            </h3>

            {/* Risk Pressure Scale */}
            <div className="flex items-end gap-1.5 h-8">
              <div className="flex-1 bg-[#20201a] h-[20%] border-t border-[#464742]" />
              <div className="flex-1 bg-[#20201a] h-[40%] border-t border-[#464742]" />
              <div className="flex-1 bg-[#20201a] h-[60%] border-t border-[#464742]" />
              <div className="flex-1 bg-[#5f4504] h-[80%] border-t border-[#e8c178]" />
              <div className="flex-1 bg-[#93000a] h-[100%] border-t border-[#ffb4ab] animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 font-mono">
              <div className="p-2.5 bg-[#20201a] border border-[#464742] rounded-xs">
                <span className="text-[10px] text-[#91918a] uppercase block">SCORE</span>
                <span className="text-xl font-bold text-[#ffb4ab]">92 / 100</span>
              </div>
              <div className="p-2.5 bg-[#20201a] border border-[#464742] rounded-xs">
                <span className="text-[10px] text-[#91918a] uppercase block">VELOCITY</span>
                <span className="text-xl font-bold text-[#e5e2d9]">+42 p/hr</span>
              </div>
            </div>
          </div>

          {/* Bottom Widget: Spatial Divergence Map */}
          <div className="flex-1 bg-[#1c1c16] border border-[#464742] p-5 rounded-xs flex flex-col space-y-3">
            <div className="flex justify-between items-center border-b border-[#464742] pb-2 font-mono text-xs">
              <span className="font-bold text-[#c7c7bf] uppercase">SPATIAL DIVERGENCE</span>
              <span className="text-[10px] text-[#ffb4ab] bg-[#93000a]/30 px-2 py-0.5 border border-[#ffb4ab]/30">
                NORMAL vs CURRENT
              </span>
            </div>

            {/* Dark Forensic Map Simulation */}
            <div className="flex-1 min-h-[220px] bg-[#0e0e0a] border border-[#464742] rounded-xs relative overflow-hidden p-4 micro-grid">
              {/* Historical Pattern */}
              <div className="absolute top-[25%] left-[30%] w-24 h-24 border border-[#464742] rounded-full flex items-center justify-center opacity-60">
                <div className="w-12 h-12 bg-[#20201a] rounded-full border border-[#464742] animate-pulse" />
                <span className="absolute -top-5 font-mono text-[9px] text-[#91918a] whitespace-nowrap">
                  HISTORICAL BASELINE (Delhi)
                </span>
              </div>

              {/* Anomaly Origin */}
              <div className="absolute top-[55%] left-[65%] w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border border-[#ffb4ab]/50 rounded-full animate-ping" />
                <div className="w-4 h-4 bg-[#ffb4ab] rounded-full shadow-[0_0_12px_rgba(255,180,171,0.8)]" />
                <span className="absolute -bottom-6 font-mono text-[9px] text-[#ffb4ab] flex items-center gap-1 bg-[#20201a] px-1.5 py-0.5 border border-[#ffb4ab]/40 whitespace-nowrap">
                  <MapPin className="w-2.5 h-2.5" /> CURRENT ORIGIN
                </span>
              </div>

              {/* Vector line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="38%"
                  y1="35%"
                  x2="68%"
                  y2="62%"
                  stroke="#ffb4ab"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="marching-ants"
                />
              </svg>

              {/* Stats overlay */}
              <div className="absolute bottom-3 left-3 p-2 bg-[#0e0e0a]/90 border border-[#464742] font-mono text-[10px]">
                <span className="text-[#91918a] block">DISTANCE DELTA:</span>
                <span className="text-[#e5e2d9] font-bold">~420km / 80ms latency anomaly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
