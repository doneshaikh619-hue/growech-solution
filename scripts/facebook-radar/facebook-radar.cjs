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
 * GROWECH SOLUTION — 24/7 AUTONOMOUS FACEBOOK LEAD & MULTIMODAL OCR RADAR
 * Automatically monitors top Pakistani freelance, e-commerce & startup groups.
 * Features:
 * 1. Deep Text Scraping for immediate buyer keywords.
 * 2. MULTIMODAL VISION OCR: Downloads & transcribes flyers, job posters, error screenshots,
 *    and Canva graphics using Google Gemini 3.8 Flash Vision!
 * 3. Extracts WhatsApp numbers & phones directly from images.
 * 4. Generates bespoke AI consultative pitches.
 * 5. Instant Telegram alert dispatch + Git ledger persistence.
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
  },
  {
    name: 'Pakistan Entrepreneur & Small Businesses Support',
    url: 'https://www.facebook.com/groups/PESBSupport/?sorting_setting=CHRONOLOGICAL',
    category: 'Local SME & Businesses'
  },
  {
    name: 'i need a website',
    url: 'https://www.facebook.com/groups/748333769171864/?sorting_setting=CHRONOLOGICAL',
    category: 'Website Requests'
  }
];

// Positive Buyer Keywords
const BUYER_KEYWORDS = [
  'need website', 'need a website', 'website developer', 'web developer required',
  'need web developer', 'need developer', 'looking for a developer', 'looking for developer',
  'shopify developer', 'shopify expert', 'woocommerce developer', 'wordpress developer',
  'developer needed', 'hire developer', 'hiring developer', 'need frontend', 'need backend',
  'need fullstack', 'need full stack', 'landing page developer', 'payment gateway fix',
  'website banwani', 'developer chahiye', 'website designer required', 'build store',
  'fix bug in website', 'next.js developer', 'react developer', 'web app developer',
  'hiring web developer', 'need programmer', 'urgent website'
];

// Negative Seller Spam Keywords
const SELLER_SPAM_KEYWORDS = [
  'i can build', 'i am offering', 'i offer', 'hire me', 'my portfolio',
  'we are offering', 'our services', 'best agency', 'dm me for services',
  'available for projects', 'looking for clients', 'i am a web developer',
  'contact me if you need', 'we build websites'
];

// Gemini Vision & Reasoning Models
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
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
    const arr = Array.from(seenSet).slice(-1500);
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

// 2. Multimodal OCR & Vision Analysis with Gemini
async function analyzeImageWithGeminiVision(base64Image, mimeType = 'image/jpeg', caption = '', groupName = '') {
  if (!GEMINI_API_KEY || !base64Image) return null;

  const prompt = `You are Mustafa's Autonomous Multimodal OCR & Lead Detection Agent for Growech Solution (custom web applications & AI automation agency).
You are analyzing an image flyer, Canva poster, error screenshot, or job announcement uploaded to the Facebook Group "${groupName}".

POST CAPTION CONTEXT (if any):
"${caption.slice(0, 500)}"

MISSION:
1. TRANSCRIBE ALL VISIBLE TEXT accurately (English, Urdu, contact numbers, job titles, bullet points, budgets, deadlines).
2. DETERMINE IF THIS IS A REAL BUYER/CLIENT NEED (e.g. someone looking to hire a developer, needing a website, needing a Shopify/WordPress fix, reporting a software error, wanting an MVP or automation).
3. EXCLUDE FREELANCER SELF-PROMOTION (e.g. freelancers advertising their own services, portfolio showcases).

RETURN STRICTLY RAW VALID JSON (NO BACKTICKS, NO PROSE):
{
  "is_buyer_lead": true | false,
  "confidence": 0.0 to 1.0,
  "transcribed_text": "Complete transcribed text from the image",
  "client_requirement": "Concise summary of what the client needs",
  "extracted_contact": "Phone/WhatsApp or email if written on the flyer, else null",
  "suggested_pitch": "A consultative, professional 2-to-3 sentence DM pitch in under 60 words referencing the exact details on the flyer that Mustafa can send immediately"
}`;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType, data: base64Image } },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const rawJson = data.candidates[0].content.parts[0].text.trim()
          .replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const parsed = JSON.parse(rawJson);
        log(`👁️ Gemini Vision (${model}) OCR Completed. is_buyer_lead: ${parsed.is_buyer_lead} (confidence: ${parsed.confidence})`);
        return parsed;
      }
    } catch (err) {
      log(`⚠️ Gemini Vision (${model}) attempt failed: ${err.message}`);
    }
  }

  return null;
}

// 3. Generate Tailored Pitch for Text-Only Posts
async function generateTailoredPitch(post) {
  if (!GEMINI_API_KEY) {
    return `Assalam-o-Alaikum! Saw your post regarding ${post.groupName}. At Growech Solution, we specialize in high-converting modern web applications (Next.js/React/Tailwind) and turnkey e-commerce setups. Can I share a quick 1-minute live demo showing how we can resolve this for you?

Mustafa | Growech Solution
Portfolio: growech.site`;
  }

  const prompt = `You are Mustafa, Senior Full-Stack Engineer and Founder at Growech Solution (custom web applications & AI automation agency).
A client just posted this hiring requirement in Facebook Group "${post.groupName}":

POST CONTENT:
${post.content.slice(0, 1000)}

YOUR TASK:
Write a consultative, confident, and low-friction 2-to-3 sentence message in polite professional English (or mixed natural Roman Urdu if the post is in Urdu) that Mustafa can DM or comment to this client immediately.

RULES:
1. Under 60 words.
2. Directly reference their exact technical requirement (e.g. Shopify theme fix, payment gateway error, Next.js MVP, custom landing page).
3. Do NOT use generic bot spam like "Hello sir check inbox".
4. Give immediate value: Offer to share a quick 1-minute interactive demo or live sample before they commit.
5. Sign off as:
Mustafa | Growech Solution
Portfolio: growech.site

Return ONLY the raw message text.`;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
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
    } catch (err) {}
  }

  return `Assalam-o-Alaikum! Saw your requirement in ${post.groupName}. At Growech Solution, we specialize in production web apps and turnkey store fixes. Would love to share a quick 1-minute live demo or look at your site details. Open to a brief chat?

Mustafa | Growech Solution
Portfolio: growech.site`;
}

// 4. Send Alert to Telegram (Formatted with OCR & Contact Details)
async function sendTelegramAlert(lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    log(`ℹ️ Telegram credentials missing. Lead saved to captured_leads.json.`);
    return false;
  }

  let leadTypeBadge = lead.isImageLead ? '🖼️ <b>NEW FACEBOOK LEAD (FLYER OCR TRANSCRIBED)</b>' : '🎯 <b>NEW FACEBOOK CLIENT LEAD</b>';
  
  let contactSection = '';
  if (lead.extractedContact) {
    contactSection = `📞 <b>Direct Contact (From Flyer):</b> <code>${lead.extractedContact}</code>\n`;
  }

  let ocrSection = '';
  if (lead.isImageLead && lead.transcribedText) {
    ocrSection = `📋 <b>Transcribed Flyer Text:</b>\n<i>${lead.transcribedText.slice(0, 280)}${lead.transcribedText.length > 280 ? '...' : ''}</i>\n\n`;
  }

  const messageText = `${leadTypeBadge}\n\n` +
    `🏢 <b>Group:</b> ${lead.groupName}\n` +
    `👤 <b>Author:</b> ${lead.author || 'Group Member'}\n` +
    contactSection +
    `📌 <b>Requirement:</b>\n<b>${lead.requirement || lead.content.slice(0, 200)}</b>\n\n` +
    ocrSection +
    `🔗 <b>Direct Post Link:</b>\n<a href="${lead.postUrl}">${lead.postUrl}</a>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📝 <b>AI TAILORED PITCH (1-CLICK COPY):</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `<code>${lead.pitch}</code>\n\n` +
    `⚡ <b>ACTION:</b> Click the post link above and send this pitch directly in comment or DM!`;

  log(`📢 Dispatched Alert: "${(lead.requirement || lead.content).slice(0, 60)}..."`);

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

// Check if raw text matches buyer intent
function isBuyerTextLead(text) {
  const lower = text.toLowerCase();

  for (const spam of SELLER_SPAM_KEYWORDS) {
    if (lower.includes(spam)) return false;
  }

  for (const kw of BUYER_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }

  return false;
}

// 5. Scan Facebook Group with Full DOM and Media Inspection
async function scanGroup(browser, group, seenSet) {
  log(`🔍 Scanning group: ${group.name}...`);
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    await page.goto(group.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Polite pause for dynamic posts to mount
    await new Promise(r => setTimeout(r, 4500));

    // Extract all posts with both text and image assets
    const rawPosts = await page.evaluate(() => {
      const results = [];
      const articles = document.querySelectorAll('div[role="feed"] > div, div[role="article"]');
      
      articles.forEach((art, index) => {
        if (index > 15) return;
        const text = art.innerText || '';
        
        // Find direct link
        let postLink = '';
        const links = art.querySelectorAll('a[href*="/posts/"], a[href*="/permalink/"], a[href*="multi_permalinks="]');
        if (links.length > 0) {
          postLink = links[0].href;
        }

        // Find author
        const strongs = art.querySelectorAll('strong, h2, h3, a[role="link"]');
        let author = '';
        if (strongs.length > 0) {
          author = strongs[0].innerText || '';
        }

        // Find flyer / attached image
        let imgSrc = '';
        const imgs = art.querySelectorAll('img');
        for (const img of imgs) {
          // Filter out tiny icons, emojis, badges (must be larger than 140px or contain scontent)
          const isLarge = (img.naturalWidth > 140 || img.clientWidth > 140 || img.height > 140);
          const isPhotoLink = !!img.closest('a[href*="/photo/"], a[href*="photo.php"]');
          if ((isLarge || isPhotoLink) && img.src && !img.src.includes('rsrc.php')) {
            imgSrc = img.src;
            break;
          }
        }

        if (text.length > 20 || imgSrc) {
          results.push({
            text: text.replace(/\n+/g, ' ').trim(),
            postLink: postLink || window.location.href,
            author: author.trim(),
            imgSrc: imgSrc
          });
        }
      });

      return results;
    });

    log(`Found ${rawPosts.length} posts in ${group.name} (with flyers & text)`);

    for (const post of rawPosts) {
      const idKey = post.postLink !== group.url ? post.postLink : (post.text.slice(0, 80) + (post.imgSrc ? '_img' : ''));
      if (seenSet.has(idKey)) continue;

      let matchedLead = null;

      // STREAM A: If post has an attached image flyer, run Multimodal Gemini OCR
      if (post.imgSrc) {
        log(`🖼️ Attached flyer found in post by "${post.author}". Downloading for Gemini OCR...`);
        try {
          const base64Data = await page.evaluate(async (url) => {
            try {
              const r = await fetch(url);
              const blob = await r.blob();
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
              });
            } catch (e) {
              return null;
            }
          }, post.imgSrc);

          if (base64Data) {
            const visionResult = await analyzeImageWithGeminiVision(base64Data, 'image/jpeg', post.text, group.name);
            if (visionResult && visionResult.is_buyer_lead) {
              matchedLead = {
                id: idKey,
                isImageLead: true,
                groupName: group.name,
                category: group.category,
                author: post.author,
                content: post.text,
                transcribedText: visionResult.transcribed_text,
                requirement: visionResult.client_requirement,
                extractedContact: visionResult.extracted_contact,
                postUrl: post.postLink,
                timestamp: new Date().toISOString(),
                pitch: visionResult.suggested_pitch
              };
            }
          }
        } catch (imgErr) {
          log(`⚠️ Image OCR error: ${imgErr.message}`);
        }
      }

      // STREAM B: If not an image lead, evaluate caption text for buyer keywords
      if (!matchedLead && isBuyerTextLead(post.text)) {
        log(`📝 Matched Text Buyer Lead in ${group.name}: "${post.text.slice(0, 80)}..."`);
        matchedLead = {
          id: idKey,
          isImageLead: false,
          groupName: group.name,
          category: group.category,
          author: post.author,
          content: post.text,
          requirement: post.text.slice(0, 250),
          extractedContact: null,
          postUrl: post.postLink,
          timestamp: new Date().toISOString(),
          pitch: ''
        };
        matchedLead.pitch = await generateTailoredPitch(matchedLead);
      }

      // If a qualified lead was detected via either Stream A or Stream B:
      if (matchedLead) {
        seenSet.add(idKey);
        saveSeenPosts(seenSet);
        saveCapturedLead(matchedLead);
        await sendTelegramAlert(matchedLead);
      }
    }
  } catch (err) {
    log(`⚠️ Error scanning ${group.name}: ${err.message}`);
  } finally {
    await page.close().catch(() => {});
  }
}

// 6. Master Execution Runner
async function runRadar() {
  log('====================================================');
  log('🚀 GROWECH FACEBOOK LEAD & OCR RADAR — SCAN STARTED');
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
    log(`⚠️ Profile launch fallback (${err.message}). Launching standalone instance...`);
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

  log('✅ Multimodal scan round complete.');
  log('====================================================\n');
}

// Run immediately
runRadar();
