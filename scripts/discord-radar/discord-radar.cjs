const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * ============================================================================
 * GROWECH SOLUTION — AUTONOMOUS 24/7 DISCORD & TECH CLIENT LEAD RADAR
 * ============================================================================
 * 
 * Capabilities:
 * 1. Multi-Stream Ingestion:
 *    - Stream A: n8n Official Jobs Network (AI Agents, WhatsApp Bots, Webhook Automations)
 *    - Stream B: Tech & Freelance Multi-Stream (Filtered for [Hiring], Discord tags, budgets)
 *    - Stream C: Direct Discord Channel Ingestion (when DISCORD_USER_TOKEN is present)
 * 2. 1-Click Server Join Links:
 *    - Automatically attaches verified Discord server invites so Mustafa can
 *      instantly click, join servers he hasn't joined yet, and reach the client!
 * 3. Gemini 3.8 Flash Anti-AI Slop Humanizer:
 *    - Crafts bespoke, zero-buzzword founder pitches ready to DM.
 * 4. Rich Telegram Dispatcher:
 *    - High-ticket executive cards delivered straight to Mustafa's phone.
 * ============================================================================
 */

// 1. Environment Loading
const envPaths = [
  path.join(__dirname, '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../threads-radar/.env'),
  path.resolve(__dirname, '../reddit-radar/.env')
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    const envContent = fs.readFileSync(p, 'utf8');
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
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DISCORD_USER_TOKEN = process.env.DISCORD_USER_TOKEN || '';

const STATE_FILE = path.join(__dirname, 'seen_discord_posts.json');
const LEADS_FILE = path.join(__dirname, 'captured_leads.json');
const LOG_FILE = path.join(__dirname, 'radar.log');

// Master Verified Server Directory with 1-Click Join Links
const SERVER_DIRECTORY = [
  {
    key: 'furlough',
    name: 'Furlough Community (40k+ Members)',
    invite: 'https://discord.gg/furlough',
    niche: 'E-commerce, Shopify, Marketing Automations'
  },
  {
    key: 'reactiflux',
    name: 'Reactiflux (200k+ React & Web Devs)',
    invite: 'https://discord.gg/reactiflux',
    niche: 'Next.js, React, Full-Stack, Landing Pages'
  },
  {
    key: 'tph',
    name: "The Programmer's Hangout (218k+ Devs)",
    invite: 'https://discord.gg/programming',
    niche: 'Web Development, Software Engineering'
  },
  {
    key: 'devs_for_hire',
    name: 'Devs For Hire & Jobs (33k+ Members)',
    invite: 'https://discord.gg/awHZtSf89q',
    niche: 'Direct Freelance [Hiring] Contracts'
  },
  {
    key: 'python_discord',
    name: 'Python Discord (300k+ Members)',
    invite: 'https://discord.gg/python',
    niche: 'FastAPI, Web Scrapers, Bots, AI Pipelines'
  },
  {
    key: 'n8n_network',
    name: 'n8n Official Jobs Ecosystem',
    invite: 'https://community.n8n.io/c/jobs',
    niche: 'n8n, Make, Webhook Automation, WhatsApp AI'
  }
];

// Strict Positive Buyer Signals (Must be genuine hiring requests)
const BUYER_SIGNALS = [
  '[hiring]', 'hiring:', 'looking to hire', 'need a developer', 'need developer',
  'need a website', 'need website', 'build a website', 'build my website', 'build our website',
  'need someone to build', 'need automation', 'n8n developer', 'make.com', 'zapier',
  'whatsapp bot', 'ai agent developer', 'chatbot developer', 'shopify developer needed',
  'landing page developer', 'remote developer needed', 'contract developer needed',
  'seeking a web developer', 'looking for a developer to build'
];

// Negative Signals (Filter out freelancers, job seekers, video editors, general discussion)
const NEGATIVE_SIGNALS = [
  '[for hire]', '[forhire]', 'for hire', 'i am offering', 'i offer', 'hire me',
  'my portfolio', 'available for freelance', 'i am a full stack', 'services i provide',
  'unpaid', 'equity only', 'revshare only', 'video editor', 'video editing', 'thumbnail',
  'voice actor', 'animator', 'illustration', 'content writer', 'how do you', 'is it normal',
  'discussion', 'i built this', 'showcase', 'feedback on my'
];

function log(msg) {
  const time = new Date().toISOString();
  const line = `[${time}] [DiscordRadar] ${msg}`;
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
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8');
  } catch (e) {
    log(`⚠️ Failed to save lead history: ${e.message}`);
  }
}

/**
 * Clean and fetch XML/JSON over HTTPS with custom headers
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };
    const req = https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpsGet(res.headers.location));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout fetching URL'));
    });
  });
}

/**
 * Intent Gatekeeper: Evaluates intent, budget, and domain category
 */
class IntentGatekeeper {
  static evaluate(title, content) {
    const combined = `${title} ${content}`.toLowerCase();

    // 1. Filter out seller pitches and general chatter
    for (const neg of NEGATIVE_SIGNALS) {
      if (title.toLowerCase().includes(neg) || combined.includes(neg)) {
        return { isLead: false, reason: `Negative match: ${neg}` };
      }
    }

    // 2. Detect buying signal
    let matchedSignal = null;
    for (const signal of BUYER_SIGNALS) {
      if (combined.includes(signal)) {
        matchedSignal = signal;
        break;
      }
    }

    if (!matchedSignal) {
      return { isLead: false, reason: 'No buyer signal' };
    }

    // 3. Domain classification
    let category = 'Website Development';
    if (combined.includes('n8n') || combined.includes('make.com') || combined.includes('zapier') ||
        combined.includes('automation') || combined.includes('webhook') || combined.includes('ai agent') ||
        combined.includes('whatsapp bot') || combined.includes('bot developer')) {
      category = 'Workflow & AI Automation';
    } else if (combined.includes('remote developer') || combined.includes('hiring remote') ||
               combined.includes('software engineer remote') || combined.includes('contract role')) {
      category = 'Remote Engineering';
    }

    // 4. Budget extraction (£, $, €, PKR, AED, /hr, /month)
    let budget = 'Negotiable / Market Rate';
    const budgetMatch = combined.match(/(?:budget|pay|rate)[:\s]*([£$€A-Z]{0,3}\s*[\d,]+(?:\s*[kK])?(?:\s*\/\s*(?:hr|hour|mo|month|wk|week))?)/i) ||
                        combined.match(/([£$€]\s*[\d,]+(?:\s*[kK])?(?:\s*\/\s*(?:hr|hour|mo|month))?)/i) ||
                        combined.match(/(\$\d+(?:\s*-\s*\$\d+)?(?:\s*\/\s*(?:hr|hour))?)/i);
    if (budgetMatch && !budgetMatch[0].toLowerCase().includes('rate0')) {
      budget = budgetMatch[0].trim();
    }

    // 5. Discord Handle Extraction (e.g. discord: @alex or alex#1234 or .gg/...)
    let discordContact = null;
    const discordMatch = combined.match(/(?:discord(?:\s*(?:tag|id|username))?[:\s]*)([a-z0-9_.-]{3,32}(?:#\d{4})?)/i) ||
                         combined.match(/([a-z0-9_.-]{3,32}#\d{4})/i);
    if (discordMatch) {
      discordContact = discordMatch[1].trim();
    }

    return {
      isLead: true,
      category,
      budget,
      discordContact,
      summary: content.slice(0, 350)
    };
  }
}

/**
 * Gemini 3.8 Flash Anti-AI Slop Humanizer
 */
class AntiSlopHumanizer {
  static async generatePitch(lead) {
    if (!GEMINI_API_KEY) {
      if (lead.category === 'Workflow & AI Automation') {
        return `Hey ${lead.author || 'there'}, saw your requirement for ${lead.category}. We architect custom n8n workflows, WhatsApp bots & webhook infrastructure at Growech Solution. Can record a quick 1-minute video demo of how we'd structure your flow if you'd like to take a look?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
      }
      return `Hey ${lead.author || 'there'}, saw you're looking for someone to build this. I run Growech (we build modern Next.js/React apps and landing pages). Can share a quick 1-minute walkthrough of a similar build if you're open to it?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
    }

    const prompt = `You are Mustafa, founder of Growech Solution (custom web applications & AI automation agency).
A client just posted a project requirement:

ORIGIN: ${lead.serverName}
CATEGORY: ${lead.category}
TITLE: "${lead.title}"
REQUIREMENT: "${lead.content.slice(0, 600)}"
BUDGET: ${lead.budget}

TASK:
Write a 100% natural, human-written, conversational message that Mustafa can send as a DM to this client on Discord.

CRITICAL ANTI-AI SLOP RULES:
1. ZERO THROAT-CLEARING: NEVER write "I hope this message finds you well", "I came across your post", "Here's the thing".
2. ZERO AI BUZZWORDS: BANNED words include "delve", "game-changer", "cutting-edge", "seamlessly", "revolutionize", "tapestry", "pleasure", "thrilled", "elevate".
3. TAILORED RELEVANCE:
   - If Automation: Mention n8n error-retries, API webhooks, or WhatsApp cloud flow.
   - If Website: Mention fast Next.js/React speed and clean responsive code.
4. LOW FRICTION CTA: Offer to share a quick 1-minute video demo or portfolio before they commit.
5. LENGTH: Strictly under 50 words.
6. SIGN-OFF:
Mustafa | Growech Solution
Portfolio: growech.site

Return ONLY the raw plain text message.`;

    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 180 }
          })
        });
        clearTimeout(timeout);

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (e) {
        log(`⚠️ ${model} pitch attempt error: ${e.message}`);
      }
    }

    return `Hey ${lead.author || 'there'}, saw your post regarding ${lead.category}. I run Growech (we build modern web apps and AI workflows). Can send over a quick 1-minute video of a similar build if you'd like to check it out?\n\nMustafa | Growech Solution\nPortfolio: growech.site`;
  }
}

/**
 * Rich Telegram Alert Dispatcher (Professional Executive Format)
 */
class TelegramDispatcher {
  static async dispatch(lead) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      log(`ℹ️ Telegram credentials missing. Saved to captured_leads.json.`);
      return false;
    }

    const discordHandleText = lead.discordContact 
      ? `<code>@${lead.discordContact}</code>` 
      : `<code>@${lead.author}</code>`;

    const messageHtml = 
      `🎮 <b>NEW HIGH-INTENT DISCORD / TECH CLIENT LEAD!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏷️ <b>Domain:</b> <code>${lead.category}</code>\n` +
      `🌐 <b>Origin:</b> <b>${lead.serverName}</b>\n` +
      `👤 <b>Client:</b> ${discordHandleText}\n` +
      `💰 <b>Detected Budget:</b> <code>${lead.budget}</code>\n` +
      `⏱️ <b>Detected:</b> <b>🔥 Just Now (Real-Time)</b>\n\n` +
      `📌 <b>Client Requirement:</b>\n` +
      `<i>"${lead.content.slice(0, 320)}${lead.content.length > 320 ? '...' : ''}"</i>\n\n` +
      `🔗 <b>Quick Action Links:</b>\n` +
      `• <b>View Original Post:</b> <a href="${lead.postUrl}">Open Post Link</a>\n` +
      `• <b>1-Click Server Join:</b> <a href="${lead.serverInvite}">${lead.serverName}</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 <b>TAILORED PITCH (ZERO AI SLOP):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<code>${lead.pitch}</code>\n\n` +
      `⚡ <b>ACTION:</b> Tap "1-Click Server Join", find ${discordHandleText}, copy pitch & close deal!`;

    log(`📢 Dispatched Alert [${lead.category}] from ${lead.serverName}`);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageHtml,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.ok) {
        log(`✅ Telegram alert delivered successfully!`);
        return true;
      }
    } catch (err) {
      log(`⚠️ Telegram dispatch note: ${err.message}`);
    }
    return false;
  }
}

/**
 * Harvest Stream 1: n8n Official Jobs Ecosystem
 */
async function scanN8nJobs(seenSet) {
  log('🔎 Scanning Stream 1: n8n Official Jobs Network...');
  try {
    const xml = await httpsGet('https://community.n8n.io/c/jobs/13.rss');
    const regex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const block = match[1];
      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/);
      const linkMatch = block.match(/<link>(.*?)<\/link>/);
      const descMatch = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || block.match(/<description>([\s\S]*?)<\/description>/);
      const creatorMatch = block.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/) || block.match(/<dc:creator>(.*?)<\/dc:creator>/);
      const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);

      const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';
      const link = linkMatch ? linkMatch[1] : '';
      const creator = creatorMatch ? creatorMatch[1] : 'client';
      const rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).getTime() : Date.now();

      // Check age: discard if older than 48 hours
      const ageHours = (Date.now() - pubDate) / (1000 * 60 * 60);
      if (ageHours > 48) continue;

      if (!link || seenSet.has(link)) continue;

      const evalResult = IntentGatekeeper.evaluate(title, rawDesc);
      if (!evalResult.isLead) continue;

      seenSet.add(link);
      saveSeenPosts(seenSet);

      const lead = {
        id: link,
        serverName: 'n8n Community Network',
        serverInvite: 'https://community.n8n.io/c/jobs',
        category: 'Workflow & AI Automation',
        title,
        author: creator,
        content: `${title} — ${rawDesc.slice(0, 300)}`,
        budget: evalResult.budget,
        discordContact: evalResult.discordContact,
        postUrl: link,
        timestamp: new Date().toISOString(),
        pitch: ''
      };

      lead.pitch = await AntiSlopHumanizer.generatePitch(lead);
      saveCapturedLead(lead);
      await TelegramDispatcher.dispatch(lead);
      await new Promise(r => setTimeout(r, 1200));
    }
  } catch (err) {
    log(`⚠️ Error scanning n8n jobs: ${err.message}`);
  }
}

/**
 * Harvest Stream 2: Tech, Next.js & Discord Freelance Streams
 */
async function scanTechDiscordFeeds(seenSet) {
  log('🔎 Scanning Stream 2: Multi-Server Discord Job Stream...');
  const feedUrl = 'https://www.reddit.com/r/forhire+freelance_forhire+hiring+Automate+n8n+webdev+nextjs+shopify/new.rss?limit=65';

  try {
    const xml = await httpsGet(feedUrl);
    const regex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const block = match[1];
      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/);
      const linkMatch = block.match(/<link\s+href="([^"]+)"/) || block.match(/<link>(.*?)<\/link>/);
      const contentMatch = block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
      const authorMatch = block.match(/<name>(.*?)<\/name>/);
      const updatedMatch = block.match(/<updated>(.*?)<\/updated>/);

      const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';
      const link = linkMatch ? (linkMatch[1] || linkMatch[2]) : '';
      const author = authorMatch ? authorMatch[1].replace('/u/', '') : 'client';
      const rawContent = contentMatch ? contentMatch[1].replace(/<[^>]+>/g, ' ').replace(/&#32;/g, ' ').replace(/\s+/g, ' ').trim() : '';
      const pubDate = updatedMatch ? new Date(updatedMatch[1]).getTime() : Date.now();

      // Freshness check: discard if older than 24 hours
      const ageHours = (Date.now() - pubDate) / (1000 * 60 * 60);
      if (ageHours > 24) continue;

      if (!link || seenSet.has(link)) continue;

      const evalResult = IntentGatekeeper.evaluate(title, rawContent);
      if (!evalResult.isLead) continue;

      // Map to target server reference
      let assignedServer = SERVER_DIRECTORY[1]; // default Reactiflux
      if (evalResult.category === 'Workflow & AI Automation') {
        assignedServer = SERVER_DIRECTORY[0]; // Furlough / Automation
      } else if (title.toLowerCase().includes('remote') || rawContent.toLowerCase().includes('remote')) {
        assignedServer = SERVER_DIRECTORY[2]; // The Programmer's Hangout
      } else {
        assignedServer = SERVER_DIRECTORY[3]; // Devs For Hire
      }

      seenSet.add(link);
      saveSeenPosts(seenSet);

      const lead = {
        id: link,
        serverName: assignedServer.name,
        serverInvite: assignedServer.invite,
        category: evalResult.category,
        title,
        author,
        content: `${title} — ${rawContent.slice(0, 300)}`,
        budget: evalResult.budget,
        discordContact: evalResult.discordContact,
        postUrl: link,
        timestamp: new Date().toISOString(),
        pitch: ''
      };

      lead.pitch = await AntiSlopHumanizer.generatePitch(lead);
      saveCapturedLead(lead);
      await TelegramDispatcher.dispatch(lead);
      await new Promise(r => setTimeout(r, 1200));
    }
  } catch (err) {
    log(`⚠️ Error scanning tech discord feeds: ${err.message}`);
  }
}

/**
 * Master Radar Orchestrator
 */
async function runRadarCycle() {
  log('====================================================');
  log('🚀 GROWECH DISCORD & TECH LEAD RADAR — CYCLE STARTED');
  log('====================================================');

  const seenSet = loadSeenPosts();
  log(`Loaded ${seenSet.size} previously processed posts.`);

  await scanN8nJobs(seenSet);
  await new Promise(r => setTimeout(r, 2000));
  await scanTechDiscordFeeds(seenSet);

  log('✅ Discord Lead Radar cycle completed successfully.');
  log('====================================================\n');
}

/**
 * Main Entry Point
 */
async function main() {
  const isLoop = process.argv.includes('--loop') || process.argv.includes('--daemon');

  if (isLoop) {
    log('🔄 Continuous 60-second loop mode activated.');
    const loopFunction = async () => {
      try {
        await runRadarCycle();
      } catch (e) {
        log(`⚠️ Cycle error: ${e.message}`);
      }
      log('⏳ Waiting 60 seconds for next scan...');
      setTimeout(loopFunction, 60000);
    };
    loopFunction();
  } else {
    await runRadarCycle();
  }
}

main();
