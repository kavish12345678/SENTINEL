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
          // Re-verify
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
    <div className="p-6 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              Engine Config
            </span>
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            Tune risk scoring thresholds, alerting notification pipelines, and backend Telegram dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-md"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* TELEGRAM BACKEND INTEGRATION CARD */}
      <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Telegram Alert Integration</h2>
              <p className="text-xs text-slate-400">Backend Server Bot API Gateway · Process Environment Protected</p>
            </div>
          </div>
          <div>
            {connectionStatus.connected ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Status: 🟢 Connected
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Status: ⚠️ Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Server Config & Test Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Update Bot Token (Server .env)
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Paste new bot token from @BotFather"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Telegram Chat ID (TELEGRAM_CHAT_ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter numeric Telegram Chat ID"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              {connectionStatus.botUsername ? (
                <span className="text-green-400 font-semibold">
                  ✓ Active Bot: @{connectionStatus.botUsername} ({connectionStatus.botName})
                </span>
              ) : connectionStatus.error ? (
                <span className="text-yellow-400 font-medium">⚠️ {connectionStatus.error}</span>
              ) : (
                <span>Tokens are securely stored in server environment.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConn}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isTestingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                Test Telegram Connection
              </button>

              <button
                type="button"
                onClick={handleSendTestAlert}
                disabled={isSendingTest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md"
              >
                {isSendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Test Alert
              </button>
            </div>
          </div>

          {/* Instructions box */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1.5 text-slate-300">
            <p className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Telegram Setup Instructions:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              <li>Create a bot on Telegram via <b>@BotFather</b> and copy the Bot Token.</li>
              <li>Message your bot or <b>@userinfobot</b> to find your numeric <b>Chat ID</b>.</li>
              <li>Paste them above and click <b>Save Changes</b> $\rightarrow$ <b>Test Telegram Connection</b>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Section 1: Risk Thresholds */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Risk Score Threshold Ranges</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/60 border border-green-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-green-400">LOW RISK (0 – 30)</span>
              <span className="text-[10px] text-slate-500">Normal operations</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <span className="text-xs text-slate-400">Max Cutoff Score</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-yellow-400">MEDIUM RISK (31 – 60)</span>
              <span className="text-[10px] text-slate-500">Unusual baseline variance</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <span className="text-xs text-slate-400">Max Cutoff Score</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-orange-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-400">HIGH RISK (61 – 80)</span>
              <span className="text-[10px] text-slate-500">Suspicious action sequences</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="text-xs text-slate-400">Max Cutoff Score</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-red-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-400">CRITICAL RISK (81 – 100)</span>
              <span className="text-[10px] text-slate-500">Autonomous / Tier 1 Incident</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-xs text-slate-400">Min Trigger Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Alert Notifications */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Alert Notification Dispatch</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'emailAlerts' as const,
              title: 'Email Security Digest',
              desc: 'Forward consolidated hourly alert reports to designated SOC group.',
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
              desc: 'Automatically mandate hardware-key or manager biometric verification for Medium/High outliers.',
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
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button className="text-blue-400">
                {localSettings.notifications[key] ? (
                  <ToggleRight className="w-7 h-7 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Demo Mode Toggle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Demo Environment Mode</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates realistic banking telemetry and enables full live sequence testing for judges.
          </p>
        </div>
        <button
          onClick={() =>
            setLocalSettings({
              ...localSettings,
              demoMode: !localSettings.demoMode,
            })
          }
          className="text-blue-400"
        >
          {localSettings.demoMode ? (
            <ToggleRight className="w-8 h-8 text-blue-500" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-slate-600" />
          )}
        </button>
      </div>
    </div>
  );
}
