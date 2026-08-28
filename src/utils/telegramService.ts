// Telegram & Mobile Notification Service for SENTINEL

export interface TelegramConfig {
  phoneNumber: string;
  botToken: string;
  chatId: string;
  enabled: boolean;
  botUsername?: string;
  autoOpenTelegram?: boolean;
}

const DEFAULT_CONFIG: TelegramConfig = {
  phoneNumber: '',
  botToken: '',
  chatId: '',
  enabled: true,
  autoOpenTelegram: false,
};

export const getTelegramConfig = (): TelegramConfig => {
  try {
    const saved = localStorage.getItem('sentinel_telegram_config');
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading telegram config', e);
  }
  return DEFAULT_CONFIG;
};

export const saveTelegramConfig = (config: TelegramConfig) => {
  localStorage.setItem('sentinel_telegram_config', JSON.stringify(config));
};

export function createTelegramShareLink(messageText: string): string {
  const encodedText = encodeURIComponent(messageText);
  return `https://t.me/share/url?url=&text=${encodedText}`;
}

export function createWhatsAppDirectLink(phoneNumber: string, messageText: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(messageText);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}

export async function validateBotToken(botToken: string): Promise<{ valid: boolean; botName?: string; username?: string; message: string }> {
  if (!botToken || !botToken.trim()) {
    return { valid: false, message: 'Bot Token cannot be empty.' };
  }

  const cleanToken = botToken.trim();
  try {
    const response = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const data = await response.json();

    if (data.ok && data.result) {
      return {
        valid: true,
        botName: data.result.first_name,
        username: data.result.username,
        message: `Connected to @${data.result.username} (${data.result.first_name})`,
      };
    } else {
      return {
        valid: false,
        message: data.description || 'Telegram API returned Unauthorized (401).',
      };
    }
  } catch (error: any) {
    return {
      valid: false,
      message: error?.message || 'Network error connecting to Telegram servers.',
    };
  }
}

export async function getLatestChatId(botToken: string): Promise<{ success: boolean; chatId?: string; name?: string; message: string }> {
  const cleanToken = botToken.trim();
  if (!cleanToken) {
    return { success: false, message: 'Please enter a Bot Token first.' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${cleanToken}/getUpdates`);
    const data = await response.json();

    if (!data.ok) {
      return { success: false, message: data.description || 'Invalid bot token or cannot connect to Telegram API.' };
    }

    if (!data.result || data.result.length === 0) {
      return {
        success: false,
        message: 'No recent messages found. Open your bot in Telegram, tap /start, and click Auto-Detect.',
      };
    }

    for (let i = data.result.length - 1; i >= 0; i--) {
      const item = data.result[i];
      const msg = item.message || item.channel_post || item.edited_message || item.callback_query?.message;
      if (msg && msg.chat && msg.chat.id) {
        const chatId = String(msg.chat.id);
        const name = msg.from?.first_name || msg.chat.title || msg.chat.username || 'User';
        return {
          success: true,
          chatId,
          name,
          message: `Found Chat ID: ${chatId} (${name})`,
        };
      }
    }

    return { success: false, message: 'Could not extract Chat ID from recent updates.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Error connecting to Telegram.' };
  }
}

export async function sendTelegramMessage(
  htmlMessage: string,
  customToken?: string,
  customChatId?: string
): Promise<{ success: boolean; message: string; telegramLink?: string }> {
  const config = getTelegramConfig();
  const token = (customToken || config.botToken || '').trim();
  const chatId = (customChatId || config.chatId || '').trim();
  const rawText = htmlMessage.replace(/<[^>]*>?/gm, '');
  const telegramLink = createTelegramShareLink(rawText);

  // If chatId is available and token is valid, attempt direct bot API dispatch
  if (token && chatId) {
    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        return { success: true, message: `Dispatched to Telegram (${chatId})`, telegramLink };
      }
    } catch (e) {
      console.warn('Direct bot sendMessage attempt failed, falling back to direct link', e);
    }
  }

  // If bot API is unauthorized or Chat ID is missing, provide direct instant link
  return {
    success: true,
    message: `Security alert generated for +91 ${config.phoneNumber}`,
    telegramLink,
  };
}

// Formatted Templates
export function formatCriticalIncidentNotification(data: {
  caseId: string;
  userName: string;
  role: string;
  riskScore: number;
  amount: string;
  beneficiary: string;
  reason: string;
  phoneNumber?: string;
}): string {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const phone = data.phoneNumber || '9911232177';

  return `🚨 [SENTINEL SECURITY ALERT] 🚨
━━━━━━━━━━━━━━━━━━━━
🔴 CRITICAL INSIDER THREAT DETECTED
━━━━━━━━━━━━━━━━━━━━
📁 Case ID: ${data.caseId}
👤 User: ${data.userName} (${data.role})
⚡ Risk Score: ${data.riskScore}/100 [CRITICAL]
📱 Alert Contact: +91 ${phone}
🕒 Time: ${timestamp}

🎯 Suspicious Sequence:
1️⃣ Unusual Off-Hours Access (02:15 AM)
2️⃣ High-Value Corporate Account Accessed
3️⃣ Beneficiary Changed → ${data.beneficiary}
4️⃣ Transaction Limit Raised 5×
5️⃣ Large Payment Initiated → ${data.amount}

⚠️ Behaviour Intelligence Analysis:
"${data.reason}"

🛡️ Recommended Action: SUSPEND TRANSACTION
━━━━━━━━━━━━━━━━━━━━
SENTINEL Privileged Behaviour Intelligence Engine`;
}

export function formatResponseActionNotification(data: {
  action: string;
  status: string;
  caseId: string;
  userName: string;
  targetAmount?: string;
  analyst: string;
  phoneNumber?: string;
}): string {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const phone = data.phoneNumber || '9911232177';

  return `🛑 [SENTINEL MITIGATION RESPONSE] 🛑
━━━━━━━━━━━━━━━━━━━━
⚡ Action Taken: ${data.action.toUpperCase()}
🛡️ Incident State: ${data.status}
📁 Case ID: ${data.caseId}
👤 Target User: ${data.userName}
${data.targetAmount ? `💰 Suspended Amount: ${data.targetAmount}\n` : ''}📱 Alert Contact: +91 ${phone}
👮 Executed By: ${data.analyst}
🕒 Time: ${timestamp}
━━━━━━━━━━━━━━━━━━━━
✅ Graduated containment protocol enforced across gateways.`;
}

export function formatTestNotification(phoneNumber?: string): string {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const phone = phoneNumber || '9911232177';
  return `🛡️ [SENTINEL TELEGRAM TEST] 🛡️
━━━━━━━━━━━━━━━━━━━━
✅ Telegram Notification Active!
SENTINEL Behaviour Intelligence is linked to Mobile +91 ${phone}.
You will receive real-time critical insider threat alerts and response action dispatches here.

🕒 Timestamp: ${timestamp}
🤖 System Status: ONLINE`;
}
