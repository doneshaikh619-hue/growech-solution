# 🎯 Growech Solution — Facebook Client Lead Radar

An autonomous, real-time lead monitoring radar built specifically for **Growech Solution**. It scans high-traffic Pakistani freelance, e-commerce, and business groups, identifies clients seeking websites, custom development, or fixes, generates instant AI pitches via Gemini, and dispatches real-time alerts.

---

### 📌 Monitored Facebook Groups

1. **Shopify Community in Pakistan by FulfillKaro** (83K+ members) — E-commerce, Shopify themes, custom code, bug fixes.
2. **Pakistani Web Developers and Freelancers** (35K+ members) — Full-stack, Next.js, WordPress, Supabase, backend.
3. **Top Freelancer Of Pakistan** (161K+ members) — High-volume subcontracting and direct client requests.
4. **Startup Pakistan** (218K+ members) — Founders seeking MVPs, landing pages, and development partners.
5. **I Need A Website Designer / Web Developer** (104K+ members) — Global & regional buyer requests.

---

### ⚙️ How It Works

1. **Session-Authenticated Scrape**: Connects via Chrome profile (`Muhammad Mustafa`) to access group chronological feeds without rate limits or bot blockers.
2. **Buyer Intent Filtering**: Matches keywords like `need website`, `web developer required`, `shopify developer`, `fix payment gateway`, `landing page`, `developer chahiye`.
3. **Spam Rejection**: Automatically excludes self-promoting freelancers (`i am offering`, `hire me`, `my portfolio`).
4. **Bespoke Gemini AI Pitches**: Generates a high-converting, 3-sentence consultative pitch tailored to the client's specific problem in under 60 words.
5. **Deduplication**: Saves post IDs to `seen_facebook_posts.json` so you never receive duplicate notifications.
6. **Captured Lead History**: Appends all captured leads with generated pitches to `captured_leads.json`.

---

### 🚀 How To Run

#### 1-Click Launch:
Double-click `run-facebook-radar.bat` inside this folder.

#### Via Terminal / Node:
```bash
node facebook-radar.cjs
```
