import { NavLink } from 'react-router-dom';
import {
  User,
  Activity,
  AlertTriangle,
  Radio,
  ArrowUpRight,
  Settings,
  LineChart,
  Terminal,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { alerts, logout } = useApp();
  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LineChart, tooltip: 'Behaviour Canvas' },
    { label: 'Identities', path: '/users', icon: User, tooltip: 'Identities' },
    { label: 'Activity', path: '/activity', icon: Terminal, tooltip: 'Telemetry' },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle, count: unresolvedAlertCount, tooltip: 'Alerts' },
    { label: 'Inv', path: '/investigation', icon: Radio, tooltip: 'Investigation' },
    { label: 'Resp', path: '/response', icon: ArrowUpRight, tooltip: 'Response' },
    { label: 'Behaviour', path: '/behaviour', icon: Activity, tooltip: 'Analytics' },
    { label: 'Settings', path: '/settings', icon: Settings, tooltip: 'Settings' },
  ];

  return (
    <nav className="w-[64px] h-full fixed left-0 top-0 bg-[#0e0e0a] border-r border-[#464742] flex flex-col items-center py-4 z-50 select-none">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <span
          className="font-mono text-sm font-bold tracking-widest text-[#e5e2d9] block text-center"
          title="Sentinel Intelligence"
        >
          SNTL
        </span>
        <span className="text-[8px] font-mono text-[#e8c178] uppercase tracking-tighter">v2.0</span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 w-full flex-1">
        {navItems.map(({ label, path, icon: Icon, count, tooltip }) => (
          <NavLink
            key={path}
            to={path}
            title={tooltip}
            className={({ isActive }) =>
              `w-full flex flex-col items-center justify-center py-2 relative transition-all duration-150 group ${
                isActive
                  ? 'text-[#e8c178] border-l-2 border-[#e8c178] bg-[#20201a]'
                  : 'text-[#c7c7bf] hover:text-[#e5e2d9] hover:bg-[#2a2a24] border-l-2 border-transparent'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono tracking-tight opacity-75 group-hover:opacity-100">
              {label}
            </span>

            {Boolean(count && count > 0) && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-auto w-full pt-3 border-t border-[#464742]/50 flex justify-center">
        <button
          onClick={logout}
          className="p-2 text-[#91918a] hover:text-[#ffb4ab] transition-colors"
          title="Disconnect Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
