import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../UI/ToastContainer';
import { ShieldCheck, Activity } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0C0D] text-[#F2F0EA]">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col relative bg-tech-grid">
        {/* Subtle Top Utility Bar */}
        <header className="h-11 border-b border-[#292B2D] bg-[#101112]/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-mono text-[#9A9A96] z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <span className="text-[#686A6B] uppercase tracking-wider text-[10px]">
              SNTL // SOC INTELLIGENCE PLATFORM
            </span>
            <span className="text-[#292B2D]">|</span>
            <div className="flex items-center gap-1.5 text-[#5F8669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
              <span className="text-[11px]">TELEMETRY: ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#9A9A96]">
              <Activity className="w-3 h-3 text-[#C19A5A]" />
              <span>LATENCY: 14ms</span>
            </div>
            <span className="text-[#292B2D]">|</span>
            <div className="flex items-center gap-1.5 text-[#9A9A96]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5F8669]" />
              <span>PAM ENGINE: ENFORCED</span>
            </div>
          </div>
        </header>

        {/* Main Content Area with page enter animation */}
        <main key={location.pathname} className="flex-1 pb-10 animate-page-enter">
          <Outlet />
        </main>

        <ToastContainer />

        {/* Subtle Bottom Technical Footer */}
        <footer className="py-2 px-6 bg-[#101112]/95 border-t border-[#292B2D] flex items-center justify-between text-[11px] font-mono text-[#686A6B] z-10">
          <span>⚠️ DEMO ENVIRONMENT // SIMULATED BANKING BEHAVIOUR TELEMETRY</span>
          <span>SESSION: SOC-ANALYST-SECURE // ASIA/KOLKATA</span>
        </footer>
      </div>
    </div>
  );
}
