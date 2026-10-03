const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * GROWECH SOLUTION — 24/7 CLOUD AUTONOMOUS OUTBOUND SENDER
 * Runs on GitHub Actions scheduled cron (10 AM, 2 PM, 6 PM PKT)
 * Works even when your laptop is completely powered off!
 * 
 * Strict Enforcement:
 * - MUST HAVE non-empty Website
 * - MUST HAVE Phone Number
 * - MUST HAVE Valid Email Address
 */

// Configuration & Secrets (injected via environment variables or GitHub Secrets)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || 'growech.site@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_NAME = process.env.FROM_NAME || 'Mustafa | Growech Solution';
const FROM_EMAIL = process.env.FROM_EMAIL || 'growech.site@gmail.com';

if (!GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY environment variable. Exiting.');
  process.exit(1);
}
if (!SMTP_PASS) {
  console.error('❌ Missing SMTP_PASS environment variable. Exiting.');
  process.exit(1);
}

const SENT_LOG_FILE = path.join(__dirname, 'sent_leads.json');
const TARGET_LEADS_FILE = path.join(__dirname, 'master_verified_leads.json');

// Strict Quality Gate Validation Function
function isValidLead(lead) {
  if (!lead) return false;

  // 1. Must have valid non-empty website
  const web = (lead.website || '').trim().toLowerCase();
  if (!web || web.length < 5 || web === 'n/a' || web.includes('facebook.com') || web.includes('instagram.com')) {
    return false;
  }

  // 2. Must have valid phone number (at least 7 digits)
  const phone = (lead.phone || '').trim();
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!phone || cleanPhone.length < 7) {
    return false;
  }

  // 3. Must have valid non-empty email
  const email = (lead.email || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return false;
  }

  const invalid = ['example.com', 'domain.com', 'user@domain', 'sentry', 'wixpress', 'schema.org'];
  if (invalid.some(inv => email.includes(inv))) {
    return false;
  }

  return true;
}

// Generate Personalized Cold Email using Gemini REST API
async function generateGeminiEmail(lead) {
  const prompt = `You are Mustafa, Founder & CEO of Growech Solution (high-converting websites & AI automation agency based in Pakistan/UK).
Write a strictly personalized, low-friction, 75-word cold outreach email to this verified business owner.

BUSINESS DETAILS:
- Company: ${lead.business_name}
- Owner/Decision Maker: ${lead.owner_name || 'Founder'} (${lead.designation || 'Owner'})
- City: ${lead.city}, Pakistan
- Website: ${lead.website}
- Phone: ${lead.phone}
- Specific Business Bottleneck / Angle: ${lead.pitch_angle || 'Automating high-ticket inquiries & filtering out price shoppers via 24/7 WhatsApp AI triage'}

STRICT RULES:
1. Under 80 words total.
2. NO generic greeting like "I hope you are doing well". Start directly addressing them.
3. Mention their company name and their specific niche naturally.
4. Highlight that high-ticket owners lose hours on unverified inquiries, and Growech builds custom systems (fast modern web platforms + official WhatsApp AI triage) that qualify serious clients automatically.
5. Conversational low-friction CTA: "Can I send a 2-minute video walkthrough showing how this works for your studio?"
6. Sign off as:
Best,
Mustafa
Founder, Growech Solution
growech.site

Return ONLY valid JSON with keys:
"subject": string (under 6 words, e.g. "Quick question for [Business Name]"),
"body": string (plain text email body)`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastErr = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Model ${model} returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(rawText);
    } catch (err) {
      lastErr = err;
      // Brief 500ms delay and try next model
      await new Promise(r => setTimeout(r, 500));
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastErr?.message}`);
}

// Main Autonomous Cloud Execution Loop
async function runCloudOutbound() {
  console.log('\n=============================================================');
  console.log('☁️ GROWECH 24/7 CLOUD OUTBOUND DISPATCHER');
  console.log('⚡ Execution: Cloud GitHub Actions Runner (Laptop-Independent)');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log('=============================================================\n');

  // Load sent history
  let sentHistory = [];
  if (fs.existsSync(SENT_LOG_FILE)) {
    try {
      sentHistory = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf8'));
    } catch (e) {
      sentHistory = [];
    }
  }

  const sentEmailsSet = new Set(sentHistory.map(s => (s.email || '').toLowerCase()));
  const sentDomainsSet = new Set(sentHistory.map(s => (s.domain || '').toLowerCase()));

  // Load target master leads
  if (!fs.existsSync(TARGET_LEADS_FILE)) {
    console.error('❌ Master leads file not found:', TARGET_LEADS_FILE);
    process.exit(1);
  }

  const masterLeads = JSON.parse(fs.readFileSync(TARGET_LEADS_FILE, 'utf8'));
  console.log(`📋 Total Master Leads Loaded: ${masterLeads.length}`);

  // Filter unsent leads that pass the strict quality filter
  const candidates = [];
  for (const lead of masterLeads) {
    if (!isValidLead(lead)) continue;

    const email = lead.email.toLowerCase().trim();
    let domain = '';
    try {
      domain = new URL(lead.website.startsWith('http') ? lead.website : 'https://' + lead.website).hostname.replace(/^www\./, '');
    } catch (e) {
      domain = lead.website.toLowerCase();
    }

    if (sentEmailsSet.has(email) || sentDomainsSet.has(domain)) {
      continue; // Already contacted
    }

    candidates.push({ ...lead, domain });
  }

  console.log(`🎯 Uncontacted Valid Leads Ready: ${candidates.length}`);

  if (candidates.length === 0) {
    console.log('✨ All master verified leads have already been contacted! System idle.');
    return;
  }

  // Hard deliverability limits to guarantee domain safety
  const HARD_DAILY_LIMIT = 20;
  const HARD_HOURLY_LIMIT = 5;

  // Calculate sends in the current Pakistan date & hour
  const now = new Date();
  const todayDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(now);
  const currentHour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }).format(now);

  const sentTodayCount = sentHistory.filter(s => {
    if (!s.sent_at) return false;
    const sDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date(s.sent_at));
    return sDate === todayDateStr;
  }).length;

  const sentThisHourCount = sentHistory.filter(s => {
    if (!s.sent_at) return false;
    const sDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date(s.sent_at));
    const sHour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }).format(new Date(s.sent_at));
    return sDate === todayDateStr && sHour === currentHour;
  }).length;

  console.log(`📊 Deliverability Guard:`);
  console.log(`   - Sent Today (${todayDateStr}): ${sentTodayCount} / ${HARD_DAILY_LIMIT}`);
  console.log(`   - Sent This Hour (${currentHour}:00 PKT): ${sentThisHourCount} / ${HARD_HOURLY_LIMIT}`);

  if (sentTodayCount >= HARD_DAILY_LIMIT) {
    console.log(`🛑 Daily hard limit of ${HARD_DAILY_LIMIT} reached for today. Safely stopping to protect domain reputation.`);
    return;
  }

  if (sentThisHourCount >= HARD_HOURLY_LIMIT) {
    console.log(`🛑 Hourly hard limit of ${HARD_HOURLY_LIMIT} reached for this hour. Safely waiting for next window.`);
    return;
  }

  // Safe batch calculation (never exceeds 5 per run and never exceeds 20 per day)
  const remainingToday = HARD_DAILY_LIMIT - sentTodayCount;
  const remainingThisHour = HARD_HOURLY_LIMIT - sentThisHourCount;
  const allowedThisRun = Math.min(candidates.length, remainingThisHour, remainingToday);

  const currentBatch = candidates.slice(0, allowedThisRun);
  console.log(`🚀 Dispatching batch of ${currentBatch.length} email(s) for this run...\n`);

  // Setup Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });

  console.log(`🔌 Verifying SMTP Connection to ${SMTP_HOST}...`);
  await transporter.verify();
  console.log('✅ SMTP Connection Active & Authenticated!\n');

  let sentCount = 0;
  for (const lead of currentBatch) {
    console.log(`-------------------------------------------------------------`);
    console.log(`🏢 Target: "${lead.business_name}" (${lead.owner_name || 'Owner'})`);
    console.log(`🌐 Website: ${lead.website}`);
    console.log(`📞 Phone: ${lead.phone}`);
    console.log(`✉️ Recipient: ${lead.email}`);

    try {
      console.log('🤖 Calling Gemini for hyper-personalized pitch...');
      const pitch = await generateGeminiEmail(lead);

      console.log(`📝 Subject: "${pitch.subject}"`);

      // Plaintext body with anti-spam compliance opt-out
      const fullBody = `${pitch.body}

---
If you'd prefer not to hear from us, just reply with 'unsubscribe' and we will remove your contact immediately.
Growech Solution | growech.site`;

      const mailOptions = {
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: lead.email,
        replyTo: FROM_EMAIL,
        subject: pitch.subject,
        text: fullBody
      };

      const isDryRun = process.argv.includes('--dry-run');
      let info = { messageId: 'DRY_RUN_MOCK_ID' };

      if (isDryRun) {
        console.log(`🧪 [DRY RUN] Would send to: ${lead.email}`);
        console.log(`📝 Preview Body:\n${pitch.body}\n`);
      } else {
        console.log(`🚀 Dispatching email to ${lead.email}...`);
        info = await transporter.sendMail(mailOptions);
        console.log(`✨ SUCCESS! Message ID: ${info.messageId}`);
      }

      sentHistory.push({
        business_name: lead.business_name,
        owner_name: lead.owner_name,
        email: lead.email.toLowerCase(),
        domain: lead.domain,
        phone: lead.phone,
        website: lead.website,
        subject: pitch.subject,
        messageId: info.messageId,
        sent_at: new Date().toISOString()
      });

      sentCount++;

      // Safe polite gap between sends
      await new Promise(r => setTimeout(r, 4000));
    } catch (err) {
      console.error(`❌ Failed sending to ${lead.email}: ${err.message}`);
    }
  }

  // Save updated sent history file
  fs.writeFileSync(SENT_LOG_FILE, JSON.stringify(sentHistory, null, 2), 'utf8');
  console.log(`\n💾 Saved updated dispatch history: ${sentHistory.length} total leads contacted.`);
  console.log(`🏁 Batch run finished: Sent ${sentCount}/${currentBatch.length} emails successfully.`);
}

runCloudOutbound().then(() => process.exit(0)).catch(err => {
  console.error('Fatal Cloud Runner Error:', err);
  process.exit(1);
});
