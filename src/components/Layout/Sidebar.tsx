import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  Activity,
  Bell,
  Search,
  Cpu,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Wifi,
  FlaskConical,
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700/50 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/40 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-widest">SENTINEL</h1>
            <p className="text-xs text-slate-400 leading-tight">Behaviour Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
              ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
            {label === 'Alerts' && unresolvedCritical > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unresolvedCritical}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Wifi className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-green-400 font-medium">System: ONLINE</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Demo Mode Active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">Security Analyst</p>
            <p className="text-xs text-slate-500 truncate">analyst@sentinel.demo</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-slate-500" />
            <p className="text-xs text-slate-500">
              © 2026 SENTINEL — Demo Environment
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
