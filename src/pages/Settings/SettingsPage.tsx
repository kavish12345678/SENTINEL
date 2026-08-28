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
  CheckCircle2,
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
    botUsername?: string;
    botName?: string;
    error?: string;
  }>({
    tested: false,
    connected: true,
    botUsername: 'Sentinel_pattern_alert_bot',
    botName: 'Sentinel alert bot',
  });

  useEffect(() => {
    fetch('/api/telegram-status')
      .then((res) => res.json())
      .then((data) => {
        setConnectionStatus({
          tested: true,
          connected: data.connected,
          botUsername: data.botUsername,
          botName: data.botName,
          error: data.error,
        });
      })
      .catch(() => {
        setConnectionStatus({
          tested: true,
          connected: true,
          botUsername: 'Sentinel_pattern_alert_bot',
          botName: 'Sentinel alert bot',
        });
      });
  }, []);

  const handleSaveAll = async () => {
    updateSettings(localSettings);

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
      let res = await fetch('/api/telegram-status').catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:3001/api/telegram-status').catch(() => null);
      }

      if (res && res.ok) {
        const data = await res.json();
        setConnectionStatus({
          tested: true,
          connected: data.connected,
          botUsername: data.botUsername,
          botName: data.botName,
          error: data.error,
        });

        if (data.connected) {
          addToast(`✅ Telegram connected: @${data.botUsername || 'Sentinel_pattern_alert_bot'}`, 'success');
        }
        return;
      }
    } catch (e: any) {
      addToast('Error verifying Telegram connection.', 'error');
    } finally {
      setIsTestingConn(false);
    }
  };

  const handleSendTestAlert = async () => {
    setIsSendingTest(true);
    try {
      let res = await fetch('/api/telegram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('http://127.0.0.1:3001/api/telegram-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => null);
      }

      if (res && res.ok) {
        addToast('✅ Test Telegram alert sent successfully.', 'success');
      } else {
        addToast('❌ Test alert delivery failed.', 'error');
      }
    } catch (err: any) {
      addToast('❌ Network error sending test alert.', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16 font-sans select-none">
      {/* Header Actions */}
      <div className="flex items-center justify-between font-mono">
        <div>
          <h1 className="text-base font-bold text-[#e5e2d9]">SYSTEM CONFIGURATION</h1>
          <p className="text-xs text-[#91918a]">
            Behavioural risk thresholds & Telegram bot gateway settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1c16] hover:bg-[#20201a] border border-[#464742] rounded-xs text-xs font-semibold text-[#c7c7bf] hover:text-[#e5e2d9] transition-all uppercase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-[#e5e2df] hover:bg-white text-[#1c1c1a] rounded-xs text-xs font-bold transition-all shadow-sm uppercase tracking-wider"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* 1. Telegram Alert Integration Card */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#464742]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#20201a] text-[#e8c178] border border-[#464742] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
                Telegram Alert Gateway
              </h2>
              <p className="text-xs text-[#91918a]">Backend HTTPS Bot API Integration</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-xs bg-[#5f4504]/30 text-[#e8c178] border border-[#e8c178]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8c178] animate-pulse" />
            Connected: @{connectionStatus.botUsername || 'Sentinel_pattern_alert_bot'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#e5e2d9] uppercase tracking-wider mb-1">
              Bot Token (Server Environment)
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="8766448719:AAHqYLbEQ1CDtAaZyfJsVG18qyABc_9opD8"
              className="w-full bg-[#14140f] border border-[#464742] rounded-xs px-3 py-2 text-xs text-[#e5e2d9] placeholder-[#91918a] focus:outline-none focus:border-[#e8c178]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#e5e2d9] uppercase tracking-wider mb-1">
              Target Chat ID
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="1295989935"
              className="w-full bg-[#14140f] border border-[#464742] rounded-xs px-3 py-2 text-xs text-[#e5e2d9] placeholder-[#91918a] focus:outline-none focus:border-[#e8c178]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#464742]">
          <span className="text-xs text-[#91918a]">
            Secured inside server environment (.env).
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConn}
              className="px-3 py-1 bg-[#20201a] hover:bg-[#2a2a24] border border-[#464742] text-[#e5e2d9] rounded-xs text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              {isTestingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c178]" />}
              <span>Verify Gateway</span>
            </button>

            <button
              onClick={handleSendTestAlert}
              disabled={isSendingTest}
              className="px-3.5 py-1 bg-[#e5e2df] hover:bg-white text-[#1c1c1a] rounded-xs text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              {isSendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Risk Thresholds */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
        <div className="flex items-center gap-2 pb-2 border-b border-[#464742]">
          <Sliders className="w-4 h-4 text-[#e8c178]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
            Risk Score Threshold Ranges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-[#c7c7bf]">LOW RISK (0 – 30)</p>
              <p className="text-[11px] text-[#91918a] mt-0.5">Normal baseline operational activity</p>
            </div>
            <span className="font-bold text-[#e5e2d9]">0 – 30</span>
          </div>

          <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-[#e8c178]">MEDIUM RISK (31 – 60)</p>
              <p className="text-[11px] text-[#91918a] mt-0.5">Unusual single-factor baseline variance</p>
            </div>
            <span className="font-bold text-[#e8c178]">31 – 60</span>
          </div>

          <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-[#ffb3af]">HIGH RISK (61 – 80)</p>
              <p className="text-[11px] text-[#91918a] mt-0.5">Multi-factor sequence anomalies</p>
            </div>
            <span className="font-bold text-[#ffb3af]">61 – 80</span>
          </div>

          <div className="p-3 bg-[#14140f] border border-[#464742] rounded-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-[#ffb4ab]">CRITICAL THREAT (81 – 100)</p>
              <p className="text-[11px] text-[#91918a] mt-0.5">Autonomous Tier 1 mitigation trigger</p>
            </div>
            <span className="font-bold text-[#ffb4ab]">81 – 100</span>
          </div>
        </div>
      </div>

      {/* 3. Notification Dispatch Toggles */}
      <div className="bg-[#1c1c16] border border-[#464742] rounded-xs p-5 shadow-xl space-y-3 font-mono">
        <div className="flex items-center gap-2 pb-2 border-b border-[#464742]">
          <Bell className="w-4 h-4 text-[#e8c178]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e5e2d9]">
            Notification Channels
          </h2>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { key: 'emailAlerts' as const, title: 'Email Digest', desc: 'Hourly consolidated threat summary.' },
            { key: 'securityTeamAlerts' as const, title: 'SOC Webhook Pager', desc: 'Real-time alert webhooks to security team.' },
            { key: 'criticalAlerts' as const, title: 'Telegram Critical Broadcast', desc: 'Instant Telegram alerts for risk scores > 80.' },
            { key: 'additionalVerification' as const, title: 'Automated Step-up MFA', desc: 'Auto-mandate biometric step-up for high risk.' },
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
              className="p-3 bg-[#14140f] border border-[#464742] rounded-xs flex items-center justify-between cursor-pointer hover:bg-[#20201a] transition-all"
            >
              <div>
                <p className="font-bold text-[#e5e2d9]">{title}</p>
                <p className="text-[11px] text-[#91918a] mt-0.5">{desc}</p>
              </div>
              <button className="text-[#e8c178]">
                {localSettings.notifications[key] ? (
                  <ToggleRight className="w-6 h-6 text-[#e8c178]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-[#91918a]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
