import {
  Clock,
  CreditCard,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { behaviourChartData } from '../../data/mockData';

export default function BehaviourAnalyticsPage() {
  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Behaviour Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
              Baseline Engine
            </span>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            Continuous peer-group learning, operational baselines, and historical deviation profiles
          </p>
        </div>
      </div>

      {/* Baseline Requirement Explanation Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white mb-1">How Behavioural Baselines Work</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            "The system continuously compares current privileged activity with historical behaviour profiles for the user's role.
            Rather than relying solely on static role-based access control (RBAC), SENTINEL builds dynamic profiles covering working hours,
            typical resource access hierarchies, recipient patterns, and transaction amounts."
          </p>
        </div>
      </div>

      {/* Behaviour Deviation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-green-500/30 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-black text-xl">
            82%
          </div>
          <div>
            <p className="text-sm font-bold text-green-400">Normal Behaviour</p>
            <p className="text-xs text-slate-400 mt-0.5">Activities within 95% baseline confidence interval</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-yellow-500/30 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-xl">
            13%
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-400">Unusual Behaviour</p>
            <p className="text-xs text-slate-400 mt-0.5">Minor baseline variance (evaluated with context)</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-xl">
            5%
          </div>
          <div>
            <p className="text-sm font-bold text-red-400">High-Risk Deviation</p>
            <p className="text-xs text-slate-400 mt-0.5">Multivariate anomalies requiring SOC escalation</p>
          </div>
        </div>
      </div>

      {/* Baseline Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Normal Login Time vs Anomaly */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Typical Login Hours Profile</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Core: 9 AM – 6 PM
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.loginHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                  {behaviourChartData.loginHours.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.anomaly ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Normal Active Hours (9AM–6PM)
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Anomaly (02:15 AM Login)
            </span>
          </div>
        </div>

        {/* Chart 2: Transaction Range Baseline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Average Transaction Amount Baseline</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Expected: ₹50K – ₹5L
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.transactionAmounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {behaviourChartData.transactionAmounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.anomaly ? '#ef4444' : '#8b5cf6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Standard Distribution Range
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Outlier (₹18.5L Outward Wire)
            </span>
          </div>
        </div>
      </div>

      {/* Typical Resources & Beneficiaries Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Typical Accessed Resources */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Typical Accessed Resources</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Payment Portal', freq: '98% Daily Access', normal: true },
              { name: 'Customer Accounts System', freq: '84% Weekly Access', normal: true },
              { name: 'Transaction Management Console', freq: '76% Regular Access', normal: true },
              { name: 'Corporate Account #CC-8821', freq: '0.4% Rare Access (Anomalous)', normal: false },
            ].map((res) => (
              <div
                key={res.name}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  res.normal
                    ? 'bg-slate-800/50 border-slate-700/60'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <span className={`text-xs font-semibold ${res.normal ? 'text-slate-200' : 'text-red-400 font-bold'}`}>
                  {res.name}
                </span>
                <span className="text-[11px] text-slate-400">{res.freq}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Typical Trusted Beneficiaries */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Typical Whitelisted Beneficiaries</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'ABC Supplies Ltd', status: 'Established 3+ yrs · 142 txns', trusted: true },
              { name: 'Tech Corp Logistics', status: 'Established 2+ yrs · 98 txns', trusted: true },
              { name: 'Vendor Solutions India', status: 'Established 1+ yr · 45 txns', trusted: true },
              { name: 'XYZ Holdings (NEW)', status: 'Created 02:19 AM · 0 past txns', trusted: false },
            ].map((ben) => (
              <div
                key={ben.name}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  ben.trusted
                    ? 'bg-slate-800/50 border-slate-700/60'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <span className={`text-xs font-semibold ${ben.trusted ? 'text-slate-200' : 'text-red-400 font-bold'}`}>
                  {ben.name}
                </span>
                <span className="text-[11px] text-slate-400">{ben.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
