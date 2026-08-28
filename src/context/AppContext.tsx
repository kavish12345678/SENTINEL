import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { DemoState, DemoStage, Incident, Alert, Settings, User, AuditRecord, IncidentStatus } from '../types';
import { mockAlerts, mockIncident, defaultSettings, mockUsers } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  demoState: DemoState;
  incident: Incident;
  alerts: Alert[];
  users: User[];
  settings: Settings;
  toasts: Toast[];
  auditRecords: AuditRecord[];
  isAuthenticated: boolean;
  isDispatching: boolean;

  // Demo controls
  startDemo: (scenarioType: 'suspicious' | 'legitimate') => void;
  pauseDemo: () => void;
  nextStep: () => void;
  resetDemo: () => void;

  // Response execution via backend Telegram API
  executeResponseAction: (actionKey: 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM') => Promise<{ success: boolean; telegramSent: boolean; error?: string }>;

  // Alert/Incident actions
  updateIncidentStatus: (status: IncidentStatus) => void;
  resolveAlert: (alertId: string) => void;

  // Settings
  updateSettings: (settings: Partial<Settings>) => void;

  // Auth
  login: () => void;
  logout: () => void;

  // Toast
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const defaultDemoState: DemoState = {
  isRunning: false,
  isPaused: false,
  stage: 0,
  currentRisk: 18,
  scenarioType: null,
  completedStages: [],
};

const initialAuditRecords: AuditRecord[] = [
  {
    id: 'audit-0',
    incidentId: 'INC-2026-0091',
    action: 'INITIAL_DETECTION',
    actionTitle: 'Incident Detected & Baseline Flagged',
    user: 'Amit Sharma',
    riskScore: 92,
    timestamp: '02:23 AM',
    executedBy: 'SENTINEL Behaviour Engine',
    telegramStatus: 'SENT',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sentinel_auth') === 'true';
  });

  const [demoState, setDemoState] = useState<DemoState>(() => {
    const saved = localStorage.getItem('sentinel_demo_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultDemoState;
      }
    }
    return defaultDemoState;
  });

  const [incident, setIncident] = useState<Incident>(() => {
    const saved = localStorage.getItem('sentinel_incident');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockIncident;
      }
    }
    return mockIncident;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sentinel_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockUsers;
      }
    }
    return mockUsers;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('sentinel_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockAlerts;
      }
    }
    return mockAlerts;
  });

  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem('sentinel_audit_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialAuditRecords;
      }
    }
    return initialAuditRecords;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('sentinel_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem('sentinel_demo_state', JSON.stringify(demoState));
  }, [demoState]);

  useEffect(() => {
    localStorage.setItem('sentinel_incident', JSON.stringify(incident));
  }, [incident]);

  useEffect(() => {
    localStorage.setItem('sentinel_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sentinel_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('sentinel_audit_records', JSON.stringify(auditRecords));
  }, [auditRecords]);

  useEffect(() => {
    localStorage.setItem('sentinel_settings', JSON.stringify(settings));
  }, [settings]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem('sentinel_auth', 'true');
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('sentinel_auth');
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const stageRisks: Record<number, number> = {
    0: 18,
    1: 20,
    2: 40,
    3: 55,
    4: 70,
    5: 80,
    6: 92,
    7: 92,
    8: 92,
  };

  const legitimateStageRisks: Record<number, number> = {
    0: 22,
    1: 24,
    2: 36,
    3: 30,
    4: 28,
    5: 22,
    6: 22,
    7: 22,
    8: 22,
  };

  const startDemo = useCallback((scenarioType: 'suspicious' | 'legitimate') => {
    setDemoState({
      isRunning: true,
      isPaused: false,
      stage: 1,
      currentRisk: scenarioType === 'suspicious' ? 20 : 24,
      scenarioType,
      completedStages: [1],
    });
  }, []);

  const pauseDemo = useCallback(() => {
    setDemoState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const nextStep = useCallback(() => {
    setDemoState((prev) => {
      if (!prev.isRunning) return prev;
      const nextStage = Math.min((prev.stage + 1) as DemoStage, 8) as DemoStage;
      const riskMap = prev.scenarioType === 'legitimate' ? legitimateStageRisks : stageRisks;
      const newRisk = riskMap[nextStage] ?? prev.currentRisk;

      return {
        ...prev,
        stage: nextStage,
        currentRisk: newRisk,
        completedStages: [...prev.completedStages, nextStage],
        isPaused: false,
      };
    });
  }, []);

  const resetDemo = useCallback(() => {
    setDemoState(defaultDemoState);
    setIncident(mockIncident);
    setUsers(mockUsers);
    setAlerts(mockAlerts);
    setAuditRecords(initialAuditRecords);
    localStorage.removeItem('sentinel_demo_state');
    localStorage.removeItem('sentinel_incident');
    localStorage.removeItem('sentinel_users');
    localStorage.removeItem('sentinel_alerts');
    localStorage.removeItem('sentinel_audit_records');
    addToast('Demo and Incident states have been reset to default', 'info');
  }, [addToast]);

  const updateIncidentStatus = useCallback((status: IncidentStatus) => {
    setIncident((prev) => ({ ...prev, status, updatedAt: new Date().toISOString() }));
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === 'al1'
          ? {
              ...a,
              status:
                status === 'CLOSED' || status === 'TRANSACTION_SUSPENDED'
                  ? 'RESOLVED'
                  : 'INVESTIGATING',
            }
          : a
      )
    );
  }, []);

  // REAL BACKEND TELEGRAM DISPATCH FUNCTION
  const executeResponseAction = useCallback(
    async (
      actionKey: 'REQUIRE_VERIFICATION' | 'RESTRICT_USER' | 'SUSPEND_TRANSACTION' | 'ESCALATE_TO_TEAM'
    ): Promise<{ success: boolean; telegramSent: boolean; error?: string }> => {
      setIsDispatching(true);

      const actionTitleMap = {
        REQUIRE_VERIFICATION: 'Verification Requested',
        RESTRICT_USER: 'User Privileges Restricted',
        SUSPEND_TRANSACTION: 'Transaction Suspended',
        ESCALATE_TO_TEAM: 'Incident Escalated to Security Team',
      };

      const newStatusMap: Record<string, IncidentStatus> = {
        REQUIRE_VERIFICATION: 'VERIFICATION_REQUIRED',
        RESTRICT_USER: 'RESTRICTED',
        SUSPEND_TRANSACTION: 'TRANSACTION_SUSPENDED',
        ESCALATE_TO_TEAM: 'ESCALATED',
      };

      const actionTitle = actionTitleMap[actionKey];
      const newStatus = newStatusMap[actionKey];
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const payload = {
        action: actionKey,
        incidentId: incident.caseId,
        user: incident.userName,
        role: 'Payment Administrator',
        riskScore: incident.riskScore,
        transactionAmount: '₹18,50,000',
        target: 'XYZ Holdings',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      let result: { success: boolean; telegramSent: boolean; error?: string } = {
        success: false,
        telegramSent: false,
      };

      try {
        let response = await fetch('/api/telegram-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => null);

        // Fallback to direct backend URL if proxy had 502
        if (!response || !response.ok) {
          response = await fetch('http://127.0.0.1:3001/api/telegram-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => null);
        }

        // Fallback to direct client-side Telegram API if backend was unreachable
        if (!response || !response.ok) {
          const directTgMsg = `🚨 SENTINEL RESPONSE ACTION\n\nAction: ${actionTitle}\nIncident: ${incident.caseId}\nUser: ${incident.userName}\nRisk: ${incident.riskScore}/100 — CRITICAL\nTime: ${payload.timestamp}\n\nSENTINEL Behaviour Intelligence`;
          response = await fetch('https://api.telegram.org/bot8766448719:AAHqYLbEQ1CDtAaZyfJsVG18qyABc_9opD8/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: '1295989935',
              text: directTgMsg,
            }),
          }).catch(() => null);
        }

        const data = response ? await response.json().catch(() => null) : null;

        if (response && response.ok && (data?.success || data?.ok)) {
          result = { success: true, telegramSent: true };
          addToast('✅ Telegram alert sent successfully.', 'success');
        } else {
          result = {
            success: false,
            telegramSent: false,
            error: data?.error || data?.description || 'Unable to deliver Telegram notification.',
          };
          addToast(
            `❌ Telegram Alert Failed: Security response was recorded, but Telegram notification could not be delivered.`,
            'error'
          );
        }
      } catch (err: any) {
        result = {
          success: false,
          telegramSent: false,
          error: err?.message || 'Error sending Telegram alert.',
        };
        addToast(
          '❌ Telegram Alert Failed: Security response was recorded, but Telegram notification could not be delivered.',
          'error'
        );
      } finally {
        setIsDispatching(false);
      }

      // 1. Update Incident Status
      updateIncidentStatus(newStatus);

      // 2. If action is RESTRICT_USER, update user status across entire application
      if (actionKey === 'RESTRICT_USER') {
        setUsers((prev) =>
          prev.map((u) =>
            u.name.toLowerCase().includes('amit')
              ? { ...u, status: 'RESTRICTED', riskScore: 92 }
              : u
          )
        );
      }

      // 3. Add to Audit Record Log (newest first)
      const newAuditRecord: AuditRecord = {
        id: `audit-${Date.now()}`,
        incidentId: incident.caseId,
        action: actionKey,
        actionTitle: actionTitle,
        user: incident.userName,
        riskScore: incident.riskScore,
        timestamp,
        executedBy: 'Security Analyst',
        telegramStatus: result.telegramSent ? 'SENT' : 'FAILED',
        error: result.error,
      };

      setAuditRecords((prev) => [newAuditRecord, ...prev]);

      return result;
    },
    [incident, updateIncidentStatus, addToast]
  );

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a)));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        demoState,
        incident,
        alerts,
        users,
        settings,
        toasts,
        auditRecords,
        isAuthenticated,
        isDispatching,
        startDemo,
        pauseDemo,
        nextStep,
        resetDemo,
        executeResponseAction,
        updateIncidentStatus,
        resolveAlert,
        updateSettings,
        login,
        logout,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
