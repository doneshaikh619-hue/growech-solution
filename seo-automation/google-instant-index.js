/**
 * Growech Instant Google Indexing Engine
 * Uses the official Google Web Search Indexing API (v3) to summon Googlebot within minutes.
 * 
 * Setup Instructions:
 * 1. Put your Google Cloud service account JSON key in this folder as 'service_account.json'.
 * 2. In Google Search Console (search.google.com), add the service account email as 'Owner'.
 * 3. Run: node google-instant-index.js
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.join(__dirname, 'service_account.json');

// All Growech URLs to be indexed
const URLS_TO_INDEX = [
  'https://growech.site/',
  'https://growech.site/solutions/turnkey-architects.html',
  'https://growech.site/solutions/dental-aesthetic-clinics.html',
  'https://growech.site/solutions/car-detailing-ppf.html',
  'https://growech.site/card-generator.html'
];

async function runGoogleIndexing() {
  console.log('====================================================');
  console.log('🚀 GROWECH INSTANT GOOGLE INDEXING ENGINE');
  console.log('====================================================\n');

  if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ Error: service_account.json not found in seo-automation folder!');
    console.log('👉 Please create a Service Account in Google Cloud Console, enable "Web Search Indexing API", download the JSON key as "service_account.json", and add its email as an Owner in Google Search Console.');
    console.log('👉 See service_account.json.example for reference.\n');
    process.exit(1);
  }

  try {
    const keyData = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
    console.log(`🔑 Authenticating as Service Account: ${keyData.client_email}...`);

    const jwtClient = new google.auth.JWT({
      email: keyData.client_email,
      key: keyData.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    await jwtClient.authorize();
    console.log('✅ Google API JWT Authorization Successful!\n');

    const indexing = google.indexing({ version: 'v3', auth: jwtClient });

    for (const url of URLS_TO_INDEX) {
      try {
        console.log(`📡 Pinging Googlebot for: ${url} ...`);
        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED'
          }
        });
        console.log(`   ✨ [SUCCESS] Status: ${response.status} (Notification received at ${response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || 'now'})\n`);
      } catch (err) {
        console.error(`   ❌ [FAILED] for ${url}:`, err.response?.data?.error?.message || err.message);
      }
    }

    console.log('🎉 Done! Googlebot has been dispatched. Crawl usually occurs within 15 mins to 4 hours.');
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
  }
}

runGoogleIndexing();
