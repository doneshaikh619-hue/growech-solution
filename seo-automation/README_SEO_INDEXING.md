# Growech Google Search Dominance & Fast Indexing Guide

This folder contains the automated tools to get **Growech Solution** indexed on Google, Bing, and AI search engines in under 24 hours, and rank on Google Search.

---

## 1. Instant Google Indexing (Google Indexing API)

Google's normal crawl can take 3 to 8 weeks for a new website. With the **Google Web Search Indexing API**, Googlebot crawls your URLs within **15 minutes to 4 hours**.

### Setup Steps (Only Once):
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `Growech-SEO`.
3. In the search bar at the top, search for **"Web Search Indexing API"** and click **ENABLE**.
4. Go to **IAM & Admin > Service Accounts** and click **Create Service Account**.
   - Name: `growech-indexer`
   - Role: `Owner` or `Editor`
5. Click on the created service account, go to the **Keys** tab, click **Add Key > Create new key > JSON**.
6. A JSON file will download. Rename it to `service_account.json` and place it right inside this `seo-automation/` folder.
7. Open [Google Search Console](https://search.google.com/search-console) for your domain `https://growechsolution.com/`.
8. Go to **Settings > Users and permissions > Add user**.
9. Paste your Service Account email (e.g. `growech-indexer@growech-seo.iam.gserviceaccount.com`) and set permission to **Owner**.
10. Run the script:
```bash
node seo-automation/google-instant-index.js
```

---

## 2. Instant IndexNow (Bing & Microsoft Copilot)

Bing and AI engines use the IndexNow protocol to index pages instantly.

Run:
```bash
node seo-automation/indexnow-submit.js
```

---

## 3. Google Business Profile (Map Pack Ranking in Pakistan & Worldwide)

To get client calls directly from Google Maps when people search *"AI automation agency near me"* or *"WhatsApp lead automation in Lahore/Karachi"*:

1. Go to [Google Business Profile](https://business.google.com/).
2. Business Name: `Growech Solution - AI Automation & VIP Lead Intake`
3. Primary Category: `Marketing Agency` or `Internet Marketing Service`
4. Secondary Categories: `Software Company`, `Business Management Consultant`
5. Service Area: Add `Lahore`, `Karachi`, `Islamabad`, `Dubai`, `London`.
6. Add Services:
   - *VIP Lead Intake Automation*
   - *WhatsApp AI Bot & Qualification Workflows*
   - *Clinic & Doctor Patient Intake Systems*
   - *Architect & Interior Project Screening*
7. Generate your review link and get 5-star reviews containing keywords from friends or early testers.
