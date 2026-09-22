import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Cpu, Sparkles } from 'lucide-react';

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

  return (
    <section id="architecture" className="relative py-28 bg-[#0D0E12] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-ember/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider">Solution Architecture Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Scalable Engineering Deployments <br />
            <span className="text-gradient-orange">Tailored to Your Operations</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            We architect solutions based on operational scope and technical complexity. Every engagement is custom-scoped following a comprehensive engineering discovery call.
          </p>
        </div>

        {/* 3-Column Architecture Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.isFeatured
                  ? 'bg-obsidian-900 border-2 border-ember shadow-glow-md scale-100 lg:-translate-y-2'
                  : 'bg-obsidian-850/90 border border-white/10 hover:border-white/20'
              }`}
            >
              {tier.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-ember to-tangerine text-white text-[10px] font-mono uppercase tracking-widest font-bold shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Architecture Tier
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {tier.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed min-h-[50px]">
                  {tier.tagline}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-zinc-400">
                  <span className="text-white font-semibold">Ideal Fit: </span>
                  {tier.idealFor}
                </div>

                {/* Architecture Highlights */}
                <div className="mt-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ember font-bold mb-3">
                    System Architecture:
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {tier.architectureHighlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-ember flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3">
                    Scope &amp; Deliverables:
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom SLA & CTA */}
              <div className="mt-8 pt-5 border-t border-white/10">
                <div className="text-[11px] text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tier.slaSupport}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenContact}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    tier.isFeatured
                      ? 'bg-gradient-to-r from-ember to-tangerine text-white shadow-glow-sm hover:shadow-glow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
