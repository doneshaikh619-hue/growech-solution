# 🧵 Growech Solution — Autonomous Threads Multi-Agent Lead Radar

A state-of-the-art 4-agent cooperative swarm that monitors Meta Threads (`threads.com`) every **5 minutes** for client website, e-commerce, and custom software requirements.

---

### 🤖 4-Agent Architecture & Responsibilities

1. **Agent 1: ThreadsScoutAgent (Chronological Feed Scout)**
   - Monitors live Threads search queries with `filter=recent`:
     * `need web developer`
     * `need website`
     * `hiring developer`
     * `looking for web developer`
     * `need shopify developer`
     * `design my website budget`
     * `website developer required`
   - Parses DOM `div[data-pressable-container="true"]` nodes to extract author, content, and direct permalink.

2. **Agent 2: IntentGatekeeperAgent (Buyer Intent & Budget Extractor)**
   - Classifies posts for genuine buyer intent.
   - Extracts explicit budgets (£, $, PKR, AED) and timelines.
   - Eliminates seller spam (freelancers advertising their own portfolios).

3. **Agent 3: AntiSlopHumanizerAgent (Gemini 3.8 Flash Vision/Reasoning)**
   - **Model:** `gemini-3.8-flash`
   - **Anti-AI Slop Engine:** Eliminates all robotic AI tells:
     * ❌ ZERO throat-clearing openings ("I hope you're doing well", "Here's the thing").
     * ❌ ZERO AI buzzwords ("delve", "game-changer", "cutting-edge", "seamlessly", "revolutionize", "tapestry").
     * ❌ ZERO adverb clutter ("genuinely", "truly", "really", "literally").
     * ✅ Direct, peer-to-peer human founder tone.
     * ✅ Low-friction call to action offering a quick 1-minute video demo or portfolio link.
     * ✅ Strictly under 55 words.

4. **Agent 4: DispatcherLedgerAgent (Telegram & Git Ledger)**
   - Dispatches instant rich Telegram alerts to Mustafa's phone.
   - Stores deduplicated hashes in `seen_threads_posts.json`.
   - Records full lead history in `captured_leads.json`.

---

### ⏱️ Schedule
* **24/7 Cloud Autopilot:** Every 5 minutes (`*/5 * * * *`) via GitHub Actions.
* **1-Click Windows Launcher:** Double-click `run-threads-radar.bat`.
