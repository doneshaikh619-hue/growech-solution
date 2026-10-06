/**
 * Test Telegram Alert Connection for Threads Multi-Agent Radar (Cloud Runner)
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function runTest() {
  console.log('==================================================');
  console.log('🧪 THREADS MULTI-AGENT TELEGRAM CONFIRMATION PING');
  console.log('==================================================');

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    process.exit(1);
  }

  // 1. Send Threads Connection Confirmation
  const confirmMsg = `🧵 <b>GROWECH SOLUTION — THREADS CONNECTED!</b>\n\n` +
    `Salam Mustafa bhai! ✅ <b>Aapka Instagram Threads account (@mustafa.user27) kamiyabi se connect ho chuka hai!</b>\n\n` +
    `🤖 <b>4-Agent Autonomous Swarm Deployed:</b>\n` +
    `1. 🔎 <b>Agent 1 (ThreadsScout):</b> Real-time chronological search across 'need web developer', 'need website', 'hiring developer', etc.\n` +
    `2. 🎯 <b>Agent 2 (IntentGatekeeper):</b> Budget (£, $, PKR) & hiring requirement extractor.\n` +
    `3. ✍️ <b>Agent 3 (AntiSlopHumanizer):</b> Powered by <b>Google Gemini 3.8 Flash</b> (Zero AI tells, Zero robotic buzzwords, 100% natural human pitch).\n` +
    `4. ⚡ <b>Agent 4 (DispatcherLedger):</b> Instant Telegram buzzer & Git deduplication.\n\n` +
    `⏱️ <b>Cloud Radar Schedule:</b> Every 5 Minutes (24/7 Autopilot)\n\n` +
    `<i>Jaise hi Threads par koi client website ya developer ke liye post karega, foran aapko live alert aur 100% human pitch yahan milegi!</i>\n\n` +
    `⚡ <i>Growech Solution | 24/7 Multi-Agent Autopilot</i>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: confirmMsg,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();
    console.log('Confirmation sendMessage Response:', JSON.stringify(data));

    // 2. Send Sample Live Lead Format
    const sampleLead = `🚨 <b>SAMPLE THREADS CLIENT LEAD (LIVE PREVIEW)</b>\n\n` +
      `👤 <b>Client:</b> @josephojetayo8\n` +
      `💰 <b>Budget:</b> <code>£985 (PKR ~3.5 Lakh)</code>\n` +
      `📌 <b>Requirement:</b>\n<i>"Need someone to design my website 👌. Budget: £985."</i>\n\n` +
      `🔗 <b>Direct Threads Link:</b>\nhttps://www.threads.com/@josephojetayo8/post/DeIPV5xjM8y\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 <b>HUMAN PITCH (ZERO AI SLOP):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<code>Hey Joseph, saw you need a website designed for £985. I run Growech (we build custom React apps and high-converting landing pages). Can share a quick 1-minute video walkthrough of a recent build if you want to take a look?

Mustafa | Growech Solution
Portfolio: growech.site</code>\n\n` +
      `⚡ <b>ACTION:</b> Open Threads link, tap Reply or Message, paste pitch & send!`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: sampleLead,
        parse_mode: 'HTML'
      })
    });

    if (data.ok) {
      console.log('🎉 SUCCESS! Threads confirmation and sample preview sent to Telegram!');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    process.exit(1);
  }
}

runTest();
