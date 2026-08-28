import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRiskBgColor } from '../../utils/riskEngine';
import AnimatedScore from '../../components/UI/AnimatedScore';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  OPEN: { label: 'OPEN INVESTIGATION', color: 'text-[#A64444]', bg: 'bg-[#A64444]/15', border: 'border-[#A64444]/40' },
  INVESTIGATING: { label: 'INVESTIGATION IN PROGRESS', color: 'text-[#C19A5A]', bg: 'bg-[#C19A5A]/15', border: 'border-[#C19A5A]/40' },
  VERIFICATION_REQUIRED: { label: 'VERIFICATION REQUIRED', color: 'text-[#C19A5A]', bg: 'bg-[#C19A5A]/15', border: 'border-[#C19A5A]/40' },
  RESTRICTED: { label: 'IDENTITY RESTRICTED', color: 'text-[#A64444]', bg: 'bg-[#A64444]/15', border: 'border-[#A64444]/40' },
  TRANSACTION_SUSPENDED: { label: 'WIRE SUSPENDED', color: 'text-[#B67842]', bg: 'bg-[#B67842]/15', border: 'border-[#B67842]/40' },
  ESCALATED: { label: 'ESCALATED TO SOC LEAD', color: 'text-[#C19A5A]', bg: 'bg-[#C19A5A]/15', border: 'border-[#C19A5A]/40' },
  CLOSED: { label: 'CASE RESOLVED', color: 'text-[#5F8669]', bg: 'bg-[#5F8669]/15', border: 'border-[#5F8669]/40' },
};

const timelineStatusColor: Record<string, string> = {
  NORMAL: 'bg-[#5F8669] border-[#5F8669]',
  UNUSUAL: 'bg-[#C19A5A] border-[#C19A5A]',
  SUSPICIOUS: 'bg-[#B67842] border-[#B67842]',
  CRITICAL: 'bg-[#A64444] border-[#A64444]',
};

export default function InvestigationPage() {
  const navigate = useNavigate();
  const { incident } = useApp();

  const status = statusConfig[incident.status] ?? statusConfig['OPEN'];
  const riskBg = getRiskBgColor(incident.riskScore);

  return (
    <div className="p-7 pb-20 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              CASE INVESTIGATION
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 bg-[#191A1C] border border-[#292B2D] rounded text-[#C19A5A] font-bold">
              {incident.caseId}
            </span>
          </div>
          <p className="text-xs text-[#9A9A96]">
            Behaviour anomaly forensic dossier and multi-event correlation evidence
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <div className={`px-3 py-1.5 rounded border text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.border} ${status.color}`}>
            {status.label}
          </div>
          <div className={`px-3 py-1.5 rounded border text-[11px] font-bold uppercase tracking-wider ${riskBg}`}>
            RISK: <AnimatedScore value={incident.riskScore} />/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Identity Profile + Forensic Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identity Profile Strip */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#A64444]/15 border border-[#A64444]/30 flex items-center justify-center text-sm font-mono font-bold text-[#A64444] flex-shrink-0">
                AS
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#F2F0EA]">{incident.userName}</h2>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101112] text-[#9A9A96] border border-[#292B2D]">
                    ID: 88219
                  </span>
                </div>
                <p className="text-xs text-[#9A9A96] mt-0.5">Payment Administrator · Finance Operations</p>
                <p className="text-[11px] font-mono text-[#686A6B] mt-0.5">
                  Normal Baseline: 18/100 (LOW) · Deviation: <span className="text-[#A64444] font-bold">+74 pts</span>
                </p>
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <p className="text-2xl font-bold text-[#A64444]">
                  <AnimatedScore value={incident.riskScore} />
                </p>
                <span className="text-[9px] text-[#686A6B] uppercase block">CURRENT RISK</span>
                <span className="text-[10px] text-[#A64444] font-bold block mt-0.5">CRITICAL</span>
              </div>
            </div>
          </div>

          {/* Sequential Timeline */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#292B2D]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C19A5A]" />
                <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                  INCIDENT CHRONOLOGY TIMELINE
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#686A6B]">
                8-MINUTE WINDOW · {incident.timeline.length} SEQUENTIAL EVENTS
              </span>
            </div>

            <div className="relative pl-2">
              {/* Timeline spine */}
              <div className="absolute left-[17px] top-3 bottom-3 w-[1px] bg-[#292B2D]" />

              <div className="space-y-3.5">
                {incident.timeline.map((event, i) => (
                  <div
                    key={i}
                    className="relative flex gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Node marker */}
                    <div
                      className={`relative z-10 w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold text-[#F2F0EA] ${timelineStatusColor[event.status]} bg-[#101112]`}
                    >
                      {i + 1}
                    </div>

                    {/* Event detail */}
                    <div
                      className={`flex-1 p-3 rounded-lg border font-mono ${
                        event.status === 'CRITICAL'
                          ? 'bg-[#151617] border-[#A64444]/40'
                          : event.status === 'SUSPICIOUS'
                          ? 'bg-[#151617] border-[#B67842]/40'
                          : event.status === 'UNUSUAL'
                          ? 'bg-[#151617] border-[#C19A5A]/30'
                          : 'bg-[#101112] border-[#292B2D]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#686A6B]">{event.time}</span>
                          <span className="text-xs font-bold text-[#F2F0EA] font-sans">{event.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`font-bold ${
                              event.riskDelta > 0 ? 'text-[#A64444]' : 'text-[#5F8669]'
                            }`}
                          >
                            +{event.riskDelta}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                              event.cumulativeRisk >= 81
                                ? 'bg-[#A64444]/20 text-[#A64444]'
                                : event.cumulativeRisk >= 61
                                ? 'bg-[#B67842]/20 text-[#B67842]'
                                : event.cumulativeRisk >= 31
                                ? 'bg-[#C19A5A]/20 text-[#C19A5A]'
                                : 'bg-[#5F8669]/20 text-[#5F8669]'
                            }`}
                          >
                            {event.cumulativeRisk}/100
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#9A9A96] font-sans">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sequence Correlation Box */}
          <div className="bg-[#151617] border border-[#A64444]/30 rounded-xl p-5 shadow-sm space-y-3 font-mono">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#A64444]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                SEQUENTIAL INSIDER THREAT PATTERN
              </h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-[#101112] rounded border border-[#292B2D] text-[11px]">
              {[
                '02:15 AM Login',
                'High-Value #CC-8821',
                'XYZ Holdings Added',
                'Limit 5× Boost',
                '₹18,50,000 Wire',
              ].map((label, i, arr) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#A64444]/15 border border-[#A64444]/30 rounded text-[#F2F0EA]">
                    {label}
                  </span>
                  {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-[#A64444]" />}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#101112] border border-[#292B2D] rounded-lg">
                <span className="text-[#5F8669] font-bold text-[10px] uppercase block">
                  ✓ Isolated Action Check
                </span>
                <p className="text-[#9A9A96] mt-0.5 text-[11px] font-sans">
                  Each individual command is technically permitted by IAM policies.
                </p>
              </div>
              <div className="p-3 bg-[#A64444]/10 border border-[#A64444]/30 rounded-lg">
                <span className="text-[#A64444] font-bold text-[10px] uppercase block">
                  ⚠ Temporal Pattern Analysis
                </span>
                <p className="text-[#F2F0EA] mt-0.5 text-[11px] font-sans">
                  Sequence topology indicates credential compromise or malicious diversion.
                </p>
              </div>
            </div>
          </div>

          {/* Behaviour Intelligence Analysis Narrative */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#292B2D]">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#C19A5A]" />
                <h3 className="text-xs font-mono font-bold text-[#F2F0EA] uppercase tracking-wider">
                  BEHAVIOURAL INTELLIGENCE DIAGNOSTIC
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#191A1C] text-[#C19A5A] border border-[#292B2D] rounded">
                ML CLASSIFIER // AUTOMATED
              </span>
            </div>
            <blockquote className="text-xs text-[#F2F0EA] leading-relaxed border-l-2 border-[#C19A5A] pl-3.5 italic bg-[#101112] p-3 rounded-r-lg">
              "{incident.behaviourAnalysis}"
            </blockquote>
          </div>
        </div>

        {/* Right: Risk Decomposition, Meter & Actions */}
        <div className="space-y-5 font-mono">
          {/* Risk factors decomposition */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#292B2D]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C19A5A]" />
                <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                  RISK DECOMPOSITION
                </h3>
              </div>
              <span className="text-[10px] text-[#686A6B]">
                SUM: +{incident.riskFactors.reduce((s, f) => s + f.score, 0)} PTS
              </span>
            </div>
            <div className="space-y-3">
              {incident.riskFactors.map((factor) => (
                <div key={factor.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F2F0EA] font-medium font-sans">{factor.label}</span>
                    <span className="font-bold text-[#A64444]">+{factor.score}</span>
                  </div>
                  <div className="h-1 bg-[#101112] rounded-full overflow-hidden border border-[#292B2D]">
                    <div
                      className="h-full bg-[#A64444] rounded-full"
                      style={{ width: `${(factor.score / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#686A6B] font-sans">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Radial Risk Gauge */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 text-center shadow-sm">
            <div className="relative w-28 h-28 mx-auto mb-2">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#191A1C" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#A64444"
                  strokeWidth="10"
                  strokeDasharray={`${(incident.riskScore / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <p className="text-2xl font-bold text-[#A64444]">
                  <AnimatedScore value={incident.riskScore} />
                </p>
                <span className="text-[9px] text-[#686A6B]">/ 100</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[#A64444] tracking-wider uppercase">CRITICAL THREAT LEVEL</p>
            <p className="text-[10px] text-[#686A6B] mt-0.5">Enforcement action mandatory</p>
          </div>

          {/* Action Center Links */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-[#C19A5A]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                MITIGATION PROTOCOLS
              </h3>
            </div>
            <button
              onClick={() => navigate('/response')}
              className="w-full py-2.5 px-3 bg-[#A64444] hover:bg-[#8f3a3a] text-white font-bold rounded-lg transition-all text-xs flex items-center justify-between btn-tactile"
            >
              <span>OPEN RESPONSE CENTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/alerts')}
              className="w-full py-2 px-3 bg-[#191A1C] hover:bg-[#242628] text-[#9A9A96] hover:text-[#F2F0EA] font-semibold rounded-lg transition-all text-xs border border-[#292B2D] btn-tactile"
            >
              VIEW LINKED ALERTS
            </button>
            <button
              onClick={() => navigate('/activity')}
              className="w-full py-2 px-3 bg-[#191A1C] hover:bg-[#242628] text-[#9A9A96] hover:text-[#F2F0EA] font-semibold rounded-lg transition-all text-xs border border-[#292B2D] btn-tactile"
            >
              FULL AUDIT TELEMETRY
            </button>
          </div>

          {/* Case Dossier Metadata */}
          <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 shadow-sm text-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#686A6B] block mb-2.5">
              CASE TELEMETRY
            </span>
            <div className="space-y-1.5 text-[11px]">
              {[
                { label: 'CASE ID', value: incident.caseId },
                { label: 'TIMESTAMP', value: '02:23:14 IST' },
                { label: 'ASSIGNED', value: 'SOC Tier 2' },
                { label: 'PRIORITY', value: 'P1 - EMERGENCY' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[#686A6B]">{label}</span>
                  <span className="text-[#F2F0EA] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
