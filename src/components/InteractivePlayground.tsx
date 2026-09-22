import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import {
  Sparkles,
  Play,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Scenario {
  id: string;
  title: string;
  industry: string;
  inputPrompt: string;
  steps: {
    title: string;
    detail: string;
    latency: string;
    icon: string;
  }[];
  businessOutcome: string;
  manualHoursSaved: string;
  responseSpeed: string;
}

export const InteractivePlayground: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const scenarios: Scenario[] = [
    {
      id: 'restaurant',
      title: 'Restaurant Table Reservation & Menu Bot',
      industry: 'Hospitality',
      inputPrompt: 'Guest asks via WhatsApp: "Hi, do you have a table for 4 tonight at 8 PM, and do you offer vegetarian options?"',
      steps: [
        {
          title: 'Inbound WhatsApp Webhook Captured',
          detail: 'Meta Cloud API delivers incoming message payload to GROWECH Event Broker.',
          latency: '0.2s',
          icon: 'Send',
        },
        {
          title: 'Intent & Entity Extraction',
          detail: 'AI agent identifies: Party size: 4, Date: Tonight, Time: 20:00, Dietary: Vegetarian.',
          latency: '0.6s',
          icon: 'Bot',
        },
        {
          title: 'Table Management Database Check',
          detail: 'Queries floor management API for 4-top availability at 8:00 PM (Table #14 confirmed).',
          latency: '0.4s',
          icon: 'Database',
        },
        {
          title: 'Automated Response & Dietary Link Dispatch',
          detail: 'Dispatches confirmed reservation code + vegetarian menu link directly to guest WhatsApp.',
          latency: '0.3s',
          icon: 'CheckCircle',
        },
      ],
      businessOutcome: 'Zero staff phone interruptions during dinner rush. Complete contact captured for loyalty updates.',
      manualHoursSaved: '15+ hrs/week',
      responseSpeed: '< 2.0s',
    },
    {
      id: 'realestate',
      title: 'Real Estate Investor Qualification & Brochure Delivery',
      industry: 'Real Estate',
      inputPrompt: 'Portal lead enters WhatsApp: "Interested in the 3-bedroom penthouse in Dubai Marina. What is the handover date and payment plan?"',
      steps: [
        {
          title: 'Lead Ingest & Number Verification',
          detail: 'Validates phone country code and checks CRM for prior broker interaction history.',
          latency: '0.3s',
          icon: 'Send',
        },
        {
          title: 'Investor Criteria Assessment',
          detail: 'Conversational agent parses budget tier, residency status, and required completion date.',
          latency: '0.5s',
          icon: 'Bot',
        },
        {
          title: 'Dynamic Asset Dispatch',
          detail: 'Sends encrypted PDF property prospectus and floor plans directly inside WhatsApp.',
          latency: '0.5s',
          icon: 'Database',
        },
        {
          title: 'VIP Broker Calendar Synchronization',
          detail: 'Routes qualified lead record to assigned broker and schedules viewing slot.',
          latency: '0.4s',
          icon: 'Calendar',
        },
      ],
      businessOutcome: 'Immediate engagement while prospect interest is highest. Unqualified inquiries filtered automatically.',
      manualHoursSaved: '25+ hrs/week',
      responseSpeed: '< 2.5s',
    },
    {
      id: 'clinic',
      title: 'Clinic 24/7 Patient Triage & Consultation Booking',
      industry: 'Healthcare',
      inputPrompt: 'Patient message at 11:30 PM: "Need an urgent dermatology appointment with Dr. Sarah for eczema flare-up."',
      steps: [
        {
          title: 'After-Hours Patient Query Intake',
          detail: 'Secure encrypted session initiated outside standard clinic operating hours.',
          latency: '0.2s',
          icon: 'Send',
        },
        {
          title: 'Specialist Schedule Lookup',
          detail: 'Grounded query checks Dr. Sarah dermatology availability for next morning slots.',
          latency: '0.5s',
          icon: 'Database',
        },
        {
          title: 'Pre-Visit Preparation Guidelines',
          detail: 'Shares clinical guidance on topical lotions to avoid 12 hours prior to skin check.',
          latency: '0.4s',
          icon: 'Bot',
        },
        {
          title: 'Instant SMS / WhatsApp Slot Confirmation',
          detail: 'Reserves 9:30 AM appointment and sends Google Maps clinic entrance pin.',
          latency: '0.3s',
          icon: 'CheckCircle',
        },
      ],
      businessOutcome: 'Captures patients who search in the evening. Front-desk phone queue reduced by 65%.',
      manualHoursSaved: '20+ hrs/week',
      responseSpeed: '< 1.8s',
    },
  ];

  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(scenarios[0].steps.length);

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const promptBoxRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger for smooth lab container reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelectScenario = (s: Scenario) => {
    if (s.id === activeScenario.id) return;
    setActiveScenario(s);
    setCurrentStepIndex(s.steps.length);
    setIsRunning(false);

    if (promptBoxRef.current) {
      animate(promptBoxRef.current, {
        opacity: [0.4, 1],
        translateY: [6, 0],
        duration: 350,
        ease: 'outQuad',
      });
    }
  };

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStepIndex(step);

      // Anime.js bounce on active step card
      const stepEls = document.querySelectorAll('.sim-step-card');
      if (stepEls[step - 1]) {
        animate(stepEls[step - 1], {
          scale: [0.97, 1.02, 1],
          duration: 400,
          ease: 'outBack',
        });
      }

      if (step >= activeScenario.steps.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 650);
  };

  return (
    <section ref={sectionRef} id="playground" className="relative py-28 bg-[#FAFAFA] text-zinc-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-ember" />
            <span className="font-mono uppercase tracking-wider">Discover the Realm</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-zinc-950">
            Interactive Automation <br />
            <span className="text-ember">Workflow Simulation Lab</span>
          </h2>

          <p className="mt-4 text-base text-zinc-600">
            Experience how GROWECH orchestrates multi-system tasks in real time. Choose an industry scenario below to trigger a live simulated execution flow.
          </p>
        </div>

        {/* Soft Curved Capsule Container */}
        <div
          ref={containerRef}
          className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl p-6 sm:p-10 relative overflow-hidden will-change-transform"
        >
          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeScenario.id === s.id
                    ? 'bg-zinc-950 text-white shadow-md scale-[1.02]'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <span className="text-ember mr-1.5 font-bold">[{s.industry}]</span>
                <span>{s.title.split('&')[0]}</span>
              </button>
            ))}
          </div>

          {/* Prompt Capsule Input Box */}
          <div
            ref={promptBoxRef}
            className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 will-change-transform"
          >
            <div className="flex-1">
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Inbound Trigger Event:
              </div>
              <div className="text-sm font-medium text-zinc-900 font-mono">
                {activeScenario.inputPrompt}
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`px-5 py-2.5 rounded-full text-xs font-bold text-white flex items-center gap-2 transition-all shadow-sm ${
                isRunning
                  ? 'bg-zinc-400 cursor-not-allowed'
                  : 'bg-ember hover:bg-ember-600 active:scale-95 shadow-glow-sm'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Simulated Pipeline</span>
                </>
              )}
            </button>
          </div>

          {/* Sequential Step Execution Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {activeScenario.steps.map((step, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex && isRunning;

              return (
                <div
                  key={idx}
                  className={`sim-step-card p-4 rounded-2xl border transition-all duration-300 relative will-change-transform ${
                    isPassed
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                      : isCurrent
                      ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-300/40'
                      : 'bg-zinc-50/60 border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
                    <span className="font-bold text-zinc-700">STAGE {idx + 1}</span>
                    <span className={isPassed ? 'text-emerald-600 font-bold' : ''}>
                      {isPassed ? '✓ ' + step.latency : step.latency}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-zinc-900 mb-1 leading-snug">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-zinc-600 leading-relaxed">
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulated Business Impact Summary Bar */}
          <div className="p-5 rounded-2xl bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Response Lag</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {activeScenario.responseSpeed}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Staff Hours Saved</div>
                <div className="text-base font-bold text-ember font-mono">
                  {activeScenario.manualHoursSaved}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Outcome</div>
                <div className="text-xs text-zinc-300 max-w-sm">
                  {activeScenario.businessOutcome}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenContact}
              className="px-5 py-2 rounded-full text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors whitespace-nowrap flex items-center gap-1.5 active:scale-95"
            >
              <span>Build This For My Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
