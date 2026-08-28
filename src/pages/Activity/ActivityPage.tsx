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
        return 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25';
      case 'SUSPICIOUS':
        return 'bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/25';
      case 'UNUSUAL':
        return 'bg-[#A87516]/10 text-[#A87516] border-[#A87516]/25';
      default:
        return 'bg-[#26734D]/10 text-[#26734D] border-[#26734D]/25';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 81) return 'text-[#C62828]';
    if (score >= 61) return 'text-[#C65D21]';
    if (score >= 31) return 'text-[#A87516]';
    return 'text-[#26734D]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, user, resource, IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E5E3DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#8A8A8A] mr-1" />
          {['ALL', 'NORMAL', 'UNUSUAL', 'SUSPICIOUS', 'CRITICAL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-white border border-[#E5E3DE] text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E5E3DE] text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Identity</th>
                <th className="py-3.5 px-4 font-semibold">Action Executed</th>
                <th className="py-3.5 px-4 font-semibold">Resource / Target</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE]">
              {filtered.map((act) => {
                const isExpanded = expandedId === act.id;

                return (
                  <>
                    <tr
                      key={act.id}
                      onClick={() => setExpandedId(isExpanded ? null : act.id)}
                      className="hover:bg-[#F6F5F2]/80 cursor-pointer transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[#6B6B6B] text-[11px]">
                        {act.timestamp}
                      </td>

                      {/* Identity */}
                      <td className="py-3 px-4 font-bold text-[#171717]">
                        {act.userName}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-[#171717]">
                        <p className="font-medium">{act.action}</p>
                        {act.amount && (
                          <span className="text-[11px] font-semibold text-[#C62828]">
                            Amount: ₹{(act.amount).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Resource */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6B6B6B]">
                        {act.resource}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={getRiskColor(act.riskScore)}>{act.riskScore}</span>
                        <span className="text-[#8A8A8A] font-normal text-[11px]"> / 100</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                            act.status
                          )}`}
                        >
                          {act.status}
                        </span>
                      </td>

                      {/* Toggle */}
                      <td className="py-3 px-4 text-right text-[#8A8A8A]">
                        {isExpanded ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                      </td>
                    </tr>

                    {/* Expandable Forensic Details */}
                    {isExpanded && (
                      <tr className="bg-[#FAFAF8] border-b border-[#E5E3DE]">
                        <td colSpan={7} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-white border border-[#E5E3DE] rounded-lg space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">
                                Behaviour Risk Reason
                              </span>
                              <p className="text-[#171717] font-medium leading-relaxed">
                                {act.riskReason}
                              </p>
                            </div>

                            <div className="p-3 bg-white border border-[#E5E3DE] rounded-lg space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">
                                Network & Client Device
                              </span>
                              <div className="flex items-center gap-1.5 text-[#6B6B6B] mt-0.5">
                                <Laptop className="w-3.5 h-3.5" />
                                <span>{act.device}</span>
                              </div>
                              <p className="font-mono text-[#8A8A8A] text-[11px]">IP: {act.ipAddress}</p>
                            </div>

                            <div className="p-3 bg-white border border-[#E5E3DE] rounded-lg space-y-1">
                              <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">
                                Geo Location & Geofence
                              </span>
                              <div className="flex items-center gap-1.5 text-[#6B6B6B] mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{act.location}</span>
                              </div>
                              <span className="inline-block text-[10px] font-semibold text-[#26734D]">
                                ✓ Corporate VPN Gateway Verified
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
