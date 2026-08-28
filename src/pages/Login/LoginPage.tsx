import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0B0C0D] text-[#F2F0EA] flex items-center justify-center p-4 relative overflow-hidden bg-tech-grid">
      <div className="relative w-full max-w-md animate-page-enter">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#151617] border border-[#C19A5A]/30 rounded-xl mb-4 text-[#C19A5A]">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-widest text-[#F2F0EA] font-mono">SENTINEL</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              ENTERPRISE
            </span>
          </div>
          <p className="text-[#9A9A96] text-xs mt-1.5 font-mono">
            PRIVILEGED BEHAVIOURAL INTELLIGENCE ENGINE
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-7 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#292B2D]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0EA] font-semibold">
              Security Console Authentication
            </span>
            <span className="text-[10px] font-mono text-[#5F8669] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
              ONLINE
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9A9A96] mb-1.5">
                Operator Identifier / Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@sentinel.demo"
                className="w-full bg-[#101112] border border-[#292B2D] rounded-lg px-3.5 py-2.5 text-xs text-[#F2F0EA] font-mono placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9A9A96] mb-1.5">
                Security Key / Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#101112] border border-[#292B2D] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-[#F2F0EA] font-mono placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686A6B] hover:text-[#9A9A96] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] hover:border-[#C19A5A]/50 text-[#F2F0EA] font-mono text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 btn-tactile disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#C19A5A]/30 border-t-[#C19A5A] rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#C19A5A]" />
                  <span>SIGN IN TO SOC CONSOLE</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#292B2D]" />
            <span className="text-[#686A6B] text-[10px] font-mono uppercase tracking-widest">
              QUICK ACCESS
            </span>
            <div className="flex-1 h-px bg-[#292B2D]" />
          </div>

          <button
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full bg-[#C19A5A]/15 hover:bg-[#C19A5A]/25 border border-[#C19A5A]/40 text-[#F2F0EA] font-mono text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 btn-tactile disabled:opacity-50"
          >
            <span>ENTER DEMO ENVIRONMENT</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C19A5A]" />
          </button>

          <p className="text-center text-[10px] font-mono text-[#686A6B] mt-4">
            Pre-authenticated session for presentation & judicial review
          </p>
        </div>

        {/* Technical Coordinate Footer */}
        <div className="text-center text-[11px] font-mono text-[#686A6B] mt-6 flex items-center justify-center gap-3">
          <span>LAT: 28.6139° N</span>
          <span>•</span>
          <span>SYS.VER: 2026.08</span>
          <span>•</span>
          <span>TLS 1.3</span>
        </div>
      </div>
    </div>
  );
}
