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
 *    - Real-time chronological monitoring of Meta Threads search feeds.
 *    - Uses user's active authenticated session (@mustafa.user27).
 *    - DOM extraction of [data-pressable-container="true"] post articles.
 * 
 * 2. Agent 2 (IntentGatekeeperAgent):
 *    - Evaluates buyer intent, scope, and explicit budgets (£, $, PKR, AED).
 *    - Rejects spam, self-promotions, and idle discussions.
 * 
 * 3. Agent 3 (AntiSlopHumanizerAgent):
 *    - Powered by Google Gemini 3.8 Flash.
 *    - Enforces strict Anti-AI Slop guidelines (Zero buzzwords, zero throat-clearing,
 *      zero robotic fluff). Writes 100% natural, peer-to-peer human pitches.
 * 
 * 4. Agent 4 (DispatcherLedgerAgent):
 *    - Instant rich Telegram alert dispatch.
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

// Target Search Queries on Threads (Chronological Filter)
const SEARCH_QUERIES = [
  'need web developer',
  'need website',
  'hiring developer',
  'looking for web developer',
  'need shopify developer',
  'design my website budget',
  'website developer required',
  'need wordpress developer',
  'landing page developer'
];

// Positive Buyer Signals
const BUYER_SIGNALS = [
  'need someone to', 'looking for a developer', 'need a web developer',
  'need a website', 'hiring a developer', 'budget:', 'budget is',
  'need a designer to', 'who can build', 'anyone build websites',
  'need someone to design', 'hire a programmer', 'freelancer needed',
  'looking for someone to build', 'build my store', 'shopify expert needed'
];

// Negative Seller Signals (Exclude Freelancers Advertising Services)
const SELLER_SIGNALS = [
  'i can build', 'i am offering', 'i offer', 'dm me if you need',
  'my portfolio', 'hire me', 'our agency', 'check out my work',
  'available for freelance', 'i am a full stack', 'we provide web design'
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
    const arr = Array.from(seenSet).slice(-1500);
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
 * ============================================================================
 * AGENT 2: IntentGatekeeperAgent
 * Classifies posts and extracts explicit budgets / technical requirements
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

    // 3. Extract budget if specified (£, $, €, PKR, AED, etc.)
    let extractedBudget = 'Not Specified';
    const budgetMatch = postText.match(/(?:budget|pay|rate)[:\s]*([£$€A-Z]{0,3}\s*[\d,]+(?:\s*[kK])?)/i) ||
                        postText.match(/([£$€]\s*[\d,]+(?:\s*[kK])?)/);
    if (budgetMatch) {
      extractedBudget = budgetMatch[1].trim();
    }

    return {
      isLead: true,
      matchedSignal,
      budget: extractedBudget,
      summary: postText.replace(/\n+/g, ' ').slice(0, 300)
    };
  }
}

/**
 * ============================================================================
 * AGENT 3: AntiSlopHumanizerAgent
 * Powered by Gemini 3.8 Flash + Stop-Slop Guidelines.
 * Generates 100% human, casual, conversational pitches with ZERO AI tells.
 * ============================================================================
 */
class AntiSlopHumanizerAgent {
  static async generatePitch(post) {
    if (!GEMINI_API_KEY) {
      return `Hey ${post.author || 'there'}, saw you're looking for someone to build this. I run Growech (we build modern Next.js/React apps and landing pages). Can share a quick 1-min walkthrough of a similar build if you're open to it?

Mustafa | Growech Solution
Portfolio: growech.site`;
    }

    const prompt = `You are Mustafa, founder of Growech Solution (custom web applications & Next.js agency).
A client just posted this on Threads:

AUTHOR: @${post.author}
POST CONTENT:
"${post.content.slice(0, 800)}"
DETECTED BUDGET: ${post.budget}

TASK:
Write a 100% natural, human-written, conversational message that Mustafa can send as a DM or reply to this client on Threads.

CRITICAL ANTI-AI SLOP RULES (MUST OBEY):
1. ZERO THROAT-CLEARING: NEVER write "I hope this message finds you well", "I came across your post", "Here's the thing", "Let me be honest".
2. ZERO AI BUZZWORDS: BANNED words include "delve", "game-changer", "cutting-edge", "seamlessly", "revolutionize", "tapestry", "pleasure", "thrilled", "elevate", "testament", "dive in".
3. NO FORMULAIC STRUCTURES: No dramatic contrasts ("Not just X, but Y"), no negative listings, no three consecutive sentences of the same length.
4. NO ADVERB CLUTTER: Kill "genuinely", "truly", "really", "literally", "actually", "honestly".
5. NO EXCLAMATION MARK OVERLOAD: Max 1 natural exclamation mark, or none.
6. HUMAN TONE: Direct, peer-to-peer tech founder voice. Acknowledge their exact project and budget naturally.
7. LOW FRICTION CTA: Offer to share a quick 1-minute video demo or relevant live link before they commit.
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

    return `Hey ${post.author || 'there'}, saw you need a site built. I run Growech (we do modern React & fast landing pages). Can send over a quick 1-minute video of a similar project if you want to take a look?

Mustafa | Growech Solution
Portfolio: growech.site`;
  }
}

/**
 * ============================================================================
 * AGENT 4: DispatcherLedgerAgent
 * Dispatches rich alerts to Telegram and maintains persistent state
 * ============================================================================
 */
class DispatcherLedgerAgent {
  static async dispatch(lead) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      log('DispatcherLedgerAgent', `ℹ️ Telegram credentials missing. Saved to captured_leads.json.`);
      return false;
    }

    const messageText = `🧵 <b>NEW THREADS CLIENT LEAD!</b>\n\n` +
      `👤 <b>Client:</b> @${lead.author}\n` +
      `💰 <b>Budget:</b> <code>${lead.budget}</code>\n` +
      `📌 <b>Requirement:</b>\n<i>${lead.content.slice(0, 320)}${lead.content.length > 320 ? '...' : ''}</i>\n\n` +
      `🔗 <b>Direct Threads Link:</b>\n<a href="${lead.postUrl}">${lead.postUrl}</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 <b>HUMAN PITCH (ZERO AI SLOP):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<code>${lead.pitch}</code>\n\n` +
      `⚡ <b>ACTION:</b> Open Threads link, tap Reply or Message, paste pitch & send!`;

    log('DispatcherLedgerAgent', `📢 Dispatched Alert for @${lead.author} (Budget: ${lead.budget})`);

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
 * Browser-level chronological crawler for Threads search
 * ============================================================================
 */
class ThreadsScoutAgent {
  static async scanQuery(page, query, seenSet) {
    const encoded = encodeURIComponent(query);
    const searchUrl = `https://www.threads.com/search?q=${encoded}&filter=recent`;
    log('ThreadsScoutAgent', `🔎 Scanning query: "${query}"...`);

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await new Promise(r => setTimeout(r, 4000));

      // Extract posts from data-pressable-container elements
      const extractedPosts = await page.evaluate(() => {
        const items = [];
        const containers = document.querySelectorAll('div[data-pressable-container="true"]');

        containers.forEach((box, idx) => {
          if (idx > 12) return; // top 12 recent items
          const text = (box.innerText || '').replace(/\n+/g, ' ').trim();
          if (text.length < 20) return;

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
            postUrl: permalink || window.location.href
          });
        });

        return items;
      });

      log('ThreadsScoutAgent', `Found ${extractedPosts.length} recent posts for "${query}"`);

      for (const post of extractedPosts) {
        // Unique post identifier
        const idKey = post.postUrl !== searchUrl ? post.postUrl : (post.author + '_' + post.content.slice(0, 60));
        if (seenSet.has(idKey)) continue;

        // Pass to Agent 2: Gatekeeper
        const gateEvaluation = IntentGatekeeperAgent.evaluate(post.content);
        if (!gateEvaluation.isLead) continue;

        seenSet.add(idKey);
        saveSeenPosts(seenSet);

        log('IntentGatekeeperAgent', `🎯 QUALIFIED LEAD by @${post.author} (Budget: ${gateEvaluation.budget})`);

        const lead = {
          id: idKey,
          platform: 'Threads',
          author: post.author,
          content: post.content,
          budget: gateEvaluation.budget,
          postUrl: post.postUrl,
          timestamp: new Date().toISOString(),
          pitch: ''
        };

        // Pass to Agent 3: Anti-Slop Humanizer
        lead.pitch = await AntiSlopHumanizerAgent.generatePitch(lead);

        // Save & Dispatch via Agent 4
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
async function runThreadsRadar() {
  log('Orchestrator', '====================================================');
  log('Orchestrator', '🚀 GROWECH MULTI-AGENT THREADS RADAR — CYCLE STARTED');
  log('Orchestrator', '====================================================');

  const seenSet = loadSeenPosts();
  log('Orchestrator', `Loaded ${seenSet.size} previously processed posts.`);

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

// Run immediately
runThreadsRadar();
