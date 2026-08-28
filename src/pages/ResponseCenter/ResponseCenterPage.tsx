import { useState, useEffect } from 'react';
import {
  FileCheck,
  UserX,
  AlertOctagon,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Radio,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createTelegramShareLink, formatResponseActionNotification } from '../../utils/telegramService';

type ActionKey = 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM';

interface ConfirmationModalProps {
  actionKey: ActionKey;
  onConfirm: () => void;
  onCancel: () => void;
  isDispatching: boolean;
  incidentUser: string;
  incidentRisk: number;
}

function ConfirmationModal({
  actionKey,
  onConfirm,
  onCancel,
  isDispatching,
  incidentUser,
  incidentRisk,
}: ConfirmationModalProps) {
  const actionDetails: Record<
    ActionKey,
    { title: string; desc: string; targetNote: string; confirmLabel: string; btnColor: string }
  > = {
    REQUIRE_VERIFICATION: {
      title: 'Require Additional Verification',
      desc: 'Enforce step-up hardware key or manager authorization for subsequent actions.',
      targetNote: 'Prompt will be dispatched to identity device.',
      confirmLabel: 'Enforce Verification',
      btnColor: 'bg-[#A87516] hover:bg-[#8F6312]',
    },
    RESTRICT_USER: {
      title: 'Restrict Privileged Access',
      desc: 'Immediately revoke active sessions and freeze identity access tokens across PAM.',
      targetNote: 'Identity will be set to RESTRICTED status.',
      confirmLabel: 'Restrict Identity',
      btnColor: 'bg-[#C62828] hover:bg-[#A31D1D]',
    },
    SUSPEND_TRANSACTION: {
      title: 'Suspend Outward Transaction',
      desc: 'Halt outward wire of ₹18,50,000 at the payment gateway pending fraud clearance.',
      targetNote: 'Disbursement to XYZ Holdings will be blocked.',
      confirmLabel: 'Suspend Transaction',
      btnColor: 'bg-[#C62828] hover:bg-[#A31D1D]',
    },
    ESCALATE_TO_TEAM: {
      title: 'Escalate to SOC Operations Team',
      desc: 'Broadcast critical incident report to on-call security leads and lock evidence log.',
      targetNote: 'High-priority alert sent to SOC Telegram channel.',
      confirmLabel: 'Escalate Incident',
      btnColor: 'bg-[#171717] hover:bg-[#2E2E2E]',
    },
  };

  const current = actionDetails[actionKey];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4 font-sans">
      <div
        className="bg-white border border-[#E5E3DE] rounded-2xl w-full max-w-md p-6 shadow-xl text-[#171717] space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#E5E3DE]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
              Response Confirmation
            </span>
            <h2 className="text-base font-bold text-[#171717] mt-0.5">{current.title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isDispatching}
            className="text-[#8A8A8A] hover:text-[#171717] p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#6B6B6B] leading-relaxed">{current.desc}</p>

        {/* Target Metadata Summary */}
        <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Target Identity:</span>
            <span className="font-bold text-[#171717]">{incidentUser}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Evaluated Risk:</span>
            <span className="font-mono font-bold text-[#C62828]">{incidentRisk} / 100</span>
          </div>
          {actionKey === 'SUSPEND_TRANSACTION' && (
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B6B]">Transaction Amount:</span>
              <span className="font-mono font-bold text-[#C62828]">₹18,50,000</span>
            </div>
          )}
          <div className="pt-1 text-[11px] text-[#8A8A8A]">
            💡 {current.targetNote}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={isDispatching}
            className="flex-1 py-2 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDispatching}
            className={`flex-1 py-2 text-white rounded-lg text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-60 ${current.btnColor}`}
          >
            {isDispatching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <span>{current.confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResponseCenterPage() {
  const { incident, auditRecords, executeResponseAction, isDispatching } = useApp();
  const [selectedModalAction, setSelectedModalAction] = useState<ActionKey | null>(null);
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

  const handleConfirmAction = async () => {
    if (!selectedModalAction) return;
    try {
      await executeResponseAction(selectedModalAction);
    } finally {
      setSelectedModalAction(null);
    }
  };

  const getStatusBadge = () => {
    switch (incident.status) {
      case 'VERIFICATION_REQUIRED':
        return { label: 'Verification Required', color: 'bg-[#A87516]/10 text-[#A87516] border-[#A87516]/25' };
      case 'RESTRICTED':
        return { label: 'User Restricted', color: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25' };
      case 'TRANSACTION_SUSPENDED':
        return { label: 'Transaction Suspended', color: 'bg-[#C65D21]/10 text-[#C65D21] border-[#C65D21]/25' };
      case 'ESCALATED':
        return { label: 'Escalated to SOC', color: 'bg-[#171717] text-white border-[#171717]' };
      default:
        return { label: 'Active Threat Investigation', color: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/25' };
    }
  };

  const statusBadge = getStatusBadge();

  // Instant direct prefilled Telegram link
  const samplePayload = formatResponseActionNotification({
    action: 'SUSPEND TRANSACTION',
    status: incident.status,
    caseId: incident.caseId,
    userName: incident.userName,
    targetAmount: '₹18,50,000',
    analyst: 'Security Analyst',
  });
  const directTelegramLink = createTelegramShareLink(samplePayload);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Header with Telegram Alerting Status Strip */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center shadow-2xs">
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Telegram Alerting Integration
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#26734D]/10 text-[#26734D] border border-[#26734D]/25 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26734D] animate-pulse" />
                Connected: @{botUsername}
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              All containment protocol actions below are dispatched via HTTPS to your Telegram security channel.
            </p>
          </div>
        </div>

        <a
          href={directTelegramLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Open in Telegram</span>
          <ExternalLink className="w-3 h-3 text-[#8A8A8A]" />
        </a>
      </div>

      {/* 2. Active Incident Banner */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E5E3DE]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#C62828] text-white flex items-center justify-center font-bold text-base shadow-sm">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#171717]">{incident.userName}</h2>
                <span className="text-xs font-mono text-[#8A8A8A]">({incident.caseId})</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Role: Payment Administrator · Department: Finance Operations
              </p>
              <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">
                Detected: 02:23 AM · Target: ₹18,50,000 (XYZ Holdings)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#FAFAF8] border border-[#E5E3DE] px-4 py-2.5 rounded-xl self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Risk Score</span>
              <p className="text-xl font-bold font-mono text-[#C62828]">{incident.riskScore} / 100</p>
            </div>
            <div className="h-7 w-px bg-[#E5E3DE]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C62828]">Recommended</span>
              <p className="text-xs font-bold text-[#171717]">SUSPEND TRANSACTION</p>
            </div>
          </div>
        </div>

        {/* 3. Four Response Action Cards (Clean White Cards) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Select Mitigation Protocol
            </h3>
            {isDispatching && (
              <span className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Dispatching action to gateway & Telegram...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Require Verification */}
            <div
              onClick={() => !isDispatching && setSelectedModalAction('REQUIRE_VERIFICATION')}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                incident.status === 'VERIFICATION_REQUIRED'
                  ? 'border-[#A87516] bg-[#A87516]/5 ring-1 ring-[#A87516]'
                  : 'border-[#E5E3DE] hover:border-[#171717]/40 hover:bg-[#FAFAF8]'
              } ${isDispatching ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E3DE] flex items-center justify-center text-[#171717] mb-3">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#171717]">Require Verification</h4>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                Prompt identity for biometric step-up or manager authorization.
              </p>
              <span className="inline-block mt-3 text-[10px] font-semibold text-[#8A8A8A] uppercase">
                Tier 1 Protocol →
              </span>
            </div>

            {/* Card 2: Restrict User */}
            <div
              onClick={() => !isDispatching && setSelectedModalAction('RESTRICT_USER')}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                incident.status === 'RESTRICTED'
                  ? 'border-[#C62828] bg-[#C62828]/5 ring-1 ring-[#C62828]'
                  : 'border-[#E5E3DE] hover:border-[#171717]/40 hover:bg-[#FAFAF8]'
              } ${isDispatching ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E3DE] flex items-center justify-center text-[#C62828] mb-3">
                <UserX className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#171717]">Restrict User</h4>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                Immediately revoke privileged session and freeze account access.
              </p>
              <span className="inline-block mt-3 text-[10px] font-semibold text-[#8A8A8A] uppercase">
                Tier 2 Protocol →
              </span>
            </div>

            {/* Card 3: Suspend Transaction (Recommended) */}
            <div
              onClick={() => !isDispatching && setSelectedModalAction('SUSPEND_TRANSACTION')}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative ${
                incident.status === 'TRANSACTION_SUSPENDED'
                  ? 'border-[#C62828] bg-[#C62828]/5 ring-1 ring-[#C62828]'
                  : 'border-[#171717] hover:bg-[#FAFAF8] shadow-2xs'
              } ${isDispatching ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] uppercase border border-[#C62828]/25">
                Recommended
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E3DE] flex items-center justify-center text-[#C62828] mb-3">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#171717]">Suspend Transaction</h4>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                Halt outward wire of ₹18,50,000 immediately in gateway.
              </p>
              <span className="inline-block mt-3 text-[10px] font-bold text-[#C62828] uppercase">
                Financial Guard →
              </span>
            </div>

            {/* Card 4: Escalate to Team */}
            <div
              onClick={() => !isDispatching && setSelectedModalAction('ESCALATE_TO_TEAM')}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                incident.status === 'ESCALATED'
                  ? 'border-[#171717] bg-[#171717]/5 ring-1 ring-[#171717]'
                  : 'border-[#E5E3DE] hover:border-[#171717]/40 hover:bg-[#FAFAF8]'
              } ${isDispatching ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E3DE] flex items-center justify-center text-[#171717] mb-3">
                <Send className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#171717]">Escalate to Team</h4>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                Broadcast critical incident brief to SOC operations leads.
              </p>
              <span className="inline-block mt-3 text-[10px] font-semibold text-[#8A8A8A] uppercase">
                Tier 3 Protocol →
              </span>
            </div>
          </div>
        </div>

        {/* 4. Response Audit History Table */}
        <div className="pt-5 border-t border-[#E5E3DE] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Response Audit History & Alert Dispatch Log
            </h3>
            <span className="text-[11px] text-[#8A8A8A] font-mono">
              {auditRecords.length} Event{auditRecords.length !== 1 ? 's' : ''} Logged
            </span>
          </div>

          <div className="border border-[#E5E3DE] rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E5E3DE] text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">Time</th>
                  <th className="py-2.5 px-4 font-semibold">Action</th>
                  <th className="py-2.5 px-4 font-semibold">Incident</th>
                  <th className="py-2.5 px-4 font-semibold">Analyst</th>
                  <th className="py-2.5 px-4 font-semibold">Telegram Delivery</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DE]">
                {auditRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F6F5F2]/60 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[#6B6B6B] text-[11px]">
                      {record.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#171717]">
                      {record.actionTitle}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#6B6B6B] text-[11px]">
                      {record.incidentId}
                    </td>
                    <td className="py-2.5 px-4 text-[#6B6B6B]">
                      {record.executedBy}
                    </td>
                    <td className="py-2.5 px-4">
                      {record.telegramStatus === 'SENT' ? (
                        <span className="text-[11px] font-semibold text-[#26734D] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ✓ Sent
                        </span>
                      ) : record.telegramStatus === 'SENDING' ? (
                        <span className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#C62828] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Delivery Failed
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#171717]">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedModalAction && (
        <ConfirmationModal
          actionKey={selectedModalAction}
          onConfirm={handleConfirmAction}
          onCancel={() => setSelectedModalAction(null)}
          isDispatching={isDispatching}
          incidentUser={incident.userName}
          incidentRisk={incident.riskScore}
        />
      )}
    </div>
  );
}
