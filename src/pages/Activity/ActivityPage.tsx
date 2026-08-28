import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, MapPin, Laptop } from 'lucide-react';
import { mockActivities } from '../../data/mockData';

export default function ActivityPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockActivities.filter((act) => {
    const matchesSearch =
      act.userName.toLowerCase().includes(search.toLowerCase()) ||
      act.action.toLowerCase().includes(search.toLowerCase()) ||
      act.resource.toLowerCase().includes(search.toLowerCase()) ||
      act.ipAddress.includes(search);
    const matchesStatus = statusFilter === 'ALL' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/40';
      case 'SUSPICIOUS':
        return 'bg-[#812627]/30 text-[#ffb3af] border-[#ffb3af]/40';
      case 'UNUSUAL':
        return 'bg-[#5f4504]/30 text-[#e8c178] border-[#e8c178]/40';
      default:
        return 'bg-[#20201a] text-[#c7c7bf] border-[#464742]';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 81) return 'text-[#ffb4ab]';
    if (score >= 61) return 'text-[#ffb3af]';
    if (score >= 31) return 'text-[#e8c178]';
    return 'text-[#c7c7bf]';
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#91918a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, user, resource, IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1c1c16] border border-[#464742] rounded-xs pl-9 pr-4 py-2 font-mono text-xs text-[#e5e2d9] placeholder-[#91918a] focus:outline-none focus:border-[#e8c178]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-mono">
          <Filter className="w-3.5 h-3.5 text-[#91918a] mr-1" />
          {['ALL', 'NORMAL', 'UNUSUAL', 'SUSPICIOUS', 'CRITICAL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-[#e5e2df] text-[#1c1c1a]'
                  : 'bg-[#1c1c16] border border-[#464742] text-[#91918a] hover:text-[#e5e2d9]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* High Density Telemetry Log Table */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs shadow-xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#14140f] border-b border-[#464742] text-[11px] font-bold text-[#91918a] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Identity</th>
                <th className="py-3 px-4 font-semibold">Action Executed</th>
                <th className="py-3 px-4 font-semibold">Resource / Target</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464742]/40">
              {filtered.map((act) => {
                const isExpanded = expandedId === act.id;

                return (
                  <>
                    <tr
                      key={act.id}
                      onClick={() => setExpandedId(isExpanded ? null : act.id)}
                      className="hover:bg-[#20201a] cursor-pointer transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 text-[#91918a] text-[11px]">
                        {act.timestamp}
                      </td>

                      {/* Identity */}
                      <td className="py-3 px-4 font-bold text-[#e5e2d9]">
                        {act.userName}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-[#e5e2d9]">
                        <p className="font-medium">{act.action}</p>
                        {act.amount && (
                          <span className="text-[11px] font-semibold text-[#ffb4ab]">
                            Amount: ₹{(act.amount).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Resource */}
                      <td className="py-3 px-4 text-[11px] text-[#c7c7bf]">
                        {act.resource}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 font-bold">
                        <span className={getRiskColor(act.riskScore)}>{act.riskScore}</span>
                        <span className="text-[#91918a] font-normal text-[10px]"> / 100</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-xs border uppercase tracking-wider ${getStatusBadge(
                            act.status
                          )}`}
                        >
                          {act.status}
                        </span>
                      </td>

                      {/* Toggle */}
                      <td className="py-3 px-4 text-right text-[#91918a]">
                        {isExpanded ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                      </td>
                    </tr>

                    {/* Expandable Forensic Details */}
                    {isExpanded && (
                      <tr className="bg-[#14140f] border-b border-[#464742]">
                        <td colSpan={7} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-[#1c1c16] border border-[#464742] rounded-xs space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#91918a]">
                                Behaviour Risk Reason
                              </span>
                              <p className="text-[#e5e2d9] font-medium leading-relaxed">
                                {act.riskReason}
                              </p>
                            </div>

                            <div className="p-3 bg-[#1c1c16] border border-[#464742] rounded-xs space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#91918a]">
                                Network & Client Device
                              </span>
                              <div className="flex items-center gap-1.5 text-[#c7c7bf] mt-0.5">
                                <Laptop className="w-3.5 h-3.5" />
                                <span>{act.device}</span>
                              </div>
                              <p className="text-[#91918a] text-[11px]">IP: {act.ipAddress}</p>
                            </div>

                            <div className="p-3 bg-[#1c1c16] border border-[#464742] rounded-xs space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#91918a]">
                                Location & Geofence
                              </span>
                              <div className="flex items-center gap-1.5 text-[#c7c7bf] mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{act.location}</span>
                              </div>
                              <span className="inline-block text-[10px] font-semibold text-[#e8c178]">
                                ✓ VPN Gateway Signature Verified
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
