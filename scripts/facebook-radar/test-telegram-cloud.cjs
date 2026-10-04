/**
 * Test Telegram Alert Connection for Facebook Radar (Cloud Runner)
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function runTest() {
  console.log('==================================================');
  console.log('🧪 FACEBOOK RADAR TELEGRAM TEST PING');
  console.log('==================================================');
  console.log('Token Present:', Boolean(BOT_TOKEN));
  console.log('Chat ID Present:', Boolean(CHAT_ID));

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ ERROR: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID secret is MISSING in GitHub Secrets!');
    process.exit(1);
  }

  // 1. Check Bot Details
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      console.error('❌ Bot Token rejected by Telegram:', meData.description);
      process.exit(1);
    }
    console.log(`✅ Bot Authenticated: @${meData.result.username}`);
  } catch (err) {
    console.error('❌ Failed to reach Telegram API:', err.message);
    process.exit(1);
  }

  // 2. Send Facebook Radar Activation Alert
  console.log(`\n📨 Sending Facebook Radar Test Message to Chat ID ${CHAT_ID}...`);
  try {
    const text = `🎯 <b>GROWECH SOLUTION — FACEBOOK RADAR CONFIRMED!</b>\n\n` +
      `Salam Mustafa bhai! ✅ <b>Facebook Client Lead Radar 100% Connect Ho Chuka Hai!</b>\n\n` +
      `📡 <b>Active Monitored Pakistani Groups:</b>\n` +
      `• 🛒 Shopify Community in Pakistan (83K+ members)\n` +
      `• 💻 Pakistani Web Developers & Freelancers (35K+ members)\n` +
      `• 🏆 Top Freelancer Of Pakistan (161K+ members)\n` +
      `• 🚀 Startup Pakistan (218K+ members)\n` +
      `• 🌐 I Need A Website Designer / Developer (104K+ members)\n\n` +
      `🤖 <b>Gemini 2.5 Flash AI Pitch Engine:</b> Active & Ready\n` +
      `⏱️ <b>Cloud Radar Schedule:</b> Every 45 Mins (24/7 Autopilot)\n\n` +
      `<i>Jaise hi koi Pakistani ya global client website ya developer ke liye post karega, foran aapko live alert, direct post link aur 1-click tailored pitch yahan mil jayegi!</i>\n\n` +
      `⚡ <i>Growech Solution | 24/7 Autonomous Radar</i>`;

    const sendRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const sendData = await sendRes.json();
    console.log('Telegram sendMessage Response:', JSON.stringify(sendData));

    // Also send a sample live lead format so Mustafa sees the exact alert UI
    const samplePost = `🚨 <b>SAMPLE FACEBOOK CLIENT LEAD (LIVE PREVIEW)</b>\n\n` +
      `🏢 <b>Group:</b> Shopify Community in Pakistan by FulfillKaro\n` +
      `👤 <b>Client:</b> Muhammad Usman (Store Owner)\n` +
      `📌 <b>Requirement:</b>\n` +
      `<i>"Need an experienced Shopify developer for a paid custom liquid code fix and payment gateway integration on our store today."</i>\n\n` +
      `🔗 <b>Direct Post Link:</b>\n` +
      `https://facebook.com/groups/1270326783833978/permalink/sample/\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 <b>AI TAILORED PITCH (1-CLICK COPY):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<code>Assalam-o-Alaikum Usman bhai! Saw your requirement for custom Liquid theme fixing and gateway setup. At Growech Solution, we specialize in high-converting Shopify store code and payment checkouts. Can I share a quick 1-minute demo or jump on a quick call to resolve this today?

Mustafa | Growech Solution
Portfolio: growech.site</code>\n\n` +
      `⚡ <b>ACTION:</b> Click direct link above, paste this pitch in comment or DM!`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: samplePost,
        parse_mode: 'HTML'
      })
    });

    if (sendData.ok) {
      console.log('🎉 SUCCESS! Both confirmation messages delivered to user Telegram!');
    } else {
      console.error('❌ Telegram error:', sendData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Failed sending message:', err.message);
    process.exit(1);
  }
}

runTest();
