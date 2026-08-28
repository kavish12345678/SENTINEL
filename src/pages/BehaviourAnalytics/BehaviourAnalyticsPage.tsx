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
    <div className="p-7 pb-24 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              BEHAVIOUR ANALYTICS & BASELINES
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              ML BASELINE ENGINE
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Continuous peer-group learning, operational baselines, and historical deviation profiles
          </p>
        </div>
      </div>

      {/* Baseline Requirement Explanation Card */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 flex items-start gap-3.5 shadow-md">
        <div className="w-8 h-8 rounded-lg bg-[#191A1C] border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A] flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C19A5A] font-semibold block mb-0.5">
            BEHAVIOURAL BASELINE FORMULATION
          </span>
          <p className="text-xs text-[#F2F0EA] leading-relaxed font-sans">
            "The system continuously evaluates privileged activity against historical behavioural vectors. Rather than relying solely on static RBAC permissions, SENTINEL constructs dynamic probability distributions covering temporal access, entity relationships, and monetary deviation."
          </p>
        </div>
      </div>

      {/* Behaviour Deviation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#5F8669]/15 border border-[#5F8669]/30 flex items-center justify-center text-[#5F8669] font-bold text-lg">
            82%
          </div>
          <div>
            <p className="text-xs font-bold text-[#5F8669]">NORMAL BEHAVIOUR</p>
            <p className="text-[11px] text-[#9A9A96] mt-0.5 font-sans">Within 95% confidence interval</p>
          </div>
        </div>

        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#C19A5A]/15 border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A] font-bold text-lg">
            13%
          </div>
          <div>
            <p className="text-xs font-bold text-[#C19A5A]">UNUSUAL VARIANCE</p>
            <p className="text-[11px] text-[#9A9A96] mt-0.5 font-sans">Evaluated with business context</p>
          </div>
        </div>

        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#A64444]/15 border border-[#A64444]/30 flex items-center justify-center text-[#A64444] font-bold text-lg">
            5%
          </div>
          <div>
            <p className="text-xs font-bold text-[#A64444]">HIGH-RISK DEVIATION</p>
            <p className="text-[11px] text-[#9A9A96] mt-0.5 font-sans">Sequential multivariate anomaly</p>
          </div>
        </div>
      </div>

      {/* Baseline Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        {/* Chart 1: Normal Login Time vs Anomaly */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#292B2D]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C19A5A]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                LOGIN TEMPORAL DISTRIBUTION
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#191A1C] text-[#686A6B] border border-[#292B2D]">
              CORE: 9 AM – 6 PM
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.loginHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242628" />
                <XAxis dataKey="hour" tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151617', borderColor: '#292B2D', borderRadius: '8px', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
                  labelStyle={{ color: '#9A9A96' }}
                />
                <Bar dataKey="frequency" radius={[3, 3, 0, 0]}>
                  {behaviourChartData.loginHours.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.anomaly ? '#A64444' : '#C19A5A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9A9A96] mt-3 pt-3 border-t border-[#292B2D]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C19A5A]" /> Normal Business Hours (9AM–6PM)
            </span>
            <span className="flex items-center gap-1.5 text-[#A64444] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#A64444]" /> Outlier (02:15 AM Access)
            </span>
          </div>
        </div>

        {/* Chart 2: Transaction Range Baseline */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#292B2D]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-[#C19A5A]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                TRANSACTION AMOUNT HISTOGRAM
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#191A1C] text-[#686A6B] border border-[#292B2D]">
              EXPECTED: ₹50K – ₹5L
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.transactionAmounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242628" />
                <XAxis dataKey="range" tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fill: '#686A6B', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151617', borderColor: '#292B2D', borderRadius: '8px', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
                  labelStyle={{ color: '#9A9A96' }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {behaviourChartData.transactionAmounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.anomaly ? '#A64444' : '#B67842'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9A9A96] mt-3 pt-3 border-t border-[#292B2D]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B67842]" /> Normal Range (₹50K–₹5L)
            </span>
            <span className="flex items-center gap-1.5 text-[#A64444] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#A64444]" /> Outlier (₹18.5L Wire)
            </span>
          </div>
        </div>
      </div>

      {/* Typical Resources & Beneficiaries Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        {/* Typical Accessed Resources */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#292B2D]">
            <Layers className="w-3.5 h-3.5 text-[#C19A5A]" />
            <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
              RESOURCE FREQUENCY PROFILE
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Payment Portal', freq: '98% Daily Frequency', normal: true },
              { name: 'Customer Accounts System', freq: '84% Weekly Frequency', normal: true },
              { name: 'Transaction Management Console', freq: '76% Regular Frequency', normal: true },
              { name: 'Corporate Account #CC-8821', freq: '0.4% Rare Access (Anomaly)', normal: false },
            ].map((res) => (
              <div
                key={res.name}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  res.normal
                    ? 'bg-[#101112] border-[#292B2D]'
                    : 'bg-[#A64444]/10 border-[#A64444]/30 text-[#A64444]'
                }`}
              >
                <span className={`font-semibold ${res.normal ? 'text-[#F2F0EA]' : 'text-[#A64444]'}`}>
                  {res.name}
                </span>
                <span className="text-[11px] text-[#686A6B]">{res.freq}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Typical Trusted Beneficiaries */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#292B2D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5F8669]" />
            <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
              WHITELISTED RECIPIENT BASELINE
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { name: 'ABC Supplies Ltd', status: 'Established 3+ yrs · 142 txns', trusted: true },
              { name: 'Tech Corp Logistics', status: 'Established 2+ yrs · 98 txns', trusted: true },
              { name: 'Vendor Solutions India', status: 'Established 1+ yr · 45 txns', trusted: true },
              { name: 'XYZ Holdings (NEW)', status: 'Created 02:19 AM · 0 past txns', trusted: false },
            ].map((ben) => (
              <div
                key={ben.name}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  ben.trusted
                    ? 'bg-[#101112] border-[#292B2D]'
                    : 'bg-[#A64444]/10 border-[#A64444]/30 text-[#A64444]'
                }`}
              >
                <span className={`font-semibold ${ben.trusted ? 'text-[#F2F0EA]' : 'text-[#A64444]'}`}>
                  {ben.name}
                </span>
                <span className="text-[11px] text-[#686A6B]">{ben.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
