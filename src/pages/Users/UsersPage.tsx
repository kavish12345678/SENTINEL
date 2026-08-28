import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ChevronRight, Clock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRiskLevel, getRiskBgColor } from '../../utils/riskEngine';
import type { User } from '../../types';

const accessColors: Record<string, string> = {
  LOW: 'text-green-400 bg-green-500/10 border-green-500/30',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const statusColors: Record<string, string> = {
  NORMAL: 'text-green-400',
  SUSPICIOUS: 'text-yellow-400',
  RESTRICTED: 'text-orange-400',
  CRITICAL: 'text-red-400',
};

const statusDot: Record<string, string> = {
  NORMAL: 'bg-green-500',
  SUSPICIOUS: 'bg-yellow-500',
  RESTRICTED: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

function UserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all duration-150 group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          user.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/40' :
          user.status === 'RESTRICTED' ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/40' :
          user.status === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-slate-700 text-slate-300'
        }`}>
          {user.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{user.name}</p>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[user.status] || 'bg-slate-500'}`} />
          </div>
          <p className="text-xs text-slate-400">{user.role}</p>
        </div>

        {/* Access level */}
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${accessColors[user.accessLevel]}`}>
          {user.accessLevel}
        </span>

        {/* Risk score */}
        <div className="text-right">
          <p className={`text-lg font-bold ${
            user.riskScore >= 81 ? 'text-red-400' :
            user.riskScore >= 61 ? 'text-orange-400' :
            user.riskScore >= 31 ? 'text-yellow-400' : 'text-green-400'
          }`}>{user.riskScore}</p>
          <p className="text-xs text-slate-500">Risk</p>
        </div>

        {/* Status */}
        <div className="text-right w-24">
          <p className={`text-xs font-semibold ${statusColors[user.status] || 'text-slate-300'}`}>{user.status}</p>
          <p className="text-xs text-slate-500 mt-0.5">{user.lastActivity}</p>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  );
}

function UserProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const navigate = useNavigate();
  const riskColor = user.riskScore >= 81 ? 'text-red-400' : user.riskScore >= 61 ? 'text-orange-400' : user.riskScore >= 31 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
                user.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/40' :
                user.status === 'RESTRICTED' ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/40' :
                user.status === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-800 text-slate-300'
              }`}>
                {user.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-slate-400">{user.role}</p>
                <p className="text-xs text-slate-500">{user.department} · {user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl font-bold px-2">×</button>
          </div>

          {/* Risk & Status */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold ${riskColor}`}>{user.riskScore}</p>
              <p className="text-xs text-slate-400 mt-1">Risk Score</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mt-1 inline-block ${getRiskBgColor(user.riskScore)}`}>
                {getRiskLevel(user.riskScore)}
              </span>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className={`text-lg font-bold mt-1 ${statusColors[user.status] || 'text-white'}`}>{user.status}</p>
              <p className="text-xs text-slate-400 mt-1">Status</p>
              <p className="text-xs text-slate-500 mt-1">Baseline: {user.baselineRiskScore}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <span className={`text-sm px-2 py-1 rounded-full border font-medium ${accessColors[user.accessLevel]}`}>
                {user.accessLevel}
              </span>
              <p className="text-xs text-slate-400 mt-2">Access Level</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-semibold text-white">Normal Working Hours</p>
              </div>
              <p className="text-slate-300">{user.normalWorkingHours.start} – {user.normalWorkingHours.end}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <p className="text-sm font-semibold text-white">Typical Transaction</p>
              </div>
              <p className="text-slate-300">
                ₹{(user.normalTransactionRange.min / 1000).toFixed(0)}K – ₹{(user.normalTransactionRange.max / 100000).toFixed(1)}L
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-white mb-2">Frequently Accessed Resources</p>
            <div className="flex flex-wrap gap-2">
              {user.typicalResources.map((r) => (
                <span key={r} className="text-xs px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg">{r}</span>
              ))}
            </div>
          </div>

          {/* Beneficiaries */}
          {user.typicalBeneficiaries.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-white mb-2">Common Beneficiaries</p>
              <div className="flex flex-wrap gap-2">
                {user.typicalBeneficiaries.map((b) => (
                  <span key={b} className="text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { navigate('/activity'); onClose(); }}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-sm"
            >
              View Activity
            </button>
            <button
              onClick={() => { navigate('/investigation'); onClose(); }}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Investigate User
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
    <div className="p-6 pb-20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Privileged Users</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Monitor {users.length} privileged accounts and their behaviour profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live Monitoring</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: users.length, color: 'text-white' },
          { label: 'Normal', value: users.filter((u) => u.status === 'NORMAL').length, color: 'text-green-400' },
          { label: 'Suspicious', value: users.filter((u) => u.status === 'SUSPICIOUS').length, color: 'text-yellow-400' },
          { label: 'Restricted / Critical', value: users.filter((u) => u.status === 'CRITICAL' || u.status === 'RESTRICTED').length, color: 'text-red-400' },
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
            placeholder="Search users or roles..."
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

      {/* Users list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No users found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} onClick={() => setSelectedUser(user)} />
          ))}
        </div>
      )}

      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
