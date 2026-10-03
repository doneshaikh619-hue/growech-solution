/**
 * Test Telegram Bot connection from Cloud (US runner)
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function runTest() {
  console.log('==================================================');
  console.log('🧪 TELEGRAM CLOUD DIAGNOSTIC & TEST PING');
  console.log('==================================================');
  console.log('Token Present:', Boolean(BOT_TOKEN), BOT_TOKEN ? `(Length: ${BOT_TOKEN.length})` : '');
  console.log('Chat ID Present:', Boolean(CHAT_ID), CHAT_ID ? `(Value: ${CHAT_ID})` : '');

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ ERROR: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID secret is MISSING in GitHub Secrets!');
    process.exit(1);
  }

  // 1. Check Bot Info (getMe)
  console.log('\n📡 Step 1: Checking Bot Details with Telegram API...');
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const meData = await meRes.json();
    console.log('Bot getMe Response:', JSON.stringify(meData));

    if (!meData.ok) {
      console.error('❌ Bot Token is invalid or rejected by Telegram:', meData.description);
      process.exit(1);
    }

    console.log(`✅ Bot Authenticated: @${meData.result.username} ("${meData.result.first_name}")`);
  } catch (err) {
    console.error('❌ Failed to reach api.telegram.org:', err.message);
    process.exit(1);
  }

  // 2. Dispatch Direct Test Message
  console.log(`\n📨 Step 2: Sending Test Message to Chat ID ${CHAT_ID}...`);
  try {
    const text = `🔥 <b>Growech Lead Radar — Test Alert!</b>\n\n` +
      `✅ <b>Connection 100% Successful!</b>\n` +
      `Mustafa, aapka Telegram Bot bilkul theek kaam kar raha hai.\n\n` +
      `Ab jaise hi Reddit par koi naya <b>[Hiring]</b> project aayega, isi tarah turant notification aayega!\n\n` +
      `<i>Growech Solution | 24/7 Cloud Autopilot</i>`;

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

    if (sendData.ok) {
      console.log('🎉 SUCCESS! Message delivered to user Telegram!');
    } else {
      console.error('❌ Telegram rejected message:');
      console.error('   Description:', sendData.description);
      console.error('   Error Code:', sendData.error_code);
      if (sendData.description && sendData.description.includes('chat not found')) {
        console.error('👉 CAUSE: The user has not pressed "START" inside their bot yet, or Chat ID is incorrect.');
      }
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Failed sending message:', err.message);
    process.exit(1);
  }
}

runTest();
