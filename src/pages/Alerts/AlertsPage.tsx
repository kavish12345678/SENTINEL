import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AlertsPage() {
  const navigate = useNavigate();
  const { alerts } = useApp();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const unresolvedCount = alerts.filter((a) => a.status !== 'RESOLVED').length;
  const totalCount = alerts.length;

  const filtered = alerts.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesSearch =
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25';
      case 'HIGH':
        return 'bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/25';
      case 'MEDIUM':
        return 'bg-[#A87516]/10 text-[#A87516] border-[#A87516]/25';
      default:
        return 'bg-[#26734D]/10 text-[#26734D] border-[#26734D]/25';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider">
              Triage Queue
            </span>
            <span className="text-xs text-[#8A8A8A]">·</span>
            <span className="text-xs font-medium text-[#171717]">
              <b>{unresolvedCount}</b> unresolved
            </span>
            <span className="text-xs text-[#8A8A8A]">·</span>
            <span className="text-xs text-[#6B6B6B]">{totalCount} total events today</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#8A8A8A] mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                severityFilter === sev
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-white border border-[#E5E3DE] text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter alerts by keyword, identity, or rule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E5E3DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717]"
        />
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(alert.relatedIncidentId ? '/investigation' : '/activity')}
            className="bg-white border border-[#E5E3DE] hover:border-[#171717]/40 rounded-xl p-4.5 shadow-2xs cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex-shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityBadge(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#171717] group-hover:underline">
                    {alert.description}
                  </h3>
                </div>
                <p className="text-xs text-[#6B6B6B]">
                  Identity: <span className="font-semibold text-[#171717]">{alert.userName}</span> · Alert Rule: {alert.type}
                </p>
                <p className="text-[11px] text-[#8A8A8A] font-mono">Detected: {alert.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Assessed Risk</span>
                <p className={`text-base font-bold font-mono ${
                  alert.riskScore >= 81 ? 'text-[#C62828]' :
                  alert.riskScore >= 61 ? 'text-[#C65D21]' : 'text-[#A87516]'
                }`}>
                  {alert.riskScore} / 100
                </p>
              </div>

              <div className="flex items-center gap-2">
                {alert.status === 'RESOLVED' ? (
                  <span className="text-xs font-semibold text-[#26734D] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                ) : (
                  <button className="px-3 py-1.5 bg-[#171717] group-hover:bg-[#2E2E2E] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-all">
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
