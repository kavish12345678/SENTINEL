import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login();
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    login();
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#171717] text-white shadow-md mb-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#171717]">SENTINEL</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
            Privileged Behaviour Intelligence
          </p>
          <p className="text-xs text-[#8A8A8A]">
            Continuous behavioural anomaly detection for enterprise banking & PAM
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E3DE] rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Sign In to Security Console</h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Authenticate with your enterprise credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@bank.sentinel.internal"
                className="w-full bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#171717] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171717] hover:bg-[#2E2E2E] disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Console'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E3DE]" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-medium text-[#8A8A8A]">
              Or Explore Live Demo
            </span>
          </div>

          {/* 1-Click Demo Access */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Enter Demo Environment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#8A8A8A]">
          🔒 CSI ORIGIN 2026 Hackathon Demo · Privileged Access Misuse Detection
        </p>
      </div>
    </div>
  );
}
