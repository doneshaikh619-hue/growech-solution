import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { Check, ArrowRight, ShieldCheck, Zap, Cpu, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ArchitectureTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  isFeatured?: boolean;
  idealFor: string;
  architectureHighlights: string[];
  deliverables: string[];
  slaSupport: string;
  ctaText: string;
}

export const ArchitectureTiers: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const featuredBadgeRef = useRef<HTMLDivElement | null>(null);

  const tiers: ArchitectureTier[] = [
    {
      id: 'core-web',
      name: 'Core Web & Digital Presence',
      tagline: 'High-performance bespoke frontend platform built for brand authority and sub-second loading.',
      idealFor: 'Growing businesses, boutique firms, and service providers upgrading from slow legacy templates.',
      architectureHighlights: [
        'React / Next.js / Vite custom modern architecture',
        'Top-tier Core Web Vitals optimization (95+ Lighthouse)',
        'Full semantic HTML5 & Schema.org JSON-LD indexing',
        'Mobile-first responsive UX with custom micro-animations',
      ],
      deliverables: [
        'Custom interactive agency-grade design system',
        'Lead capture funnels with instant validation',
        'Direct WhatsApp click-to-chat integration hooks',
        'Global CDN caching and automated SSL security',
        'Complete source code ownership & zero platform lock-in',
      ],
      slaSupport: 'Dedicated deployment guarantee + 30 days post-launch warranty',
      ctaText: 'Discuss Web Platform',
    },
    {
      id: 'automation-suite',
      name: 'Intelligent Operations & WhatsApp Funnels',
      badge: 'MOST IN-DEMAND ARCHITECTURE',
      tagline: 'Official WhatsApp Business Cloud API integration paired with automated lead qualification.',
      isFeatured: true,
      idealFor: 'Restaurants, clinics, real estate brokerages, and e-commerce stores handling frequent customer inquiries.',
      architectureHighlights: [
        'Official Meta Cloud API architecture (zero ban risk)',
        'Automated multi-step qualification & triage dialogues',
        'Bi-directional CRM & Google Calendar synchronization',
        'Automated appointment confirmations & reminder triggers',
      ],
      deliverables: [
        'Everything in Core Web Platform',
        'Official Meta WhatsApp Business Cloud verification',
        'Automated catalog, booking, or quote inquiry flows',
        'Multi-agent shared team inbox configuration',
        'Webhook connectors to your CRM (HubSpot, Zoho, Sheets)',
        'Automated customer satisfaction & review collection',
      ],
      slaSupport: 'Priority technical maintenance + quarterly Meta API version updates',
      ctaText: 'Discuss Automation Suite',
    },
    {
      id: 'enterprise-ai',
      name: 'Autonomous Enterprise AI Systems',
      tagline: 'Custom task-oriented AI agents, internal knowledge retrieval (RAG), and end-to-end workflow automation.',
      idealFor: 'Trade firms, logistics agencies, multi-location operators, and tech-forward businesses scaling transaction volume.',
      architectureHighlights: [
        'Proprietary RAG knowledge bases with strict guardrails',
        'Automated PDF, invoice, and document data extraction',
        'Custom multi-agent tool execution and deterministic fallbacks',
        'Enterprise data isolation with zero third-party training',
      ],
      deliverables: [
        'Everything in Automation Suite',
        'Custom AI agent trained on your company SOPs & knowledge',
        'Human-in-the-loop validation dashboards for sensitive operations',
        'Automated cross-department document routing & processing',
        'Custom internal staff administrative portals',
        'Dedicated technical scoping & executive team training',
      ],
      slaSupport: 'Custom Enterprise SLA with dedicated engineering team review',
      ctaText: 'Discuss Enterprise AI',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tier-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    if (featuredBadgeRef.current) {
      animate(featuredBadgeRef.current, {
        scale: [1, 1.05, 1],
        duration: 2200,
        loop: true,
        ease: 'inOutSine',
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="architecture" className="relative py-28 bg-[#0D0E12] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-ember/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider">Solution Architecture Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Scalable Business Architectures <br />
            <span className="text-gradient-orange">Engineered to Your Exact Scope</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            We avoid rigid package tiers. Every proposal is custom-scoped to your technical requirements, CRM endpoints, and growth goals after an architectural discovery consultation.
          </p>
        </div>

        {/* 3 Architecture Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`tier-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 will-change-transform ${
                tier.isFeatured
                  ? 'bg-obsidian-900 border-2 border-ember shadow-glow-md relative lg:-translate-y-3 z-10'
                  : 'bg-obsidian-950/70 border border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                {/* Featured Badge */}
                {tier.badge && (
                  <div
                    ref={featuredBadgeRef}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-ember to-tangerine text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-4 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{tier.badge}</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold font-display text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  {tier.tagline}
                </p>

                {/* Scoping Notice */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                  <div className="text-[10px] font-mono uppercase text-ember font-bold mb-1">
                    Ideal Fit:
                  </div>
                  <div className="text-xs text-zinc-300">{tier.idealFor}</div>
                </div>

                {/* Architecture Highlights */}
                <div className="mb-6 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    Technical Specifications:
                  </div>
                  {tier.architectureHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Zap className="w-3.5 h-3.5 text-ember flex-shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    What We Engineer &amp; Deliver:
                  </div>
                  {tier.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SLA & CTA Button */}
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-4 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                  <span>{tier.slaSupport}</span>
                </div>

                <button
                  onClick={onOpenContact}
                  className={`w-full py-3.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    tier.isFeatured
                      ? 'bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine text-white shadow-glow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
