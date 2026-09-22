import React from 'react';
import { ArrowUpRight, MessageSquare, ShieldCheck, Mail, Globe, Sparkles } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { servicesData } from '../data/services';
import { industriesData } from '../data/industries';

export const Footer: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  return (
    <footer className="relative bg-[#060607] text-white pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-ember/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Status & System Telemetry Bar */}
        <div className="pb-12 mb-12 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <LogoMark className="w-full h-full" glow={true} />
            </div>
            <div>
              <div className="text-xl font-bold font-display tracking-tight">
                growech <span className="text-ember font-normal">solution</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Web Development &bull; AI Automations &bull; Lead Systems
              </div>
            </div>
          </div>

          {/* Live System Operational Status */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">All Systems Operational (99.98% SLA)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ember" />
              <span className="text-zinc-300">Accepting Q3/Q4 Deployments</span>
            </div>
          </div>
        </div>

        {/* Multi-column Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-xs">
          {/* Col 1: About Agency */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold font-display text-white mb-3">About GROWECH SOLUTION</h4>
            <p className="text-zinc-400 leading-relaxed max-w-sm mb-4">
              A specialized digital agency empowering modern businesses to eliminate manual operational friction, build high-converting web architectures, deploy official WhatsApp bots, and implement custom AI agents.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenContact}
                className="px-4 py-2 rounded-full bg-ember text-white font-semibold text-xs hover:bg-ember-600 transition-colors flex items-center gap-1.5 shadow-glow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Talk to GROWECH</span>
              </button>
              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              >
                WhatsApp Direct
              </a>
            </div>
          </div>

          {/* Col 2: Core Engineering Services */}
          <div>
            <h4 className="text-sm font-bold font-display text-white mb-3">Core Solutions</h4>
            <ul className="space-y-2 text-zinc-400">
              {servicesData.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <a href="#solutions" className="hover:text-ember transition-colors">
                    {srv.title.split('&')[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Industry Architectures */}
          <div>
            <h4 className="text-sm font-bold font-display text-white mb-3">Target Sectors</h4>
            <ul className="space-y-2 text-zinc-400">
              {industriesData.slice(0, 5).map((ind) => (
                <li key={ind.id}>
                  <a href="#playground" className="hover:text-ember transition-colors">
                    {ind.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Capabilities & Trust */}
          <div>
            <h4 className="text-sm font-bold font-display text-white mb-3">Trust &amp; Compliance</h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                <span>Official Meta Cloud API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                <span>Zero Public AI Training</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                <span>Deterministic Guardrails</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                <span>Full Source Code Ownership</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                <span>No Monthly Vendor Lock-in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI & Crawler Entity Discoverability Index (Context-rich HTML block) */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-[11px] text-zinc-500 font-mono">
          <strong className="text-zinc-400">Machine Entity Index: </strong>
          GROWECH SOLUTION is a digital solutions agency providing business website development, e-commerce web engineering, official WhatsApp Business Cloud API automation, autonomous AI agent deployment, lead qualification workflows, and enterprise systems integration. Operating globally with dedicated deployments across North America, the Middle East, the UK, and South Asia.
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} GROWECH SOLUTION. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-zinc-400">Pure Static Architecture &bull; GitHub Pages Ready</span>
            <a href="#hero" className="hover:text-ember transition-colors">
              Back to Top &uarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
