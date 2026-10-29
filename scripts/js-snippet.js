
    // ==========================================
    // INTERACTIVE ENGINES FOR ADVANCED MODULES
    // ==========================================

    // 1. ICU Real-Time Animated ECG Waveform Simulator
    let ecgAnimationId = null;
    let ecgOffset = 0;
    let ecgRhythmType = 'sinus';

    function initIcuEcgCanvas() {
      const canvas = document.getElementById('icuEcgCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (ecgAnimationId) cancelAnimationFrame(ecgAnimationId);

      function drawGrid() {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
      }

      function getEcgY(t) {
        const midY = canvas.height / 2;
        const phase = t % 100;
        
        if (ecgRhythmType === 'tachy') {
          // Rapid tachycardia
          const tachyPhase = t % 50;
          if (tachyPhase > 15 && tachyPhase < 20) return midY - 60; // QRS
          if (tachyPhase >= 20 && tachyPhase < 25) return midY + 30;
          if (tachyPhase >= 30 && tachyPhase < 40) return midY - 15; // T wave
          return midY;
        } else if (ecgRhythmType === 'brady') {
          // Slow bradycardia
          const bradyPhase = t % 180;
          if (bradyPhase > 40 && bradyPhase < 50) return midY - 10; // P
          if (bradyPhase >= 60 && bradyPhase < 65) return midY - 70; // QRS
          if (bradyPhase >= 65 && bradyPhase < 70) return midY + 35;
          if (bradyPhase >= 85 && bradyPhase < 105) return midY - 20; // T
          return midY;
        } else if (ecgRhythmType === 'st') {
          // ST Elevation
          if (phase > 20 && phase < 28) return midY - 10; // P
          if (phase >= 35 && phase < 40) return midY - 70; // R
          if (phase >= 40 && phase < 45) return midY + 15; // S
          if (phase >= 45 && phase < 70) return midY - 35; // Elevated ST segment
          return midY;
        } else {
          // Normal Sinus
          if (phase > 20 && phase < 28) return midY - 12; // P wave
          if (phase >= 36 && phase < 40) return midY + 15; // Q
          if (phase >= 40 && phase < 45) return midY - 75; // R peak
          if (phase >= 45 && phase < 50) return midY + 30; // S wave
          if (phase >= 60 && phase < 75) return midY - 20; // T wave
          return midY;
        }
      }

      function renderFrame() {
        drawGrid();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
          const y = getEcgY(x + ecgOffset);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ecgOffset += (ecgRhythmType === 'tachy' ? 3.5 : (ecgRhythmType === 'brady' ? 1.2 : 2));
        ecgAnimationId = requestAnimationFrame(renderFrame);
      }

      renderFrame();
    }

    function changeEcgRhythm(val) {
      ecgRhythmType = val;
      const hrEl = document.getElementById('icuHeartRate');
      if (hrEl) {
        if (val === 'tachy') hrEl.innerText = '138';
        else if (val === 'brady') hrEl.innerText = '44';
        else if (val === 'st') hrEl.innerText = '92';
        else hrEl.innerText = '74';
      }
      playChime('beep');
    }

    // 2. Emergency Resuscitation Engine
    function admitErPatient() {
      const alias = document.getElementById('erAliasInput')?.value || 'Trauma-Unknown-Male';
      alert(`[ER CODE RED INTAKE] STAT Patient "${alias}" registered! Resuscitation bed ETW-01 allocated. Trauma team dispatched.`);
      addResuscitationLog(`Patient ${alias} admitted directly to ETW-01 &bull; Crash Cart activated`);
      playChime('dingdong');
    }

    function addResuscitationLog(actionText) {
      const stream = document.getElementById('erResuscitationLogStream');
      if (!stream) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const item = document.createElement('div');
      item.className = 'p-3 rounded-xl bg-dark-950 border border-white/5 flex items-start gap-3 text-xs animate-fadeIn';
      item.innerHTML = `
        <span class="font-mono text-[10px] text-brand-teal font-bold px-2 py-0.5 rounded bg-brand-teal/10">${timeStr}</span>
        <div class="flex-1">
          <div class="font-semibold text-white">${actionText}</div>
          <div class="text-[11px] text-slate-400">Logged by Attending ER Physician &bull; Verified in EHR</div>
        </div>
      `;
      stream.prepend(item);
      playChime('beep');
    }

    // 3. PACU Aldrete Scoring Engine
    function updateAldreteScore() {
      const m = parseInt(document.getElementById('aldreteMotor')?.value || '2', 10);
      const r = parseInt(document.getElementById('aldreteResp')?.value || '2', 10);
      const c = parseInt(document.getElementById('aldreteCirc')?.value || '2', 10);
      const k = parseInt(document.getElementById('aldreteConsc')?.value || '2', 10);
      const o = parseInt(document.getElementById('aldreteO2')?.value || '2', 10);
      const total = m + r + c + k + o;

      const scoreEl = document.getElementById('aldreteScoreDisplay');
      if (scoreEl) {
        scoreEl.innerText = `${total} / 10`;
        if (total >= 9) {
          scoreEl.className = 'font-mono text-base font-black text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40';
        } else {
          scoreEl.className = 'font-mono text-base font-black text-amber-400 px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40';
        }
      }
    }

    // 4. Interactive Hospital Automation Pipeline Runner
    function executeAutomation(pipelineId) {
      const names = [
        '',
        'Appointment Booking -> Smart Token -> Web Audio Chime',
        'Doctor E-Prescription -> Allergy Screening -> FEFO Pharmacy Dispense',
        'Diagnostic Lab Order -> Vector SVG Code128 Barcode -> Panic Alert',
        'Polytrauma Code Red -> Hospital-Wide Code Blue Siren -> Bed ETW-01',
        '4-Gate Discharge (Doctor, Nurse, Pharmacy, Cashier) -> Bed Cleaning Cycle',
        'Cashier Shift Closing -> Multi-Tender Reconciliation (Cash/Card/Raast)',
        'Multi-Branch Switcher (Karachi PKR, Dubai AED, London GBP)',
        'Automated WhatsApp Telehealth Notification Broadcast'
      ];
      alert(`[HOSPITAL AUTOMATION #${pipelineId} EXECUTED]\nPipeline: ${names[pipelineId]}\nStatus: Complete with 0 errors & real-time state mutation.`);
      playChime('dingdong');
    }

    // 5. Conversational AI Receptionist Simulator (Roman Urdu & English)
    function askAiAssistant(question) {
      const input = document.getElementById('aiChatInput');
      if (input) input.value = question;
      submitAiQuery();
    }

    function submitAiQuery() {
      const input = document.getElementById('aiChatInput');
      const stream = document.getElementById('aiChatStream');
      if (!input || !stream || !input.value.trim()) return;

      const userText = input.value.trim();
      input.value = '';

      // User Bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'p-3 rounded-xl bg-white/10 text-white text-xs space-y-1 self-end max-w-[85%] ml-auto';
      userBubble.innerHTML = `<div class="font-bold text-[10px] text-slate-300">YOU:</div><p>${userText}</p>`;
      stream.appendChild(userBubble);

      // AI Response Engine
      let reply = "Ji bilkul! Growech Care hospital management system mein aap ki request verify ho chuki hai. Mazeed maloomat ke liye hamare WhatsApp helpline +92 309 8178527 par rabta karein.";
      const lower = userText.toLowerCase();

      if (lower.includes('mustafa') || lower.includes('timing') || lower.includes('schedule')) {
        reply = "Dr. Mustafa Shaikh (Medical Director / Surgery) ki OPD timings Monday se Saturday, subah 10:00 AM se 02:00 PM tak hain. Consultation Room 304 mein tashreef layein.";
      } else if (lower.includes('cardio') || lower.includes('appointment')) {
        reply = "Cardiology consultation ke liye Dr. Ayesha Al-Zahra (MRCP, FACC) available hain. Aap Reception Kiosk se instant token generate kar sakte hain ya online WhatsApp pass book kar sakte hain.";
      } else if (lower.includes('ambulance') || lower.includes('emergency') || lower.includes('number')) {
        reply = "Emergency Ambulance Hotline: +92 309 8178527 ya hospital direct line par rabta karein. Hamari ACLS Mobile ICU Unit AMB-01 24/7 on-call dispatch ke liye ready hai.";
      } else if (lower.includes('sehat') || lower.includes('panel') || lower.includes('insurance')) {
        reply = "Ji haan! Government of Pakistan ka Sehat Sahulat Card aur corporate insurance panels (EFU, Jubilee, Adamjee) Growech Care billing desk par 100% cashless pre-authorized hain.";
      }

      setTimeout(() => {
        const aiBubble = document.createElement('div');
        aiBubble.className = 'p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 text-xs space-y-1 self-start max-w-[85%]';
        aiBubble.innerHTML = `<div class="font-bold text-[10px] text-indigo-300">🤖 GROWECH AI ASSISTANT:</div><p>${reply}</p>`;
        stream.appendChild(aiBubble);
        stream.scrollTop = stream.scrollHeight;
        playChime('dingdong');
      }, 300);

      stream.scrollTop = stream.scrollHeight;
    }
