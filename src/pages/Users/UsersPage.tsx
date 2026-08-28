import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ChevronRight, Clock, Shield, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRiskLevel, getRiskBgColor } from '../../utils/riskEngine';
import type { User } from '../../types';

const accessColors: Record<string, string> = {
  LOW: 'text-[#5F8669] bg-[#5F8669]/10 border-[#5F8669]/30',
  MEDIUM: 'text-[#C19A5A] bg-[#C19A5A]/10 border-[#C19A5A]/30',
  HIGH: 'text-[#B67842] bg-[#B67842]/10 border-[#B67842]/30',
  CRITICAL: 'text-[#A64444] bg-[#A64444]/15 border-[#A64444]/40',
};

const statusColors: Record<string, string> = {
  NORMAL: 'text-[#5F8669]',
  SUSPICIOUS: 'text-[#C19A5A]',
  RESTRICTED: 'text-[#B67842]',
  CRITICAL: 'text-[#A64444]',
};

const statusDot: Record<string, string> = {
  NORMAL: 'bg-[#5F8669]',
  SUSPICIOUS: 'bg-[#C19A5A]',
  RESTRICTED: 'bg-[#B67842]',
  CRITICAL: 'bg-[#A64444]',
};

function UserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#151617] border border-[#292B2D] hover:border-[#383B3E] hover:bg-[#191A1C] rounded-lg p-3.5 cursor-pointer transition-all duration-150 group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
            user.status === 'CRITICAL'
              ? 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40'
              : user.status === 'RESTRICTED'
              ? 'bg-[#B67842]/20 text-[#B67842] border border-[#B67842]/40'
              : user.status === 'SUSPICIOUS'
              ? 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/40'
              : 'bg-[#191A1C] text-[#F2F0EA] border border-[#292B2D]'
          }`}
        >
          {user.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-xs text-[#F2F0EA] group-hover:text-[#C19A5A] transition-colors truncate">
              {user.name}
            </p>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[user.status] || 'bg-[#686A6B]'}`} />
          </div>
          <p className="text-[11px] text-[#9A9A96] truncate">{user.role}</p>
        </div>

        {/* Access level */}
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${accessColors[user.accessLevel]}`}>
          {user.accessLevel}
        </span>

        {/* Risk score */}
        <div className="text-right font-mono">
          <p
            className={`text-base font-bold ${
              user.riskScore >= 81
                ? 'text-[#A64444]'
                : user.riskScore >= 61
                ? 'text-[#B67842]'
                : user.riskScore >= 31
                ? 'text-[#C19A5A]'
                : 'text-[#5F8669]'
            }`}
          >
            {user.riskScore}
          </p>
          <span className="text-[9px] text-[#686A6B] uppercase">RISK</span>
        </div>

        {/* Status */}
        <div className="text-right w-24 font-mono">
          <p className={`text-[11px] font-semibold ${statusColors[user.status] || 'text-[#9A9A96]'}`}>{user.status}</p>
          <p className="text-[10px] text-[#686A6B] mt-0.5">{user.lastActivity}</p>
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-[#686A6B] group-hover:text-[#F2F0EA] transition-colors" />
      </div>
    </div>
  );
}

function UserProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const navigate = useNavigate();
  const riskColor =
    user.riskScore >= 81
      ? 'text-[#A64444]'
      : user.riskScore >= 61
      ? 'text-[#B67842]'
      : user.riskScore >= 31
      ? 'text-[#C19A5A]'
      : 'text-[#5F8669]';

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#151617] border border-[#292B2D] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#292B2D]">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold ${
                  user.status === 'CRITICAL'
                    ? 'bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40'
                    : user.status === 'RESTRICTED'
                    ? 'bg-[#B67842]/20 text-[#B67842] border border-[#B67842]/40'
                    : user.status === 'SUSPICIOUS'
                    ? 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/40'
                    : 'bg-[#191A1C] text-[#F2F0EA] border border-[#292B2D]'
                }`}
              >
                {user.avatar}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F2F0EA]">{user.name}</h2>
                <p className="text-xs text-[#9A9A96]">{user.role}</p>
                <p className="text-[11px] font-mono text-[#686A6B] mt-0.5">
                  {user.department} · {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#686A6B] hover:text-[#F2F0EA] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Risk & Status */}
          <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
            <div className="bg-[#101112] border border-[#292B2D] rounded-lg p-3.5 text-center">
              <p className={`text-2xl font-bold ${riskColor}`}>{user.riskScore}</p>
              <span className="text-[10px] text-[#686A6B] uppercase block mt-0.5">Risk Score</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-medium mt-1.5 inline-block ${getRiskBgColor(user.riskScore)}`}>
                {getRiskLevel(user.riskScore)}
              </span>
            </div>
            <div className="bg-[#101112] border border-[#292B2D] rounded-lg p-3.5 text-center">
              <p className={`text-sm font-bold mt-1 ${statusColors[user.status] || 'text-[#F2F0EA]'}`}>{user.status}</p>
              <span className="text-[10px] text-[#686A6B] uppercase block mt-1">Status</span>
              <span className="text-[10px] text-[#9A9A96] block mt-1">Base: {user.baselineRiskScore}</span>
            </div>
            <div className="bg-[#101112] border border-[#292B2D] rounded-lg p-3.5 text-center">
              <span className={`text-xs px-2 py-0.5 rounded border uppercase ${accessColors[user.accessLevel]}`}>
                {user.accessLevel}
              </span>
              <span className="text-[10px] text-[#686A6B] uppercase block mt-2">Access Tier</span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3.5 mb-5 font-mono text-xs">
            <div className="bg-[#101112] border border-[#292B2D] rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-1.5 text-[#C19A5A]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Working Hours</span>
              </div>
              <p className="text-[#F2F0EA]">{user.normalWorkingHours.start} – {user.normalWorkingHours.end}</p>
            </div>
            <div className="bg-[#101112] border border-[#292B2D] rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-1.5 text-[#C19A5A]">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Typical Wire</span>
              </div>
              <p className="text-[#F2F0EA]">
                ₹{(user.normalTransactionRange.min / 1000).toFixed(0)}K – ₹{(user.normalTransactionRange.max / 100000).toFixed(1)}L
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#686A6B] block mb-2">
              FREQUENTLY ACCESSED RESOURCES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.typicalResources.map((r) => (
                <span key={r} className="text-[11px] font-mono px-2 py-0.5 bg-[#191A1C] border border-[#292B2D] text-[#9A9A96] rounded">
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Beneficiaries */}
          {user.typicalBeneficiaries.length > 0 && (
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#686A6B] block mb-2">
                COMMON BENEFICIARIES
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.typicalBeneficiaries.map((b) => (
                  <span key={b} className="text-[11px] font-mono px-2 py-0.5 bg-[#191A1C] border border-[#292B2D] text-[#5F8669] rounded">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 font-mono text-xs pt-2 border-t border-[#292B2D]">
            <button
              onClick={() => {
                navigate('/activity');
                onClose();
              }}
              className="flex-1 py-2 px-3 bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] text-[#F2F0EA] font-semibold rounded-lg transition-all btn-tactile"
            >
              VIEW ACTIVITY
            </button>
            <button
              onClick={() => {
                navigate('/investigation');
                onClose();
              }}
              className="flex-1 py-2 px-3 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 text-[#F2F0EA] font-semibold rounded-lg transition-all btn-tactile"
            >
              INVESTIGATE USER
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
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || u.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = ['ALL', 'NORMAL', 'SUSPICIOUS', 'RESTRICTED', 'CRITICAL'];

  return (
    <div className="p-7 pb-20 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              PRIVILEGED IDENTITIES
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              {users.length} PROFILES
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Continuous behavioral baseline tracking for all privileged accounts
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5F8669]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
          <span>REAL-TIME SURVEILLANCE</span>
        </div>
      </div>

      {/* Status Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {[
          { label: 'TOTAL IDENTITIES', value: users.length, color: 'text-[#F2F0EA]' },
          { label: 'NORMAL BEHAVIOUR', value: users.filter((u) => u.status === 'NORMAL').length, color: 'text-[#5F8669]' },
          { label: 'SUSPICIOUS (ELEVATED)', value: users.filter((u) => u.status === 'SUSPICIOUS').length, color: 'text-[#C19A5A]' },
          {
            label: 'RESTRICTED / CRITICAL',
            value: users.filter((u) => u.status === 'CRITICAL' || u.status === 'RESTRICTED').length,
            color: 'text-[#A64444]',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#151617] border border-[#292B2D] rounded-lg p-3.5 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <span className="text-[10px] text-[#686A6B] uppercase tracking-wider block mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Strip */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#686A6B]" />
          <input
            type="text"
            placeholder="Search privileged users, roles, departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151617] border border-[#292B2D] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F2F0EA] font-mono placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono">
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

      {/* Users list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#151617] border border-[#292B2D] rounded-xl">
          <Users className="w-10 h-10 text-[#686A6B] mx-auto mb-2 opacity-50" />
          <p className="text-xs font-mono text-[#9A9A96]">NO IDENTITIES MATCHING SEARCH CRITERIA</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} onClick={() => setSelectedUser(user)} />
          ))}
        </div>
      )}

      {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
