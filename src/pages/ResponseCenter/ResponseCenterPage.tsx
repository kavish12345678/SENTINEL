import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Loader2,
  ArrowRight,
  Send,
  ExternalLink,
  UserX,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createTelegramShareLink, formatResponseActionNotification } from '../../utils/telegramService';

type ActionKey = 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM';

export default function ResponseCenterPage() {
  const { incident, auditRecords, executeResponseAction, isDispatching } = useApp();
  const [selectedAction, setSelectedAction] = useState<ActionKey>('SUSPEND_TRANSACTION');
  const [botUsername, setBotUsername] = useState('Sentinel_pattern_alert_bot');

  useEffect(() => {
    fetch('/api/telegram-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.connected && data.botUsername) {
          setBotUsername(data.botUsername);
        }
      })
      .catch(() => {});
  }, []);

  const handleExecute = async () => {
    await executeResponseAction(selectedAction);
  };

  // Direct prefilled Telegram link for backup
  const samplePayload = formatResponseActionNotification({
    action: selectedAction.replace(/_/g, ' '),
    status: incident.status,
    caseId: incident.caseId,
    userName: incident.userName,
    targetAmount: '₹18,50,000',
    analyst: 'Security Analyst',
  });
  const directTelegramLink = createTelegramShareLink(samplePayload);

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-16 font-sans select-none">
      {/* Top Banner */}
      <div className="bg-[#1c1c16] border border-[#464742] p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#ffb4ab] flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-4 h-4" />
            TACTICAL EXECUTION MODE // INC-2026-0091
          </span>
          <div className="h-3 w-px bg-[#464742]" />
          <span className="font-mono text-xs text-[#c7c7bf]">
            Target: <b className="text-[#e5e2d9]">{incident.userName}</b>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={directTelegramLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#c7c7bf] hover:text-[#e5e2d9] font-mono text-[11px] uppercase rounded-xs transition-all"
          >
            <Send className="w-3 h-3 text-[#e8c178]" />
            <span>Open in Telegram</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Main Tactical Response Container (Matching Desktop/SENTINEL template) */}
      <div className="border border-[#464742] bg-[#20201a] shadow-[0_4px_32px_rgba(0,0,0,0.8)] rounded-xs overflow-hidden">
        {/* Header Strip */}
        <div className="flex justify-between items-center p-4 border-b border-[#464742] bg-[#1c1c16]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse" />
            <h1 className="font-mono text-xs font-bold text-[#ffb4ab] uppercase tracking-wider">
              RESPONSE REQUIRED | {incident.caseId}
            </h1>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#91918a]">RISK SCORE:</span>
            <span className="text-[#ffb4ab] font-bold">92 / 100</span>
          </div>
        </div>

        {/* 2-Panel Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left Panel: Vertical Decision Path (2/3 width) */}
          <div className="w-full md:w-2/3 p-6 border-r border-[#464742] overflow-y-auto flex flex-col space-y-4">
            <h2 className="font-mono text-xs font-bold text-[#91918a] tracking-widest uppercase mb-2">
              VERTICAL DECISION PATH
            </h2>

            <div className="flex flex-col gap-3 relative">
              {/* Action 01: REQUIRE VERIFICATION */}
              <div
                onClick={() => !isDispatching && setSelectedAction('REQUIRE_VERIFICATION')}
                className={`flex gap-3.5 items-start cursor-pointer group transition-all p-3 border rounded-xs ${
                  selectedAction === 'REQUIRE_VERIFICATION'
                    ? 'border-[#e8c178] bg-[#5f4504]/20'
                    : 'border-[#464742] bg-[#14140f] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shrink-0 font-mono text-xs font-bold text-[#c7c7bf] group-hover:border-[#e8c178]">
                  01
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-[#e5e2d9]">REQUIRE VERIFICATION</h3>
                    <FileCheck className="w-4 h-4 text-[#c7c7bf]" />
                  </div>
                  <p className="text-xs text-[#91918a] mt-0.5">
                    Enforce step-up biometric prompt or manager quorum.
                  </p>
                </div>
              </div>

              {/* Action 02: RESTRICT USER */}
              <div
                onClick={() => !isDispatching && setSelectedAction('RESTRICT_USER')}
                className={`flex gap-3.5 items-start cursor-pointer group transition-all p-3 border rounded-xs ${
                  selectedAction === 'RESTRICT_USER'
                    ? 'border-[#ffb4ab] bg-[#93000a]/20'
                    : 'border-[#464742] bg-[#14140f] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shrink-0 font-mono text-xs font-bold text-[#c7c7bf] group-hover:border-[#ffb4ab]">
                  02
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-[#e5e2d9]">RESTRICT USER</h3>
                    <UserX className="w-4 h-4 text-[#ffb4ab]" />
                  </div>
                  <p className="text-xs text-[#91918a] mt-0.5">
                    Immediately revoke active PAM session and lock credentials.
                  </p>
                </div>
              </div>

              {/* Action 03: SUSPEND TRANSACTION (Recommended) */}
              <div
                onClick={() => !isDispatching && setSelectedAction('SUSPEND_TRANSACTION')}
                className={`p-4 border-2 rounded-xs transition-all ${
                  selectedAction === 'SUSPEND_TRANSACTION'
                    ? 'border-[#ffb4ab] bg-[#2a2a24] shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
                    : 'border-[#464742] bg-[#14140f] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-center mb-3 border-b border-[#464742] pb-2">
                  <h3 className="font-mono text-xs font-bold text-[#ffb4ab] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#93000a] text-[#ffdad6] flex items-center justify-center text-xs">
                      03
                    </span>
                    SUSPEND TRANSACTION
                  </h3>
                  <span className="font-mono text-[10px] font-bold bg-[#ffb4ab] text-[#690005] px-2 py-0.5 rounded-xs uppercase">
                    RECOMMENDED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                  <div className="p-2 bg-[#14140f] border border-[#464742]">
                    <span className="text-[10px] text-[#91918a] uppercase block">AMOUNT</span>
                    <span className="text-sm font-bold text-[#e5e2d9]">₹18,50,000 INR</span>
                  </div>
                  <div className="p-2 bg-[#14140f] border border-[#464742]">
                    <span className="text-[10px] text-[#91918a] uppercase block">TARGET</span>
                    <span className="text-sm font-bold text-[#e5e2d9]">Amit Sharma</span>
                  </div>
                  <div className="col-span-2 p-2 bg-[#14140f] border border-[#464742]">
                    <span className="text-[10px] text-[#91918a] uppercase block mb-0.5">JUSTIFICATION</span>
                    <p className="text-xs text-[#c7c7bf] border-l-2 border-[#ffb4ab] pl-2">
                      Anomalous transfer volume detected outside typical velocity parameters. 5-step sequence matches privileged account misuse typology.
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleExecute}
                  disabled={isDispatching}
                  className="w-full bg-[#e5e2df] text-[#1c1c1a] border border-[#292925] py-3 font-mono text-xs font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60 shadow-lg"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>DISPATCHING RESPONSE & TELEGRAM ALERT...</span>
                    </>
                  ) : (
                    <>
                      <span>[ CONFIRM RESPONSE & DISPATCH ALERT ]</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Action 04: ESCALATE TO TEAM */}
              <div
                onClick={() => !isDispatching && setSelectedAction('ESCALATE_TO_TEAM')}
                className={`flex gap-3.5 items-start cursor-pointer group transition-all p-3 border rounded-xs ${
                  selectedAction === 'ESCALATE_TO_TEAM'
                    ? 'border-[#c9c6c4] bg-[#2a2a24]'
                    : 'border-[#464742] bg-[#14140f] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-[#464742] bg-[#20201a] flex items-center justify-center shrink-0 font-mono text-xs font-bold text-[#c7c7bf] group-hover:border-[#c9c6c4]">
                  04
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold text-[#e5e2d9]">ESCALATE TO TEAM</h3>
                    <Send className="w-4 h-4 text-[#c7c7bf]" />
                  </div>
                  <p className="text-xs text-[#91918a] mt-0.5">
                    Route incident brief to Level-2 security analysts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Audit & Comms (1/3 width) */}
          <div className="w-full md:w-1/3 flex flex-col bg-[#14140f]">
            <div className="p-4 border-b border-[#464742]">
              <h2 className="font-mono text-xs font-bold text-[#91918a] tracking-widest uppercase">
                AUDIT TRAIL // PRE-EXECUTION
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
              <div className="border-l border-[#464742] pl-3 pb-3 relative">
                <div className="absolute w-2 h-2 bg-[#464742] rounded-full -left-[4.5px] top-1" />
                <span className="text-[10px] text-[#91918a] block">T-02:15:04Z</span>
                <p className="text-xs text-[#c7c7bf]">System flag raised via Engine Baseline.</p>
              </div>

              <div className="border-l border-[#464742] pl-3 pb-3 relative">
                <div className="absolute w-2 h-2 bg-[#464742] rounded-full -left-[4.5px] top-1" />
                <span className="text-[10px] text-[#91918a] block">T-02:23:01Z</span>
                <p className="text-xs text-[#c7c7bf]">Analyst reviewed and elevated priority.</p>
              </div>

              <div className="border-l border-dashed border-[#ffb4ab] pl-3 pb-3 relative">
                <div className="absolute w-2 h-2 bg-[#ffb4ab] rounded-full -left-[4.5px] top-1 animate-pulse" />
                <span className="text-[10px] text-[#ffb4ab] font-bold block">ACTIVE EXECUTION</span>
                <p className="text-xs text-[#ffb4ab] font-semibold">
                  {incident.status === 'TRANSACTION_SUSPENDED'
                    ? 'TRANSACTION SUSPENDED'
                    : 'RESPONSE PENDING CONFIRMATION'}
                </p>
              </div>

              {/* Dynamic Audit History from recent dispatches */}
              {auditRecords.map((rec) => (
                <div key={rec.id} className="border-l border-[#e8c178] pl-3 pb-2 relative">
                  <div className="absolute w-2 h-2 bg-[#e8c178] rounded-full -left-[4.5px] top-1" />
                  <span className="text-[10px] text-[#e8c178] block">{rec.timestamp}</span>
                  <p className="text-xs text-[#e5e2d9] font-bold">{rec.actionTitle}</p>
                  <p className="text-[10px] text-[#91918a]">
                    Telegram Status:{' '}
                    <span className="text-[#e8c178] font-bold">
                      {rec.telegramStatus === 'SENT' ? '✓ DELIVERED' : rec.telegramStatus}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Status Strip */}
            <div className="p-4 border-t border-[#464742] bg-[#1c1c16]">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#91918a]">TELEGRAM GATEWAY:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#e8c178] animate-pulse" />
                  <span className="text-[#e8c178] font-bold">@{botUsername}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
