/**
 * Growech Instant IndexNow Submitter
 * Submits all pages directly to Bing & Microsoft Copilot (which powers AI search summaries).
 * IndexNow is an open protocol supported by Bing, Yandex, Seznam, and AI search engines.
 */

import https from 'https';

const HOST = 'growechsolution.com';
const KEY = 'growech-indexnow-key-2026';
const KEY_LOCATION = `https://${HOST}/growech-indexnow-key-2026.txt`;

const URLS = [
  'https://growechsolution.com/',
  'https://growechsolution.com/solutions/turnkey-architects.html',
  'https://growechsolution.com/solutions/dental-aesthetic-clinics.html',
  'https://growechsolution.com/solutions/car-detailing-ppf.html',
  'https://growechsolution.com/card-generator.html'
];

async function submitToIndexNow() {
  console.log('====================================================');
  console.log('⚡ GROWECH INSTANT INDEXNOW SUBMITTER (BING / COPILOT)');
  console.log('====================================================\n');

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📡 Response Status: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✨ [SUCCESS] URLs successfully submitted to IndexNow network (Bing & AI Engines)!');
    } else {
      console.log(`⚠️ Status received: ${res.statusCode}. Check host verification key.`);
    }

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
  });

  req.write(payload);
  req.end();
}

submitToIndexNow();
