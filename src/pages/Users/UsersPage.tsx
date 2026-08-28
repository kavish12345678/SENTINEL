import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';

function UserProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const navigate = useNavigate();

  const getRiskColor = (score: number) => {
    if (score >= 81) return '#ffb4ab';
    if (score >= 61) return '#e8c178';
    if (score >= 31) return '#e8c178';
    return '#c7c7bf';
  };

  const riskColor = getRiskColor(user.riskScore);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c16] border border-[#464742] rounded-xs w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-[#e5e2d9]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#464742]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xs bg-[#20201a] border border-[#464742] text-[#e8c178] flex items-center justify-center text-base font-bold font-mono">
                {user.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-mono text-[#e5e2d9]">{user.name}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#20201a] border border-[#464742] uppercase text-[#c7c7bf]">
                    {user.accessLevel} Access
                  </span>
                </div>
                <p className="text-xs text-[#91918a]">{user.role} · {user.department}</p>
                <p className="text-[11px] text-[#91918a] font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#91918a] hover:text-[#e5e2d9] p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Bar */}
          <div className="p-4 bg-[#14140f] border border-[#464742] rounded-xs space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#91918a]">
                Evaluated Risk Score
              </span>
              <span className="text-base font-bold" style={{ color: riskColor }}>
                {user.riskScore} / 100
              </span>
            </div>

            <div className="h-2 bg-[#20201a] rounded-xs overflow-hidden flex border border-[#464742]/50">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${user.riskScore}%`,
                  backgroundColor: riskColor,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#91918a]">
              <span>Baseline: {user.baselineRiskScore}/100</span>
              <span className="font-semibold" style={{ color: riskColor }}>
                {user.status === 'CRITICAL' ? 'Significant Anomaly Sequence' : user.status}
              </span>
            </div>
          </div>

          {/* Baseline Profile */}
          <div className="space-y-3 font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
              Established Behavioural Baseline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#91918a]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#e5e2d9]">Normal Working Hours</span>
                </div>
                <p className="text-[#c7c7bf]">{user.normalWorkingHours.start} – {user.normalWorkingHours.end}</p>
                <p className="text-[10px] text-[#91918a]">Evaluated against 90-day peer group baseline</p>
              </div>

              <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#91918a]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#e5e2d9]">Typical Transaction Range</span>
                </div>
                <p className="text-[#c7c7bf]">
                  ₹{(user.normalTransactionRange.min / 1000).toFixed(0)}K – ₹{(user.normalTransactionRange.max / 100000).toFixed(1)}L
                </p>
                <p className="text-[10px] text-[#91918a]">Single-approver financial threshold</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-[#464742]">
            <button
              onClick={() => {
                onClose();
                navigate('/activity');
              }}
              className="flex-1 py-2 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#e5e2d9] font-mono rounded-xs text-xs font-semibold uppercase tracking-wider transition-all"
            >
              [ View Telemetry ]
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/investigation');
              }}
              className="flex-1 py-2 bg-[#e5e2df] hover:bg-white text-[#1c1c1a] font-mono rounded-xs text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              [ Open Case ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'CRITICAL' && (u.status === 'CRITICAL' || u.status === 'RESTRICTED')) ||
      u.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/40';
      case 'RESTRICTED':
        return 'bg-[#812627]/30 text-[#ffb3af] border-[#ffb3af]/40';
      case 'SUSPICIOUS':
        return 'bg-[#5f4504]/30 text-[#e8c178] border-[#e8c178]/40';
      default:
        return 'bg-[#20201a] text-[#c7c7bf] border-[#464742]';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 81) return 'text-[#ffb4ab]';
    if (score >= 61) return 'text-[#e8c178]';
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
            placeholder="Search privileged identities, roles, departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1c1c16] border border-[#464742] rounded-xs pl-9 pr-4 py-2 font-mono text-xs text-[#e5e2d9] placeholder-[#91918a] focus:outline-none focus:border-[#e8c178]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-mono">
          <Filter className="w-3.5 h-3.5 text-[#91918a] mr-1" />
          {['ALL', 'NORMAL', 'SUSPICIOUS', 'CRITICAL'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3 py-1 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === opt
                  ? 'bg-[#e5e2df] text-[#1c1c1a]'
                  : 'bg-[#1c1c16] border border-[#464742] text-[#91918a] hover:text-[#e5e2d9]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs shadow-xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#14140f] border-b border-[#464742] text-[11px] font-bold text-[#91918a] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Identity</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Access Level</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Last Telemetry</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464742]/40">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-[#20201a] cursor-pointer transition-colors group"
                >
                  {/* Identity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xs bg-[#20201a] border border-[#464742] text-[#e8c178] flex items-center justify-center text-[11px] font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2d9] group-hover:text-[#e8c178] transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-[#91918a]">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-[#c7c7bf]">
                    <p className="font-medium text-[#e5e2d9]">{user.role}</p>
                    <p className="text-[10px] text-[#91918a]">{user.department}</p>
                  </td>

                  {/* Access Level */}
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#20201a] border border-[#464742] text-[#c7c7bf] uppercase">
                      {user.accessLevel}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-xs border uppercase tracking-wider ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3 px-4 font-bold">
                    <span className={getRiskColor(user.riskScore)}>{user.riskScore}</span>
                    <span className="text-[#91918a] font-normal text-[10px]"> / 100</span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-3 px-4 text-[#91918a] text-[11px]">
                    {user.lastActivity}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-[#91918a] inline-block group-hover:text-[#e8c178] transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
