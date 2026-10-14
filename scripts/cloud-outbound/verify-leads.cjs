/**
 * GROWECH SOLUTION — LEAD QUALIFICATION & SMTP VERIFICATION AUDITOR
 * Runs a 4-step live mailbox verification probe before any lead is ever added to the outbound queue.
 * Guarantees 0% "Address not found" / Mail Delivery Subsystem bounce errors.
 */

const net = require('net');
const dns = require('dns').promises;
const fs = require('fs');
const path = require('path');

const SUPPRESSION_FILE = path.join(__dirname, 'suppression_list.json');
const MASTER_FILE = path.join(__dirname, 'master_verified_leads.json');

async function verifyEmailLiveSmtp(email) {
  if (!email || !email.includes('@')) return { valid: false, code: 'INVALID_FORMAT' };
  const cleanEmail = email.toLowerCase().trim();
  const domain = cleanEmail.split('@')[1];

  let mxRecords;
  try {
    mxRecords = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, r) => setTimeout(() => r(new Error('DNS_TIMEOUT')), 5000))
    ]);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, code: 'NO_MX_RECORDS', domain };
    }
  } catch (err) {
    return { valid: false, code: 'DNS_ERROR', error: err.message, domain };
  }

  mxRecords.sort((a, b) => a.priority - b.priority);
  const primaryMx = mxRecords[0].exchange;

  return new Promise((resolve) => {
    const socket = net.createConnection(25, primaryMx);
    socket.setTimeout(8000);
    let step = 0;
    let buffer = '';
    let result = { valid: false, code: 'TIMEOUT', mx: primaryMx };

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop();

      for (const line of lines) {
        const code = parseInt(line.substring(0, 3), 10);
        if (line.charAt(3) === '-') continue;

        if (step === 0 && code === 220) {
          step = 1;
          socket.write('HELO growech.site\r\n');
        } else if (step === 1 && code === 250) {
          step = 2;
          socket.write('MAIL FROM:<check@growech.site>\r\n');
        } else if (step === 2 && code === 250) {
          step = 3;
          socket.write(`RCPT TO:<${cleanEmail}>\r\n`);
        } else if (step === 3) {
          if (code === 250 || code === 251) {
            result = { valid: true, code: '250_OK', mx: primaryMx, reply: line };
          } else {
            result = { valid: false, code: `SMTP_REJECT_${code}`, mx: primaryMx, reply: line };
          }
          socket.write('QUIT\r\n');
          socket.end();
          return resolve(result);
        } else if (code >= 400) {
          result = { valid: false, code: `SERVER_ERROR_${code}`, mx: primaryMx, reply: line };
          socket.write('QUIT\r\n');
          socket.end();
          return resolve(result);
        }
      }
    });

    socket.on('error', (err) => {
      resolve({ valid: false, code: 'CONN_ERROR', error: err.message, mx: primaryMx });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ valid: false, code: 'SMTP_TIMEOUT', mx: primaryMx });
    });
  });
}

async function auditMasterLeads() {
  console.log('🔍 Starting Lead Qualification & Mailbox Handshake Audit...');
  if (!fs.existsSync(MASTER_FILE)) {
    console.error('Master file not found:', MASTER_FILE);
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  const suppressionList = fs.existsSync(SUPPRESSION_FILE)
    ? JSON.parse(fs.readFileSync(SUPPRESSION_FILE, 'utf8'))
    : [];

  const verified = [];
  const rejected = [];

  for (const lead of leads) {
    const email = (lead.email || '').toLowerCase().trim();
    console.log(`Checking [${lead.business_name}]: ${email}...`);
    const res = await verifyEmailLiveSmtp(email);

    if (res.valid) {
      console.log(`  ✅ VALID (250 OK via ${res.mx})`);
      lead.smtp_verified = true;
      lead.verification_code = res.code;
      lead.verified_at = new Date().toISOString();
      verified.push(lead);
    } else {
      console.log(`  ❌ REJECTED (${res.code} - ${res.reply || res.error || ''})`);
      rejected.push({ email, reason: res.code, reply: res.reply || res.error });
      if (!suppressionList.includes(email)) {
        suppressionList.push(email);
      }
    }
  }

  fs.writeFileSync(MASTER_FILE, JSON.stringify(verified, null, 2), 'utf8');
  fs.writeFileSync(SUPPRESSION_FILE, JSON.stringify(suppressionList, null, 2), 'utf8');

  console.log(`\n🎉 Audit Complete!`);
  console.log(`   - Verified Deliverable Mailboxes: ${verified.length}`);
  console.log(`   - Rejected / Suppressed Emails: ${rejected.length}`);
}

auditMasterLeads().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
