import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Activity,
  AlertTriangle,
  Search,
  ShieldCheck,
  BarChart2,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { alerts, logout } = useApp();
  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'People', path: '/users', icon: Users },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle, count: unresolvedAlertCount },
    { label: 'Investigations', path: '/investigation', icon: Search },
    { label: 'Response', path: '/response', icon: ShieldAlert },
    { label: 'Behaviour', path: '/behaviour', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E5E3DE] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#E5E3DE]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-[#171717]">SENTINEL</span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#6B6B6B] truncate">Privileged Behaviour Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Core Console
          </span>
        </div>

        {navItems.map(({ label, path, icon: Icon, count }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#F6F5F2] text-[#171717] font-semibold border-l-2 border-[#171717] shadow-2xs'
                  : 'text-[#6B6B6B] hover:text-[#171717] hover:bg-[#F6F5F2]/60'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-[#6B6B6B]" />
              <span>{label}</span>
            </div>
            {Boolean(count && count > 0) && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/20">
                {count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom System Status & User Info */}
      <div className="p-3.5 border-t border-[#E5E3DE] bg-[#FAFAF8] space-y-3">
        {/* System Health Strip */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white border border-[#E5E3DE] text-[11px]">
          <span className="text-[#6B6B6B]">System Status</span>
          <span className="flex items-center gap-1.5 font-medium text-[#26734D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26734D] animate-pulse" />
            Operational
          </span>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#171717] truncate">Security Analyst</p>
              <p className="text-[10px] text-[#6B6B6B] truncate">Demo Environment</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-[#6B6B6B] hover:text-[#171717] p-1.5 rounded hover:bg-neutral-200/60 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
