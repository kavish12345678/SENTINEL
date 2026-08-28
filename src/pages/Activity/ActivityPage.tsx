import { useState, useMemo } from 'react';
import { Activity, Search, Filter, MapPin, Monitor } from 'lucide-react';
import { mockActivities } from '../../data/mockData';

const statusBadge: Record<string, string> = {
  NORMAL: 'bg-green-500/15 text-green-400 border border-green-500/30',
  UNUSUAL: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  SUSPICIOUS: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  CRITICAL: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

const riskColor = (score: number) =>
  score >= 81 ? 'text-red-400' :
  score >= 61 ? 'text-orange-400' :
  score >= 31 ? 'text-yellow-400' : 'text-green-400';

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
    <div className="p-6 pb-20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Monitor</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Real-time log of all privileged user actions across systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live Feed</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Events', value: mockActivities.length, color: 'text-white' },
          { label: 'Normal', value: mockActivities.filter((a) => a.status === 'NORMAL').length, color: 'text-green-400' },
          { label: 'Suspicious', value: mockActivities.filter((a) => a.status === 'SUSPICIOUS' || a.status === 'UNUSUAL').length, color: 'text-yellow-400' },
          { label: 'Critical', value: mockActivities.filter((a) => a.status === 'CRITICAL').length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user, action, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
          />
        </div>
        <Filter className="w-4 h-4 text-slate-500" />
        <div className="flex gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === opt
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[100px_1fr_1fr_1fr_80px_80px_90px] gap-4 px-4 py-3 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Time</span>
          <span>User</span>
          <span>Action</span>
          <span>Resource</span>
          <span>Location</span>
          <span>Risk</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No activities found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div>
            {filtered.map((activity) => (
              <div key={activity.id}>
                <div
                  onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                  className={`grid grid-cols-[100px_1fr_1fr_1fr_80px_80px_90px] gap-4 px-4 py-3 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-all ${
                    expandedId === activity.id ? 'bg-slate-800/50' : ''
                  } ${
                    activity.status === 'CRITICAL' ? 'border-l-2 border-l-red-500/50' :
                    activity.status === 'SUSPICIOUS' ? 'border-l-2 border-l-orange-500/50' :
                    activity.status === 'UNUSUAL' ? 'border-l-2 border-l-yellow-500/50' : ''
                  }`}
                >
                  <span className="text-xs text-slate-400 font-mono">{activity.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {activity.userName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm text-white font-medium truncate">{activity.userName}</span>
                  </div>
                  <span className="text-sm text-slate-300 truncate">{activity.action}</span>
                  <span className="text-sm text-slate-400 truncate">{activity.resource}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    <span className="text-xs text-slate-500 truncate">{activity.location.split(',')[0]}</span>
                  </div>
                  <span className={`text-sm font-bold ${riskColor(activity.riskScore)}`}>
                    +{activity.riskScore}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>

                {/* Expanded detail */}
                {expandedId === activity.id && (
                  <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700/50">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 mb-1">IP Address</p>
                        <p className="text-slate-300 font-mono">{activity.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Device</p>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3 text-slate-500" />
                          <p className="text-slate-300">{activity.device}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Full Location</p>
                        <p className="text-slate-300">{activity.location}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-slate-500 mb-1">Risk Reason</p>
                        <p className={`font-medium ${riskColor(activity.riskScore)}`}>
                          {activity.riskReason}
                        </p>
                      </div>
                      {activity.beneficiary && (
                        <div>
                          <p className="text-slate-500 mb-1">Beneficiary</p>
                          <p className="text-slate-300">{activity.beneficiary}</p>
                        </div>
                      )}
                      {activity.amount && (
                        <div>
                          <p className="text-slate-500 mb-1">Amount</p>
                          <p className="text-red-400 font-bold">₹{activity.amount.toLocaleString('en-IN')}</p>
                        </div>
                      )}
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
