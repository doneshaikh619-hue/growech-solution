import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { useMouseSpotlight } from '../hooks/useMouseSpotlight';
import {
  MessageSquare,
  Bot,
  Gauge,
  Workflow,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '' }) => {
  const { handleMouseMove, handleMouseLeave, spotlightStyle } = useMouseSpotlight();

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bento-card relative rounded-3xl p-6 sm:p-8 bg-obsidian-850/80 border border-white/10 hover:border-ember/40 transition-colors duration-300 overflow-hidden group will-change-transform ${className}`}
    >
      {/* Interactive Cursor Spotlight with 0 React re-renders */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl z-0"
        style={spotlightStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const BentoGrid: React.FC<{ onOpenContact: () => void }> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const flowLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. GSAP ScrollTrigger Staggered 3D Perspective Reveal
      gsap.fromTo(
        '.bento-card',
        {
          opacity: 0,
          y: 45,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    // 2. Anime.js High-Tech Counter for 99+ Lighthouse Score
    let counterObj = { val: 0 };
    const counterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && counterRef.current) {
          animate(counterObj, {
            val: 99,
            duration: 1400,
            ease: 'outExpo',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(counterObj.val)}+`;
              }
            },
          });
          counterObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (counterRef.current) {
      counterObserver.observe(counterRef.current);
    }

    return () => {
      ctx.revert();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bento"
      className="relative py-28 sm:py-32 bg-[#0A0A0B] text-white overflow-hidden"
    >
      {/* Background Ember Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-ember/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-mono uppercase tracking-wider">Engineered Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Unleash Operational Velocity <br />
              <span className="text-gradient-orange">Without Headcount Bloat</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-zinc-400">
            Every system we engineer is designed for resilience, sub-second execution speed, and direct integration with your existing business tools.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Official WhatsApp Cloud API (Large span 2 col) */}
          <BentoCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-ember inline-flex shadow-inner">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Meta Verified Cloud API
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Official WhatsApp Business Automation
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Connect directly with Meta&apos;s enterprise cloud endpoints. Prevent account suspensions, enable simultaneous multi-agent customer support, and automate interactive booking flows directly inside WhatsApp.
              </p>
            </div>

            {/* Micro visual: Chat dialog snippet */}
            <div className="mt-6 p-3 rounded-xl bg-obsidian-950/80 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>SIMULATED CHAT ENGINE</span>
                <span className="text-ember font-semibold">Latency: 0.8s</span>
              </div>
              <div className="flex gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-2xl rounded-tl-none bg-white/10 text-zinc-300">
                  &ldquo;I&apos;d like to book a consultation for tomorrow at 2 PM.&rdquo;
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-2xl rounded-tr-none bg-gradient-to-r from-ember/90 to-tangerine text-white font-medium shadow-glow-sm">
                  &ldquo;Verified! Slot held for tomorrow 2:00 PM. Confirmation sent to your calendar.&rdquo;
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Autonomous AI Agents (Span 1 or 2) */}
          <BentoCard className="md:col-span-1 lg:col-span-2 flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-ember inline-flex shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-zinc-400">RAG + Guardrails</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Proprietary AI Knowledge Agents
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Trained exclusively on your company documents, SOPs, and product manuals. Our strict deterministic guardrails completely eliminate AI hallucination.
              </p>
            </div>

            {/* Telemetry micro pills */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors">
                <div className="text-[11px] text-zinc-500 font-mono">Accuracy Target</div>
                <div className="text-lg font-bold text-white font-mono">Deterministic</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-colors">
                <div className="text-[11px] text-zinc-500 font-mono">Fallback Mode</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">Human Routing</div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Bespoke Websites & Headless E-Commerce (Span 1) */}
          <BentoCard className="md:col-span-1 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-ember inline-flex mb-4 shadow-inner">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display">Bespoke Web &amp; E-Commerce</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Custom responsive websites and high-converting landing pages built with React, Vite, and Tailwind, engineered for sub-second speeds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span
                ref={counterRef}
                className="text-2xl font-extrabold text-emerald-400 font-mono"
              >
                99+
              </span>
              <span className="text-[10px] uppercase font-mono text-zinc-500">Google Lighthouse</span>
            </div>
          </BentoCard>

          {/* Card 4: Multi-Step Business Workflows (Span 2) */}
          <BentoCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-ember inline-flex shadow-inner">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-zinc-400">Zero Manual Transfer</span>
              </div>
              <h4 className="text-lg font-bold font-display">End-to-End Workflow Pipelines</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Connect billing, customer forms, cloud storage, and task assignment into automated pipelines that execute automatically upon event triggers.
              </p>
            </div>
            <div
              ref={flowLineRef}
              className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300"
            >
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Inbound Form</span>
              <span className="text-ember">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">AI Extraction</span>
              <span className="text-ember">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-ember/20 text-ember border border-ember/30 font-semibold shadow-glow-sm">Auto CRM</span>
            </div>
          </BentoCard>

          {/* Card 5: Enterprise Security & Compliance (Span 1) */}
          <BentoCard className="md:col-span-1 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-ember inline-flex mb-4 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display">Zero Data Leakage</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Strict enterprise privacy. Your internal company records are never used to train public AI models.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
              <Lock className="w-4 h-4 text-ember" />
              <span>AES-256 Encrypted</span>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
