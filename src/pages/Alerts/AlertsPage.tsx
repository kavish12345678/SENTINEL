import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Alert, AlertSeverity } from '../../types';

const severityConfig: Record<AlertSeverity, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40' },
  HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  LOW: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/40' },
};

const statusConfig = {
  UNRESOLVED: 'bg-red-500/20 text-red-400',
  INVESTIGATING: 'bg-yellow-500/20 text-yellow-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
};

function AlertCard({ alert, onInvestigate, onResolve }: {
  alert: Alert;
  onInvestigate: () => void;
  onResolve: () => void;
}) {
  const config = severityConfig[alert.severity];

  return (
    <div className={`p-5 rounded-xl border ${config.bg} ${config.border} transition-all hover:scale-[1.005] duration-150`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
            <AlertTriangle className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.color}`}>
                {alert.severity}
              </span>
              <span className="text-xs text-slate-500">{alert.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${statusConfig[alert.status]}`}>
                {alert.status}
              </span>
            </div>
            <p className="text-sm text-white font-medium mb-1">{alert.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>User: <span className="text-slate-300 font-medium">{alert.userName}</span></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {alert.timestamp}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <p className={`text-2xl font-bold ${config.color}`}>{alert.riskScore}</p>
          <p className="text-xs text-slate-500">Risk Score</p>
          {alert.status !== 'RESOLVED' && (
            <div className="flex gap-2 mt-1">
              {alert.relatedIncidentId && (
                <button
                  onClick={onInvestigate}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-orange-600 hover:bg-orange-500 text-white'
                  }`}
                >
                  Investigate
                </button>
              )}
              <button
                onClick={onResolve}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
              >
                Resolve
              </button>
            </div>
          )}
          {alert.status === 'RESOLVED' && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Resolved</span>
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
    <div className="p-6 pb-20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Alerts</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {unresolvedCount} unresolved alert{unresolvedCount !== 1 ? 's' : ''} requiring attention
          </p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold">{criticalCount} Critical</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Alerts', value: alerts.length, color: 'text-white' },
          { label: 'Critical', value: alerts.filter((a) => a.severity === 'CRITICAL').length, color: 'text-red-400' },
          { label: 'Unresolved', value: unresolvedCount, color: 'text-orange-400' },
          { label: 'Resolved', value: alerts.filter((a) => a.status === 'RESOLVED').length, color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {severityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterSeverity(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === opt ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === opt ? 'bg-slate-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No alerts found</p>
          <p className="text-slate-500 text-sm mt-1">All clear. No unresolved critical incidents.</p>
        </div>
      ) : (
        <div className="space-y-3">
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
