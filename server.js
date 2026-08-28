import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper for HTTPS Telegram API calls
function callTelegramApi(endpoint, payload = null) {
  return new Promise((resolve, reject) => {
    const token = (process.env.TELEGRAM_BOT_TOKEN || '8766448719:AAHqYLbEQ1CDtAaZyfJsVG18qyABc_9opD8').trim();
    const postData = payload ? JSON.stringify(payload) : null;

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/${endpoint}`,
      method: payload ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve(parsed);
        } catch (e) {
          resolve({ ok: false, error: 'Invalid JSON response from Telegram' });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Telegram API request timed out'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Helper to get formatted timestamp
function getTimestamp() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Format specific messages based on action
function formatTelegramMessage(data) {
  const { action, incidentId, user, role, riskScore, transactionAmount, target, timestamp } = data;
  const time = timestamp || getTimestamp();

  switch (action) {
    case 'REQUIRE_VERIFICATION':
      return `🔐 SENTINEL RESPONSE ACTION

🟡 ADDITIONAL VERIFICATION REQUIRED

Incident:
${incidentId || 'INC-2026-0091'}

User:
${user || 'Amit Sharma'}

Role:
${role || 'Payment Administrator'}

Risk:
${riskScore || 92}/100 — CRITICAL

Reason:
Suspicious privileged-user behaviour detected.

Response:
Additional verification has been requested.

Action:
Require biometric / MFA / manager authorization.

Time:
${time}

SENTINEL Behaviour Intelligence`;

    case 'RESTRICT_USER':
      return `🚨 SENTINEL RESPONSE ACTION

🔴 USER PRIVILEGES RESTRICTED

Incident:
${incidentId || 'INC-2026-0091'}

User:
${user || 'Amit Sharma'}

Role:
${role || 'Payment Administrator'}

Risk:
${riskScore || 92}/100 — CRITICAL

Reason:
High-risk behavioural sequence detected.

Actions detected:

1. Unusual login time
2. Unusual account access
3. Beneficiary changed
4. Transaction limit increased
5. Large payment initiated

Response:
Privileged session restricted.

Status:
USER RESTRICTED

Time:
${time}

SENTINEL Behaviour Intelligence`;

    case 'SUSPEND_TRANSACTION':
      return `🚨 SENTINEL RESPONSE ACTION

🛑 TRANSACTION SUSPENDED

Incident:
${incidentId || 'INC-2026-0091'}

User:
${user || 'Amit Sharma'}

Role:
${role || 'Payment Administrator'}

Risk:
${riskScore || 92}/100 — CRITICAL

Transaction:
${transactionAmount || '₹18,50,000'}

Target:
${target || 'XYZ Holdings'}

Reason:
Suspicious behavioural sequence detected.

Sequence:

Unusual login
↓
Unusual account access
↓
Beneficiary change
↓
Transaction limit increase
↓
Large payment

Response:
Transaction has been suspended pending investigation.

Status:
TRANSACTION SUSPENDED

Time:
${time}

SENTINEL Behaviour Intelligence`;

    case 'ESCALATE_TO_TEAM':
      return `🚨 SENTINEL RESPONSE ACTION

🚨 CRITICAL INCIDENT ESCALATED

Incident:
${incidentId || 'INC-2026-0091'}

User:
${user || 'Amit Sharma'}

Role:
${role || 'Payment Administrator'}

Risk:
${riskScore || 92}/100 — CRITICAL

Threat:
Potential privileged account misuse / insider threat.

Detected sequence:

1. Unusual login
2. Unusual resource access
3. Beneficiary modification
4. Transaction limit increase
5. Large payment initiation

Response:
Incident escalated to the Security Operations Team.

Priority:
CRITICAL

Time:
${time}

SENTINEL Behaviour Intelligence`;

    default:
      return `🚨 SENTINEL RESPONSE ACTION

Action: ${action}
Incident: ${incidentId || 'INC-2026-0091'}
User: ${user || 'Amit Sharma'}
Risk: ${riskScore || 92}/100
Time: ${time}

SENTINEL Behaviour Intelligence`;
  }
}

// 1. POST /api/telegram-alert
app.post('/api/telegram-alert', async (req, res) => {
  const chatId = (process.env.TELEGRAM_CHAT_ID || '1295989935').trim();
  const messageText = formatTelegramMessage(req.body);

  try {
    const data = await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: messageText,
    });

    if (data.ok && data.result) {
      return res.json({
        success: true,
        telegramSent: true,
        messageId: data.result.message_id,
      });
    } else {
      return res.status(502).json({
        success: false,
        telegramSent: false,
        error: data.description || 'Telegram Bot API error.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      telegramSent: false,
      error: 'Network failure communicating with Telegram Bot API.',
    });
  }
});

// 2. GET /api/telegram-status
app.get('/api/telegram-status', async (req, res) => {
  const chatId = (process.env.TELEGRAM_CHAT_ID || '1295989935').trim();

  try {
    const data = await callTelegramApi('getMe');

    if (data.ok && data.result) {
      return res.json({
        connected: true,
        configured: Boolean(chatId),
        hasChatId: Boolean(chatId),
        chatId,
        botUsername: data.result.username,
        botName: data.result.first_name,
      });
    } else {
      return res.json({
        connected: false,
        configured: false,
        error: data.description || 'Bot token unauthorized.',
      });
    }
  } catch (error) {
    return res.json({
      connected: false,
      configured: false,
      error: 'Unable to connect to Telegram servers.',
    });
  }
});

// 3. POST /api/telegram-test
app.post('/api/telegram-test', async (req, res) => {
  const chatId = (process.env.TELEGRAM_CHAT_ID || '1295989935').trim();

  const testMessage = `🛡️ SENTINEL TEST ALERT

Telegram integration is working successfully.

System:
SENTINEL Behaviour Intelligence

Status:
ONLINE

Time:
${getTimestamp()}`;

  try {
    const data = await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: testMessage,
    });

    if (data.ok && data.result) {
      return res.json({
        success: true,
        telegramSent: true,
        messageId: data.result.message_id,
      });
    } else {
      return res.status(502).json({
        success: false,
        telegramSent: false,
        error: data.description || 'Telegram Bot API error.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      telegramSent: false,
      error: 'Network failure sending test alert.',
    });
  }
});

// 4. POST /api/set-telegram-config
app.post('/api/set-telegram-config', (req, res) => {
  const { botToken, chatId } = req.body;

  if (botToken !== undefined) {
    process.env.TELEGRAM_BOT_TOKEN = botToken.trim();
  }
  if (chatId !== undefined) {
    process.env.TELEGRAM_CHAT_ID = chatId.trim();
  }

  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = `TELEGRAM_BOT_TOKEN=${process.env.TELEGRAM_BOT_TOKEN || ''}\nTELEGRAM_CHAT_ID=${process.env.TELEGRAM_CHAT_ID || ''}\nPORT=${PORT}\n`;
    fs.writeFileSync(envPath, envContent, 'utf-8');
  } catch (err) {
    console.error('Could not write to .env file', err);
  }

  return res.json({
    success: true,
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    hasChatId: Boolean(process.env.TELEGRAM_CHAT_ID),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SENTINEL Security Backend listening on http://0.0.0.0:${PORT}`);
});

// Keepalive heartbeat
setInterval(() => {}, 1000 * 60 * 60);
