import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'animejs';
import { caseStudiesData, CaseStudy } from '../data/caseStudies';
import { ArrowUpRight, CheckCircle2, ChevronRight, Layers, Sparkles, X, ShieldAlert } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const WorkShowcase: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const filters = ['ALL', 'DEMO PROJECT', 'CONCEPT PROJECT', 'SAMPLE WORK'];

  const filteredCases =
    activeFilter === 'ALL'
      ? caseStudiesData
      : caseStudiesData.filter((c) => c.badgeType === activeFilter);

  // GSAP ScrollTrigger on initial entry
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.case-study-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Anime.js Stagger Animation whenever Filter changes
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.case-study-card');
      if (cards.length > 0) {
        animate(cards, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 500,
          delay: stagger(80),
          ease: 'outExpo',
        });
      }
    }
  }, [activeFilter]);

  return (
    <section ref={sectionRef} id="work" className="relative py-28 bg-[#0A0A0B] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-mono uppercase tracking-wider">Proof of Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Demonstrations &amp; <br />
              <span className="text-gradient-orange">Verified Reference Architectures</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We believe in radical transparency. Every project below is an engineering demonstration or concept architecture showcasing exact problems, workflows, and deliverables—with zero fabricated claims or fake client reviews.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-wider transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-ember text-white shadow-glow-sm scale-[1.03]'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Case Study Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((cs) => (
            <div
              key={cs.id}
              className="case-study-card glass-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-ember/30 transition-all duration-300 group will-change-transform"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${
                      cs.badgeType === 'DEMO PROJECT'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : cs.badgeType === 'CONCEPT PROJECT'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {cs.badgeType}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{cs.industry}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-ember transition-colors">
                  {cs.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {cs.overview}
                </p>

                {/* Problem & Solution Quick Snippet */}
                <div className="mt-6 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-mono text-zinc-500 uppercase text-[10px] block mb-0.5">
                      Problem Addressed:
                    </span>
                    <span className="text-zinc-300">{cs.problem}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-ember/5 border border-ember/15">
                    <span className="font-mono text-ember uppercase text-[10px] block mb-0.5 font-bold">
                      GROWECH Solution:
                    </span>
                    <span className="text-zinc-200">{cs.solution}</span>
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {cs.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Trigger */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCase(cs)}
                  className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 group-hover:text-ember transition-colors"
                >
                  <span>Inspect System Architecture</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenContact}
                  className="p-2 rounded-full bg-white/5 hover:bg-ember text-zinc-400 hover:text-white transition-colors"
                  title="Discuss similar project"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Deep-Dive Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-obsidian-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full uppercase bg-ember/20 text-ember border border-ember/30">
                  {selectedCase.badgeType}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {selectedCase.industry}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-white pr-8">
                {selectedCase.title}
              </h3>

              <div className="mt-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div>
                  <h4 className="font-mono text-zinc-400 uppercase text-[11px] font-bold mb-1">
                    System Architecture Overview
                  </h4>
                  <p>{selectedCase.overview}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <h4 className="font-mono text-ember uppercase text-[11px] font-bold">
                    What Was Built:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedCase.whatWasBuilt.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-ember flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
                  <h4 className="font-mono text-emerald-400 uppercase text-[11px] font-bold">
                    Automation Highlights:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedCase.automationHighlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-mono text-zinc-400 uppercase text-[11px] font-bold mb-2">
                    Technologies Implemented:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCase.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Close Architecture View
                </button>

                <button
                  onClick={() => {
                    setSelectedCase(null);
                    onOpenContact();
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm transition-all"
                >
                  Request Similar Architecture
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
