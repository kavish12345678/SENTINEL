import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InvestigationPage() {
  const navigate = useNavigate();
  const { incident } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Case Header Banner */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E3DE]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C62828] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#171717]">{incident.caseId}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/25 uppercase tracking-wider">
                  Critical Threat
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#6B6B6B]">
                  Status: Open Investigation
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Identity: <span className="font-semibold text-[#171717]">{incident.userName}</span> · Role: Payment Administrator · Department: Treasury Ops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A]">Assessed Risk</span>
              <p className="text-2xl font-bold font-mono text-[#C62828]">92 / 100</p>
            </div>

            <button
              onClick={() => navigate('/response')}
              className="px-4 py-2 bg-[#C62828] hover:bg-[#A31D1D] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <span>Execute Mitigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#6B6B6B]">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">Case Opened</span>
            <p className="font-medium text-[#171717] mt-0.5">28/08/2026, 02:23 AM</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">Target Entity</span>
            <p className="font-medium text-[#171717] mt-0.5">XYZ Holdings (#BEN-9921)</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">Amount At Risk</span>
            <p className="font-bold text-[#C62828] mt-0.5">₹18,50,000 INR</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8A8A8A]">Recommended Action</span>
            <p className="font-bold text-[#171717] mt-0.5">SUSPEND TRANSACTION</p>
          </div>
        </div>
      </div>

      {/* 2. Split Investigation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Investigation Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Sequential Investigation Timeline
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Chronological execution order correlating individual actions into an insider threat sequence
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E3DE]">
            {[
              {
                time: '02:15 AM',
                tag: 'LOGIN',
                title: 'Unusual Access Time',
                desc: 'User authenticated to corporate payment server outside standard operating hours (09:00–18:00).',
                risk: '+20',
              },
              {
                time: '02:17 AM',
                tag: 'RESOURCE ACCESS',
                title: 'Unusual Account Access',
                desc: 'Corporate treasury account #CC-8821 accessed. Identity has zero historical access in past 90 days.',
                risk: '+15',
              },
              {
                time: '02:19 AM',
                tag: 'BENEFICIARY CHANGE',
                title: 'New Beneficiary Introduced',
                desc: 'Pre-existing vendor ABC Supplies modified to new external entity XYZ Holdings.',
                risk: '+15',
              },
              {
                time: '02:21 AM',
                tag: 'LIMIT CHANGE',
                title: 'Transaction Limit Increased',
                desc: 'Single-approver threshold elevated 5× from ₹5,00,000 → ₹25,00,000 without multi-party quorum.',
                risk: '+10',
              },
              {
                time: '02:23 AM',
                tag: 'PAYMENT',
                title: 'Large Payment Initiated',
                desc: 'Outward wire transfer of ₹18,50,000 initiated to the newly modified beneficiary.',
                risk: '+12',
              },
            ].map((event) => (
              <div key={event.time} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#171717] border-2 border-white ring-2 ring-[#E5E3DE]" />

                <div className="bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#171717]">{event.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 text-[#171717]">
                        {event.tag}
                      </span>
                      <span className="font-mono font-bold text-[#C62828] text-[11px]">{event.risk}</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-[#171717]">{event.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sequence Correlated Flag */}
          <div className="p-4 bg-[#C62828]/5 border border-[#C62828]/25 rounded-xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C62828]">
              ⚠️ Critical Sequence Correlation
            </span>
            <p className="text-xs text-[#171717]">
              While individual actions may appear authorized within PAM access policies, their combined sequence within an 8-minute window strongly correlates with malicious privileged misuse.
            </p>
          </div>
        </div>

        {/* RIGHT: Risk Assessment & Behavioural Assessment (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Risk Factor Breakdown */}
          <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DE]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Risk Factor Weights
              </h2>
              <span className="text-xs font-mono font-bold text-[#C62828]">Total: 92/100</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Unusual Access Time', weight: 20, pct: 20 },
                { label: 'Unusual Resource Access', weight: 15, pct: 15 },
                { label: 'New Beneficiary Introduced', weight: 15, pct: 15 },
                { label: 'Limit Increase (5×)', weight: 10, pct: 10 },
                { label: 'Large Outward Transaction', weight: 12, pct: 12 },
                { label: 'Suspicious Sequence Correlation', weight: 10, pct: 10 },
                { label: 'Baseline Prior History', weight: 10, pct: 10 },
              ].map((factor) => (
                <div key={factor.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B6B6B]">{factor.label}</span>
                    <span className="font-mono font-bold text-[#171717]">+{factor.weight}</span>
                  </div>
                  <div className="h-1.5 bg-[#F0EFEA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#171717] rounded-full"
                      style={{ width: `${(factor.pct / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Normal vs Current Comparison */}
          <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DE]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Baseline Comparison
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/25">
                Significant Deviation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#26734D]/5 border border-[#26734D]/25 rounded-lg space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#26734D]">
                  Normal Baseline
                </span>
                <p className="text-[#171717] font-medium">09:00 – 18:00</p>
                <p className="text-[11px] text-[#6B6B6B]">Regular transactions (₹2L–₹5L)</p>
                <p className="text-[11px] text-[#6B6B6B]">Known vendors: ABC Supplies</p>
              </div>

              <div className="p-3 bg-[#C62828]/5 border border-[#C62828]/25 rounded-lg space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#C62828]">
                  Current Activity
                </span>
                <p className="text-[#C62828] font-bold">02:15 AM (Off-hours)</p>
                <p className="text-[11px] text-[#C62828] font-semibold">₹18.5L payment initiated</p>
                <p className="text-[11px] text-[#C62828]">Modified payee: XYZ Holdings</p>
              </div>
            </div>
          </div>

          {/* AI / Behavioural Assessment */}
          <div className="bg-white border border-[#E5E3DE] rounded-xl p-5 shadow-2xs space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Behavioural Assessment
            </span>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              "The activity differs significantly from the identity's established behavioural baseline. The combination of unusual access timing, beneficiary modification, privilege change and high-value transaction increases the likelihood of account misuse."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
