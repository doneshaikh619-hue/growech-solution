# 🧵 Growech Solution — Autonomous Threads Multi-Agent Lead Radar

A state-of-the-art 4-agent cooperative swarm that monitors Meta Threads (`threads.net`) every **1 minute** for client website, automation, and remote hiring requirements with strict 24-hour freshness gating.

---

### 🤖 4-Agent Architecture & Responsibilities

1. **Agent 1: ThreadsScoutAgent (Real-Time Chronological Scout)**
   - Monitors live Threads search queries across 3 core pillars:
     * **Website Needs:** `need web developer`, `need website`, `looking for web developer`, `need shopify developer`, `need wordpress developer`, `landing page developer`, `design my website budget`, `hire web developer`, `need frontend developer`, `build ecommerce store`
     * **Automation Needs:** `need automation`, `n8n developer`, `make.com automation`, `zapier automation`, `whatsapp automation`, `ai automation developer`, `need chatbot developer`, `workflow automation`, `ai agent developer`
     * **Remote Hiring Needs:** `hiring remote developer`, `remote web developer`, `hiring software engineer remote`, `looking for remote developer`, `remote developer needed`, `freelance developer remote`
   - **Strict Freshness Gate:**
     * Extracts `<time datetime>` tags and relative age indicators.
     * Computes `minutesAgo` relative to real-time.
     * **Hard Cutoff:** Automatically discards any post older than 24 hours (1440 minutes).
     * Highlights ultra-fresh leads (`🔥 ULTRA-FRESH (Just 5m-15m ago)`).

2. **Agent 2: IntentGatekeeperAgent (Pillar Classifier & Budget Extractor)**
   - Classifies posts into 3 specific pillars:
     * `Website Development`
     * `Workflow & AI Automation`
     * `Remote Hiring`
   - Extracts explicit budgets (£, $, €, PKR, AED).
   - Eliminates seller spam (freelancers advertising their own portfolios).

3. **Agent 3: AntiSlopHumanizerAgent (Gemini 3.8 Flash Vision/Reasoning)**
   - **Model:** `gemini-3.8-flash`
   - **Category-Aware Anti-AI Slop Engine:** Tailors pitch to Website speed, AI/n8n automation, or Remote full-stack availability.
   - Eliminates all robotic AI tells:
     * ❌ ZERO throat-clearing openings ("I hope you're doing well", "Here's the thing").
     * ❌ ZERO AI buzzwords ("delve", "game-changer", "cutting-edge", "seamlessly", "revolutionize", "tapestry").
     * ❌ ZERO adverb clutter ("genuinely", "truly", "really", "literally").
     * ✅ Direct, peer-to-peer human founder tone.
     * ✅ Low-friction call to action offering a quick 1-minute video demo or portfolio link.
     * ✅ Strictly under 55 words.

4. **Agent 4: DispatcherLedgerAgent (Telegram & Git Ledger)**
   - Dispatches instant rich Telegram alerts with Category and Freshness tags.
   - Stores deduplicated hashes in `seen_threads_posts.json`.
   - Records full lead history in `captured_leads.json`.

---

### ⏱️ Schedule & Execution

* **24/7 Cloud Autopilot:** Runs every **1 minute** (`* * * * *`) via GitHub Actions.
* **1-Click Windows Launcher:** Double-click `run-threads-radar.bat` to run continuous 60-second real-time loops on your desktop.
