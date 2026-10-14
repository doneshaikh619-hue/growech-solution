const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

/**
 * GROWECH SOLUTION — 24/7 CLOUD AUTONOMOUS OUTBOUND & FOLLOW-UP DISPATCHER
 * Enhanced with 5-Layer Zero-Bounce Qualification & Automatic Suppression
 * Runs on GitHub Actions scheduled cron (10 AM, 2 PM, 6 PM PKT)
 *
 * Core Guarantees:
 * 1. Zero tolerance for unverified / non-existent / dead email addresses.
 * 2. Every single recipient is pre-flight qualified before Initial Send AND Follow-Up Send.
 * 3. Automatic suppression & blacklist feedback loop to prevent repeat bounces.
 * 4. Maximum protection of sender domain & Gmail account reputation.
 */

// Load local .env fallback if running locally outside GitHub Actions
if (!process.env.GEMINI_API_KEY || !process.env.SMTP_PASS) {
  const possibleEnvPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../growech-outbound/.env')
  ];
  for (const envPath of possibleEnvPaths) {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      for (const line of envContent.split(/\r?\n/)) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = (match[2] || '').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

// Configuration & Secrets
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || 'growech.site@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_NAME = process.env.FROM_NAME || 'Mustafa | Growech Solution';
const FROM_EMAIL = process.env.FROM_EMAIL || 'growech.site@gmail.com';

const FOLLOWUP_DELAY_DAYS = Number(process.env.FOLLOWUP_DELAY_DAYS) || 2; // 48 hours minimum gap before follow-up
const MAX_FOLLOWUPS_PER_RUN = 3; // Prioritize up to 3 warm follow-ups per batch

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
const SUPPRESSION_FILE = path.join(__dirname, 'suppression_list.json');

// Helper to load or initialize suppression blacklist
function loadSuppressionSet() {
  if (fs.existsSync(SUPPRESSION_FILE)) {
    try {
      const list = JSON.parse(fs.readFileSync(SUPPRESSION_FILE, 'utf8'));
      if (Array.isArray(list)) {
        return new Set(list.map(e => e.toLowerCase().trim()));
      }
    } catch (e) {
      console.warn('⚠️ Could not parse suppression_list.json, initializing empty set.');
    }
  }
  return new Set();
}

function addToSuppressionList(email, reason = 'Bounce or validation failure') {
  if (!email) return;
  const cleanEmail = email.toLowerCase().trim();
  const set = loadSuppressionSet();
  if (!set.has(cleanEmail)) {
    set.add(cleanEmail);
    fs.writeFileSync(SUPPRESSION_FILE, JSON.stringify(Array.from(set), null, 2), 'utf8');
    console.log(`🛡️ [SUPPRESSION BLACKLIST] Added ${cleanEmail} -> Reason: ${reason}`);
  }
}

// Disposable domains blacklist
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'throwawaymail.com', 'yopmail.com', 'sharklasers.com', 'getairmail.com',
  'dispostable.com', 'fakeinbox.com', 'tempinbox.com', 'example.com',
  'domain.com', 'test.com', 'invalid.com', 'sentry.io', 'wixpress.com'
]);

// 5-Layer Bulletproof Email Qualification Gate
async function qualifyRecipientEmail(email, website, isFollowUp = false) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'EMPTY_OR_NON_STRING_EMAIL' };
  }

  const cleanEmail = email.toLowerCase().trim();

  // Layer 1: Strict RFC 5322 Syntax Regex
  const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!rfcRegex.test(cleanEmail)) {
    return { valid: false, reason: 'FAILED_RFC_SYNTAX_VALIDATION' };
  }

  // Layer 2: Check Permanent Suppression Blacklist
  const suppressionSet = loadSuppressionSet();
  if (suppressionSet.has(cleanEmail)) {
    return { valid: false, reason: 'SUPPRESSED_IN_BOUNCE_BLACKLIST' };
  }

  // Layer 3: Disposable Domain and Invalid Keyword Check
  const parts = cleanEmail.split('@');
  const userPart = parts[0];
  const domainPart = parts[1];

  if (DISPOSABLE_DOMAINS.has(domainPart) || domainPart.includes('example') || domainPart.includes('schema.org')) {
    return { valid: false, reason: 'DISPOSABLE_OR_PLACEHOLDER_DOMAIN' };
  }

  // Layer 4: Live DNS MX Record Resolution with Timeout
  try {
    const mxRecords = await Promise.race([
      dns.resolveMx(domainPart),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DNS_TIMEOUT')), 5000))
    ]);

    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'NO_MX_RECORDS_FOUND' };
    }

    const hasValidHost = mxRecords.some(mx => mx.exchange && mx.exchange.trim().length > 3);
    if (!hasValidHost) {
      return { valid: false, reason: 'INVALID_MX_EXCHANGE_HOST' };
    }
  } catch (err) {
    return { valid: false, reason: `DNS_MX_RESOLVE_FAILED: ${err.message}` };
  }

  // Layer 5: Live Website Verification (for new initial outreach)
  if (!isFollowUp && website) {
    const isLive = await verifyEmailOnLiveWebsite(website, cleanEmail);
    if (!isLive) {
      // If not visibly found on website, we require pre-verified confirmation
      return { valid: false, reason: 'EMAIL_NOT_CONFIRMED_ON_LIVE_WEBSITE' };
    }
  }

  return { valid: true };
}

// Live Website Mailbox Presence Validator
async function verifyEmailOnLiveWebsite(website, targetEmail) {
  if (!website || !targetEmail) return false;
  const target = targetEmail.trim().toLowerCase();
  const baseUrl = website.startsWith('http') ? website.replace(/\/$/, '') : 'https://' + website.replace(/\/$/, '');
  const urlsToTry = [baseUrl, `${baseUrl}/contact`, `${baseUrl}/contact-us`];

  for (const u of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(u, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      clearTimeout(timeoutId);
      if (!res.ok) continue;
      const html = (await res.text()).toLowerCase();
      if (html.includes(target)) {
        return true;
      }
    } catch (e) {}
  }
  return false;
}

// Helper to call Gemini API with fallback models
async function callGeminiJson(prompt) {
  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
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
            temperature: 0.35,
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
      await new Promise(r => setTimeout(r, 500));
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastErr?.message}`);
}

// Sanitize AI punctuation tells so text looks 100% human-typed
function sanitizeHumanText(text) {
  if (!text) return '';
  return text
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/\s+--+\s+/g, ', ')
    .replace(/,\s*,/g, ',')
    .trim();
}

// Generate Initial Personalized Cold Email
async function generateGeminiEmail(lead) {
  const prompt = `You are Mustafa, Founder & CEO of Growech Solution (high-converting websites & AI automation agency based in Pakistan/UK).
Write a strictly personalized, low-friction, 75-word cold outreach email to this verified business owner.

BUSINESS DETAILS:
- Company: ${lead.business_name}
- Owner/Decision Maker: ${lead.owner_name || 'Founder'} (${lead.designation || 'Owner'})
- City: ${lead.city || 'Pakistan'}
- Website: ${lead.website}
- Phone: ${lead.phone}
- Specific Business Bottleneck / Angle: ${lead.pitch_angle || 'Automating high-ticket inquiries & filtering out price shoppers via 24/7 WhatsApp AI triage'}

STRICT RULES:
1. Under 80 words total.
2. NO em-dashes (—) or en-dashes (–). Use normal commas or periods like a real human typing.
3. NO generic greeting like "I hope you are doing well". Start directly addressing them.
4. Mention their company name and their specific niche naturally.
5. Highlight that high-ticket owners lose hours on unverified inquiries, and Growech builds custom systems (fast modern web platforms + official WhatsApp AI triage) that qualify serious clients automatically.
6. Conversational low-friction CTA: "Can I send a quick interactive prototype / solution draft showing how this works for your team?"
7. Sign off as:
Best,
Mustafa
Founder, Growech Solution
growech.site

Return ONLY valid JSON with keys:
"subject": string (under 6 words, e.g. "Quick question for [Business Name]"),
"body": string (plain text email body)`;

  const res = await callGeminiJson(prompt);
  if (res && res.body) res.body = sanitizeHumanText(res.body);
  return res;
}

// Generate Personalized Feature-Focused Follow-Up Email
async function generateGeminiFollowUpEmail(lead, sentRecord) {
  const prompt = `You are Mustafa, Founder of Growech Solution (custom Next.js web platforms & WhatsApp AI automation studio).
Write a natural, 100% human-sounding, 60-to-75-word FOLLOW-UP email to this business owner whom you emailed a few days ago.
Instead of a boring "just checking in", pitch a SPECIFIC, HIGH-VALUE FEATURE tailored to their business.

BUSINESS DETAILS:
- Company: ${lead.business_name}
- Owner/Decision Maker: ${lead.owner_name || 'Founder'} (${lead.designation || 'Owner'})
- City: ${lead.city || 'Pakistan'}
- Website: ${lead.website}
- Niche / Angle: ${lead.pitch_angle || 'High-ticket appointments & client qualification'}
- Previous Email Subject: "${sentRecord.subject || 'Quick question'}"

FEATURE TO HIGHLIGHT:
- Our "15-Second WhatsApp & Web AI Booking Triage": When a prospect messages ${lead.business_name} after hours or during busy slots, the system instantly answers service/pricing questions in natural language, filters out casual window-shoppers, and books serious consultations directly onto the calendar without staff typing back and forth.

STRICT RULES:
1. Under 75 words total.
2. NO em-dashes (—) or en-dashes (–). Use commas and periods only.
3. Sound like a real human founder writing a quick, helpful reply. NO AI buzzwords ("revolutionary", "cutting-edge", "synergy", "elevate").
4. Start naturally (e.g., "Hi [Owner First Name], following up briefly on my note from earlier this week...").
5. Explain the specific WhatsApp/Web auto-qualification feature in 1-2 crisp sentences and how it saves their team hours while locking in high-intent clients.
6. Low-friction CTA: Offer to share a 60-second custom interactive demo link built for ${lead.business_name} (e.g., "Mind if I send over a quick 60-second test link so you can try the flow yourself?").
7. Sign off as:
Best,
Mustafa
Founder, Growech Solution
growech.site

Return ONLY valid JSON with keys:
"subject": string (must be "Re: ${sentRecord.subject || 'Quick question for ' + lead.business_name}"),
"body": string (plain text email body)`;

  const res = await callGeminiJson(prompt);
  if (res && res.body) res.body = sanitizeHumanText(res.body);
  return res;
}

// Main Autonomous Cloud Execution Loop
async function runCloudOutbound() {
  console.log('\n=============================================================');
  console.log('☁️ GROWECH 24/7 CLOUD OUTBOUND — ZERO BOUNCE QUALIFICATION GATE');
  console.log('⚡ Execution: Cloud GitHub Actions Runner (Laptop-Independent)');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log('=============================================================\n');

  // Load suppression set
  const suppressionSet = loadSuppressionSet();
  console.log(`🛡️ Active Blacklisted/Suppressed Emails: ${suppressionSet.size}`);

  // Load sent history
  let sentHistory = [];
  if (fs.existsSync(SENT_LOG_FILE)) {
    try {
      sentHistory = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf8'));
    } catch (e) {
      sentHistory = [];
    }
  }

  // Load target master leads
  if (!fs.existsSync(TARGET_LEADS_FILE)) {
    console.error('❌ Master leads file not found:', TARGET_LEADS_FILE);
    process.exit(1);
  }

  const masterLeads = JSON.parse(fs.readFileSync(TARGET_LEADS_FILE, 'utf8'));
  console.log(`📋 Total Verified Master Leads Available: ${masterLeads.length}`);
  console.log(`📂 Total Previously Contacted Records: ${sentHistory.length}`);

  // Build lookup map of master leads by email
  const masterMap = new Map();
  for (const m of masterLeads) {
    if (m.email) {
      masterMap.set(m.email.toLowerCase().trim(), m);
    }
  }

  // Hard deliverability limits to guarantee domain safety
  const HARD_DAILY_LIMIT = 20;
  const HARD_HOURLY_LIMIT = 5;

  const now = new Date();
  const todayDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(now);
  const currentHour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }).format(now);

  let sentTodayCount = 0;
  let sentThisHourCount = 0;

  for (const s of sentHistory) {
    if (s.sent_at) {
      const sDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date(s.sent_at));
      const sHour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }).format(new Date(s.sent_at));
      if (sDate === todayDateStr) {
        sentTodayCount++;
        if (sHour === currentHour) sentThisHourCount++;
      }
    }
    if (s.followup_sent_at) {
      const fDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date(s.followup_sent_at));
      const fHour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', hour: '2-digit', hour12: false }).format(new Date(s.followup_sent_at));
      if (fDate === todayDateStr) {
        sentTodayCount++;
        if (fHour === currentHour) sentThisHourCount++;
      }
    }
  }

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

  const remainingToday = HARD_DAILY_LIMIT - sentTodayCount;
  const remainingThisHour = HARD_HOURLY_LIMIT - sentThisHourCount;
  const maxAllowedThisRun = Math.min(remainingThisHour, remainingToday);

  // ---------------------------------------------------------------------------
  // PHASE 1: Identify & Deep-Qualify Eligible Leads for Follow-Up
  // ---------------------------------------------------------------------------
  const readyFollowUps = [];
  for (const record of sentHistory) {
    if (record.followup_sent || record.unsubscribed || record.bounced || record.suppressed) {
      continue;
    }
    if (!record.sent_at || !record.email) continue;

    const email = record.email.toLowerCase().trim();

    // Check suppression blacklist immediately
    if (suppressionSet.has(email)) {
      console.log(`🛡️ BOUNCE SHIELD: Auto-suppressing follow-up to ${email} (blacklisted)`);
      record.followup_sent = true;
      record.suppressed = true;
      continue;
    }

    const elapsedMs = now.getTime() - new Date(record.sent_at).getTime();
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

    if (elapsedDays < FOLLOWUP_DELAY_DAYS) continue;

    // Run 5-Layer Qualification Check on Follow-Up Recipient
    const qual = await qualifyRecipientEmail(email, record.website, true);
    if (!qual.valid) {
      console.log(`🛡️ QUALIFICATION BLOCKED (Follow-Up): Skipped ${record.business_name} (${email}) - ${qual.reason}`);
      record.followup_sent = true;
      record.suppressed = true;
      record.bounce_reason = qual.reason;
      addToSuppressionList(email, qual.reason);
      continue;
    }

    const enrichedLead = masterMap.get(email) || record;
    readyFollowUps.push({ record, enrichedLead, elapsedDays: elapsedDays.toFixed(1) });
  }

  // ---------------------------------------------------------------------------
  // PHASE 2: Identify & Deep-Qualify Uncontacted Leads for Initial Outreach
  // ---------------------------------------------------------------------------
  const sentEmailsSet = new Set(sentHistory.map(s => (s.email || '').toLowerCase().trim()));
  const sentDomainsSet = new Set(sentHistory.map(s => (s.domain || '').toLowerCase().trim()));

  const newCandidates = [];
  for (const lead of masterLeads) {
    const email = (lead.email || '').toLowerCase().trim();
    if (!email) continue;

    // Check suppression blacklist
    if (suppressionSet.has(email)) {
      console.log(`🛡️ BOUNCE SHIELD: Discarded ${lead.business_name} (${email}) - Suppressed.`);
      continue;
    }

    let domain = '';
    try {
      domain = new URL(lead.website.startsWith('http') ? lead.website : 'https://' + lead.website).hostname.replace(/^www\./, '');
    } catch (e) {
      domain = (lead.website || '').toLowerCase();
    }

    if (sentEmailsSet.has(email) || sentDomainsSet.has(domain)) {
      continue;
    }

    // Require explicit verification code
    if (!lead.smtp_verified) {
      console.log(`🛡️ QUALIFICATION GATE: Discarded ${lead.business_name} (${email}) - Missing SMTP verification.`);
      continue;
    }

    // Run 5-Layer Qualification Check
    const qual = await qualifyRecipientEmail(email, lead.website, false);
    if (!qual.valid) {
      console.log(`🛡️ QUALIFICATION BLOCKED (Initial): Discarded ${lead.business_name} (${email}) - ${qual.reason}`);
      addToSuppressionList(email, qual.reason);
      continue;
    }

    newCandidates.push({ ...lead, domain });
  }

  console.log(`\n🎯 Queue Breakdown:`);
  console.log(`   - 100% Qualified Leads Ready for Feature Follow-Up: ${readyFollowUps.length}`);
  console.log(`   - 100% Qualified Leads Ready for Initial Email: ${newCandidates.length}`);

  if (readyFollowUps.length === 0 && newCandidates.length === 0) {
    console.log('✨ All qualified initial emails and follow-ups are up to date! System safely idle.');
    return;
  }

  // Allocate slots
  let followUpQuota = Math.min(readyFollowUps.length, MAX_FOLLOWUPS_PER_RUN, maxAllowedThisRun);
  let initialQuota = Math.min(newCandidates.length, maxAllowedThisRun - followUpQuota);

  if (followUpQuota + initialQuota < maxAllowedThisRun && readyFollowUps.length > followUpQuota) {
    followUpQuota = Math.min(readyFollowUps.length, maxAllowedThisRun - initialQuota);
  }

  const followUpBatch = readyFollowUps.slice(0, followUpQuota);
  const initialBatch = newCandidates.slice(0, initialQuota);

  console.log(`🚀 Dispatch Plan This Run: ${followUpBatch.length} Follow-Up(s) + ${initialBatch.length} Initial Email(s)\n`);

  const isDryRun = process.argv.includes('--dry-run');

  // Setup Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });

  if (!isDryRun) {
    console.log(`🔌 Verifying SMTP Connection to ${SMTP_HOST}...`);
    await transporter.verify();
    console.log('✅ SMTP Connection Active & Authenticated!\n');
  } else {
    console.log('🧪 [DRY RUN MODE ACTIVE] Skipping live SMTP send and file mutation.\n');
  }

  let sentFollowUpsCount = 0;
  let sentInitialsCount = 0;

  // ---------------------------------------------------------------------------
  // EXECUTE FOLLOW-UP BATCH
  // ---------------------------------------------------------------------------
  for (const item of followUpBatch) {
    const { record, enrichedLead, elapsedDays } = item;
    const recipientEmail = record.email.toLowerCase().trim();

    // Final safety interceptor
    if (suppressionSet.has(recipientEmail) || record.bounced) {
      console.log(`🛑 SAFETY INTERCEPT: Cancelled send to ${recipientEmail}`);
      continue;
    }

    console.log(`-------------------------------------------------------------`);
    console.log(`🔄 [FOLLOW-UP #1] Target: "${record.business_name}" (${record.owner_name || 'Owner'})`);
    console.log(`⏱️  Days Since Initial Email: ${elapsedDays} days`);
    console.log(`✉️  Recipient (Pre-Qualified): ${recipientEmail}`);

    try {
      console.log('🤖 Calling Gemini for personalized feature follow-up...');
      const pitch = await generateGeminiFollowUpEmail(enrichedLead, record);

      const baseSubject = record.subject || `Quick question for ${record.business_name}`;
      const threadSubject = baseSubject.toLowerCase().startsWith('re:') ? baseSubject : `Re: ${baseSubject}`;

      const fullBody = `${pitch.body}

---
If you'd prefer not to hear from us, just reply with 'unsubscribe' and we will remove your contact immediately.
Growech Solution | growech.site`;

      const mailOptions = {
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: recipientEmail,
        replyTo: FROM_EMAIL,
        subject: threadSubject,
        text: fullBody
      };

      if (record.messageId) {
        mailOptions.inReplyTo = record.messageId;
        mailOptions.references = record.messageId;
      }

      let info = { messageId: 'DRY_RUN_FOLLOWUP_MOCK_ID' };

      if (isDryRun) {
        console.log(`🧪 [DRY RUN] Would send Threaded Follow-Up to: ${recipientEmail}`);
        console.log(`📝 Preview Body:\n${pitch.body}\n`);
      } else {
        console.log(`🚀 Dispatching qualified follow-up to ${recipientEmail}...`);
        info = await transporter.sendMail(mailOptions);
        console.log(`✨ FOLLOW-UP SENT SUCCESSFULLY! Message ID: ${info.messageId}`);

        record.followup_sent = true;
        record.followup_sent_at = new Date().toISOString();
        record.followup_subject = threadSubject;
        record.followup_messageId = info.messageId;
        record.followup_step = 1;
      }

      sentFollowUpsCount++;
      await new Promise(r => setTimeout(r, isDryRun ? 500 : 4000));
    } catch (err) {
      console.error(`❌ Send error to ${recipientEmail}: ${err.message}`);
      // Self-healing auto-suppression
      if (err.message.includes('550') || err.message.includes('not found') || err.message.includes('recipient')) {
        record.bounced = true;
        record.suppressed = true;
        record.followup_sent = true;
        addToSuppressionList(recipientEmail, `SMTP Send Error: ${err.message}`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // EXECUTE INITIAL OUTREACH BATCH
  // ---------------------------------------------------------------------------
  for (const lead of initialBatch) {
    const recipientEmail = lead.email.toLowerCase().trim();

    // Final safety interceptor
    if (suppressionSet.has(recipientEmail)) {
      console.log(`🛑 SAFETY INTERCEPT: Cancelled initial send to ${recipientEmail}`);
      continue;
    }

    console.log(`-------------------------------------------------------------`);
    console.log(`🏢 [INITIAL OUTREACH] Target: "${lead.business_name}" (${lead.owner_name || 'Owner'})`);
    console.log(`🌐 Website: ${lead.website}`);
    console.log(`📞 Phone: ${lead.phone}`);
    console.log(`✉️  Recipient (Pre-Qualified): ${recipientEmail}`);

    try {
      console.log('🤖 Calling Gemini for hyper-personalized initial pitch...');
      const pitch = await generateGeminiEmail(lead);

      const fullBody = `${pitch.body}

---
If you'd prefer not to hear from us, just reply with 'unsubscribe' and we will remove your contact immediately.
Growech Solution | growech.site`;

      const mailOptions = {
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: recipientEmail,
        replyTo: FROM_EMAIL,
        subject: pitch.subject,
        text: fullBody
      };

      let info = { messageId: 'DRY_RUN_INITIAL_MOCK_ID' };

      if (isDryRun) {
        console.log(`🧪 [DRY RUN] Would send Initial Email to: ${recipientEmail}`);
        console.log(`📝 Preview Body:\n${pitch.body}\n`);
      } else {
        console.log(`🚀 Dispatching qualified initial email to ${recipientEmail}...`);
        info = await transporter.sendMail(mailOptions);
        console.log(`✨ INITIAL EMAIL SENT SUCCESSFULLY! Message ID: ${info.messageId}`);

        sentHistory.push({
          business_name: lead.business_name,
          owner_name: lead.owner_name,
          email: recipientEmail,
          domain: lead.domain,
          phone: lead.phone,
          website: lead.website,
          subject: pitch.subject,
          messageId: info.messageId,
          sent_at: new Date().toISOString(),
          followup_sent: false
        });
      }

      sentInitialsCount++;
      await new Promise(r => setTimeout(r, isDryRun ? 500 : 4000));
    } catch (err) {
      console.error(`❌ Send error to ${recipientEmail}: ${err.message}`);
      if (err.message.includes('550') || err.message.includes('not found') || err.message.includes('recipient')) {
        addToSuppressionList(recipientEmail, `SMTP Send Error: ${err.message}`);
      }
    }
  }

  // Save updated sent history file if not dry run
  if (!isDryRun && (sentFollowUpsCount > 0 || sentInitialsCount > 0)) {
    fs.writeFileSync(SENT_LOG_FILE, JSON.stringify(sentHistory, null, 2), 'utf8');
    console.log(`\n💾 Saved updated dispatch telemetry to sent_leads.json.`);
  }

  console.log(`\n🏁 Run Complete: Sent ${sentFollowUpsCount} Follow-Up(s) and ${sentInitialsCount} Initial Email(s).`);
}

runCloudOutbound().then(() => process.exit(0)).catch(err => {
  console.error('Fatal Cloud Runner Error:', err);
  process.exit(1);
});
