import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { behaviourChartData, riskDistributionData } from '../../data/mockData';

export default function BehaviourAnalyticsPage() {
  const roleAverages = [
    { role: 'Payment Admin', baseline: 18, typicalHours: '09:00 - 18:00', maxTxn: '₹5,00,000' },
    { role: 'Senior DBA', baseline: 22, typicalHours: '09:30 - 18:30', maxTxn: 'N/A (Read/Query)' },
    { role: 'System Admin', baseline: 25, typicalHours: '10:00 - 19:00', maxTxn: 'N/A (Console)' },
    { role: 'Security Analyst', baseline: 12, typicalHours: '24/7 Shift Rotation', maxTxn: 'N/A (Audit)' },
    { role: 'Compliance Officer', baseline: 10, typicalHours: '09:00 - 17:30', maxTxn: 'N/A (Review)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Top Section: Statistical Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
            Baseline Conformance Rate
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#171717] mt-1">94.6%</p>
          <p className="text-xs text-[#26734D] mt-0.5 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +1.2% model confidence over 90 days
          </p>
        </div>

        <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
            Context Verification Efficiency
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#171717] mt-1">82.4%</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Unusual events reconciled against ITSM tickets
          </p>
        </div>

        <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
            False Positive Suppression
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#171717] mt-1">91.8%</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Legitimate operational outliers automatically de-escalated
          </p>
        </div>
      </div>

      {/* 2. Legitimate Exception vs Suspicious Threat Comparison */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Contextual Intelligence Engine in Action
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            How SENTINEL distinguishes between an authorized exceptional task and an active insider threat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Legitimate Exception */}
          <div className="p-4 bg-[#26734D]/5 border border-[#26734D]/25 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#26734D]/10 text-[#26734D] uppercase tracking-wider">
                ✓ Context Verified (False Positive Prevented)
              </span>
              <span className="text-xs font-mono font-bold text-[#26734D]">Risk: 22/100</span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#171717]">Off-Hours SSH Access (Rahul Verma)</h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                SysAdmin logged in at 11:00 PM to deploy an emergency kernel update.
              </p>
            </div>

            <div className="p-2.5 bg-white border border-[#E5E3DE] rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Initial Access Anomaly:</span>
                <span className="text-[#A87516] font-semibold">+12 Risk</span>
              </div>
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>ITSM Ticket #CHG-2026-881:</span>
                <span className="text-[#26734D] font-semibold">-14 Risk Discount</span>
              </div>
              <p className="text-[11px] text-[#26734D] font-medium pt-0.5">
                ✓ Activity scope matches approved change calendar.
              </p>
            </div>
          </div>

          {/* Card B: Suspicious Account Misuse */}
          <div className="p-4 bg-[#C62828]/5 border border-[#C62828]/25 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] uppercase tracking-wider">
                🚨 Malicious Sequence (Critical Threat)
              </span>
              <span className="text-xs font-mono font-bold text-[#C62828]">Risk: 92/100</span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#171717]">Off-Hours Wire Transfer (Amit Sharma)</h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Payment Admin modified beneficiary and executed ₹18.5L wire at 02:23 AM.
              </p>
            </div>

            <div className="p-2.5 bg-white border border-[#E5E3DE] rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Unusual Access Time:</span>
                <span className="text-[#C62828] font-semibold">+20 Risk</span>
              </div>
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Beneficiary Modification + 5x Limit:</span>
                <span className="text-[#C62828] font-semibold">+25 Risk</span>
              </div>
              <p className="text-[11px] text-[#C62828] font-medium pt-0.5">
                ⚠️ Zero change ticket or second-approver authorization found.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Timing Distribution Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DE]">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Access Timing Distribution (24 Hours)
              </h2>
              <p className="text-xs text-[#6B6B6B]">Aggregate login activity density across 24 privileged identities</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
              <Clock className="w-3.5 h-3.5" />
              <span>Core band: 09:00 – 18:00</span>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.loginHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DE" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#6B6B6B', fontSize: 10 }}
                  axisLine={{ stroke: '#E5E3DE' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B6B6B', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E3DE',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="frequency" name="Login Frequency" fill="#171717" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-[#E5E3DE]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Risk Tier Population
            </h2>
            <p className="text-xs text-[#6B6B6B]">Distribution across 24 privileged identities</p>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E3DE',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs text-[#6B6B6B]">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-[#171717]">{item.value} Identities</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Role Comparison Table */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Peer Group Role Baselines
        </h2>

        <div className="border border-[#E5E3DE] rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E5E3DE] text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Role Category</th>
                <th className="py-2.5 px-4 font-semibold">Baseline Risk Score</th>
                <th className="py-2.5 px-4 font-semibold">Expected Working Hours</th>
                <th className="py-2.5 px-4 font-semibold text-right">Transaction Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE]">
              {roleAverages.map((role) => (
                <tr key={role.role} className="hover:bg-[#F6F5F2]/60 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#171717]">{role.role}</td>
                  <td className="py-2.5 px-4 font-mono text-[#6B6B6B]">{role.baseline} / 100</td>
                  <td className="py-2.5 px-4 text-[#6B6B6B]">{role.typicalHours}</td>
                  <td className="py-2.5 px-4 text-right font-medium text-[#171717]">{role.maxTxn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
