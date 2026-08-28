import { useState, useEffect } from 'react';
import {
  Sliders,
  Bell,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Send,
  Radio,
  CheckCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { defaultSettings } from '../../data/mockData';

export default function SettingsPage() {
  const { settings, updateSettings, addToast } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    configured: boolean;
    botUsername?: string;
    botName?: string;
    error?: string;
  }>({
    tested: false,
    connected: false,
    configured: false,
  });

  // Check backend status on mount
  useEffect(() => {
    fetch('/api/telegram-status')
      .then((res) => res.json())
      .then((data) => {
        setConnectionStatus({
          tested: true,
          connected: data.connected,
          configured: data.configured,
          botUsername: data.botUsername,
          botName: data.botName,
          error: data.error,
        });
      })
      .catch(() => {
        setConnectionStatus({
          tested: true,
          connected: false,
          configured: false,
          error: 'Backend API unreachable.',
        });
      });
  }, []);

  const handleSaveAll = async () => {
    updateSettings(localSettings);

    // Save telegram config to backend
    if (botToken.trim() || chatId.trim()) {
      try {
        const res = await fetch('/api/set-telegram-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            botToken: botToken.trim() || undefined,
            chatId: chatId.trim() || undefined,
          }),
        });
        if (res.ok) {
          addToast('Configuration & Telegram environment saved on backend.', 'success');
          handleTestConnection();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    addToast('Configuration settings saved successfully.', 'success');
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    updateSettings(defaultSettings);
    addToast('Settings reset to default baseline thresholds.', 'info');
  };

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    try {
      const res = await fetch('/api/telegram-status');
      const data = await res.json();
      setConnectionStatus({
        tested: true,
        connected: data.connected,
        configured: data.configured,
        botUsername: data.botUsername,
        botName: data.botName,
        error: data.error,
      });

      if (data.connected) {
        addToast(`✅ Telegram connection successful (@${data.botUsername || 'Bot'}).`, 'success');
      } else {
        addToast(`⚠️ Telegram status: ${data.error || 'Not connected'}`, 'warning');
      }
    } catch (e: any) {
      addToast('❌ Could not connect to Telegram status endpoint.', 'error');
    } finally {
      setIsTestingConn(false);
    }
  };

  const handleSendTestAlert = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch('/api/telegram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.ok && data.success && data.telegramSent) {
        addToast('✅ Test Telegram alert sent.', 'success');
      } else {
        addToast(`❌ Telegram Test Failed: ${data.error || 'Could not deliver alert.'}`, 'error');
      }
    } catch (err: any) {
      addToast('❌ Network error sending test alert to backend.', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="p-7 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B2D]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F2F0EA] tracking-wide font-mono">
              SYSTEM CONFIGURATION & TUNING
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191A1C] text-[#C19A5A] border border-[#292B2D]">
              ENGINE PARAMETERS
            </span>
          </div>
          <p className="text-xs text-[#9A9A96] mt-0.5">
            Tune risk scoring thresholds, alerting notification pipelines, and backend Telegram dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151617] hover:bg-[#191A1C] border border-[#292B2D] rounded-lg text-[#9A9A96] hover:text-[#F2F0EA] transition-all btn-tactile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DEFAULTS</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 rounded-lg font-semibold text-[#F2F0EA] transition-all btn-tactile"
          >
            <Save className="w-3.5 h-3.5 text-[#C19A5A]" />
            <span>SAVE CHANGES</span>
          </button>
        </div>
      </div>

      {/* TELEGRAM BACKEND INTEGRATION CARD */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#292B2D]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#191A1C] border border-[#C19A5A]/30 flex items-center justify-center text-[#C19A5A]">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
                TELEGRAM API INTEGRATION
              </h2>
              <p className="text-[11px] text-[#9A9A96] font-sans">
                Backend Server Bot API Gateway · Process Environment Protected
              </p>
            </div>
          </div>
          <div>
            {connectionStatus.connected ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#5F8669]/15 text-[#5F8669] border border-[#5F8669]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5F8669] animate-pulse" />
                STATUS: CONNECTED
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C19A5A]/15 text-[#C19A5A] border border-[#C19A5A]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C19A5A]" />
                STATUS: STANDBY
              </span>
            )}
          </div>
        </div>

        {/* Server Config & Test Controls */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] text-[#686A6B] uppercase tracking-wider mb-1">
                Update Bot Token (Server .env)
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Paste new bot token from @BotFather"
                className="w-full bg-[#101112] border border-[#292B2D] rounded-lg px-3 py-2 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#686A6B] uppercase tracking-wider mb-1">
                Telegram Chat ID (TELEGRAM_CHAT_ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="1295989935"
                className="w-full bg-[#101112] border border-[#292B2D] rounded-lg px-3 py-2 text-xs text-[#F2F0EA] placeholder-[#686A6B] focus:outline-none focus:border-[#C19A5A]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-[#9A9A96]">
              {connectionStatus.botUsername ? (
                <span className="text-[#5F8669] font-semibold">
                  ✓ Active Bot: @{connectionStatus.botUsername} ({connectionStatus.botName})
                </span>
              ) : connectionStatus.error ? (
                <span className="text-[#C19A5A]">⚠️ {connectionStatus.error}</span>
              ) : (
                <span>Tokens securely managed in backend environment.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConn}
                className="px-3 py-1.5 bg-[#191A1C] hover:bg-[#242628] border border-[#292B2D] rounded-lg text-xs font-semibold text-[#F2F0EA] transition-all disabled:opacity-50 flex items-center gap-1.5 btn-tactile"
              >
                {isTestingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-[#5F8669]" />}
                <span>TEST CONNECTION</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestAlert}
                disabled={isSendingTest}
                className="px-3 py-1.5 bg-[#C19A5A]/20 hover:bg-[#C19A5A]/30 border border-[#C19A5A]/50 rounded-lg text-xs font-semibold text-[#F2F0EA] transition-all disabled:opacity-50 flex items-center gap-1.5 btn-tactile"
              >
                {isSendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#C19A5A]" />}
                <span>SEND TEST ALERT</span>
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3 bg-[#101112] border border-[#292B2D] rounded-lg text-[11px] space-y-1 text-[#9A9A96] font-sans">
            <p className="font-bold text-[#F2F0EA] flex items-center gap-1.5 font-mono text-xs">
              <HelpCircle className="w-3.5 h-3.5 text-[#C19A5A]" /> TELEGRAM CONFIGURATION REFERENCE:
            </p>
            <p>1. Bot: <b>@Sentinel_pattern_alert_bot</b> (Token configured on server).</p>
            <p>2. Chat ID: <b>1295989935</b> (+91 9911232177).</p>
          </div>
        </div>
      </div>

      {/* Section 1: Risk Thresholds */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-4 font-mono">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#292B2D]">
          <Sliders className="w-3.5 h-3.5 text-[#C19A5A]" />
          <h2 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
            RISK CLASSIFICATION THRESHOLDS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#101112] border border-[#5F8669]/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#5F8669]">LOW RISK (0 – 30)</span>
              <span className="text-[10px] text-[#686A6B]">Baseline operations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={localSettings.riskThresholds.low.max}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    riskThresholds: {
                      ...localSettings.riskThresholds,
                      low: { min: 0, max: Number(e.target.value) },
                    },
                  })
                }
                className="w-20 bg-[#151617] border border-[#292B2D] rounded px-2.5 py-1 text-xs text-[#F2F0EA] font-mono text-center focus:outline-none focus:border-[#5F8669]"
              />
              <span className="text-[11px] text-[#686A6B]">Max Cutoff</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#101112] border border-[#C19A5A]/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#C19A5A]">MEDIUM RISK (31 – 60)</span>
              <span className="text-[10px] text-[#686A6B]">Unusual baseline variance</span>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={localSettings.riskThresholds.medium.max}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    riskThresholds: {
                      ...localSettings.riskThresholds,
                      medium: { min: 31, max: Number(e.target.value) },
                    },
                  })
                }
                className="w-20 bg-[#151617] border border-[#292B2D] rounded px-2.5 py-1 text-xs text-[#F2F0EA] font-mono text-center focus:outline-none focus:border-[#C19A5A]"
              />
              <span className="text-[11px] text-[#686A6B]">Max Cutoff</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#101112] border border-[#B67842]/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#B67842]">HIGH RISK (61 – 80)</span>
              <span className="text-[10px] text-[#686A6B]">Suspicious pattern sequences</span>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={localSettings.riskThresholds.high.max}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    riskThresholds: {
                      ...localSettings.riskThresholds,
                      high: { min: 61, max: Number(e.target.value) },
                    },
                  })
                }
                className="w-20 bg-[#151617] border border-[#292B2D] rounded px-2.5 py-1 text-xs text-[#F2F0EA] font-mono text-center focus:outline-none focus:border-[#B67842]"
              />
              <span className="text-[11px] text-[#686A6B]">Max Cutoff</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#101112] border border-[#A64444]/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#A64444]">CRITICAL RISK (81 – 100)</span>
              <span className="text-[10px] text-[#686A6B]">Emergency containment</span>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={localSettings.riskThresholds.critical.min}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    riskThresholds: {
                      ...localSettings.riskThresholds,
                      critical: { min: Number(e.target.value), max: 100 },
                    },
                  })
                }
                className="w-20 bg-[#151617] border border-[#292B2D] rounded px-2.5 py-1 text-xs text-[#F2F0EA] font-mono text-center focus:outline-none focus:border-[#A64444]"
              />
              <span className="text-[11px] text-[#686A6B]">Min Trigger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Alert Notifications */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-5 shadow-md space-y-3 font-mono">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#292B2D]">
          <Bell className="w-3.5 h-3.5 text-[#C19A5A]" />
          <h2 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
            AUTOMATED NOTIFICATION PIPELINES
          </h2>
        </div>

        <div className="space-y-2">
          {[
            {
              key: 'emailAlerts' as const,
              title: 'Email Security Digest',
              desc: 'Forward hourly consolidated incident digests to SOC group.',
            },
            {
              key: 'securityTeamAlerts' as const,
              title: 'Real-Time SOC Pager',
              desc: 'Instant high-priority webhooks sent to on-duty analyst team.',
            },
            {
              key: 'criticalAlerts' as const,
              title: 'Critical Incident Telegram Broadcast',
              desc: 'Trigger immediate automated Telegram alerts for incidents with Risk > 80.',
            },
            {
              key: 'additionalVerification' as const,
              title: 'Automated Step-up MFA Enforcement',
              desc: 'Automatically mandate manager biometric verification for Medium/High outliers.',
            },
          ].map(({ key, title, desc }) => (
            <div
              key={key}
              onClick={() =>
                setLocalSettings({
                  ...localSettings,
                  notifications: {
                    ...localSettings.notifications,
                    [key]: !localSettings.notifications[key],
                  },
                })
              }
              className="p-3 bg-[#101112] border border-[#292B2D] rounded-lg flex items-center justify-between cursor-pointer hover:border-[#383B3E] transition-all"
            >
              <div>
                <p className="text-xs font-bold text-[#F2F0EA] font-sans">{title}</p>
                <p className="text-[11px] text-[#686A6B] mt-0.5 font-sans">{desc}</p>
              </div>
              <button className="text-[#C19A5A] pl-3">
                {localSettings.notifications[key] ? (
                  <ToggleRight className="w-6 h-6 text-[#C19A5A]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-[#686A6B]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Demo Mode Toggle */}
      <div className="bg-[#151617] border border-[#292B2D] rounded-xl p-4 shadow-md flex items-center justify-between font-mono">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#F2F0EA] uppercase tracking-wider">
              DEMO ENVIRONMENT TELEMETRY
            </h2>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5F8669]/15 text-[#5F8669] border border-[#5F8669]/30">
              ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-[#9A9A96] mt-0.5 font-sans">
            Simulates realistic banking telemetry and enables full live sequence testing for presentation.
          </p>
        </div>
        <button
          onClick={() =>
            setLocalSettings({
              ...localSettings,
              demoMode: !localSettings.demoMode,
            })
          }
          className="text-[#C19A5A]"
        >
          {localSettings.demoMode ? (
            <ToggleRight className="w-7 h-7 text-[#C19A5A]" />
          ) : (
            <ToggleLeft className="w-7 h-7 text-[#686A6B]" />
          )}
        </button>
      </div>
    </div>
  );
}
