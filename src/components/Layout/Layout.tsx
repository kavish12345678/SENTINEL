import { Outlet, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import ToastContainer from '../UI/ToastContainer';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const location = useLocation();
  const { alerts } = useApp();
  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': {
      title: 'Security Overview',
      subtitle: 'Continuous visibility across privileged activity.',
    },
    '/users': {
      title: 'Privileged Identities',
      subtitle: 'Directory of privileged accounts, access scopes, and behavioural variance baselines.',
    },
    '/activity': {
      title: 'Activity Monitor',
      subtitle: 'Real-time telemetry event stream with forensic behavioral anomaly scoring.',
    },
    '/alerts': {
      title: 'Security Alerts',
      subtitle: 'Prioritised triage queue of behavioural outliers and high-risk sequence triggers.',
    },
    '/investigation': {
      title: 'Case Investigation',
      subtitle: 'Comprehensive forensic intelligence summary and multi-factor risk attribution.',
    },
    '/response': {
      title: 'Response Center',
      subtitle: 'Execute graduated containment protocols and dispatch Telegram security alerts.',
    },
    '/behaviour': {
      title: 'Behaviour Analytics',
      subtitle: 'Baseline statistical distributions, access timing matrices, and peer group models.',
    },
    '/settings': {
      title: 'System Configuration',
      subtitle: 'Engine threshold parameters, webhook channels, and Telegram Bot integration.',
    },
  };

  const currentInfo = pageTitles[location.pathname] || {
    title: 'Security Console',
    subtitle: 'Privileged Behaviour Intelligence Platform',
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#171717] flex font-sans">
      <Sidebar />

      <div className="flex-1 ml-60 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E5E3DE] px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-bold text-[#171717] tracking-tight">{currentInfo.title}</h1>
            <p className="text-xs text-[#6B6B6B] hidden sm:block">{currentInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search telemetry, users, cases..."
                className="w-56 bg-[#F6F5F2] border border-[#E5E3DE] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:bg-white transition-all"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-2 rounded-lg text-[#6B6B6B] hover:text-[#171717] hover:bg-[#F6F5F2] transition-colors border border-transparent hover:border-[#E5E3DE]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unresolvedAlertCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C62828]" />
                )}
              </button>
            </div>

            <div className="h-5 w-px bg-[#E5E3DE]" />

            {/* Demo Mode Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#26734D]/10 border border-[#26734D]/25 text-[#26734D] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26734D]" />
              <span>Demo Mode</span>
            </div>

            {/* Analyst Avatar */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
