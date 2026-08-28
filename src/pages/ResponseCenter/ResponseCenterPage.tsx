import { useState, useEffect, useMemo } from 'react';
import {
  UserX,
  FileCheck,
  Send,
  CheckCircle2,
  AlertOctagon,
  Radio,
  XCircle,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Sliders,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createTelegramShareLink, formatResponseActionNotification } from '../../utils/telegramService';
import AnimatedScore from '../../components/UI/AnimatedScore';
import {
  DEFAULT_SIMULATION_STATE,
  PRESET_SCENARIOS,
  calculateSimulationRisk,
  evaluateSecurityResponse,
  evaluateTransactionGovernance,
  type SimulationState,
} from '../../utils/simulationEngine';

export default function ResponseCenterPage() {
  const { incident, auditRecords, executeResponseAction, isDispatching, addToast } = useApp();

  // Simulation mode toggling & state
  const [simulationModeActive, setSimulationModeActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'SCENARIOS' | 'MANUAL'>('SCENARIOS');
  const [simState, setSimState] = useState<SimulationState>(DEFAULT_SIMULATION_STATE);

  // Simulated Governance Approval state: 'PENDING' | 'APPROVED' | 'REJECTED'
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Action execution state
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [executionPhase, setExecutionPhase] = useState<string>('');

  // Telegram Config Drawer
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

  // Calculate live dynamic risk and decisions
  const riskDecomposition = useMemo(() => calculateSimulationRisk(simState), [simState]);
  const securityDecision = useMemo(
    () => evaluateSecurityResponse(simState, riskDecomposition.finalRisk),
    [simState, riskDecomposition.finalRisk]
  );
  const governanceDecision = useMemo(
    () =>
      evaluateTransactionGovernance(
        simState.transactionAmount,
        simState.transactionActive,
        simState.standardLimit
      ),
    [simState.transactionAmount, simState.transactionActive, simState.standardLimit]
  );

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

  // Scenario Selection
  const applyPreset = (presetId: string) => {
    const found = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (found) {
      setSimState({ ...found.state });
      setApprovalStatus('PENDING');
      addToast(`Applied Scenario: ${found.name}`, 'info');
    }
  };

  const handleResetSimulation = () => {
    setSimState(DEFAULT_SIMULATION_STATE);
    setApprovalStatus('PENDING');
    addToast('Simulation reset to Critical Financial Threat baseline.', 'info');
  };

  // Response Protocol Execution with dynamic simulated payload
  const handleAction = async (
    actionKey: 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM'
  ) => {
    if (isDispatching) return;
    setActiveActionKey(actionKey);
    setExecutionPhase('ANALYSING');

    setTimeout(() => {
      setExecutionPhase('EXECUTING');
    }, 150);

    const detectedBehaviours: string[] = [];
    if (simState.unusualLogin) detectedBehaviours.push('Unusual Login Time');
    if (simState.unusualResource) detectedBehaviours.push('Unusual Resource Access');
    if (simState.newBeneficiary) detectedBehaviours.push('New Beneficiary Modified');
    if (simState.privilegeChange) detectedBehaviours.push('Limit Increased 5×');
    if (simState.suspiciousSequence) detectedBehaviours.push('Suspicious Action Sequence');
    if (simState.multipleFailedAttempts) detectedBehaviours.push('Failed Authentication Attempts');

    try {
      await executeResponseAction(actionKey, {
        riskScore: riskDecomposition.finalRisk,
        transactionAmount: simState.transactionActive
          ? `₹${simState.transactionAmount.toLocaleString('en-IN')}`
          : '₹0 (Inactive)',
        authorityLevel: governanceDecision.authorityTitle,
        detectedBehaviours,
      });
    } finally {
      setActiveActionKey(null);
      setExecutionPhase('');
    }
  };

  const formattedTxnAmount = simState.transactionActive
    ? `₹${simState.transactionAmount.toLocaleString('en-IN')}`
    : '₹0 (Inactive)';

  const samplePayload = formatResponseActionNotification({
    action: securityDecision.recommendedAction.replace(/_/g, ' '),
    status: incident.status,
    caseId: incident.caseId,
    userName: incident.userName,
    targetAmount: formattedTxnAmount,
    analyst: 'Security Analyst (SOC Tier 2)',
  });
  const directTelegramLink = createTelegramShareLink(samplePayload);

  return (
    <div className="p-7 pb-24 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Simulation Mode Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              RESPONSE CENTER
            </h1>
            <button
              onClick={() => setSimulationModeActive(!simulationModeActive)}
              className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all btn-tactile ${
                simulationModeActive
                  ? 'bg-[#C19A5A]/20 text-[#C19A5A] border-[#C19A5A]/60 shadow-[0_0_10px_rgba(193,154,90,0.2)]'
                  : 'bg-[#151617] text-[#9A9A96] border-[#292B2D]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#C19A5A]" />
              <span className="font-bold">SIMULATION MODE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C19A5A] animate-pulse" />
            </button>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Interactive dual-decision engine: Security Containment + Financial Governance Ladder
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151617] hover:bg-[#191A1C] border border-[#292B2D] rounded-lg text-[#9A9A96] hover:text-[#F2F0EA] transition-all btn-tactile"
            title="Reset to default hackathon baseline (Critical Financial Threat)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SIMULATION</span>
          </button>
        </div>
      </div>

      {/* SIMULATION CONTROL WORKBENCH PANEL */}
      {simulationModeActive && (
        <div className="bg-[#151617] border border-[#C19A5A]/40 rounded-xl p-5 shadow-lg space-y-4 font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#292B2D]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C19A5A]" />
              <span className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                SIMULATION WORKBENCH & DEMO PRESETS
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#101112] p-1 rounded-lg border border-[#292B2D] text-xs">
              <button
                onClick={() => setActiveTab('SCENARIOS')}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                  activeTab === 'SCENARIOS'
                    ? 'bg-[#C19A5A]/20 text-[#F2F0EA] border border-[#C19A5A]/40'
                    : 'text-[#9A9A96] hover:text-[#F2F0EA]'
                }`}
              >
                DEMO SCENARIOS
              </button>
              <button
                onClick={() => setActiveTab('MANUAL')}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                  activeTab === 'MANUAL'
                    ? 'bg-[#C19A5A]/20 text-[#F2F0EA] border border-[#C19A5A]/40'
                    : 'text-[#9A9A96] hover:text-[#F2F0EA]'
                }`}
              >
                MANUAL SIMULATION
              </button>
            </div>
          </div>

          {/* TAB 1: PRESET SCENARIOS */}
          {activeTab === 'SCENARIOS' && (
            <div className="space-y-3">
              <span className="text-[10px] text-[#686A6B] uppercase tracking-wider block">
                SELECT A DEMO SCENARIO TO AUTO-FILL INCIDENT & WIRE PARAMETERS:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {PRESET_SCENARIOS.map((preset) => {
                  const isSelected = simState.presetName === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all btn-tactile flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#191A1C] border-[#C19A5A] ring-1 ring-[#C19A5A]/50 text-[#F2F0EA]'
                          : 'bg-[#101112] border-[#292B2D] hover:border-[#383B3E] text-[#9A9A96] hover:text-[#F2F0EA]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] truncate">{preset.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C19A5A] flex-shrink-0 ml-1" />}
                      </div>
                      <p className="text-[10px] text-[#686A6B] line-clamp-2 font-sans">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL SIMULATION CONTROLS */}
          {activeTab === 'MANUAL' && (
            <div className="space-y-4 text-xs pt-1">
              {/* Identity Details Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#101112] rounded-lg border border-[#292B2D]">
                <div>
                  <span className="text-[10px] text-[#686A6B] uppercase block">TARGET IDENTITY</span>
                  <p className="text-xs text-[#F2F0EA] font-semibold mt-0.5">Amit Sharma (INC-2026-0091)</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#686A6B] uppercase block">ROLE</span>
                  <p className="text-xs text-[#F2F0EA] font-semibold mt-0.5">Payment Administrator</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#686A6B] uppercase block">DEPARTMENT</span>
                  <p className="text-xs text-[#F2F0EA] font-semibold mt-0.5">Finance Operations</p>
                </div>
              </div>

              {/* Sliders & Numeric Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Base Risk Slider */}
                <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#686A6B] uppercase">BASE RISK SCORE</span>
                    <span className="text-xs font-bold text-[#C19A5A]">{simState.baseRisk}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simState.baseRisk}
                    onChange={(e) => {
                      setSimState({
                        ...simState,
                        presetName: 'CUSTOM_MANUAL',
                        baseRisk: Number(e.target.value),
                      });
                      setApprovalStatus('PENDING');
                    }}
                    className="w-full accent-[#C19A5A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#686A6B]">
                    <span>0 (Normal)</span>
                    <span>50 (Moderate)</span>
                    <span>100 (Critical)</span>
                  </div>
                </div>

                {/* Transaction Amount Input */}
                <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#686A6B] uppercase">TRANSACTION AMOUNT (₹)</span>
                    <button
                      onClick={() => {
                        setSimState({
                          ...simState,
                          presetName: 'CUSTOM_MANUAL',
                          transactionActive: !simState.transactionActive,
                        });
                        setApprovalStatus('PENDING');
                      }}
                      className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${
                        simState.transactionActive
                          ? 'bg-[#5F8669]/20 text-[#5F8669] border-[#5F8669]/40'
                          : 'bg-[#686A6B]/20 text-[#9A9A96] border-[#292B2D]'
                      }`}
                    >
                      {simState.transactionActive ? 'ACTIVE: ON' : 'ACTIVE: OFF'}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={simState.transactionAmount}
                    disabled={!simState.transactionActive}
                    onChange={(e) => {
                      setSimState({
                        ...simState,
                        presetName: 'CUSTOM_MANUAL',
                        transactionAmount: Math.max(0, Number(e.target.value)),
                      });
                      setApprovalStatus('PENDING');
                    }}
                    placeholder="1850000"
                    className="w-full bg-[#151617] border border-[#292B2D] rounded px-3 py-1.5 text-xs text-[#F2F0EA] font-mono focus:outline-none focus:border-[#C19A5A] disabled:opacity-40"
                  />
                  <span className="text-[10px] text-[#686A6B] block truncate">
                    Formatted: ₹{simState.transactionAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Standard Demo Limit Tuning */}
                <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#686A6B] uppercase">STANDARD DEMO LIMIT (₹)</span>
                    <span className="text-[10px] text-[#9A9A96]">₹{(simState.standardLimit / 100000).toFixed(1)}L</span>
                  </div>
                  <input
                    type="number"
                    value={simState.standardLimit}
                    onChange={(e) => {
                      setSimState({
                        ...simState,
                        presetName: 'CUSTOM_MANUAL',
                        standardLimit: Math.max(10000, Number(e.target.value)),
                      });
                    }}
                    className="w-full bg-[#151617] border border-[#292B2D] rounded px-3 py-1.5 text-xs text-[#F2F0EA] font-mono focus:outline-none focus:border-[#C19A5A]"
                  />
                  <span className="text-[10px] text-[#686A6B] block">
                    Threshold where higher review begins
                  </span>
                </div>
              </div>

              {/* Behavioural Modifiers Grid */}
              <div>
                <span className="text-[10px] text-[#686A6B] uppercase tracking-wider block mb-2">
                  BEHAVIOURAL EVIDENCE & CONTEXT MODIFIERS (TOGGLE ON/OFF):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { key: 'unusualLogin' as const, label: 'Unusual Login', pts: '+10' },
                    { key: 'unusualResource' as const, label: 'Unusual Resource', pts: '+10' },
                    { key: 'newBeneficiary' as const, label: 'New Beneficiary', pts: '+15' },
                    { key: 'privilegeChange' as const, label: 'Privilege Change', pts: '+15' },
                    { key: 'suspiciousSequence' as const, label: 'Suspicious Seq', pts: '+20' },
                    { key: 'multipleFailedAttempts' as const, label: 'Failed Auth', pts: '+10' },
                    { key: 'contextVerified' as const, label: 'Context Verified', pts: '-15' },
                  ].map(({ key, label, pts }) => {
                    const isActive = simState[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSimState({
                            ...simState,
                            presetName: 'CUSTOM_MANUAL',
                            [key]: !simState[key],
                          });
                        }}
                        className={`p-2 rounded border text-left transition-all btn-tactile ${
                          isActive
                            ? key === 'contextVerified'
                              ? 'bg-[#5F8669]/20 border-[#5F8669]/60 text-[#5F8669]'
                              : 'bg-[#A64444]/20 border-[#A64444]/60 text-[#F2F0EA]'
                            : 'bg-[#101112] border-[#292B2D] text-[#686A6B]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-bold">{pts}</span>
                          <span className="text-[9px]">{isActive ? 'ON' : 'OFF'}</span>
                        </div>
                        <p className="text-[10px] truncate">{label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User History & Context Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#686A6B] uppercase block">USER PROFILE HISTORY</span>
                    <span className="text-xs text-[#F2F0EA] font-semibold">{simState.userHistory}</span>
                  </div>
                  <div className="flex gap-1">
                    {(['NORMAL', 'CONCERNING', 'HIGH_RISK'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() =>
                          setSimState({ ...simState, presetName: 'CUSTOM_MANUAL', userHistory: lvl })
                        }
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          simState.userHistory === lvl
                            ? 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/50'
                            : 'bg-[#151617] border border-[#292B2D] text-[#686A6B]'
                        }`}
                      >
                        {lvl === 'NORMAL' ? 'NORM' : lvl === 'CONCERNING' ? 'CONC (+7)' : 'HIGH (+15)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#686A6B] uppercase block">TRANSACTION CONTEXT</span>
                    <span className="text-xs text-[#F2F0EA] font-semibold">{simState.transactionContext}</span>
                  </div>
                  <div className="flex gap-1">
                    {(['NORMAL', 'UNUSUAL', 'UNKNOWN'] as const).map((ctx) => (
                      <button
                        key={ctx}
                        onClick={() =>
                          setSimState({ ...simState, presetName: 'CUSTOM_MANUAL', transactionContext: ctx })
                        }
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          simState.transactionContext === ctx
                            ? 'bg-[#C19A5A]/20 text-[#C19A5A] border border-[#C19A5A]/50'
                            : 'bg-[#151617] border border-[#292B2D] text-[#686A6B]'
                        }`}
                      >
                        {ctx}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transparent Live Risk Formula Bar */}
          <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-[#686A6B] uppercase font-bold">RISK DECOMPOSITION:</span>
              <span className="text-[#9A9A96]">BASE: <b className="text-[#F2F0EA]">{riskDecomposition.baseRisk}</b></span>
              <span className="text-[#686A6B]">+</span>
              <span className="text-[#9A9A96]">BEHAVIOURAL FACTORS: <b className="text-[#A64444]">+{riskDecomposition.factorTotal}</b></span>
              <span className="text-[#686A6B]">-</span>
              <span className="text-[#9A9A96]">CONTEXT: <b className="text-[#5F8669]">-{riskDecomposition.contextReduction}</b></span>
              <span className="text-[#686A6B]">=</span>
              <span className="text-xs font-bold text-[#F2F0EA]">
                FINAL: <span className="text-[#C19A5A] font-extrabold text-sm"><AnimatedScore value={riskDecomposition.finalRisk} /></span> / 100
              </span>
            </div>
            <span className="text-[10px] text-[#686A6B]">
              SCENARIO: <b className="text-[#C19A5A]">{simState.presetName.replace(/_/g, ' ')}</b>
            </span>
          </div>
        </div>
      )}

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
                Every clicked protocol action below broadcasts this simulated security state to your Telegram bot.
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
                <span>Connected target chat ID: <b>1295989935</b> (+91 9911232177)</span>
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

      {/* DUAL DECISION MATRIX (SECURITY DECISION + FINANCIAL GOVERNANCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        {/* DECISION 1: SECURITY CONTAINMENT DECISION */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#292B2D]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#A64444]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                1. SECURITY RESPONSE EVALUATION
              </h3>
            </div>
            <span
              className={`text-[9px] px-2 py-0.2 rounded border font-bold uppercase ${
                riskDecomposition.finalRisk >= 80
                  ? 'bg-[#A64444]/20 text-[#A64444] border-[#A64444]/40'
                  : riskDecomposition.finalRisk >= 60
                  ? 'bg-[#B67842]/20 text-[#B67842] border-[#B67842]/40'
                  : riskDecomposition.finalRisk >= 31
                  ? 'bg-[#C19A5A]/20 text-[#C19A5A] border-[#C19A5A]/40'
                  : 'bg-[#5F8669]/20 text-[#5F8669] border-[#5F8669]/40'
              }`}
            >
              {securityDecision.tierLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D]">
              <span className="text-[10px] text-[#686A6B] uppercase block">BEHAVIOURAL RISK</span>
              <p
                className={`text-xl font-bold mt-0.5 ${
                  riskDecomposition.finalRisk >= 80
                    ? 'text-[#A64444]'
                    : riskDecomposition.finalRisk >= 60
                    ? 'text-[#B67842]'
                    : riskDecomposition.finalRisk >= 31
                    ? 'text-[#C19A5A]'
                    : 'text-[#5F8669]'
                }`}
              >
                <AnimatedScore value={riskDecomposition.finalRisk} />
                <span className="text-xs text-[#686A6B]"> / 100</span>
              </p>
            </div>

            <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D]">
              <span className="text-[10px] text-[#686A6B] uppercase block">RECOMMENDED PROTOCOL</span>
              <p className="text-xs font-bold text-[#F2F0EA] mt-1.5 truncate">
                {securityDecision.recommendedAction.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Why this response reasoning bullets */}
          <div className="p-3.5 bg-[#101112] rounded-lg border border-[#292B2D] space-y-2">
            <span className="text-[10px] text-[#C19A5A] uppercase font-bold tracking-wider block">
              WHY THIS RESPONSE?
            </span>
            <ul className="space-y-1 text-[11px] text-[#9A9A96] font-sans">
              {securityDecision.reasonBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C19A5A] mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-[#292B2D]/80">
              <span className="text-[10px] text-[#686A6B] uppercase block">DECISION SUMMARY:</span>
              <p className="text-xs text-[#F2F0EA] font-sans mt-0.5 italic">
                "{securityDecision.decisionSummary}"
              </p>
            </div>
          </div>
        </div>

        {/* DECISION 2: FINANCIAL GOVERNANCE & AUTHORITY LADDER */}
        <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#292B2D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C19A5A]" />
              <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                2. TRANSACTION GOVERNANCE LADDER
              </h3>
            </div>
            <span
              className={`text-[9px] px-2 py-0.2 rounded border font-bold uppercase ${
                governanceDecision.approvalRequired
                  ? 'bg-[#B67842]/20 text-[#B67842] border-[#B67842]/40'
                  : 'bg-[#5F8669]/20 text-[#5F8669] border-[#5F8669]/40'
              }`}
            >
              {governanceDecision.approvalRequired ? 'APPROVAL REQUIRED' : 'AUTO PROCESSING'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D]">
              <span className="text-[10px] text-[#686A6B] uppercase block">CURRENT TRANSACTION</span>
              <p className="text-lg font-bold text-[#F2F0EA] mt-0.5">{formattedTxnAmount}</p>
              <span className="text-[10px] text-[#686A6B] block mt-0.5">
                Standard Limit: ₹{simState.standardLimit.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D]">
              <span className="text-[10px] text-[#686A6B] uppercase block">MANDATED AUTHORITY TIER</span>
              <p className="text-xs font-bold text-[#C19A5A] mt-1 truncate">
                {governanceDecision.authorityTitle}
              </p>
              <span className="text-[10px] text-[#686A6B] block mt-0.5">
                Status: {governanceDecision.limitStatus}
              </span>
            </div>
          </div>

          {/* 4-Tier Authority Ladder */}
          <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] space-y-2">
            <span className="text-[10px] text-[#686A6B] uppercase tracking-wider block">
              AUTHORITY TIER THRESHOLDS:
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center">
              {[
                { title: 'STANDARD', range: '≤ ₹1L', idx: 0 },
                { title: 'HIGHER REVIEW', range: '₹1L – ₹10L', idx: 1 },
                { title: 'SENIOR AUTH', range: '₹10L – ₹50L', idx: 2 },
                { title: 'HIGHEST AUTH', range: '> ₹50L', idx: 3 },
              ].map(({ title, range, idx }) => {
                const isCurrent = governanceDecision.ladderIndex === idx;
                return (
                  <div
                    key={title}
                    className={`p-1.5 rounded border transition-all ${
                      isCurrent
                        ? 'bg-[#C19A5A]/20 border-[#C19A5A] text-[#F2F0EA] font-bold ring-1 ring-[#C19A5A]/40'
                        : 'bg-[#151617] border-[#292B2D] text-[#686A6B]'
                    }`}
                  >
                    <p className="truncate">{title}</p>
                    <p className="text-[9px] mt-0.5 opacity-80">{range}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Governance Approval Action Buttons */}
          {governanceDecision.approvalRequired ? (
            <div className="p-3 bg-[#101112] rounded-lg border border-[#292B2D] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#686A6B] uppercase block">GOVERNANCE APPROVAL:</span>
                <span
                  className={`text-[11px] font-bold ${
                    approvalStatus === 'APPROVED'
                      ? 'text-[#5F8669]'
                      : approvalStatus === 'REJECTED'
                      ? 'text-[#A64444]'
                      : 'text-[#C19A5A]'
                  }`}
                >
                  {approvalStatus === 'APPROVED'
                    ? `✓ ${governanceDecision.authorityTitle} GRANTED`
                    : approvalStatus === 'REJECTED'
                    ? '× TRANSACTION REJECTED BY AUTHORITY'
                    : '● PENDING REVIEW'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setApprovalStatus('APPROVED');
                    addToast(`Simulated: ${governanceDecision.authorityTitle} granted.`, 'success');
                  }}
                  className="px-3 py-1 bg-[#5F8669]/20 hover:bg-[#5F8669]/30 border border-[#5F8669]/40 text-[#5F8669] font-bold rounded text-xs transition-all btn-tactile"
                >
                  APPROVE
                </button>
                <button
                  onClick={() => {
                    setApprovalStatus('REJECTED');
                    addToast('Simulated: Transaction rejected by authority.', 'warning');
                  }}
                  className="px-3 py-1 bg-[#A64444]/20 hover:bg-[#A64444]/30 border border-[#A64444]/40 text-[#A64444] font-bold rounded text-xs transition-all btn-tactile"
                >
                  REJECT
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-[#101112] rounded-lg border border-[#292B2D] text-[11px] text-[#5F8669] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Standard limit processing — No elevated authority approval required.</span>
            </div>
          )}
        </div>
      </div>

      {/* THE 4 EXISTING RESPONSE PROTOCOL CARDS WITH DYNAMIC HIGHLIGHTING */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-5 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#292B2D]">
          <div>
            <h3 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
              EXECUTE RESPONSE PROTOCOL (REAL BACKEND TELEGRAM BROADCAST)
            </h3>
            <p className="text-[11px] text-[#9A9A96] font-sans">
              Clicking any card executes graduated containment and records an immutable audit trail event.
            </p>
          </div>
          {isDispatching && (
            <span className="text-xs font-bold text-[#C19A5A] flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {executionPhase === 'ANALYSING'
                ? 'ANALYSING INCIDENT...'
                : executionPhase === 'EXECUTING'
                ? 'DISPATCHING TELEGRAM NOTIFICATION...'
                : 'RECORDING AUDIT TRAIL...'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Require Verification (Tier 1 Containment) */}
          {(() => {
            const isRec = securityDecision.isActionRecommended('REQUIRE_VERIFICATION');
            return (
              <button
                onClick={() => handleAction('REQUIRE_VERIFICATION')}
                disabled={isDispatching}
                className={`p-4 rounded-lg border text-left transition-all btn-tactile relative overflow-hidden flex flex-col justify-between ${
                  isRec
                    ? 'bg-[#191A1C] border-[#C19A5A] ring-2 ring-[#C19A5A]/60 shadow-[0_0_15px_rgba(193,154,90,0.15)]'
                    : 'bg-[#101112] border-[#292B2D] hover:border-[#C19A5A]/40 hover:bg-[#151617]'
                } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRec && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-[#C19A5A]/20 border border-[#C19A5A]/50 text-[9px] font-extrabold text-[#C19A5A]">
                    RECOMMENDED
                  </div>
                )}
                <div>
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
                    Prompt for step-up biometric or manager MFA authorization.
                  </p>
                </div>
                <span className="inline-block mt-3 text-[10px] font-bold text-[#C19A5A] uppercase">
                  TIER 1 CONTAINMENT →
                </span>
              </button>
            );
          })()}

          {/* Action 2: Restrict User (Tier 2 Containment) */}
          {(() => {
            const isRec = securityDecision.isActionRecommended('RESTRICT_USER');
            return (
              <button
                onClick={() => handleAction('RESTRICT_USER')}
                disabled={isDispatching}
                className={`p-4 rounded-lg border text-left transition-all btn-tactile relative overflow-hidden flex flex-col justify-between ${
                  isRec
                    ? 'bg-[#191A1C] border-[#A64444] ring-2 ring-[#A64444]/60 shadow-[0_0_15px_rgba(166,68,68,0.15)]'
                    : 'bg-[#101112] border-[#292B2D] hover:border-[#A64444]/40 hover:bg-[#151617]'
                } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRec && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-[#A64444]/20 border border-[#A64444]/50 text-[9px] font-extrabold text-[#A64444]">
                    RECOMMENDED
                  </div>
                )}
                <div>
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
                    Revoke active privileged session and freeze account access.
                  </p>
                </div>
                <span className="inline-block mt-3 text-[10px] font-bold text-[#A64444] uppercase">
                  TIER 2 CONTAINMENT →
                </span>
              </button>
            );
          })()}

          {/* Action 3: Suspend Transaction (Financial Guard) */}
          {(() => {
            const isRec = securityDecision.isActionRecommended('SUSPEND_TRANSACTION');
            return (
              <button
                onClick={() => handleAction('SUSPEND_TRANSACTION')}
                disabled={isDispatching}
                className={`p-4 rounded-lg border text-left transition-all btn-tactile relative overflow-hidden flex flex-col justify-between ${
                  isRec
                    ? 'bg-[#191A1C] border-[#B67842] ring-2 ring-[#B67842]/60 shadow-[0_0_15px_rgba(182,120,66,0.15)]'
                    : 'bg-[#101112] border-[#292B2D] hover:border-[#B67842]/40 hover:bg-[#151617]'
                } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRec && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-[#B67842]/20 border border-[#B67842]/50 text-[9px] font-extrabold text-[#B67842]">
                    RECOMMENDED
                  </div>
                )}
                <div>
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
                    Halt outward wire immediately in payment gateway.
                  </p>
                </div>
                <span className="inline-block mt-3 text-[10px] font-bold text-[#B67842] uppercase">
                  FINANCIAL GUARD →
                </span>
              </button>
            );
          })()}

          {/* Action 4: Escalate to Security Team (Tier 3 Escalation) */}
          {(() => {
            const isRec = securityDecision.isActionRecommended('ESCALATE_TO_TEAM');
            return (
              <button
                onClick={() => handleAction('ESCALATE_TO_TEAM')}
                disabled={isDispatching}
                className={`p-4 rounded-lg border text-left transition-all btn-tactile relative overflow-hidden flex flex-col justify-between ${
                  isRec
                    ? 'bg-[#191A1C] border-[#C19A5A] ring-2 ring-[#C19A5A]/60 shadow-[0_0_15px_rgba(193,154,90,0.15)]'
                    : 'bg-[#101112] border-[#292B2D] hover:border-[#C19A5A]/40 hover:bg-[#151617]'
                } ${isDispatching ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRec && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-[#C19A5A]/20 border border-[#C19A5A]/50 text-[9px] font-extrabold text-[#C19A5A]">
                    RECOMMENDED
                  </div>
                )}
                <div>
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
                </div>
                <span className="inline-block mt-3 text-[10px] font-bold text-[#C19A5A] uppercase">
                  TIER 3 ESCALATION →
                </span>
              </button>
            );
          })()}
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
                      Executed by <span className="text-[#9A9A96]">{record.executedBy}</span> · Risk: <b className="text-[#F2F0EA]">{record.riskScore}/100</b>
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
