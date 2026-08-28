import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Clock,
  ChevronRight,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRiskBgColor } from '../../utils/riskEngine';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  OPEN: { label: '🔴 Open', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' },
  INVESTIGATING: { label: '🔍 Investigating', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  VERIFICATION_REQUIRED: { label: '🟡 Verification Required', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  RESTRICTED: { label: '🔴 Restricted', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' },
  TRANSACTION_SUSPENDED: { label: '🛑 Transaction Suspended', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
  ESCALATED: { label: '🚨 Escalated', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/40' },
  CLOSED: { label: '✅ Closed', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/40' },
};

const timelineStatusColor: Record<string, string> = {
  NORMAL: 'bg-green-500 border-green-500',
  UNUSUAL: 'bg-yellow-500 border-yellow-500',
  SUSPICIOUS: 'bg-orange-500 border-orange-500',
  CRITICAL: 'bg-red-500 border-red-500',
};

export default function InvestigationPage() {
  const navigate = useNavigate();
  const { incident } = useApp();

  const status = statusConfig[incident.status] ?? statusConfig['OPEN'];
  const riskBg = getRiskBgColor(incident.riskScore);

  return (
    <div className="p-6 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Investigation</h1>
            <span className="text-sm font-mono px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
              {incident.caseId}
            </span>
          </div>
          <p className="text-slate-400 text-sm">Detailed behavioural analysis and evidence timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${status.bg} ${status.border} ${status.color}`}>
            {status.label}
          </div>
          <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${riskBg}`}>
            Risk: {incident.riskScore}/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left: User + Timeline */}
        <div className="col-span-2 space-y-4">
          {/* User card */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-lg font-bold text-red-400">
                AS
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{incident.userName}</h2>
                <p className="text-slate-400">Payment Administrator · Finance Operations</p>
                <p className="text-xs text-slate-500 mt-0.5">Normal Risk: 18/100 · Baseline: 🟢 Normal</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-bold text-red-400">{incident.riskScore}</p>
                <p className="text-xs text-slate-500">Current Risk</p>
                <p className="text-xs text-red-400 font-semibold mt-0.5">CRITICAL</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Incident Timeline</h3>
              <span className="text-xs text-slate-500 ml-auto">8-minute window · {incident.timeline.length} events</span>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700" />

              <div className="space-y-4">
                {incident.timeline.map((event, i) => (
                  <div key={i} className="relative flex gap-4">
                    {/* Dot */}
                    <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timelineStatusColor[event.status]} bg-slate-900`}>
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-3 rounded-xl border ${
                      event.status === 'CRITICAL' ? 'bg-red-500/5 border-red-500/30' :
                      event.status === 'SUSPICIOUS' ? 'bg-orange-500/5 border-orange-500/30' :
                      event.status === 'UNUSUAL' ? 'bg-yellow-500/5 border-yellow-500/30' :
                      'bg-slate-800/50 border-slate-700/50'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{event.time}</span>
                          <span className="text-sm font-semibold text-white">{event.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            event.riskDelta > 0 ? 'text-red-400' : 'text-green-400'
                          }`}>+{event.riskDelta}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            event.cumulativeRisk >= 81 ? 'bg-red-500/20 text-red-400' :
                            event.cumulativeRisk >= 61 ? 'bg-orange-500/20 text-orange-400' :
                            event.cumulativeRisk >= 31 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>{event.cumulativeRisk}/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sequence Correlation */}
          <div className="bg-slate-900 border border-red-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-white">Suspicious Behaviour Sequence</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {[
                'Login at 2:15 AM',
                'Unusual account access',
                'Beneficiary changed',
                'Limit increased 5×',
                'Large payment ₹18.5L',
              ].map((label, i, arr) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 font-medium">
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                <p className="text-green-400 font-semibold text-xs mb-1">✓ Individual Actions</p>
                <p className="text-slate-400 text-xs">Each action is technically authorised for this user's role</p>
              </div>
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="text-red-400 font-semibold text-xs mb-1">⚠ Combined Behaviour</p>
                <p className="text-slate-400 text-xs">Sequential pattern indicates coordinated, suspicious activity</p>
              </div>
            </div>
          </div>

          {/* Behaviour Intelligence Analysis */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Behaviour Intelligence Analysis</h3>
              <span className="ml-auto text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full">
                System Generated
              </span>
            </div>
            <blockquote className="text-slate-300 text-sm leading-relaxed border-l-2 border-purple-500/40 pl-4 italic">
              "{incident.behaviourAnalysis}"
            </blockquote>
          </div>
        </div>

        {/* Right: Risk Factors + Actions */}
        <div className="space-y-4">
          {/* Risk factors */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-white">Risk Factors</h3>
              <span className="text-xs text-slate-500 ml-auto">
                Total: {incident.riskFactors.reduce((s, f) => s + f.score, 0)}
              </span>
            </div>
            <div className="space-y-3">
              {incident.riskFactors.map((factor) => (
                <div key={factor.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">{factor.label}</span>
                    <span className="text-xs font-bold text-red-400">+{factor.score}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500/60 rounded-full"
                      style={{ width: `${(factor.score / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk meter */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${(incident.riskScore / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-red-400">{incident.riskScore}</p>
                <p className="text-xs text-slate-500">/ 100</p>
              </div>
            </div>
            <p className="text-red-400 font-bold text-sm">CRITICAL RISK</p>
            <p className="text-xs text-slate-500 mt-1">Immediate response recommended</p>
          </div>

          {/* Actions */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/response')}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-between"
              >
                <span>Go to Response Center</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/alerts')}
                className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                View Related Alert
              </button>
              <button
                onClick={() => navigate('/activity')}
                className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                View Full Activity Log
              </button>
            </div>
          </div>

          {/* Case metadata */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Case Details</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Case ID', value: incident.caseId },
                { label: 'Created', value: '02:23 AM Today' },
                { label: 'Updated', value: 'Just now' },
                { label: 'Assigned to', value: 'Security Team' },
                { label: 'Priority', value: 'P1 - Critical' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-300 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
