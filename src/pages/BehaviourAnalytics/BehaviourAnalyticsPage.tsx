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

  const darkPieData = [
    { name: 'Low (0-30)', value: 14, color: '#464742' },
    { name: 'Medium (31-60)', value: 6, color: '#5f4504' },
    { name: 'High (61-80)', value: 3, color: '#812627' },
    { name: 'Critical (81-100)', value: 1, color: '#ffb4ab' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* Top Section: Statistical Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#91918a]">
            Baseline Conformance Rate
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#e5e2d9] mt-1">94.6%</p>
          <p className="text-xs text-[#e8c178] mt-0.5 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +1.2% model confidence (90d)
          </p>
        </div>

        <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#91918a]">
            Context Verification Efficiency
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#e5e2d9] mt-1">82.4%</p>
          <p className="text-xs text-[#c7c7bf] mt-0.5">
            ITSM ticket reconciliation match
          </p>
        </div>

        <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-4 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#91918a]">
            False Positive Suppression
          </span>
          <p className="text-2xl font-bold tracking-tight text-[#e5e2d9] mt-1">91.8%</p>
          <p className="text-xs text-[#c7c7bf] mt-0.5">
            Legitimate operational outliers de-escalated
          </p>
        </div>
      </div>

      {/* Legitimate Exception vs Suspicious Threat Comparison */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
            Contextual Intelligence Engine Comparison
          </h2>
          <p className="text-xs text-[#91918a] mt-0.5">
            How SENTINEL distinguishes authorized operational maintenance from unauthorized insider threat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Legitimate Exception */}
          <div className="p-4 bg-[#20201a] border border-[#e8c178]/40 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-xs bg-[#5f4504]/30 text-[#e8c178] uppercase tracking-wider border border-[#e8c178]/30">
                ✓ Context Verified (False Positive Suppressed)
              </span>
              <span className="text-xs font-bold text-[#e8c178]">Risk: 22/100</span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#e5e2d9]">Off-Hours SSH Access (Rahul Verma)</h3>
              <p className="text-xs text-[#c7c7bf] mt-0.5">
                SysAdmin logged in at 11:00 PM to deploy an emergency kernel update.
              </p>
            </div>

            <div className="p-2.5 bg-[#14140f] border border-[#464742] rounded-xs text-xs space-y-1">
              <div className="flex items-center justify-between text-[#91918a]">
                <span>Initial Access Anomaly:</span>
                <span className="text-[#e8c178] font-semibold">+12 Risk</span>
              </div>
              <div className="flex items-center justify-between text-[#91918a]">
                <span>ITSM Ticket #CHG-2026-881:</span>
                <span className="text-[#c7c7bf] font-semibold">-14 Risk Discount</span>
              </div>
              <p className="text-[11px] text-[#e8c178] pt-0.5">
                ✓ Activity scope matches approved change calendar.
              </p>
            </div>
          </div>

          {/* Card B: Suspicious Account Misuse */}
          <div className="p-4 bg-[#20201a] border border-[#ffb4ab]/40 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-xs bg-[#93000a]/40 text-[#ffb4ab] uppercase tracking-wider border border-[#ffb4ab]/40">
                🚨 Malicious Sequence (Critical Threat)
              </span>
              <span className="text-xs font-bold text-[#ffb4ab]">Risk: 92/100</span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#e5e2d9]">Off-Hours Wire Transfer (Amit Sharma)</h3>
              <p className="text-xs text-[#c7c7bf] mt-0.5">
                Payment Admin modified beneficiary and executed ₹18.5L wire at 02:23 AM.
              </p>
            </div>

            <div className="p-2.5 bg-[#14140f] border border-[#464742] rounded-xs text-xs space-y-1">
              <div className="flex items-center justify-between text-[#91918a]">
                <span>Unusual Access Time:</span>
                <span className="text-[#ffb4ab] font-semibold">+20 Risk</span>
              </div>
              <div className="flex items-center justify-between text-[#91918a]">
                <span>Beneficiary Modification + 5x Limit:</span>
                <span className="text-[#ffb4ab] font-semibold">+25 Risk</span>
              </div>
              <p className="text-[11px] text-[#ffb4ab] pt-0.5">
                ⚠️ Zero change ticket or second-approver authorization found.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Access Timing Distribution Chart */}
        <div className="lg:col-span-2 bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[#464742]">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
                Access Timing Distribution (24 Hours)
              </h2>
              <p className="text-xs text-[#91918a]">Login activity density across 24 privileged identities</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#91918a]">
              <Clock className="w-3.5 h-3.5" />
              <span>Core band: 09:00 – 18:00</span>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourChartData.loginHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#464742" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#91918a', fontSize: 10 }}
                  axisLine={{ stroke: '#464742' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#91918a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#14140f',
                    border: '1px solid #464742',
                    borderRadius: '2px',
                    fontSize: '11px',
                    color: '#e5e2d9',
                  }}
                />
                <Bar dataKey="frequency" name="Login Density" fill="#c9c6c4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
          <div className="pb-2 border-b border-[#464742]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
              Risk Tier Population
            </h2>
            <p className="text-xs text-[#91918a]">Distribution across 24 identities</p>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={darkPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {darkPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1c1c16" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#14140f',
                    border: '1px solid #464742',
                    borderRadius: '2px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs text-[#91918a]">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="font-bold text-[#e5e2d9]">{item.value} Identities</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Comparison Table */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
          Peer Group Role Baselines
        </h2>

        <div className="border border-[#464742] rounded-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#14140f] border-b border-[#464742] text-[11px] font-bold text-[#91918a] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Role Category</th>
                <th className="py-2.5 px-4 font-semibold">Baseline Risk</th>
                <th className="py-2.5 px-4 font-semibold">Expected Working Hours</th>
                <th className="py-2.5 px-4 font-semibold text-right">Transaction Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464742]/40">
              {roleAverages.map((role) => (
                <tr key={role.role} className="hover:bg-[#20201a] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#e5e2d9]">{role.role}</td>
                  <td className="py-2.5 px-4 text-[#c7c7bf]">{role.baseline} / 100</td>
                  <td className="py-2.5 px-4 text-[#91918a]">{role.typicalHours}</td>
                  <td className="py-2.5 px-4 text-right font-medium text-[#e5e2d9]">{role.maxTxn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
