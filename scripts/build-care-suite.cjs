const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'care', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update the sidebar navigation to include all 5 categories and 22 tabs
const oldSidebarNavRegex = /<!-- NAVIGATION SIDEBAR -->[\s\S]*?<\/nav>/;

const newSidebarNav = `<!-- NAVIGATION SIDEBAR -->
    <nav class="w-16 md:w-60 bg-dark-900 border-r border-white/10 flex flex-col justify-between p-2 md:p-3 flex-shrink-0 z-30">
      <div class="space-y-3 overflow-y-auto max-h-[calc(100vh-165px)] pr-1 custom-scroll">
        
        <!-- GROUP 1: CLINICAL & IPD -->
        <div>
          <div class="px-2 py-1 text-[9px] font-mono text-brand-teal font-bold uppercase tracking-wider hidden md:block">1. Clinical &amp; Inpatient</div>
          <div class="space-y-1 mt-0.5">
            <button onclick="switchTab('dashboard')" id="tabBtn-dashboard" class="nav-tab active w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all bg-brand-teal/15 text-brand-teal border border-brand-teal/30">
              <i data-lucide="layout-dashboard" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Dashboard</span>
            </button>
            <button onclick="switchTab('patients')" id="tabBtn-patients" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="users" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Patient EHR</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] font-mono text-slate-300" id="totalPatientsBadge">142</span>
            </button>
            <button onclick="switchTab('opd')" id="tabBtn-opd" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="stethoscope" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">OPD &amp; Triage</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-brand-amber/20 text-brand-amber text-[9px] font-mono font-bold" id="opdQueueBadge">6</span>
            </button>
            <button onclick="switchTab('er')" id="tabBtn-er" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="ambulance" class="w-4 h-4 flex-shrink-0 text-rose-400"></i>
              <span class="hidden md:inline text-rose-300">Emergency &amp; ER</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold animate-pulse">STAT</span>
            </button>
            <button onclick="switchTab('beds')" id="tabBtn-beds" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="bed" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Bed Matrix (IPD)</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-brand-rose/20 text-brand-rose text-[9px] font-mono font-bold">84%</span>
            </button>
            <button onclick="switchTab('ot')" id="tabBtn-ot" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="scissors" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Operating Theatre</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">OT-2</span>
            </button>
            <button onclick="switchTab('icu')" id="tabBtn-icu" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="heart-pulse" class="w-4 h-4 flex-shrink-0 text-emerald-400"></i>
              <span class="hidden md:inline text-emerald-300">ICU Telemetry</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">ECG</span>
            </button>
          </div>
        </div>

        <!-- GROUP 2: DIAGNOSTICS & PHARMACY -->
        <div>
          <div class="px-2 py-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider hidden md:block">2. Diagnostics &amp; Rx</div>
          <div class="space-y-1 mt-0.5">
            <button onclick="switchTab('lab')" id="tabBtn-lab" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="flask-conical" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Diagnostic Lab (LIS)</span>
            </button>
            <button onclick="switchTab('radiology')" id="tabBtn-radiology" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="scan" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Radiology &amp; PACS</span>
            </button>
            <button onclick="switchTab('pharmacy')" id="tabBtn-pharmacy" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="pill" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Pharmacy (FEFO)</span>
              <span class="ml-auto hidden md:inline-block px-1.5 py-0.2 rounded-full bg-brand-teal/20 text-brand-teal text-[9px] font-mono font-bold">3 Pend</span>
            </button>
          </div>
        </div>

        <!-- GROUP 3: FINANCE & REVENUE -->
        <div>
          <div class="px-2 py-1 text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider hidden md:block">3. Finance &amp; Panels</div>
          <div class="space-y-1 mt-0.5">
            <button onclick="switchTab('billing')" id="tabBtn-billing" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="receipt" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Billing &amp; Invoices</span>
            </button>
          </div>
        </div>

        <!-- GROUP 4: HOSPITAL OPERATIONS -->
        <div>
          <div class="px-2 py-1 text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider hidden md:block">4. Operations &amp; Infra</div>
          <div class="space-y-1 mt-0.5">
            <button onclick="switchTab('admin')" id="tabBtn-admin" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="settings" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Admin &amp; Setup</span>
            </button>
            <button onclick="switchTab('hr')" id="tabBtn-hr" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="user-cog" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">HR &amp; Doctor Rosters</span>
            </button>
            <button onclick="switchTab('bloodbank')" id="tabBtn-bloodbank" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="droplet" class="w-4 h-4 flex-shrink-0 text-rose-400"></i>
              <span class="hidden md:inline">Blood Bank</span>
            </button>
            <button onclick="switchTab('cssd')" id="tabBtn-cssd" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="shield-check" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">CSSD Sterilization</span>
            </button>
            <button onclick="switchTab('dietary')" id="tabBtn-dietary" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="utensils" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Dietary &amp; Kitchen</span>
            </button>
            <button onclick="switchTab('ambulance')" id="tabBtn-ambulance" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="truck" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Ambulance Fleet</span>
            </button>
            <button onclick="switchTab('biomedical')" id="tabBtn-biomedical" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="cpu" class="w-4 h-4 flex-shrink-0"></i>
              <span class="hidden md:inline">Biomedical Assets</span>
            </button>
          </div>
        </div>

        <!-- GROUP 5: PATIENT EXPERIENCE & AI -->
        <div>
          <div class="px-2 py-1 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden md:block">5. Patient &amp; AI Suite</div>
          <div class="space-y-1 mt-0.5">
            <button onclick="switchTab('portal')" id="tabBtn-portal" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="smartphone" class="w-4 h-4 flex-shrink-0 text-cyan-400"></i>
              <span class="hidden md:inline text-cyan-300">Patient Portal</span>
            </button>
            <button onclick="switchTab('whatsapp')" id="tabBtn-whatsapp" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="message-square" class="w-4 h-4 flex-shrink-0 text-emerald-400"></i>
              <span class="hidden md:inline text-emerald-300">WhatsApp Hub</span>
            </button>
            <button onclick="switchTab('automations')" id="tabBtn-automations" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="workflow" class="w-4 h-4 flex-shrink-0 text-amber-400"></i>
              <span class="hidden md:inline text-amber-300">8 Automations</span>
            </button>
            <button onclick="switchTab('ai')" id="tabBtn-ai" class="nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <i data-lucide="bot" class="w-4 h-4 flex-shrink-0 text-indigo-400"></i>
              <span class="hidden md:inline text-indigo-300">AI Assistants</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Sidebar Footer: Agency License & WhatsApp Direct -->
      <div class="pt-2 border-t border-white/10 hidden md:block">
        <div class="p-2.5 rounded-xl bg-gradient-to-br from-white/[0.04] to-brand-teal/10 border border-brand-teal/20 text-[11px]">
          <div class="font-bold text-white flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-brand-teal"></i>
            <span>Growech Solution</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">Need full turnkey deployment for your hospital?</p>
          <a href="https://wa.me/923098178527?text=Salam%20Growech%2C%20let%27s%20discuss%20hospital%20management%20system%20deployment" target="_blank" rel="noopener noreferrer" class="mt-2 w-full py-1 px-2 rounded-lg bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/40 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors">
            <span>+92 309 8178527</span>
            <i data-lucide="external-link" class="w-3 h-3"></i>
          </a>
        </div>
      </div>
    </nav>`;

content = content.replace(oldSidebarNavRegex, newSidebarNav);

// 2. Read the additional view sections from an external snippet
const viewsSnippetPath = path.join(__dirname, 'views-snippet.html');
const additionalViews = fs.readFileSync(viewsSnippetPath, 'utf8');

// Insert additionalViews right before </main>
content = content.replace('    </main>', additionalViews + '\n    </main>');

// 3. Update switchTab function in JS
const oldSwitchTabRegex = /function switchTab\(tabId\) \{[\s\S]*?lucide\.createIcons\(\);\s*\}/;

const newSwitchTab = `function switchTab(tabId) {
      state.activeTab = tabId;
      const tabs = [
        'dashboard', 'patients', 'opd', 'er', 'beds', 'ot', 'icu',
        'lab', 'radiology', 'pharmacy', 'billing', 'admin', 'hr',
        'bloodbank', 'cssd', 'dietary', 'ambulance', 'biomedical',
        'portal', 'whatsapp', 'automations', 'ai'
      ];
      
      tabs.forEach(t => {
        const viewEl = document.getElementById('view-' + t);
        const btnEl = document.getElementById('tabBtn-' + t);
        if (viewEl) {
          if (t === tabId) {
            viewEl.classList.remove('hidden');
          } else {
            viewEl.classList.add('hidden');
          }
        }
        if (btnEl) {
          if (t === tabId) {
            btnEl.className = 'nav-tab active w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all bg-brand-teal/15 text-brand-teal border border-brand-teal/30';
          } else {
            btnEl.className = 'nav-tab w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all';
          }
        }
      });
      playChime('beep');
      lucide.createIcons();
      if (tabId === 'icu') initIcuEcgCanvas();
    }`;

content = content.replace(oldSwitchTabRegex, newSwitchTab);

// 4. Append helper JS routines (ICU ECG animator, WHO Checklist toggles, Aldrete calculator, AI Receptionist, Automations runner)
const jsSnippetPath = path.join(__dirname, 'js-snippet.js');
const additionalJs = fs.readFileSync(jsSnippetPath, 'utf8');

content = content.replace('  </script>\n</body>', additionalJs + '\n  </script>\n</body>');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully enhanced public/care/index.html with all 22 modules, categorized navigation, and interactive engines!');
