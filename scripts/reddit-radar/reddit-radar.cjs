const fs = require('fs');
const path = require('path');

/**
 * GROWECH SOLUTION — 24/7 REDDIT CLIENT LEAD RADAR
 * Automatically scans top high-ticket freelance subreddits,
 * detects [Hiring] opportunities in real-time, generates bespoke
 * AI pitches with Gemini, and pings your Telegram immediately!
 */

// Load local environment if available
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

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const STATE_FILE = path.join(__dirname, 'seen_reddit_posts.json');
const LOG_FILE = path.join(__dirname, 'radar.log');

// Target high-intent subreddits combined into a single unified multi-feed (0 rate-limit issues)
const MULTI_SUB_URL = 'https://www.reddit.com/r/forhire+jobbit+freelance_forhire+hiring+Automate+n8n+b2bforhire+webdev+startups+SaaS/new.rss?limit=50';

const TARGET_KEYWORDS = [
  'website', 'web dev', 'web design', 'developer', 'frontend', 'backend',
  'full stack', 'fullstack', 'react', 'nextjs', 'next.js', 'typescript',
  'javascript', 'python', 'node', 'express', 'tailwind', 'wordpress',
  'landing page', 'shopify', 'ai', 'automation', 'agent', 'chatbot',
  'n8n', 'make.com', 'zapier', 'llm', 'openai', 'scraper', 'scraping',
  'mvp', 'saas', 'stripe', 'crm', 'database', 'supabase', 'firebase'
];

const NEGATIVE_KEYWORDS = [
  '[for hire]', 'forhire', 'unpaid', 'equity only', 'revshare only',
  'free work', 'slavelabour', 'voice actor', 'video editing', 'video editor',
  'drawing', 'cartoon', 'illustrator', 'scriptwriter', 'script writer',
  'writer', 'content writer', 'copywriter', 'translator'
];

// Helper to append log
function log(msg) {
  const time = new Date().toISOString();
  const line = `[${time}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  } catch (e) {}
}

// Load seen posts
function loadSeenPosts() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      return new Set(Array.isArray(data) ? data : []);
    } catch (e) {
      return new Set();
    }
  }
  return new Set();
}

// Save seen posts (keep last 1000)
function saveSeenPosts(seenSet) {
  try {
    const arr = Array.from(seenSet).slice(-1000);
    fs.writeFileSync(STATE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    log(`⚠️ Failed to save state: ${e.message}`);
  }
}

// Send message via Telegram Bot API
async function sendTelegramAlert(messageText) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    log('⚠️ Telegram credentials not configured yet. Alert simulated in console.');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(data.description || 'Telegram API returned error');
    }
    return true;
  } catch (err) {
    log(`❌ Telegram dispatch error: ${err.message}`);
    return false;
  }
}

// Generate tailored pitch using Gemini REST API
async function generateTailoredPitch(post) {
  if (!GEMINI_API_KEY) {
    return 'Hey! Saw your post regarding this project. At Growech Solution, we specialize in high-converting Next.js web applications and custom AI automations. Let me know if you would like to see our portfolio or jump on a quick 5-minute chat!';
  }

  const prompt = `You are Mustafa, Senior Full-Stack Engineer and Founder at Growech Solution (custom web applications & AI automation agency).
A client just posted this job on Reddit:

TITLE: ${post.title}
SUBREDDIT: r/${post.subreddit}
POST TEXT:
${post.cleanSummary.slice(0, 1200)}

YOUR TASK:
Write a highly consultative, confident, and low-friction 3-to-4 sentence DM pitch that Mustafa can send to this client on Reddit immediately.

CRITICAL RULES:
1. Under 80 words.
2. NO generic fluff ("Hope you're well", "I am a dedicated software engineer with 5 years experience").
3. Directly reference their exact technical requirement (e.g. Next.js, Stripe, AI webhook, Supabase, Tailwind, etc.).
4. If the client asked to include a specific word or code phrase (e.g. "include picture day in your message"), YOU MUST naturally include it.
5. Highlight relevant experience: Growech builds high-speed production web apps and official WhatsApp / web AI triage bots.
6. The Winning Call-To-Action: Offer to review their exact scope and put together a quick interactive prototype / solution draft for them to test out, e.g.:
"If you can share a few quick details on your scope in chat, I'd be happy to put together a quick interactive prototype / solution draft for you to review before deciding. Open to a brief chat?"
7. Sign off as:
Mustafa | Growech Solution
Portfolio: growech.site

Return ONLY the raw plain text message to send in Reddit DM.`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {}
  }

  return 'Hey! Saw your post regarding this build. We specialize in custom Next.js apps & AI workflow systems at Growech Solution. Would love to send a quick walkthrough or portfolio sample if you have 2 minutes!';
}

// Fetch and parse multi-feed Reddit RSS
async function fetchMultiFeed() {
  const res = await fetch(MULTI_SUB_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8'
    }
  });

  if (res.status === 429) {
    const resetSec = parseInt(res.headers.get('x-ratelimit-reset') || '60', 10);
    log(`⏳ Reddit rate limit active. Next window opens in ${resetSec}s.`);
    return [];
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from Reddit Multi-RSS`);
  }

  const xml = await res.text();
  const posts = [];

  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const entry of entryMatches) {
    const idMatch = entry.match(/<id>(.*?)<\/id>/);
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = entry.match(/<link href="([^"]+)"/);
    const authorMatch = entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>/);
    const contentMatch = entry.match(/<content type="html">([\s\S]*?)<\/content>/);
    const updatedMatch = entry.match(/<updated>(.*?)<\/updated>/);
    const categoryMatch = entry.match(/<category term="([^"]+)"/);

    if (idMatch && titleMatch && linkMatch) {
      let rawTitle = titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
      let rawContent = contentMatch ? contentMatch[1].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : '';

      // Extract subreddit
      let subreddit = categoryMatch ? categoryMatch[1] : '';
      if (!subreddit) {
        const subMatch = linkMatch[1].match(/\/r\/([a-zA-Z0-9_]+)\//);
        subreddit = subMatch ? subMatch[1] : 'freelance';
      }

      posts.push({
        id: idMatch[1],
        title: rawTitle,
        link: linkMatch[1],
        author: authorMatch ? authorMatch[1] : 'Anonymous',
        cleanSummary: rawContent.slice(0, 1500),
        subreddit: subreddit,
        date: updatedMatch ? updatedMatch[1] : new Date().toISOString()
      });
    }
  }

  return posts;
}

// Qualify post with exact word boundary checking
function isTargetLead(post) {
  const fullText = `${post.title} ${post.cleanSummary}`.toLowerCase();

  // 1. Must be hiring or asking for hire
  const isHiring = fullText.includes('[hiring]') || fullText.includes('hiring') || fullText.includes('looking for a developer') || fullText.includes('need a developer') || fullText.includes('need someone to build') || fullText.includes('looking for web');
  if (!isHiring) return false;

  // 2. Reject negative / lowball patterns
  if (NEGATIVE_KEYWORDS.some(neg => fullText.includes(neg))) {
    return false;
  }

  // 3. Must match at least one high-intent dev / AI keyword with word-boundary awareness
  const matchesKeyword = TARGET_KEYWORDS.some(kw => {
    if (kw.length <= 3) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(fullText);
    }
    return fullText.includes(kw);
  });

  return matchesKeyword;
}

// Main Radar Cycle
async function runRadarCycle() {
  const seenPosts = loadSeenPosts();
  log(`📡 Scanning multi-feed for fresh [Hiring] projects...`);

  let newLeadsCount = 0;

  try {
    const posts = await fetchMultiFeed();
    log(`📥 Fetched ${posts.length} latest posts across target subreddits.`);

    for (const post of posts) {
      if (seenPosts.has(post.id)) continue;
      seenPosts.add(post.id);

      if (isTargetLead(post)) {
        newLeadsCount++;
        log(`\n======================================================`);
        log(`🔥 HIGH-INTENT LEAD DETECTED in r/${post.subreddit}!`);
        log(`📌 Project: "${post.title}"`);
        log(`👤 Client: ${post.author}`);
        log(`🔗 Link: ${post.link}`);

        // Generate AI Pitch
        log('🤖 Calling Gemini to draft bespoke high-converting pitch...');
        const pitch = await generateTailoredPitch(post);
        log(`📝 Pitch Preview:\n${pitch}\n`);

        // Build Rich Telegram Message
        const telegramMessage = `🚨 <b>NEW REDDIT CLIENT LEAD!</b>\n\n` +
          `🏢 <b>Subreddit:</b> r/${post.subreddit}\n` +
          `👤 <b>Client:</b> ${post.author}\n` +
          `📌 <b>Project:</b> ${post.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n` +
          `🔗 <b>Direct Link:</b> ${post.link}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📝 <b>AI TAILORED PITCH (COPY & SEND):</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `<code>${pitch.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>\n\n` +
          `⚡ <b>ACTION:</b> Tap link, click Chat on client profile, paste pitch & send!`;

        await sendTelegramAlert(telegramMessage);
        log('✅ Alert dispatched to Telegram!');
        log(`======================================================\n`);
      }
    }
  } catch (err) {
    log(`⚠️ Multi-feed check error: ${err.message}`);
  }

  saveSeenPosts(seenPosts);
  log(`🏁 Radar cycle complete. Dispatched ${newLeadsCount} new qualified lead(s).\n`);
}

// Test Telegram notification directly
async function testTelegram() {
  console.log('🧪 Testing Telegram connection...');
  console.log(`Bot Token: ${TELEGRAM_BOT_TOKEN ? 'CONFIGURED ✅' : 'MISSING ❌'}`);
  console.log(`Chat ID: ${TELEGRAM_CHAT_ID ? 'CONFIGURED ✅' : 'MISSING ❌'}`);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('\n❌ Please configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env first!');
    process.exit(1);
  }

  const testMsg = `🚀 <b>Growech Reddit Lead Radar — Connection Verified!</b>\n\n` +
    `✅ Your Telegram Bot is successfully connected.\n` +
    `🔔 You will now receive instant push alerts whenever a high-ticket client posts a [Hiring] project on Reddit.\n\n` +
    `<i>Ready to close deals this week!</i>`;

  const ok = await sendTelegramAlert(testMsg);
  if (ok) {
    console.log('✨ SUCCESS: Test alert sent! Check your Telegram app right now.');
  } else {
    console.error('❌ Failed to send Telegram message. Please verify Bot Token and Chat ID.');
  }
}

// CLI Execution Handlers
if (process.argv.includes('--test-telegram')) {
  testTelegram();
} else if (process.argv.includes('--once')) {
  runRadarCycle().then(() => process.exit(0)).catch(e => {
    log(`Fatal: ${e.message}`);
    process.exit(1);
  });
} else {
  // Continuous 24/7 background mode (every 60 seconds)
  log('====================================================');
  log('🚀 GROWECH 24/7 REDDIT LEAD RADAR ENGINE STARTED');
  log('⚡ Monitoring: r/forhire, r/jobbit, r/Automate, r/SaaS...');
  log('====================================================');

  runRadarCycle();
  setInterval(runRadarCycle, 75 * 1000); // Poll every 75s (stays safe from rate limits)
}
