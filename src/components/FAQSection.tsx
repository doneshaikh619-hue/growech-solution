import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqData } from '../data/faqData';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FAQSection: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleAccordion = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="relative py-28 bg-[#0A0A0B] text-white overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider">Engineering Inquiries</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Frequently Asked <br />
            <span className="text-gradient-orange">Technical &amp; Business Questions</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Clear, straightforward answers about our integration standards, safety guardrails, and implementation methodology.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndices.includes(idx);

            return (
              <div
                key={idx}
                className="rounded-2xl bg-obsidian-850/80 border border-white/10 overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-ember">0{idx + 1}.</span>
                    <span className="text-base sm:text-lg font-semibold text-white font-display">
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 rounded-full bg-white/5 text-zinc-400 flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                        <div className="mb-2 text-[10px] font-mono uppercase text-zinc-500">
                          Domain: {item.category}
                        </div>
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">Have a custom technical requirement?</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Speak directly with our solutions architect to evaluate API feasibility.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 text-ember" />
            <span>Ask Our Engineers</span>
          </button>
        </div>
      </div>
    </section>
  );
};
