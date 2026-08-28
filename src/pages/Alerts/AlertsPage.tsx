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
        return 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/40';
      case 'HIGH':
        return 'bg-[#812627]/30 text-[#ffb3af] border-[#ffb3af]/40';
      case 'MEDIUM':
        return 'bg-[#5f4504]/30 text-[#e8c178] border-[#e8c178]/40';
      default:
        return 'bg-[#20201a] text-[#c7c7bf] border-[#464742]';
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16 font-sans select-none">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#ffb4ab] uppercase tracking-wider">
              TRIAGE QUEUE
            </span>
            <span className="text-xs text-[#91918a]">·</span>
            <span className="text-xs text-[#e5e2d9]">
              <b>{unresolvedCount}</b> unresolved
            </span>
            <span className="text-xs text-[#91918a]">·</span>
            <span className="text-xs text-[#c7c7bf]">{totalCount} total alerts</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#91918a] mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all ${
                severityFilter === sev
                  ? 'bg-[#e5e2df] text-[#1c1c1a]'
                  : 'bg-[#1c1c16] border border-[#464742] text-[#91918a] hover:text-[#e5e2d9]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#91918a] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter alerts by keyword, identity, or PAM rule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1c1c16] border border-[#464742] rounded-xs pl-9 pr-4 py-2 font-mono text-xs text-[#e5e2d9] placeholder-[#91918a] focus:outline-none focus:border-[#e8c178]"
        />
      </div>

      {/* Alerts List */}
      <div className="space-y-2.5 font-mono">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(alert.relatedIncidentId ? '/investigation' : '/activity')}
            className="bg-[#1c1c16] border border-[#464742] hover:border-[#e8c178]/60 rounded-xs p-4 shadow-xl cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex-shrink-0">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider border ${getSeverityBadge(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-[#e5e2d9] group-hover:text-[#e8c178] transition-colors">
                  {alert.description}
                </h3>
                <p className="text-xs text-[#91918a]">
                  Identity: <span className="font-semibold text-[#e5e2d9]">{alert.userName}</span> · Alert Rule: {alert.type}
                </p>
                <p className="text-[10px] text-[#91918a]">Detected: {alert.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#91918a]">Assessed Risk</span>
                <p className={`text-base font-bold ${
                  alert.riskScore >= 81 ? 'text-[#ffb4ab]' :
                  alert.riskScore >= 61 ? 'text-[#ffb3af]' : 'text-[#e8c178]'
                }`}>
                  {alert.riskScore} / 100
                </p>
              </div>

              <div className="flex items-center gap-2">
                {alert.status === 'RESOLVED' ? (
                  <span className="text-xs font-semibold text-[#e8c178] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                ) : (
                  <button className="px-3 py-1 bg-[#20201a] group-hover:bg-[#e5e2df] group-hover:text-[#1c1c1a] border border-[#464742] text-[#e5e2d9] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1 transition-all">
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
