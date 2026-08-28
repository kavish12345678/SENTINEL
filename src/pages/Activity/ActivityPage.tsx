import { useState, useMemo } from 'react';
import { Activity, Search, Filter, MapPin, Monitor } from 'lucide-react';
import { mockActivities } from '../../data/mockData';

const statusBadge: Record<string, string> = {
  NORMAL: 'bg-[#5F8669]/15 text-[#5F8669] border border-[#5F8669]/30',
  UNUSUAL: 'bg-[#C19A5A]/15 text-[#C19A5A] border border-[#C19A5A]/30',
  SUSPICIOUS: 'bg-[#B67842]/15 text-[#B67842] border border-[#B67842]/30',
  CRITICAL: 'bg-[#A64444]/15 text-[#A64444] border border-[#A64444]/30',
};

const riskColor = (score: number) =>
  score >= 81 ? 'text-[#A64444]' :
  score >= 61 ? 'text-[#B67842]' :
  score >= 31 ? 'text-[#C19A5A]' : 'text-[#5F8669]';

export default function ActivityPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterOptions = ['ALL', 'NORMAL', 'UNUSUAL', 'SUSPICIOUS', 'CRITICAL'];

  const filtered = useMemo(() => {
    return mockActivities.filter((a) => {
      const matchesSearch =
        a.userName.toLowerCase().includes(search.toLowerCase()) ||
        a.action.toLowerCase().includes(search.toLowerCase()) ||
        a.resource.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || a.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterStatus]);

  return (
    <div className="p-7 pb-20 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              TELEMETRY & ACTIVITY MONITOR
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              LIVE LOG
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Real-time event stream of privileged system interactions and gateway invocations
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5F8669]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
          <span>INGESTION: 1.2K EPS</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {[
          { label: 'TOTAL LOGGED', value: mockActivities.length, color: 'text-[#F2F0EA]' },
          { label: 'NORMAL EVENTS', value: mockActivities.filter((a) => a.status === 'NORMAL').length, color: 'text-[#5F8669]' },
          { label: 'UNUSUAL / SUSPICIOUS', value: mockActivities.filter((a) => a.status === 'SUSPICIOUS' || a.status === 'UNUSUAL').length, color: 'text-[#C19A5A]' },
          { label: 'CRITICAL THREATS', value: mockActivities.filter((a) => a.status === 'CRITICAL').length, color: 'text-[#A64444]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#151617] border border-[#292B2D] rounded-lg p-3.5 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <span className="text-[10px] text-[#686A6B] uppercase tracking-wider block mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 font-mono">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#686A6B]" />
          <input
            type="text"
            placeholder="Search by user, action type, resource identifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151617] border border-[#292B2D] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#686A6B] mr-1 hidden sm:inline" />
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all btn-tactile ${
                filterStatus === opt
                  ? 'bg-[#C19A5A]/20 border border-[#C19A5A]/50 text-[#F2F0EA]'
                  : 'bg-[#151617] border border-[#292B2D] text-[#9A9A96] hover:text-[#F2F0EA]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl overflow-hidden shadow-md">
        {/* Table Header */}
        <div className="grid grid-cols-[90px_1.2fr_1.2fr_1fr_90px_70px_90px] gap-4 px-4 py-3 border-b border-[#292B2D] text-[10px] font-mono uppercase tracking-wider text-[#686A6B] bg-[#101112]">
          <span>TIMESTAMP</span>
          <span>OPERATOR</span>
          <span>ACTION INVOCATION</span>
          <span>RESOURCE</span>
          <span>GEO / NODE</span>
          <span className="text-right">DELTA</span>
          <span className="text-right">STATUS</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <Activity className="w-8 h-8 text-[#686A6B] mx-auto mb-2 opacity-40" />
            <p className="text-xs font-mono text-[#9A9A96]">NO TELEMETRY MATCHING CRITERIA</p>
          </div>
        ) : (
          <div className="divide-y divide-[#292B2D]/50 font-mono text-xs">
            {filtered.map((activity) => (
              <div key={activity.id}>
                <div
                  onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                  className={`grid grid-cols-[90px_1.2fr_1.2fr_1fr_90px_70px_90px] gap-4 px-4 py-3 cursor-pointer hover:bg-[#191A1C] transition-colors items-center ${
                    expandedId === activity.id ? 'bg-[#191A1C]' : ''
                  } ${
                    activity.status === 'CRITICAL' ? 'border-l-2 border-l-[#A64444]' :
                    activity.status === 'SUSPICIOUS' ? 'border-l-2 border-l-[#B67842]' :
                    activity.status === 'UNUSUAL' ? 'border-l-2 border-l-[#C19A5A]' : ''
                  }`}
                >
                  <span className="text-[11px] text-[#9A9A96]">{activity.timestamp}</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded bg-[#191A1C] border border-[#292B2D] flex items-center justify-center text-[10px] font-bold text-[#C19A5A] flex-shrink-0">
                      {activity.userName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs text-[#F2F0EA] font-medium truncate font-sans">{activity.userName}</span>
                  </div>
                  <span className="text-xs text-[#9A9A96] truncate">{activity.action}</span>
                  <span className="text-xs text-[#686A6B] truncate">{activity.resource}</span>
                  <div className="flex items-center gap-1 text-[11px] text-[#686A6B]">
                    <MapPin className="w-3 h-3 text-[#686A6B]" />
                    <span className="truncate">{activity.location.split(',')[0]}</span>
                  </div>
                  <span className={`text-right font-bold ${riskColor(activity.riskScore)}`}>
                    +{activity.riskScore}
                  </span>
                  <div className="text-right">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded inline-block ${statusBadge[activity.status]}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>

                {/* Expanded Forensic Detail Pane */}
                {expandedId === activity.id && (
                  <div className="px-6 py-4 bg-[#101112] border-t border-b border-[#292B2D] space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-[#686A6B] uppercase block">SOURCE IP</span>
                        <p className="text-[#F2F0EA] font-semibold mt-0.5">{activity.ipAddress}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#686A6B] uppercase block">DEVICE / AGENT</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[#F2F0EA]">
                          <Monitor className="w-3.5 h-3.5 text-[#C19A5A]" />
                          <span>{activity.device}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#686A6B] uppercase block">GEOLOCATION</span>
                        <p className="text-[#F2F0EA] mt-0.5">{activity.location}</p>
                      </div>
                      {activity.amount && (
                        <div>
                          <span className="text-[10px] text-[#A64444] uppercase block font-bold">TRANSACTION AMOUNT</span>
                          <p className="text-[#A64444] font-bold mt-0.5">₹{activity.amount.toLocaleString('en-IN')}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-[#151617] rounded border border-[#292B2D]">
                      <span className="text-[10px] text-[#C19A5A] uppercase font-bold block mb-1">
                        BEHAVIOUR ENGINE ANOMALY DIAGNOSTIC:
                      </span>
                      <p className={`text-xs font-sans ${riskColor(activity.riskScore)}`}>
                        {activity.riskReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
