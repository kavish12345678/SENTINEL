import { Outlet } from 'react-router-dom';
import { Bell, LayoutGrid, Radio } from 'lucide-react';
import Sidebar from './Sidebar';
import ToastContainer from '../UI/ToastContainer';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { alerts, demoState } = useApp();
  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#14140f] text-[#e5e2d9] flex font-sans selection:bg-[#e8c178] selection:text-[#412d00]">
      {/* Background micro-grid */}
      <div className="fixed inset-0 micro-grid pointer-events-none z-0 opacity-40" />

      <Sidebar />

      <div className="flex-1 ml-[64px] flex flex-col min-w-0 relative z-10">
        {/* Top App Bar matching Desktop/SENTINEL template */}
        <header className="h-12 w-full bg-[#14140f] border-b border-[#464742] flex justify-between items-center px-6 font-mono text-xs z-40 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest text-[#e5e2d9] text-[11px]">
              SNTL // INTELLIGENCE ENGINE
            </span>
            {demoState.isRunning && (
              <span className="text-[10px] px-2 py-0.5 bg-[#e8c178]/10 text-[#e8c178] border border-[#e8c178]/30 rounded-xs flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3 h-3" /> SIMULATION ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[#c7c7bf]">
            <div className="hidden md:flex items-center text-[11px]">
              <span className="text-[#c7c7bf] px-3 border-r border-[#464742]">24 IDENTITIES</span>
              <span className="text-[#c9c6c4] px-3 border-r border-[#464742]">11 ACTIVE</span>
              <span className="text-[#ffb4ab] px-3 border-r border-[#464742] font-semibold">03 INCIDENTS</span>
              <span className="text-[#c7c7bf] px-3">1,284 OBSERVATIONS</span>
            </div>

            <div className="flex items-center gap-2 border-l border-[#464742] pl-3">
              <button
                className="hover:text-[#e8c178] transition-colors p-1 relative"
                title="Alert Notifications"
              >
                <Bell className="w-4 h-4" />
                {unresolvedAlertCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#ffb4ab]" />
                )}
              </button>
              <button className="hover:text-[#e8c178] transition-colors p-1" title="Terminal View">
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 min-w-0 p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
