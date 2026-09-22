import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { servicesData, ServiceDetail } from '../data/services';
import {
  MessageSquare,
  Bot,
  Layout,
  Cpu,
  ShoppingCart,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Bot,
  Layout,
  Cpu,
  ShoppingCart,
  Zap,
  Sparkles,
  Layers,
};

export const InvertedSection: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail>(servicesData[0]);
  const [simulatingStep, setSimulatingStep] = useState(2);

  const capabilityChips = [
    'Custom Business Websites',
    'High-Converting Landing Pages',
    'Official WhatsApp Cloud API',
    'Autonomous Multi-Agent Workflows',
    'Headless E-Commerce Engineering',
    'Lead Qualification Pipelines',
    'Core Web Vitals 99+ Speed',
    'Zero Server Maintenance',
  ];

  return (
    <section
      id="solutions"
      className="relative py-28 bg-[#FFFFFF] text-zinc-900 transition-colors duration-500 overflow-hidden"
    >
      {/* Top transition wave/divider */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#0A0A0B] to-transparent opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-ember border border-zinc-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            <span className="font-mono uppercase tracking-wider">Websites &bull; AI Automation &bull; Lead Systems</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 font-display">
            High-Converting Websites &amp; <br />
            <span className="text-ember">Intelligent Business Automation</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            A winning digital strategy requires both high-impact digital presence and frictionless operations. GROWECH builds bespoke, blazing-fast websites that turn visitors into qualified inquiries, paired with automated WhatsApp and AI pipelines that handle follow-ups, bookings, and customer operations 24/7.
          </p>

          {/* Staggered Tag Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {capabilityChips.map((chip, idx) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300/80 transition-colors cursor-default"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Split Layout: Interactive Dark Card vs Business Value    */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Dark Glowing Card (Workflow Simulator) */}
          <div className="lg:col-span-5 bg-obsidian-900 rounded-3xl p-6 sm:p-8 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
            {/* Ambient orange glow in the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ember/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ember animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                  Live Workflow Execution
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400">
                ACTIVE PIPELINE
              </span>
            </div>

            {/* Workflow steps interactive display */}
            <div className="space-y-4 relative">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>STEP 1: INBOUND CAPTURE</span>
                  <span className="text-emerald-400 font-semibold">Instant (0.4s)</span>
                </div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-ember" />
                  <span>Customer sends inquiry via official WhatsApp Cloud API</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-ember/40 shadow-glow-sm">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>STEP 2: INTENT &amp; QUALIFICATION</span>
                  <span className="text-ember font-semibold">Autonomous AI</span>
                </div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-ember" />
                  <span>AI Agent extracts requirements against business guidelines</span>
                </div>
                <div className="mt-2 text-xs bg-obsidian-950 p-2.5 rounded-lg font-mono text-zinc-300 border border-white/5">
                  &ldquo;Extracted: VIP Consultation &bull; Budget: Verified &bull; Slot: Tomorrow 3:00 PM&rdquo;
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>STEP 3: SYSTEM ACTION &amp; CRM SYNC</span>
                  <span className="text-emerald-400 font-semibold">2-Way Webhook</span>
                </div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-ember" />
                  <span>Calendar slot reserved &bull; Record synced to CRM database</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>STEP 4: CONFIRMATION &amp; TEAM NOTIFICATION</span>
                  <span className="text-zinc-400 font-semibold">Automated</span>
                </div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Interactive confirmation sent to customer &bull; Team alert pushed</span>
                </div>
              </div>
            </div>

            {/* Impact Metric callout */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-400">Manual Handling Saved</div>
                <div className="text-xl font-bold text-white font-mono">100% Automated</div>
              </div>
              <button
                onClick={onOpenContact}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-ember hover:bg-ember-600 transition-colors flex items-center gap-1.5 shadow-glow-sm"
              >
                <span>Automate This</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Deep Business Value Breakdown & Service Navigation */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Service selector tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {servicesData.slice(0, 4).map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedService.id === srv.id
                      ? 'bg-zinc-950 text-white shadow-md'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {srv.title.split(' ')[0]} {srv.title.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Selected Service Card Detailed Breakdown */}
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-ember font-bold">
                  {selectedService.category}
                </span>
                <span className="text-xs text-zinc-600 font-mono">GROWECH ENGINEERING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-display">
                {selectedService.title}
              </h3>
              <p className="mt-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
                {selectedService.shortDescription}
              </p>

              {/* Problem vs Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm">
                  <div className="text-xs font-mono font-bold text-red-600 uppercase mb-1">
                    The Business Problem
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {selectedService.problem}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                  <div className="text-xs font-mono font-bold text-emerald-600 uppercase mb-1">
                    The GROWECH Solution
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {selectedService.solution}
                  </p>
                </div>
              </div>

              {/* What GROWECH Builds */}
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-bold mb-3">
                  What GROWECH Builds For You:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.whatWeBuild.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-800 bg-white p-3 rounded-xl border border-zinc-200/60">
                      <CheckCircle className="w-4 h-4 text-ember flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact Metrics (Credible, No Fake Stats) */}
              <div className="mt-6 pt-5 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-ember flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-zinc-600 uppercase font-bold">Response Speed</div>
                    <div className="text-xs text-zinc-800 font-medium">{selectedService.responseTimeImprovement}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-ember flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-zinc-600 uppercase font-bold">Work Reduction</div>
                    <div className="text-xs text-zinc-800 font-medium">{selectedService.manualWorkReduction}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-ember flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-mono text-zinc-600 uppercase font-bold">Operations</div>
                    <div className="text-xs text-zinc-800 font-medium">{selectedService.businessImpact}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
