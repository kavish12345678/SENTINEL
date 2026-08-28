import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';

function UserProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const navigate = useNavigate();

  const getRiskColor = (score: number) => {
    if (score >= 81) return '#C62828';
    if (score >= 61) return '#C65D21';
    if (score >= 31) return '#A87516';
    return '#26734D';
  };

  const riskColor = getRiskColor(user.riskScore);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E5E3DE] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-[#171717]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E5E3DE]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#171717] text-white flex items-center justify-center text-base font-bold shadow-sm">
                {user.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#171717]">{user.name}</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 uppercase text-[#6B6B6B]">
                    {user.accessLevel} Access
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B]">{user.role} · {user.department}</p>
                <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#8A8A8A] hover:text-[#171717] p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Horizontal Risk Bar */}
          <div className="p-4 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#6B6B6B]">
                Evaluated Risk Score
              </span>
              <span className="text-base font-bold font-mono" style={{ color: riskColor }}>
                {user.riskScore} / 100
              </span>
            </div>

            {/* Segmented Risk Bar */}
            <div className="h-2 bg-[#E5E3DE] rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${user.riskScore}%`,
                  backgroundColor: riskColor,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8A8A8A]">
              <span>Baseline: {user.baselineRiskScore}/100</span>
              <span className="font-semibold" style={{ color: riskColor }}>
                {user.status === 'CRITICAL' ? 'Significant Anomaly Sequence' : user.status}
              </span>
            </div>
          </div>

          {/* Behavioural Baseline Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Established Behavioural Baseline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white border border-[#E5E3DE] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#171717]">Normal Working Hours</span>
                </div>
                <p className="text-[#6B6B6B]">{user.normalWorkingHours.start} – {user.normalWorkingHours.end}</p>
                <p className="text-[10px] text-[#8A8A8A]">Evaluated against 90-day peer group baseline</p>
              </div>

              <div className="p-3.5 bg-white border border-[#E5E3DE] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#171717]">Typical Transaction Range</span>
                </div>
                <p className="text-[#6B6B6B]">
                  ₹{(user.normalTransactionRange.min / 1000).toFixed(0)}K – ₹{(user.normalTransactionRange.max / 100000).toFixed(1)}L
                </p>
                <p className="text-[10px] text-[#8A8A8A]">Single-approver financial threshold limit</p>
              </div>
            </div>
          </div>

          {/* Resources & Beneficiaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <p className="font-semibold text-[#171717]">Common Resources</p>
              <div className="flex flex-wrap gap-1.5">
                {user.typicalResources.map((res) => (
                  <span
                    key={res}
                    className="px-2 py-0.5 bg-[#F6F5F2] border border-[#E5E3DE] rounded text-[11px] text-[#171717]"
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-semibold text-[#171717]">Typical Beneficiaries</p>
              <div className="flex flex-wrap gap-1.5">
                {user.typicalBeneficiaries.map((b) => (
                  <span
                    key={b}
                    className="px-2 py-0.5 bg-[#F6F5F2] border border-[#E5E3DE] rounded text-[11px] text-[#171717]"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-[#E5E3DE]">
            <button
              onClick={() => {
                onClose();
                navigate('/activity');
              }}
              className="flex-1 py-2 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] rounded-lg text-xs font-semibold transition-all"
            >
              View Activity Logs
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/investigation');
              }}
              className="flex-1 py-2 bg-[#171717] hover:bg-[#2E2E2E] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs"
            >
              Investigate Identity
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
        return 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25';
      case 'RESTRICTED':
        return 'bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/25';
      case 'SUSPICIOUS':
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search privileged identities, roles, departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E5E3DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#8A8A8A] mr-1" />
          {['ALL', 'NORMAL', 'SUSPICIOUS', 'CRITICAL'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === opt
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-white border border-[#E5E3DE] text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E5E3DE] text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Identity</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Access Level</th>
                <th className="py-3.5 px-4 font-semibold">Behaviour Status</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-[#F6F5F2]/80 cursor-pointer transition-colors group"
                >
                  {/* Identity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-[11px] font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-[#171717] group-hover:underline">{user.name}</p>
                        <p className="text-[11px] text-[#8A8A8A] font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-[#6B6B6B]">
                    <p className="font-medium text-[#171717]">{user.role}</p>
                    <p className="text-[11px] text-[#8A8A8A]">{user.department}</p>
                  </td>

                  {/* Access Level */}
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#171717]">
                      {user.accessLevel}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={getRiskColor(user.riskScore)}>{user.riskScore}</span>
                    <span className="text-[#8A8A8A] font-normal text-[11px]"> / 100</span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-3 px-4 text-[#6B6B6B] font-mono text-[11px]">
                    {user.lastActivity}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-[#8A8A8A] inline-block group-hover:text-[#171717] transition-colors" />
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
