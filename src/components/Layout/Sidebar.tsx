import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  Activity,
  Bell,
  Search,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Radio,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/investigation', icon: Search, label: 'Investigations' },
  { to: '/response', icon: Target, label: 'Response Center' },
  { to: '/analytics', icon: BarChart3, label: 'Behaviour Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, alerts } = useApp();
  const unresolvedCritical = alerts.filter(
    (a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED'
  ).length;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#101112] border-r border-[#292B2D] flex flex-col z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#292B2D]">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 bg-[#151617] border border-[#C19A5A]/30 rounded-lg flex items-center justify-center text-[#C19A5A]">
              <Shield className="w-4 h-4" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#5F8669] rounded-full border border-[#101112]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-widest text-[#F2F0EA] font-mono">SENTINEL</h1>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-[#9A9A96] tracking-wider uppercase font-mono mt-0.5">
              Behaviour Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#686A6B]">
            Navigation
          </span>
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#191A1C] text-[#F2F0EA] border border-[#292B2D]'
                  : 'text-[#9A9A96] hover:text-[#F2F0EA] hover:bg-[#151617]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#C19A5A] rounded-r" />
                )}
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#C19A5A]' : 'text-[#686A6B] group-hover:text-[#9A9A96]'
                  }`}
                />
                <span className="tracking-wide">{label}</span>
                {label === 'Alerts' && unresolvedCritical > 0 && (
                  <span className="ml-auto bg-[#A64444]/20 text-[#A64444] border border-[#A64444]/40 text-[10px] font-mono rounded px-1.5 py-0.2 font-bold">
                    {unresolvedCritical}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Telemetry & User Profile */}
      <div className="p-3.5 border-t border-[#292B2D] space-y-2 bg-[#0B0C0D]/50">
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#151617] border border-[#292B2D] rounded text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-[#5F8669]">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="tracking-wider">SYS // ONLINE</span>
          </div>
          <span className="text-[10px] text-[#686A6B]">PORT:8080</span>
        </div>

        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-[#151617] border border-[#292B2D] rounded">
          <div className="w-6 h-6 bg-[#191A1C] border border-[#292B2D] rounded flex items-center justify-center text-[10px] font-mono font-bold text-[#C19A5A]">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#F2F0EA] font-medium truncate">Security Analyst</p>
            <p className="text-[10px] text-[#686A6B] font-mono truncate">analyst@sentinel.demo</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-[#686A6B] hover:text-[#A64444] transition-colors p-1"
            title="Logout from console"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-2 pt-1 flex items-center justify-between text-[10px] font-mono text-[#686A6B]">
          <span className="flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" /> SNTL-ENGINE
          </span>
          <span>© 2026</span>
        </div>
      </div>
    </aside>
  );
}
