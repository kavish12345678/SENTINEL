import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../UI/ToastContainer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
      <ToastContainer />
      {/* Demo Footer */}
      <div className="fixed bottom-0 left-64 right-0 py-1 px-4 bg-slate-900/80 backdrop-blur border-t border-slate-700/30 z-30">
        <p className="text-center text-xs text-slate-500">
          ⚠️ Demo environment — All users, transactions and activities are simulated. No real financial data.
        </p>
      </div>
    </div>
  );
}
