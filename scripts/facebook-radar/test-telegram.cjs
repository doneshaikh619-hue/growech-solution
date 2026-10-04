const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

console.log('Testing Telegram Bot with:');
console.log('Token:', TELEGRAM_BOT_TOKEN ? 'Loaded (starts with ' + TELEGRAM_BOT_TOKEN.substring(0, 10) + '...)' : 'MISSING');
console.log('Chat ID:', TELEGRAM_CHAT_ID || 'MISSING');

async function sendTest() {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const text = `🚀 <b>Growech Solution — Facebook Lead Radar Activated!</b>\n\n` +
    `Salam Mustafa bhai! Aapka <b>Facebook Client Lead Radar</b> kamiyabi se deploy ho chuka hai.\n\n` +
    `⚡ <b>Monitored Groups:</b>\n` +
    `• Shopify Community Pakistan (83K)\n` +
    `• Pakistani Web Developers & Freelancers (35K)\n` +
    `• Top Freelancer Of Pakistan (161K)\n` +
    `• Startup Pakistan (218K)\n\n` +
    `Jaise hi koi client website ya developer ke liye post karega, foran aapko direct link aur tailored pitch yahan mil jayegi!`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    if (data.ok) {
      console.log('✅ Telegram test message delivered successfully!');
    } else {
      console.error('❌ Telegram error:', data);
    }
  } catch (err) {
    console.error('❌ Network error:', err.message);
  }
}

sendTest();
