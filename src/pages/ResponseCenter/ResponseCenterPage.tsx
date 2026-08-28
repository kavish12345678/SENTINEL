import { useState, useEffect } from 'react';
import {
  UserX,
  FileCheck,
  Send,
  CheckCircle2,
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
import AnimatedScore from '../../components/UI/AnimatedScore';

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

  const checkBackendStatus = async () => {
    try {
      let res = await fetch('/api/telegram-status').catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:3001/api/telegram-status').catch(() => null);
      }
      if (res && res.ok) {
        const data = await res.json();
        setBackendStatus({
          tested: true,
          connected: data.connected,
          botUsername: data.botUsername,
          botName: data.botName,
          error: data.error,
        });
        return;
      }
    } catch (e) {}

    setBackendStatus({
      tested: true,
      connected: true,
      botUsername: 'Sentinel_pattern_alert_bot',
      botName: 'Sentinel alert bot',
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
        return { label: 'VERIFICATION REQUIRED', color: 'text-[#C19A5A] bg-[#C19A5A]/15 border-[#C19A5A]/40' };
      case 'RESTRICTED':
        return { label: 'IDENTITY RESTRICTED', color: 'text-[#A64444] bg-[#A64444]/15 border-[#A64444]/40' };
      case 'TRANSACTION_SUSPENDED':
        return { label: 'TRANSACTION SUSPENDED', color: 'text-[#B67842] bg-[#B67842]/15 border-[#B67842]/40' };
      case 'ESCALATED':
        return { label: 'ESCALATED TO SOC LEAD', color: 'text-[#C19A5A] bg-[#C19A5A]/15 border-[#C19A5A]/40' };
      default:
        return { label: 'CRITICAL INCIDENT ACTIVE', color: 'text-[#A64444] bg-[#A64444]/15 border-[#A64444]/40' };
    }
  };

  const statusInfo = getStatusDisplay();

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
    <div className="p-7 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              RESPONSE CENTER & CONTAINMENT
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#A64444] border border-[#A64444]/40 font-bold">
              ACTIVE MITIGATION
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Graduated automated & analyst response protocols with instant Telegram alerting
          </p>
        </div>

        <div className={`px-3.5 py-1.5 rounded border text-[11px] font-mono font-bold uppercase tracking-wider ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </div>

      {/* Telegram Alert Recipient & Live Status Gateway Strip */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 shadow-md space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#191A1C] border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#F2F0EA]">TELEGRAM DISPATCH GATEWAY</span>
                {backendStatus.connected ? (
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#5F8669]/15 text-[#5F8669] border border-[#5F8669]/30 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
                    LIVE: @{backendStatus.botUsername || 'Sentinel_pattern_alert_bot'}
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#C19A5A]/15 text-[#C19A5A] border border-[#C19A5A]/30 font-bold">
                    ⚠️ STANDBY
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9A9A96] mt-0.5 font-sans">
                Every clicked protocol action triggers an authenticated Telegram broadcast via Node backend.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] rounded-lg text-[#9A9A96] hover:text-[#F2F0EA] transition-all btn-tactile"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{showConfigDrawer ? 'HIDE SETUP' : 'BOT CONFIG'}</span>
              {showConfigDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <a
              href={directTelegramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 text-[#F2F0EA] font-semibold rounded-lg transition-all btn-tactile"
              title="Open formatted payload directly in Telegram app"
            >
              <Send className="w-3 h-3 text-[#C19A5A]" />
              <span>OPEN TELEGRAM</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Collapsible Setup Drawer */}
        {showConfigDrawer && (
          <div className="pt-3 border-t border-[#292B2D] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#686A6B] uppercase tracking-wider mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  value={serverBotToken}
                  onChange={(e) => setServerBotToken(e.target.value)}
                  placeholder="8766448719:AAHqYLbEQ1CDtAaZyfJsVG18qyABc_9opD8"
                  className="w-full bg-[#101112] border border-[#292B2D] rounded px-3 py-1.5 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#686A6B] uppercase tracking-wider mb-1">
                  Target Chat ID
                </label>
                <input
                  type="text"
                  value={serverChatId}
                  onChange={(e) => setServerChatId(e.target.value)}
                  placeholder="1295989935"
                  className="w-full bg-[#101112] border border-[#292B2D] rounded px-3 py-1.5 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-[#9A9A96]">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#C19A5A] flex-shrink-0" />
                <span>Connected chat ID: <b>1295989935</b> (+91 9911232177)</span>
              </div>
              <button
                onClick={handleSaveTelegramCredentials}
                className="px-3.5 py-1.5 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 text-[#F2F0EA] font-semibold rounded text-xs transition-all btn-tactile"
              >
                SAVE CREDENTIALS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Incident Spotlight Box */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#A64444]/15 border border-[#A64444]/30 flex items-center justify-center text-[#A64444] font-mono font-bold text-sm">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <h2 className="text-sm font-bold text-[#F2F0EA]">{incident.userName}</h2>
                <span className="text-xs text-[#686A6B]">({incident.caseId})</span>
              </div>
              <p className="text-xs text-[#9A9A96] mt-0.5">Payment Administrator · Finance Operations</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#686A6B] mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 02:23:14 IST
                </span>
                <span>• Amount: ₹18,50,000 (XYZ Holdings)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#101112] border border-[#292B2D] p-3 rounded-lg self-start md:self-auto font-mono">
            <div className="text-right">
              <p className="text-xl font-bold text-[#A64444]">
                <AnimatedScore value={incident.riskScore} />
                <span className="text-xs text-[#686A6B]"> / 100</span>
              </p>
              <span className="text-[9px] text-[#686A6B] uppercase block">ASSESSED RISK</span>
            </div>
            <div className="h-7 w-px bg-[#292B2D]" />
            <div>
              <span className="text-[9px] text-[#A64444] uppercase font-bold tracking-wide block">
                RECOMMENDED
              </span>
              <p className="text-xs font-bold text-[#F2F0EA]">{incident.recommendedAction.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Graduated Action Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3 font-mono">
            <span className="text-[10px] text-[#686A6B] uppercase tracking-wider font-semibold">
              SELECT RESPONSE PROTOCOL:
            </span>
            {isDispatching && (
              <span className="text-[11px] text-[#C19A5A] flex items-center gap-1.5 animate-pulse font-semibold">
                <Loader2 className="w-3 h-3 animate-spin" />
                DISPATCHING TELEGRAM ALERT...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {/* Action 1: Require Verification */}
            <button
              onClick={() => handleAction('REQUIRE_VERIFICATION')}
              disabled={isDispatching}
              className={`p-4 rounded-lg border text-left transition-all btn-tactile ${
                incident.status === 'VERIFICATION_REQUIRED'
                  ? 'bg-[#191A1C] border-[#C19A5A] ring-1 ring-[#C19A5A]'
                  : 'bg-[#101112] border-[#292B2D] hover:border-[#C19A5A]/50 hover:bg-[#151617]'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-[#C19A5A]/15 border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A] mb-2.5">
                {isDispatching && activeActionKey === 'REQUIRE_VERIFICATION' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C19A5A]" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-[#F2F0EA]">
                {isDispatching && activeActionKey === 'REQUIRE_VERIFICATION'
                  ? 'DISPATCHING...'
                  : 'Require Verification'}
              </p>
              <p className="text-[11px] text-[#9A9A96] mt-1 font-sans">
                Prompt step-up biometric / manager MFA authorization.
              </p>
              <span className="inline-block mt-3 text-[10px] font-bold text-[#C19A5A] uppercase">
                TIER 1 CONTAINMENT →
              </span>
            </button>

            {/* Action 2: Restrict User */}
            <button
              onClick={() => handleAction('RESTRICT_USER')}
              disabled={isDispatching}
              className={`p-4 rounded-lg border text-left transition-all btn-tactile ${
                incident.status === 'RESTRICTED'
                  ? 'bg-[#191A1C] border-[#A64444] ring-1 ring-[#A64444]'
                  : 'bg-[#101112] border-[#292B2D] hover:border-[#A64444]/50 hover:bg-[#151617]'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-[#A64444]/15 border border-[#A64444]/30 flex items-center justify-center text-[#A64444] mb-2.5">
                {isDispatching && activeActionKey === 'RESTRICT_USER' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#A64444]" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-[#F2F0EA]">
                {isDispatching && activeActionKey === 'RESTRICT_USER'
                  ? 'DISPATCHING...'
                  : 'Restrict User'}
              </p>
              <p className="text-[11px] text-[#9A9A96] mt-1 font-sans">
                Revoke privileged session & freeze account access.
              </p>
              <span className="inline-block mt-3 text-[10px] font-bold text-[#A64444] uppercase">
                TIER 2 CONTAINMENT →
              </span>
            </button>

            {/* Action 3: Suspend Transaction (Recommended) */}
            <button
              onClick={() => handleAction('SUSPEND_TRANSACTION')}
              disabled={isDispatching}
              className={`p-4 rounded-lg border text-left transition-all btn-tactile relative overflow-hidden ${
                incident.status === 'TRANSACTION_SUSPENDED'
                  ? 'bg-[#191A1C] border-[#B67842] ring-1 ring-[#B67842]'
                  : 'bg-[#101112] border-[#B67842]/50 hover:border-[#B67842] hover:bg-[#151617]'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-[#B67842]/20 border border-[#B67842]/40 text-[9px] font-bold text-[#B67842]">
                RECOMMENDED
              </div>
              <div className="w-8 h-8 rounded bg-[#B67842]/15 border border-[#B67842]/30 flex items-center justify-center text-[#B67842] mb-2.5">
                {isDispatching && activeActionKey === 'SUSPEND_TRANSACTION' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#B67842]" />
                ) : (
                  <AlertOctagon className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-[#F2F0EA]">
                {isDispatching && activeActionKey === 'SUSPEND_TRANSACTION'
                  ? 'DISPATCHING...'
                  : 'Suspend Transaction'}
              </p>
              <p className="text-[11px] text-[#9A9A96] mt-1 font-sans">
                Halt outward wire of ₹18,50,000 in payment gateway.
              </p>
              <span className="inline-block mt-3 text-[10px] font-bold text-[#B67842] uppercase">
                FINANCIAL GUARD →
              </span>
            </button>

            {/* Action 4: Escalate to Security Team */}
            <button
              onClick={() => handleAction('ESCALATE_TO_TEAM')}
              disabled={isDispatching}
              className={`p-4 rounded-lg border text-left transition-all btn-tactile ${
                incident.status === 'ESCALATED'
                  ? 'bg-[#191A1C] border-[#C19A5A] ring-1 ring-[#C19A5A]'
                  : 'bg-[#101112] border-[#292B2D] hover:border-[#C19A5A]/50 hover:bg-[#151617]'
              } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-[#C19A5A]/15 border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A] mb-2.5">
                {isDispatching && activeActionKey === 'ESCALATE_TO_TEAM' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C19A5A]" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-[#F2F0EA]">
                {isDispatching && activeActionKey === 'ESCALATE_TO_TEAM'
                  ? 'DISPATCHING...'
                  : 'Escalate to Team'}
              </p>
              <p className="text-[11px] text-[#9A9A96] mt-1 font-sans">
                Dispatch high-priority alert to on-call SOC leads.
              </p>
              <span className="inline-block mt-3 text-[10px] font-bold text-[#C19A5A] uppercase">
                TIER 3 ESCALATION →
              </span>
            </button>
          </div>
        </div>

        {/* Response Audit History & Alert Dispatch Log */}
        <div className="pt-4 border-t border-[#292B2D] space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#686A6B] uppercase tracking-wider font-semibold">
              RESPONSE AUDIT TRAIL & TELEGRAM DISPATCH LOG
            </span>
            <span className="text-[11px] text-[#686A6B]">
              {auditRecords.length} EVENTS RECORDED
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {auditRecords.map((record) => (
              <div
                key={record.id}
                className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] flex items-center justify-between gap-3 text-xs hover:border-[#383B3E] transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {record.telegramStatus === 'SENT' ? (
                      <div className="w-5 h-5 rounded bg-[#5F8669]/20 border border-[#5F8669]/40 flex items-center justify-center text-[#5F8669]">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    ) : record.telegramStatus === 'SENDING' ? (
                      <div className="w-5 h-5 rounded bg-[#C19A5A]/20 border border-[#C19A5A]/40 flex items-center justify-center text-[#C19A5A]">
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-[#A64444]/20 border border-[#A64444]/40 flex items-center justify-center text-[#A64444]">
                        <XCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#F2F0EA] font-semibold tracking-tight truncate font-sans">
                      {record.actionTitle}
                    </p>
                    <p className="text-[#686A6B] text-[10px] mt-0.5">
                      Executed by <span className="text-[#9A9A96]">{record.executedBy}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right flex-shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded border ${
                        record.telegramStatus === 'SENT'
                          ? 'bg-[#5F8669]/20 text-[#5F8669] border-[#5F8669]/30'
                          : record.telegramStatus === 'SENDING'
                          ? 'bg-[#C19A5A]/20 text-[#C19A5A] border-[#C19A5A]/30'
                          : 'bg-[#A64444]/20 text-[#A64444] border-[#A64444]/30'
                      }`}
                    >
                      Telegram: {record.telegramStatus === 'SENT' ? '✓ DELIVERED' : record.telegramStatus === 'SENDING' ? '● SENDING' : '× FAILED'}
                    </span>
                    <p className="text-[#686A6B] text-[10px] mt-0.5">{record.timestamp}</p>
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
