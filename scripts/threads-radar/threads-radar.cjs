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
 * ============================================================================
 * GROWECH SOLUTION — AUTONOMOUS 24/7 MULTI-AGENT THREADS RADAR
 * ============================================================================
 * 
 * Architecture: 4 Cooperative Autonomous Agents
 * 
 * 1. Agent 1 (ThreadsScoutAgent):
 *    - Real-time search across Website, Automation & Remote Hiring.
 *    - Strict <time datetime> extraction and 24-hour freshness gate.
 *    - Automatically discards any post older than 24 hours (1440 minutes).
 *    - Prioritizes ultra-fresh posts (5 to 15 minutes old).
 * 
 * 2. Agent 2 (IntentGatekeeperAgent):
 *    - Evaluates buyer intent across:
 *      * Website Needs (Next.js, React, Shopify, WordPress, Landing pages)
 *      * Automation Needs (n8n, Make.com, Zapier, WhatsApp bots, AI agents)
 *      * Remote Hiring (Remote developer, engineer roles, freelance contracts)
 *    - Rejects seller spam, self-promotions, and services ads.
 * 
 * 3. Agent 3 (AntiSlopHumanizerAgent):
 *    - Powered by Google Gemini 3.8 Flash.
 *    - Category-aware, 100% human, peer-to-peer pitch with ZERO AI buzzwords.
 * 
 * 4. Agent 4 (DispatcherLedgerAgent):
 *    - Instant rich Telegram alerts with Category & Freshness indicators.
 *    - Hash-based deduplication and persistent Git state ledger.
 * ============================================================================
 */

// 1. Environment Loading
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

const STATE_FILE = path.join(__dirname, 'seen_threads_posts.json');
const LEADS_FILE = path.join(__dirname, 'captured_leads.json');
const LOG_FILE = path.join(__dirname, 'threads_radar.log');

// Target Search Queries across 3 Core Pillars (Chronological Search)
const SEARCH_QUERIES = [
  // 1. Website Needs
  'need web developer',
  'need website',
  'looking for web developer',
  'need shopify developer',
  'need wordpress developer',
  'landing page developer',
  'design my website budget',
  'hire web developer',
  'need frontend developer',
  'build ecommerce store',

  // 2. Automation Needs
  'need automation',
  'n8n developer',
  'make.com automation',
  'zapier automation',
  'whatsapp automation',
  'ai automation developer',
  'need chatbot developer',
  'workflow automation',
  'ai agent developer',

  // 3. Remote Hiring Needs
  'hiring remote developer',
  'remote web developer',
  'hiring software engineer remote',
  'looking for remote developer',
  'remote developer needed',
  'freelance developer remote'
];

// Positive Buyer Signals across all 3 domains
const BUYER_SIGNALS = [
  // Website signals
  'need someone to', 'looking for a developer', 'need a web developer',
  'need a website', 'hiring a developer', 'budget:', 'budget is',
  'need a designer to', 'who can build', 'anyone build websites',
  'need someone to design', 'hire a programmer', 'freelancer needed',
  'looking for someone to build', 'build my store', 'shopify expert needed',
  'need wordpress', 'landing page needed', 'need web designer', 'web dev needed',
  'redesign my website', 'build me a website', 'ecommerce website needed',
  'looking for web designer', 'build my website',

  // Automation signals
  'need automation', 'automate my', 'automation needed', 'n8n', 'make.com',
  'zapier', 'whatsapp bot', 'whatsapp automation', 'ai automation',
  'workflow automation', 'build a bot', 'need a chatbot', 'ai agent',
  'crm integration', 'lead automation', 'auto dm', 'chatbot developer',
  'looking for ai automation', 'automated workflow',

  // Remote hiring signals
  'hiring remote', 'remote developer', 'looking for a remote', 'hire remote',
  'remote engineer', 'remote programmer', 'remote role', 'remote position',
  'looking to hire remote', 'we are hiring remote', 'dev needed remote',
  'remote frontend', 'remote fullstack', 'remote backend', 'remote software developer',
  'looking for remote engineer', 'hire remote developer'
];

// Negative Seller Signals (Exclude Freelancers Advertising Services)
const SELLER_SIGNALS = [
  'i can build', 'i am offering', 'i offer', 'dm me if you need',
  'my portfolio', 'hire me', 'our agency', 'check out my work',
  'available for freelance', 'i am a full stack', 'we provide web design',
  'services i provide', 'dm for inquiries', 'i make websites', 'contact us for services'
];

function log(agentName, msg) {
  const time = new Date().toISOString();
  const line = `[${time}] [${agentName}] ${msg}`;
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
    const arr = Array.from(seenSet).slice(-2000);
    fs.writeFileSync(STATE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    log('DispatcherLedgerAgent', `⚠️ Failed to save state: ${e.message}`);
  }
}

function saveCapturedLead(lead) {
  try {
    let existing = [];
    if (fs.existsSync(LEADS_FILE)) {
      existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
    existing.unshift(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8');
  } catch (e) {
    log('DispatcherLedgerAgent', `⚠️ Failed to save lead history: ${e.message}`);
  }
}

/**
 * Calculate post freshness and filter out stale posts (> 24 hours).
 * Returns { minutesAgo, isFresh, badge, exactIso }
 */
function evaluatePostFreshness(post) {
  const now = Date.now();

  // 1. Check exact datetime attribute from <time> tag
  if (post.timeDatetime) {
    const parsedDate = new Date(post.timeDatetime);
    if (!isNaN(parsedDate.getTime())) {
      const diffMinutes = Math.round((now - parsedDate.getTime()) / (1000 * 60));
      const mins = Math.max(0, diffMinutes);

      // Strict 24-hour gate (1440 minutes)
      const isFresh = mins <= 1440;
      let badge = '';
      if (mins <= 10) {
        badge = `🔥 ULTRA-FRESH (Just ${mins}m ago)`;
      } else if (mins <= 60) {
        badge = `⚡ FRESH (${mins}m ago)`;
      } else if (mins <= 1440) {
        badge = `🕒 TODAY (${Math.round(mins / 60)}h ago)`;
      } else {
        badge = `❌ OLD (${Math.round(mins / 1440)}d ago)`;
      }

      return {
        minutesAgo: mins,
        isFresh,
        badge,
        exactIso: parsedDate.toISOString()
      };
    }
  }

  // 2. Inspect relative time text (e.g., "5m", "15m", "1h", "4h", "1d", "2d", "1w")
  const rawText = (post.timeText || '').trim().toLowerCase();

  // Explicit calendar date (e.g. 10/11/26 or 08/25/26) = definitely older than 1 day!
  if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(rawText) || /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(post.content)) {
    return {
      minutesAgo: 999999,
      isFresh: false,
      badge: `❌ STALE DATE (${rawText})`,
      exactIso: null
    };
  }

  // Check week/month/year indicators
  if (/[wy]|mo/i.test(rawText)) {
    return {
      minutesAgo: 999999,
      isFresh: false,
      badge: `❌ STALE (${rawText})`,
      exactIso: null
    };
  }

  // Days
  const matchDays = rawText.match(/^(\d+)\s*d$/);
  if (matchDays) {
    const days = parseInt(matchDays[1], 10);
    const mins = days * 1440;
    return {
      minutesAgo: mins,
      isFresh: days <= 1, // only accept if 1d or less
      badge: days <= 1 ? `🕒 1d ago` : `❌ ${days}d ago`,
      exactIso: new Date(now - mins * 60 * 1000).toISOString()
    };
  }

  // Hours
  const matchHours = rawText.match(/^(\d+)\s*h$/);
  if (matchHours) {
    const hours = parseInt(matchHours[1], 10);
    const mins = hours * 60;
    return {
      minutesAgo: mins,
      isFresh: hours <= 24,
      badge: `🕒 ${hours}h ago`,
      exactIso: new Date(now - mins * 60 * 1000).toISOString()
    };
  }

  // Minutes
  const matchMins = rawText.match(/^(\d+)\s*m$/);
  if (matchMins) {
    const mins = parseInt(matchMins[1], 10);
    return {
      minutesAgo: mins,
      isFresh: true,
      badge: mins <= 10 ? `🔥 ULTRA-FRESH (Just ${mins}m ago)` : `⚡ FRESH (${mins}m ago)`,
      exactIso: new Date(now - mins * 60 * 1000).toISOString()
    };
  }

  // Default assumption if no time element is found
  return {
    minutesAgo: 0,
    isFresh: true,
    badge: `⚡ REAL-TIME`,
    exactIso: new Date().toISOString()
  };
}

/**
 * ============================================================================
 * AGENT 2: IntentGatekeeperAgent
 * Classifies posts, categorizes into 3 pillars, and extracts explicit budgets
 * ============================================================================
 */
class IntentGatekeeperAgent {
  static evaluate(postText) {
    const lower = postText.toLowerCase();

    // 1. Exclude self-promotional spam
    for (const seller of SELLER_SIGNALS) {
      if (lower.includes(seller)) return { isLead: false, reason: 'Seller self-promotion' };
    }

    // 2. Detect buying intention
    let matchedSignal = null;
    for (const signal of BUYER_SIGNALS) {
      if (lower.includes(signal)) {
        matchedSignal = signal;
        break;
      }
    }

    if (!matchedSignal) {
      return { isLead: false, reason: 'No buyer signal' };
    }

    // 3. Classify Domain Pillar
    let category = 'Website Development';
    if (lower.includes('automation') || lower.includes('n8n') || lower.includes('make.com') ||
        lower.includes('zapier') || lower.includes('chatbot') || lower.includes('ai agent') ||
        lower.includes('workflow') || lower.includes('whatsapp bot') || lower.includes('automate')) {
      category = 'Workflow & AI Automation';
    } else if (lower.includes('remote') || lower.includes('hiring remote') || lower.includes('remote developer') ||
               lower.includes('remote engineer') || lower.includes('remote position') || lower.includes('freelance developer remote')) {
      category = 'Remote Hiring';
    }

    // 4. Extract budget if specified (£, $, €, PKR, AED, etc.)
    let extractedBudget = 'Not Specified';
    const budgetMatch = postText.match(/(?:budget|pay|rate)[:\s]*([£$€A-Z]{0,3}\s*[\d,]+(?:\s*[kK])?)/i) ||
                        postText.match(/([£$€]\s*[\d,]+(?:\s*[kK])?)/) ||
                        postText.match(/(?:pkr|rs\.?|aed|usd)\s*[\d,]+(?:\s*[kK])?/i);
    if (budgetMatch) {
      extractedBudget = budgetMatch[0].trim();
    }

    return {
      isLead: true,
      category,
      matchedSignal,
      budget: extractedBudget,
      summary: postText.replace(/\n+/g, ' ').slice(0, 300)
    };
  }
}

/**
 * ============================================================================
 * AGENT 3: AntiSlopHumanizerAgent
 * Powered by Gemini 3.8 Flash + Category-Aware Guidance.
 * ============================================================================
 */
class AntiSlopHumanizerAgent {
  static async generatePitch(post) {
    if (!GEMINI_API_KEY) {
      if (post.category === 'Workflow & AI Automation') {
        return `Hey ${post.author || 'there'}, saw you need automation built. I run Growech (we build n8n, AI agents & custom webhooks). Can send over a quick 1-min walkthrough of a similar workflow if you're open to it?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
      }
      if (post.category === 'Remote Hiring') {
        return `Hey ${post.author || 'there'}, saw you're hiring for a remote developer. I build production Next.js apps & automation systems at Growech. Would love to share a quick 1-min demo of recent builds if you're taking applicants?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
      }
      return `Hey ${post.author || 'there'}, saw you need a website built. I run Growech (we build modern Next.js/React apps and landing pages). Can share a quick 1-min walkthrough of a similar build if you're open to it?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
    }

    const prompt = `You are Mustafa, founder of Growech Solution (custom web applications, Next.js & AI automation agency).
A client just posted this on Threads:

AUTHOR: @${post.author}
CATEGORY: ${post.category}
POST CONTENT:
"${post.content.slice(0, 800)}"
DETECTED BUDGET: ${post.budget}

TASK:
Write a 100% natural, human-written, conversational message that Mustafa can send as a DM or reply to this client on Threads.

CRITICAL ANTI-AI SLOP RULES (MUST OBEY):
1. ZERO THROAT-CLEARING: NEVER write "I hope this message finds you well", "I came across your post", "Here's the thing", "Let me be honest".
2. ZERO AI BUZZWORDS: BANNED words include "delve", "game-changer", "cutting-edge", "seamlessly", "revolutionize", "tapestry", "pleasure", "thrilled", "elevate", "testament", "dive in".
3. NO FORMULAIC STRUCTURES: No dramatic contrasts ("Not just X, but Y"), no negative listings.
4. NO ADVERB CLUTTER: Kill "genuinely", "truly", "really", "literally", "actually", "honestly".
5. NO EXCLAMATION OVERLOAD: Max 1 natural exclamation mark, or none.
6. TAILORED RELEVANCE:
   - If Website: Mention fast Next.js/React build speed.
   - If Automation: Mention n8n/AI agents/custom API workflows.
   - If Remote Hiring: Mention strong full-stack experience and immediate availability.
7. LOW FRICTION CTA: Offer to share a quick 1-minute video demo or portfolio link before they decide.
8. LENGTH: Strictly under 55 words.
9. SIGN-OFF:
Mustafa | Growech Solution
Portfolio: growech.site

Return ONLY the raw plain text message.`;

    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 200
            }
          })
        });

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text.trim()
            .replace(/^["']|["']$/g, '');
          log('AntiSlopHumanizerAgent', `Generated 100% human pitch via ${model}`);
          return rawText;
        }
      } catch (err) {
        log('AntiSlopHumanizerAgent', `⚠️ ${model} pitch attempt error: ${err.message}`);
      }
    }

    return `Hey ${post.author || 'there'}, saw your post regarding ${post.category}. I run Growech (we build modern web apps and AI workflows). Can send over a quick 1-minute video of a similar build if you'd like to check it out?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
  }
}

/**
 * ============================================================================
 * AGENT 4: DispatcherLedgerAgent
 * Dispatches rich alerts to Telegram with Category & Freshness badges
 * ============================================================================
 */
class DispatcherLedgerAgent {
  static async dispatch(lead) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      log('DispatcherLedgerAgent', `ℹ️ Telegram credentials missing. Saved locally to captured_leads.json.`);
      return false;
    }

    const messageText = `🧵 <b>NEW THREADS CLIENT LEAD!</b>\n\n` +
      `🏷️ <b>Category:</b> <code>${lead.category}</code>\n` +
      `⏱️ <b>Freshness:</b> <b>${lead.freshnessBadge}</b>\n` +
      `👤 <b>Client:</b> @${lead.author}\n` +
      `💰 <b>Budget:</b> <code>${lead.budget}</code>\n` +
      `📌 <b>Requirement:</b>\n<i>${lead.content.slice(0, 300)}${lead.content.length > 300 ? '...' : ''}</i>\n\n` +
      `🔗 <b>Direct Threads Link:</b>\n<a href="${lead.postUrl}">${lead.postUrl}</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 <b>HUMAN PITCH (ZERO AI SLOP):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<code>${lead.pitch}</code>\n\n` +
      `⚡ <b>ACTION:</b> Open Threads link, tap Reply or Message, paste pitch & send!`;

    log('DispatcherLedgerAgent', `📢 Dispatched [${lead.category}] [${lead.freshnessBadge}] for @${lead.author}`);

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
        log('DispatcherLedgerAgent', `✅ Telegram alert delivered successfully!`);
        return true;
      }
    } catch (err) {
      log('DispatcherLedgerAgent', `ℹ️ Direct Telegram connection note: ${err.message}. Archived locally.`);
    }

    return false;
  }
}

/**
 * ============================================================================
 * AGENT 1: ThreadsScoutAgent
 * Real-time crawler with strict 24-hour freshness gating
 * ============================================================================
 */
class ThreadsScoutAgent {
  static async scanQuery(page, query, seenSet) {
    const encoded = encodeURIComponent(query);
    const searchUrl = `https://www.threads.net/search/?q=${encoded}`;
    log('ThreadsScoutAgent', `🔎 Scanning query: "${query}"...`);

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await new Promise(r => setTimeout(r, 4000));

      // Extract posts from data-pressable-container elements with time elements
      const extractedPosts = await page.evaluate(() => {
        const items = [];
        const containers = document.querySelectorAll('div[data-pressable-container="true"]');

        containers.forEach((box, idx) => {
          if (idx > 15) return; // top recent items
          const text = (box.innerText || '').replace(/\n+/g, ' ').trim();
          if (text.length < 15) return;

          // Extract <time> element attributes
          const timeEl = box.querySelector('time');
          const timeDatetime = timeEl ? timeEl.getAttribute('datetime') : null;
          const timeText = timeEl ? (timeEl.innerText || '').trim() : '';

          // Extract permalink
          let permalink = '';
          const postLink = box.querySelector('a[href*="/post/"]');
          if (postLink) {
            permalink = postLink.href;
          }

          // Extract author handle
          let author = '';
          const authorLink = box.querySelector('a[href^="/@"]');
          if (authorLink) {
            author = authorLink.getAttribute('href').replace(/^\/@/, '').split('/')[0];
          }

          items.push({
            content: text,
            author: author || 'threads_user',
            postUrl: permalink || window.location.href,
            timeDatetime,
            timeText
          });
        });

        return items;
      });

      log('ThreadsScoutAgent', `Found ${extractedPosts.length} posts for "${query}". Checking freshness...`);

      for (const post of extractedPosts) {
        // 1. Strict Freshness Filter (< 24 Hours / 1440 Minutes)
        const freshness = evaluatePostFreshness(post);
        if (!freshness.isFresh) {
          log('ThreadsScoutAgent', `⏩ Discarded stale post by @${post.author} (${freshness.badge})`);
          continue;
        }

        // Unique post identifier
        const idKey = post.postUrl !== searchUrl ? post.postUrl : (post.author + '_' + post.content.slice(0, 60));
        if (seenSet.has(idKey)) continue;

        // 2. Pass to Agent 2: Gatekeeper & Classifier
        const gateEvaluation = IntentGatekeeperAgent.evaluate(post.content);
        if (!gateEvaluation.isLead) continue;

        seenSet.add(idKey);
        saveSeenPosts(seenSet);

        log('IntentGatekeeperAgent', `🎯 QUALIFIED [${gateEvaluation.category}] [${freshness.badge}] by @${post.author} (Budget: ${gateEvaluation.budget})`);

        const lead = {
          id: idKey,
          platform: 'Threads',
          category: gateEvaluation.category,
          author: post.author,
          content: post.content,
          budget: gateEvaluation.budget,
          postUrl: post.postUrl,
          freshnessBadge: freshness.badge,
          minutesAgo: freshness.minutesAgo,
          timestamp: freshness.exactIso || new Date().toISOString(),
          pitch: ''
        };

        // 3. Pass to Agent 3: Anti-Slop Humanizer
        lead.pitch = await AntiSlopHumanizerAgent.generatePitch(lead);

        // 4. Save & Dispatch via Agent 4
        saveCapturedLead(lead);
        await DispatcherLedgerAgent.dispatch(lead);
      }
    } catch (err) {
      log('ThreadsScoutAgent', `⚠️ Error on query "${query}": ${err.message}`);
    }
  }
}

/**
 * ============================================================================
 * MASTER ORCHESTRATOR
 * Coordinates all 4 agents in the scanning cycle
 * ============================================================================
 */
async function runCycle() {
  log('Orchestrator', '====================================================');
  log('Orchestrator', '🚀 GROWECH MULTI-AGENT THREADS RADAR — CYCLE STARTED');
  log('Orchestrator', '⚙️ Mode: Real-Time Gated (< 24 Hours Only)');
  log('Orchestrator', '====================================================');

  const seenSet = loadSeenPosts();
  log('Orchestrator', `Loaded ${seenSet.size} previously processed posts.`);

  const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);

  // Dynamic Chrome detection on Windows
  const possibleChromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  const chromePathWin = possibleChromePaths.find(p => fs.existsSync(p));
  const userDataDirWin = path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\User Data');

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

  if (!isCI && chromePathWin) {
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
    log('Orchestrator', `⚠️ Profile launch fallback (${err.message}). Launching clean instance...`);
    browser = await puppeteer.launch(launchOptions);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  try {
    for (const query of SEARCH_QUERIES) {
      await ThreadsScoutAgent.scanQuery(page, query, seenSet);
      await new Promise(r => setTimeout(r, 2000));
    }
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }

  log('Orchestrator', '✅ Multi-Agent Threads radar cycle complete.');
  log('Orchestrator', '====================================================\n');
}

/**
 * Main Entry Point:
 * Supports single-shot (default / CI) or continuous 1-minute loop (--loop / --daemon)
 */
async function main() {
  const isLoop = process.argv.includes('--loop') || process.argv.includes('--daemon');

  if (isLoop) {
    log('Orchestrator', '🔄 Continuous 1-minute loop mode activated.');
    const runAndSchedule = async () => {
      try {
        await runCycle();
      } catch (e) {
        log('Orchestrator', `⚠️ Cycle error: ${e.message}`);
      }
      log('Orchestrator', '⏳ Sleeping 60 seconds until next cycle...');
      setTimeout(runAndSchedule, 60000);
    };
    runAndSchedule();
  } else {
    await runCycle();
  }
}

main();
