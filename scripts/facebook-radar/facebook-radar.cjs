const fs = require('fs');
const path = require('path');

// Dynamically require puppeteer (fall back to puppeteer-core if needed)
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (e) {
  puppeteer = require('puppeteer-core');
}

/**
 * GROWECH SOLUTION — 24/7 FACEBOOK CLIENT LEAD RADAR
 * Automatically scans top high-intent Pakistani freelance & e-commerce Facebook groups,
 * detects client website/development requirements, generates bespoke AI pitches with Gemini,
 * and delivers real-time Telegram alerts!
 *
 * Runs seamlessly both on Windows locally and in 24/7 GitHub Actions (Ubuntu CI).
 */

// 1. Load Environment Variables
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

const STATE_FILE = path.join(__dirname, 'seen_facebook_posts.json');
const LEADS_FILE = path.join(__dirname, 'captured_leads.json');
const LOG_FILE = path.join(__dirname, 'facebook_radar.log');

// Target High-Yield Facebook Groups
const TARGET_GROUPS = [
  {
    name: 'Shopify Community in Pakistan by FulfillKaro',
    url: 'https://www.facebook.com/groups/1270326783833978/?sorting_setting=CHRONOLOGICAL',
    category: 'E-commerce & Shopify'
  },
  {
    name: 'Pakistani Web Developers and Freelancers',
    url: 'https://www.facebook.com/groups/1099698603777663/?sorting_setting=CHRONOLOGICAL',
    category: 'Tech & Full-Stack'
  },
  {
    name: 'Top Freelancer Of Pakistan',
    url: 'https://www.facebook.com/groups/topfreelancerofpakistan/?sorting_setting=CHRONOLOGICAL',
    category: 'General Freelance & Subcontracting'
  },
  {
    name: 'Startup Pakistan',
    url: 'https://www.facebook.com/groups/2447093245580572/?sorting_setting=CHRONOLOGICAL',
    category: 'Startups & MVPs'
  },
  {
    name: 'I Need A Website Designer / Web Developer',
    url: 'https://www.facebook.com/groups/needwebsitedesignerordeveloper/?sorting_setting=CHRONOLOGICAL',
    category: 'Direct Hiring'
  }
];

// Keywords indicating a BUYER looking for help
const BUYER_KEYWORDS = [
  'need website', 'need a website', 'website developer', 'web developer required',
  'need web developer', 'need developer', 'looking for a developer', 'looking for developer',
  'shopify developer', 'shopify expert', 'woocommerce developer', 'wordpress developer',
  'developer needed', 'hire developer', 'hiring developer', 'need frontend', 'need backend',
  'need fullstack', 'need full stack', 'landing page developer', 'payment gateway fix',
  'website banwani', 'developer chahiye', 'website designer required', 'build store',
  'fix bug in website', 'next.js developer', 'react developer', 'web app developer'
];

// Negative keywords indicating someone SELLING their own services (Spam)
const SELLER_SPAM_KEYWORDS = [
  'i can build', 'i am offering', 'i offer', 'hire me', 'my portfolio',
  'we are offering', 'our services', 'best agency', 'dm me for services',
  'available for projects', 'looking for clients', 'i am a web developer',
  'contact me if you need', 'we build websites'
];

function log(msg) {
  const time = new Date().toISOString();
  const line = `[${time}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  } catch (e) {}
}

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

function saveSeenPosts(seenSet) {
  try {
    const arr = Array.from(seenSet).slice(-1000);
    fs.writeFileSync(STATE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    log(`⚠️ Failed to save state: ${e.message}`);
  }
}

function saveCapturedLead(lead) {
  try {
    let existing = [];
    if (fs.existsSync(LEADS_FILE)) {
      existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
    existing.unshift(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing.slice(0, 300), null, 2), 'utf8');
  } catch (e) {
    log(`⚠️ Failed to save lead history: ${e.message}`);
  }
}

// Generate tailored pitch using Gemini REST API
async function generateTailoredPitch(post) {
  if (!GEMINI_API_KEY) {
    return `Assalam-o-Alaikum! Saw your post regarding ${post.groupName}. At Growech Solution, we specialize in high-converting modern web applications (Next.js/React/Tailwind) and turnkey e-commerce setups. Can I share a quick 1-minute live demo showing how we can resolve this for you?

Mustafa | Growech Solution
Portfolio: growech.site`;
  }

  const prompt = `You are Mustafa, Senior Full-Stack Engineer and Founder at Growech Solution (custom web applications & AI automation agency).
A Pakistani/international client just posted this hiring requirement in Facebook Group "${post.groupName}":

POST CONTENT:
${post.content.slice(0, 1000)}

YOUR TASK:
Write a highly consultative, confident, and low-friction 2-to-3 sentence message in polite professional English (or mixed natural Roman Urdu if the post is in Urdu) that Mustafa can DM or comment to this client immediately.

RULES:
1. Under 60 words.
2. Directly reference their exact technical requirement (e.g. Shopify theme fix, payment gateway error, Next.js MVP, custom landing page).
3. Do NOT use generic bot spam like "Hello sir check inbox" or "I am an experienced developer with 5 years experience".
4. Give immediate value: Offer to share a quick 1-minute interactive demo or live sample before they commit.
5. Sign off as:
Mustafa | Growech Solution
Portfolio: growech.site

Return ONLY the raw message text.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 250, temperature: 0.3 }
      })
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
  } catch (err) {
    log(`⚠️ Gemini pitch generation failed, falling back to default: ${err.message}`);
  }

  return `Assalam-o-Alaikum! Saw your requirement in ${post.groupName}. At Growech Solution, we specialize in production web apps and turnkey store fixes. Would love to share a quick 1-minute live demo or look at your site details. Open to a brief chat?

Mustafa | Growech Solution
Portfolio: growech.site`;
}

// Send alert to Telegram
async function sendTelegramAlert(lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    log(`ℹ️ Telegram credentials missing. Lead saved to captured_leads.json.`);
    return false;
  }

  const messageText = `🎯 <b>NEW FACEBOOK CLIENT LEAD!</b>\n\n` +
    `🏢 <b>Group:</b> ${lead.groupName}\n` +
    `👤 <b>Author:</b> ${lead.author || 'Group Member'}\n` +
    `📌 <b>Requirement:</b>\n<i>${lead.content.slice(0, 350)}${lead.content.length > 350 ? '...' : ''}</i>\n\n` +
    `🔗 <b>Direct Post Link:</b>\n<a href="${lead.postUrl}">${lead.postUrl}</a>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📝 <b>AI TAILORED PITCH (1-CLICK COPY):</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `<code>${lead.pitch}</code>\n\n` +
    `⚡ <b>ACTION:</b> Click the post link above and send this pitch directly in comment or DM!`;

  log(`📢 Dispatched Lead Alert: "${lead.content.slice(0, 60)}..."`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.ok) {
      log(`✅ Telegram alert delivered directly!`);
      return true;
    } else {
      log(`⚠️ Telegram API returned error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    log(`ℹ️ Telegram delivery note: ${err.message}. Lead safely archived in captured_leads.json.`);
  }

  return false;
}

// Check if post text matches buyer intent
function isBuyerLead(text) {
  const lower = text.toLowerCase();

  for (const spam of SELLER_SPAM_KEYWORDS) {
    if (lower.includes(spam)) return false;
  }

  for (const kw of BUYER_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }

  return false;
}

// Scan Facebook Group with Puppeteer
async function scanGroup(browser, group, seenSet) {
  log(`🔍 Scanning group: ${group.name}...`);
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    await page.goto(group.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Wait for content render
    await new Promise(r => setTimeout(r, 5000));

    // Extract posts from feed
    const rawPosts = await page.evaluate(() => {
      const results = [];
      const articles = document.querySelectorAll('div[role="feed"] > div, div[role="article"]');
      
      articles.forEach((art, index) => {
        if (index > 15) return;
        const text = art.innerText || '';
        if (text.length < 25) return;

        let postLink = '';
        const links = art.querySelectorAll('a[href*="/posts/"], a[href*="/permalink/"], a[href*="multi_permalinks="]');
        if (links.length > 0) {
          postLink = links[0].href;
        }

        const strongs = art.querySelectorAll('strong, h2, h3, a[role="link"]');
        let author = '';
        if (strongs.length > 0) {
          author = strongs[0].innerText || '';
        }

        results.push({
          text: text.replace(/\n+/g, ' ').trim(),
          postLink: postLink || window.location.href,
          author: author.trim()
        });
      });

      return results;
    });

    log(`Found ${rawPosts.length} recent posts in ${group.name}`);

    for (const post of rawPosts) {
      if (!isBuyerLead(post.text)) continue;

      const idKey = post.postLink !== group.url ? post.postLink : post.text.slice(0, 100);
      if (seenSet.has(idKey)) continue;

      seenSet.add(idKey);
      saveSeenPosts(seenSet);

      log(`🔥 MATCHED BUYER LEAD in ${group.name}: "${post.text.slice(0, 80)}..."`);

      const lead = {
        id: idKey,
        groupName: group.name,
        category: group.category,
        author: post.author,
        content: post.text,
        postUrl: post.postLink,
        timestamp: new Date().toISOString(),
        pitch: ''
      };

      lead.pitch = await generateTailoredPitch(lead);
      saveCapturedLead(lead);
      await sendTelegramAlert(lead);
    }
  } catch (err) {
    log(`⚠️ Error scanning ${group.name}: ${err.message}`);
  } finally {
    await page.close().catch(() => {});
  }
}

// Master execution runner
async function runRadar() {
  log('====================================================');
  log('🚀 GROWECH FACEBOOK LEAD RADAR — SCAN STARTED');
  log('====================================================');

  const seenSet = loadSeenPosts();
  log(`Loaded ${seenSet.size} previously seen posts.`);

  const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
  const chromePathWin = 'C:\\Users\\SDC TECH\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDirWin = 'C:\\Users\\SDC TECH\\AppData\\Local\\Google\\Chrome\\User Data';

  let launchOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-notifications',
      '--disable-blink-features=AutomationControlled'
    ]
  };

  if (!isCI && fs.existsSync(chromePathWin)) {
    launchOptions.executablePath = chromePathWin;
  }

  let browser;
  try {
    if (!isCI && fs.existsSync(userDataDirWin)) {
      browser = await puppeteer.launch({
        ...launchOptions,
        args: [
          ...launchOptions.args,
          `--user-data-dir=${userDataDirWin}`,
          '--profile-directory=Default'
        ]
      });
    } else {
      browser = await puppeteer.launch(launchOptions);
    }
  } catch (err) {
    log(`⚠️ Profile launch error (${err.message}). Launching clean instance...`);
    browser = await puppeteer.launch(launchOptions);
  }

  try {
    for (const group of TARGET_GROUPS) {
      await scanGroup(browser, group, seenSet);
      await new Promise(r => setTimeout(r, 2000));
    }
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  log('✅ Scan round complete.');
  log('====================================================\n');
}

// Run immediately
runRadar();
