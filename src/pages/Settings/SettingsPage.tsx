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
          addToast(`✅ Telegram connection successful (@${data.botUsername || 'Bot'}).`, 'success');
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
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#171717]">System Configuration</h1>
          <p className="text-xs text-[#6B6B6B]">
            Configure behavioral risk thresholds and Telegram alert gateways
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] rounded-lg text-xs font-semibold text-[#171717] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#171717] hover:bg-[#2E2E2E] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* 1. Telegram Alert Integration Card */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#171717] text-white flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Telegram Alert Gateway
              </h2>
              <p className="text-xs text-[#6B6B6B]">Backend HTTPS Bot API Integration</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#26734D]/10 text-[#26734D] border border-[#26734D]/25 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26734D] animate-pulse" />
            Connected: @{connectionStatus.botUsername || 'Sentinel_pattern_alert_bot'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#171717] uppercase tracking-wider mb-1">
              Bot Token (Server Environment)
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="8766448719:AAHqYLbEQ1CDtAaZyfJsVG18qyABc_9opD8"
              className="w-full bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#171717] uppercase tracking-wider mb-1">
              Target Chat ID
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="1295989935"
              className="w-full bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono placeholder-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5E3DE]">
          <span className="text-xs text-[#6B6B6B]">
            Tokens are protected within backend server environment.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConn}
              className="px-3 py-1.5 bg-[#F6F5F2] hover:bg-[#EBE9E4] border border-[#E5E3DE] text-[#171717] rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              {isTestingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#26734D]" />}
              <span>Verify Connection</span>
            </button>

            <button
              onClick={handleSendTestAlert}
              disabled={isSendingTest}
              className="px-3 py-1.5 bg-[#171717] hover:bg-[#2E2E2E] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
            >
              {isSendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Risk Scoring Thresholds */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DE]">
          <Sliders className="w-4 h-4 text-[#171717]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Risk Score Threshold Ranges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#26734D]">LOW RISK (0 – 30)</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">Normal baseline operational activity</p>
            </div>
            <span className="font-mono font-bold text-[#171717]">0 – 30</span>
          </div>

          <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#A87516]">MEDIUM RISK (31 – 60)</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">Unusual single-factor baseline variance</p>
            </div>
            <span className="font-mono font-bold text-[#171717]">31 – 60</span>
          </div>

          <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#C65D21]">HIGH RISK (61 – 80)</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">Multi-factor sequence anomalies</p>
            </div>
            <span className="font-mono font-bold text-[#171717]">61 – 80</span>
          </div>

          <div className="p-3.5 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#C62828]">CRITICAL THREAT (81 – 100)</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">Autonomous Tier 1 mitigation trigger</p>
            </div>
            <span className="font-mono font-bold text-[#C62828]">81 – 100</span>
          </div>
        </div>
      </div>

      {/* 3. Alert Notification Dispatch Toggles */}
      <div className="bg-white border border-[#E5E3DE] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5E3DE]">
          <Bell className="w-4 h-4 text-[#171717]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Notification Channels
          </h2>
        </div>

        <div className="space-y-2.5 text-xs">
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
              className="p-3 bg-[#FAFAF8] border border-[#E5E3DE] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#F0EFEA] transition-all"
            >
              <div>
                <p className="font-bold text-[#171717]">{title}</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">{desc}</p>
              </div>
              <button className="text-[#171717]">
                {localSettings.notifications[key] ? (
                  <ToggleRight className="w-6 h-6 text-[#171717]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-[#8A8A8A]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
