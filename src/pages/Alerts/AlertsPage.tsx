import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Alert, AlertSeverity } from '../../types';

const severityConfig: Record<AlertSeverity, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: 'text-[#A64444]', bg: 'bg-[#A64444]/15', border: 'border-[#A64444]/40' },
  HIGH: { color: 'text-[#B67842]', bg: 'bg-[#B67842]/15', border: 'border-[#B67842]/40' },
  MEDIUM: { color: 'text-[#C19A5A]', bg: 'bg-[#C19A5A]/15', border: 'border-[#C19A5A]/40' },
  LOW: { color: 'text-[#5F8669]', bg: 'bg-[#5F8669]/15', border: 'border-[#5F8669]/40' },
};

const statusConfig = {
  UNRESOLVED: 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40',
  INVESTIGATING: 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/40',
  RESOLVED: 'bg-[#5F8669]/20 text-[#5F8669] border border-[#5F8669]/40',
};

function AlertCard({
  alert,
  onInvestigate,
  onResolve,
}: {
  alert: Alert;
  onInvestigate: () => void;
  onResolve: () => void;
}) {
  const config = severityConfig[alert.severity];

  return (
    <div
      className={`p-4 rounded-xl border bg-[#151617] ${
        alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED'
          ? 'border-[#A64444]/50'
          : 'border-[#292B2D]'
      } transition-all hover:bg-[#191A1C] shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap font-mono">
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${config.bg} ${config.border} ${config.color}`}>
                {alert.severity}
              </span>
              <span className="text-[11px] text-[#686A6B]">{alert.type}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ml-auto ${statusConfig[alert.status]}`}>
                {alert.status}
              </span>
            </div>
            <p className="text-xs text-[#F2F0EA] font-medium mb-1.5 leading-snug">{alert.description}</p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#9A9A96]">
              <span>OPERATOR: <span className="text-[#F2F0EA] font-semibold">{alert.userName}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#686A6B]" /> {alert.timestamp}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0 font-mono">
          <div className="text-right">
            <p className={`text-xl font-bold ${config.color}`}>{alert.riskScore}</p>
            <span className="text-[9px] text-[#686A6B] uppercase block">SCORE</span>
          </div>
          {alert.status !== 'RESOLVED' && (
            <div className="flex gap-1.5 mt-1">
              {alert.relatedIncidentId && (
                <button
                  onClick={onInvestigate}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all btn-tactile ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-[#A64444] hover:bg-[#8f3a3a] text-white'
                      : 'bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 text-[#F2F0EA] border border-[#C19A5A]/40'
                  }`}
                >
                  INVESTIGATE
                </button>
              )}
              <button
                onClick={onResolve}
                className="px-2.5 py-1 text-[11px] font-medium rounded bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] text-[#9A9A96] hover:text-[#F2F0EA] transition-all btn-tactile"
              >
                RESOLVE
              </button>
            </div>
          )}
          {alert.status === 'RESOLVED' && (
            <div className="flex items-center gap-1 text-[#5F8669] text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const navigate = useNavigate();
  const { alerts, resolveAlert, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const severityOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statusOptions = ['ALL', 'UNRESOLVED', 'INVESTIGATING', 'RESOLVED'];

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSearch && matchesSev && matchesStatus;
  });

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId);
    addToast('Alert marked as resolved', 'success');
  };

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const unresolvedCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <div className="p-7 pb-20 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              SECURITY ALERTS QUEUE
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              {unresolvedCount} PENDING
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Behavioral anomaly triage sorted by cumulative threat severity
          </p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#A64444]/15 border border-[#A64444]/40 rounded font-mono text-xs text-[#A64444]">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">{criticalCount} CRITICAL THREATS</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {[
          { label: 'TOTAL ALERTS', value: alerts.length, color: 'text-[#F2F0EA]' },
          { label: 'CRITICAL SEVERITY', value: alerts.filter((a) => a.severity === 'CRITICAL').length, color: 'text-[#A64444]' },
          { label: 'UNRESOLVED QUEUE', value: unresolvedCount, color: 'text-[#B67842]' },
          { label: 'RESOLVED CASES', value: alerts.filter((a) => a.status === 'RESOLVED').length, color: 'text-[#5F8669]' },
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
            placeholder="Search alerts by user, type, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151617] border border-[#292B2D] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#686A6B] mr-1 hidden sm:inline" />
          {severityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterSeverity(opt)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all btn-tactile ${
                filterSeverity === opt
                  ? 'bg-[#C19A5A]/20 border border-[#C19A5A]/50 text-[#F2F0EA]'
                  : 'bg-[#151617] border border-[#292B2D] text-[#9A9A96] hover:text-[#F2F0EA]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all btn-tactile ${
                filterStatus === opt
                  ? 'bg-[#191A1C] border border-[#C19A5A]/40 text-[#F2F0EA]'
                  : 'bg-[#151617] border border-[#292B2D] text-[#9A9A96] hover:text-[#F2F0EA]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#151617] border border-[#292B2D] rounded-xl">
          <Bell className="w-10 h-10 text-[#686A6B] mx-auto mb-2 opacity-40" />
          <p className="text-xs font-mono text-[#9A9A96]">NO ALERTS MATCHING SPECIFIED CRITERIA</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onInvestigate={() => navigate('/investigation')}
              onResolve={() => handleResolve(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
