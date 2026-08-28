import { useState, useEffect } from 'react';
import {
  UserX,
  FileCheck,
  Send,
  CheckCircle,
  AlertOctagon,
  Clock,
  Radio,
  XCircle,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createTelegramShareLink, formatResponseActionNotification } from '../../utils/telegramService';

export default function ResponseCenterPage() {
  const { incident, auditRecords, executeResponseAction, isDispatching, addToast } = useApp();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [serverBotToken, setServerBotToken] = useState('');
  const [serverChatId, setServerChatId] = useState('');
  const [backendStatus, setBackendStatus] = useState<{
    tested: boolean;
    connected: boolean;
    botUsername?: string;
    botName?: string;
    error?: string;
  }>({
    tested: false,
    connected: false,
  });

  const checkBackendStatus = () => {
    fetch('/api/telegram-status')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus({
          tested: true,
          connected: data.connected,
          botUsername: data.botUsername,
          botName: data.botName,
          error: data.error,
        });
      })
      .catch(() => {
        setBackendStatus({
          tested: true,
          connected: false,
          error: 'Backend API unreachable.',
        });
      });
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const handleSaveTelegramCredentials = async () => {
    if (!serverBotToken.trim() && !serverChatId.trim()) {
      addToast('Please enter a Bot Token or Chat ID to save.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/set-telegram-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: serverBotToken.trim() || undefined,
          chatId: serverChatId.trim() || undefined,
        }),
      });

      if (res.ok) {
        addToast('Credentials saved to backend environment.', 'success');
        checkBackendStatus();
      }
    } catch (e: any) {
      addToast('Error saving credentials to server.', 'error');
    }
  };

  const handleAction = async (actionKey: 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM') => {
    if (isDispatching) return;
    setActiveActionKey(actionKey);
    try {
      await executeResponseAction(actionKey);
    } finally {
      setActiveActionKey(null);
    }
  };

  const getStatusDisplay = () => {
    switch (incident.status) {
      case 'VERIFICATION_REQUIRED':
        return { label: '🟡 Verification Required', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
      case 'RESTRICTED':
        return { label: '🔴 User Restricted', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
      case 'TRANSACTION_SUSPENDED':
        return { label: '🛑 Transaction Suspended', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
      case 'ESCALATED':
        return { label: '🚨 Escalated', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      default:
        return { label: '🔴 Critical Incident Active', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    }
  };

  const statusInfo = getStatusDisplay();

  // Instant pre-formatted direct Telegram link for demonstration fallback
  const samplePayload = formatResponseActionNotification({
    action: 'SUSPEND TRANSACTION',
    status: incident.status,
    caseId: incident.caseId,
    userName: incident.userName,
    targetAmount: '₹18,50,000',
    analyst: 'Security Analyst (SOC L2)',
  });
  const directTelegramLink = createTelegramShareLink(samplePayload);

  return (
    <div className="p-6 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Response Center</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
              Active Mitigation
            </span>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            Execute graduated containment protocols based on evaluated behavioural risk
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-300 ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </div>

      {/* Telegram Alert Recipient & Live Status Banner */}
      <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Telegram Alert Gateway</span>
                {backendStatus.connected ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-extrabold border border-green-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    LIVE: @{backendStatus.botUsername || 'SENTINEL_BOT'}
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-extrabold border border-yellow-500/30">
                    ⚠️ SERVER BOT CONFIGURATION NEEDED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every clicked protocol action below is formatted and broadcast to your Telegram bot via backend API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showConfigDrawer ? 'Hide Setup' : 'Bot Setup & Status'}</span>
              {showConfigDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <a
              href={directTelegramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md"
              title="Open the formatted incident alert directly in Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Collapsible Setup Drawer */}
        {showConfigDrawer && (
          <div className="pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Telegram Bot Token (from @BotFather)
                </label>
                <input
                  type="text"
                  value={serverBotToken}
                  onChange={(e) => setServerBotToken(e.target.value)}
                  placeholder="e.g. 1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Telegram Chat ID / Channel ID
                </label>
                <input
                  type="text"
                  value={serverChatId}
                  onChange={(e) => setServerChatId(e.target.value)}
                  placeholder="e.g. 987654321 or -100123456789"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>
                  Tip: Get your numeric Chat ID by messaging <b>@userinfobot</b> on Telegram, then click <b>Save & Verify</b>!
                </span>
              </div>
              <button
                onClick={handleSaveTelegramCredentials}
                className="w-full sm:w-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Save & Verify Token
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Incident Spotlight Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-extrabold text-xl">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{incident.userName}</h2>
                <span className="text-xs font-mono text-slate-400">({incident.caseId})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Payment Administrator · Finance Operations</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Detected: 02:23 AM
                </span>
                <span>• Target: ₹18,50,000 (XYZ Holdings)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl self-start md:self-auto">
            <div className="text-right">
              <p className="text-2xl font-black text-red-400">{incident.riskScore}/100</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assessed Risk</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Recommended Action</p>
              <p className="text-sm font-extrabold text-white">{incident.recommendedAction.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Graduated Action Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Response Protocol:
            </h3>
            {isDispatching && (
              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Dispatching Security Response to Telegram...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Action 1: Require Verification */}
            <button
              onClick={() => handleAction('REQUIRE_VERIFICATION')}
              disabled={isDispatching}
              className={`p-4 rounded-xl border text-left transition-all group ${
                incident.status === 'VERIFICATION_REQUIRED'
                  ? 'bg-yellow-500/20 border-yellow-500/60 ring-2 ring-yellow-500/30'
                  : 'bg-slate-800/60 border-slate-700 hover:border-yellow-500/50 hover:bg-yellow-500/5'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-3 group-hover:scale-105 transition-transform">
                {isDispatching && activeActionKey === 'REQUIRE_VERIFICATION' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                {isDispatching && activeActionKey === 'REQUIRE_VERIFICATION'
                  ? '⏳ Dispatching...'
                  : 'Require Verification'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Prompt for step-up biometric / manager MFA authorization.</p>
              <span className="inline-block mt-3 text-[10px] font-bold text-yellow-400 uppercase">
                Tier 1 Containment →
              </span>
            </button>

            {/* Action 2: Restrict User */}
            <button
              onClick={() => handleAction('RESTRICT_USER')}
              disabled={isDispatching}
              className={`p-4 rounded-xl border text-left transition-all group ${
                incident.status === 'RESTRICTED'
                  ? 'bg-red-500/20 border-red-500/60 ring-2 ring-red-500/30'
                  : 'bg-slate-800/60 border-slate-700 hover:border-red-500/50 hover:bg-red-500/5'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 group-hover:scale-105 transition-transform">
                {isDispatching && activeActionKey === 'RESTRICT_USER' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                {isDispatching && activeActionKey === 'RESTRICT_USER'
                  ? '⏳ Dispatching...'
                  : 'Restrict User'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Revoke privileged session & freeze account access.</p>
              <span className="inline-block mt-3 text-[10px] font-bold text-red-400 uppercase">
                Tier 2 Containment →
              </span>
            </button>

            {/* Action 3: Suspend Transaction (Recommended) */}
            <button
              onClick={() => handleAction('SUSPEND_TRANSACTION')}
              disabled={isDispatching}
              className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${
                incident.status === 'TRANSACTION_SUSPENDED'
                  ? 'bg-orange-500/20 border-orange-500/60 ring-2 ring-orange-500/30'
                  : 'bg-gradient-to-br from-orange-950/30 to-slate-800/80 border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-[9px] font-black text-orange-400">
                RECOMMENDED
              </div>
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-105 transition-transform">
                {isDispatching && activeActionKey === 'SUSPEND_TRANSACTION' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                ) : (
                  <AlertOctagon className="w-4 h-4" />
                )}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                {isDispatching && activeActionKey === 'SUSPEND_TRANSACTION'
                  ? '⏳ Dispatching...'
                  : 'Suspend Transaction'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Halt outward wire of ₹18,50,000 immediately in gateway.</p>
              <span className="inline-block mt-3 text-[10px] font-bold text-orange-400 uppercase">
                Direct Financial Guard →
              </span>
            </button>

            {/* Action 4: Escalate to Security Team */}
            <button
              onClick={() => handleAction('ESCALATE_TO_TEAM')}
              disabled={isDispatching}
              className={`p-4 rounded-xl border text-left transition-all group ${
                incident.status === 'ESCALATED'
                  ? 'bg-purple-500/20 border-purple-500/60 ring-2 ring-purple-500/30'
                  : 'bg-slate-800/60 border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/5'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                {isDispatching && activeActionKey === 'ESCALATE_TO_TEAM' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {isDispatching && activeActionKey === 'ESCALATE_TO_TEAM'
                  ? '⏳ Dispatching...'
                  : 'Escalate to Team'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Dispatch high-priority alert to on-call SOC leads.</p>
              <span className="inline-block mt-3 text-[10px] font-bold text-purple-400 uppercase">
                Tier 3 Escalation →
              </span>
            </button>
          </div>
        </div>

        {/* Response Audit History & Alert Dispatch Log */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Response Audit History & Alert Dispatch Log
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {auditRecords.length} Event{auditRecords.length !== 1 ? 's' : ''} Recorded
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {auditRecords.map((record) => (
              <div
                key={record.id}
                className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {record.telegramStatus === 'SENT' ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                    ) : record.telegramStatus === 'SENDING' ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold tracking-tight truncate">{record.actionTitle}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Updated by <span className="text-slate-300 font-medium">{record.executedBy}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right flex-shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        record.telegramStatus === 'SENT'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : record.telegramStatus === 'SENDING'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      Telegram: {record.telegramStatus === 'SENT' ? '✓ SENT' : record.telegramStatus === 'SENDING' ? '⏳ SENDING' : '❌ FAILED'}
                    </span>
                    <p className="text-slate-500 font-mono text-[10px] mt-1">{record.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
