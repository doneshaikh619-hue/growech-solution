import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Sparkles, Phone, Mail, ShieldCheck } from 'lucide-react';

interface HorizonCTAProps {
  onOpenContact: () => void;
}

export const HorizonCTA: React.FC<HorizonCTAProps> = ({ onOpenContact }) => {
  return (
    <section className="relative pt-28 pb-40 bg-[#0A0A0B] text-white overflow-hidden">
      {/* ======================================================== */}
      {/* Massive Ambient Orange Curved Bottom Horizon / Sunrise Glow */}
      {/* ======================================================== */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] pointer-events-none">
        <div className="w-full h-full rounded-t-[100%] bg-gradient-to-t from-[#FF5500]/30 via-[#FF6A00]/10 to-transparent blur-[120px]" />
      </div>

      {/* Decorative Horizon Curved Rim Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/60 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-ember" />
          <span className="font-mono uppercase tracking-wider">Start Your Engineering Engagement</span>
        </motion.div>

        {/* Display Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-white max-w-3xl mx-auto leading-[1.08]"
        >
          Ready to Automate Your Operations &amp; <br />
          <span className="text-gradient-orange">Accelerate Growth?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed"
        >
          Schedule an architectural consultation to discuss your business website, official WhatsApp automation pipelines, or custom AI agents.
        </motion.p>

        {/* Dual Primary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenContact}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-lg flex items-center justify-center gap-2 group transition-all"
          >
            <span>Let&apos;s Build Your Solution</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/923000000000?text=Hello%20GROWECH%20SOLUTION,%20I%20would%20like%20to%20discuss%20a%20digital%20solution%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold text-white bg-white/[0.06] border border-white/15 hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </motion.a>
        </motion.div>

        {/* Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-ember" />
            Confidential Architectural Assessment
          </span>
          <span>&bull;</span>
          <span>Zero Obligation Discovery Call</span>
          <span>&bull;</span>
          <span>Direct Response Within 2 Hours</span>
        </motion.div>
      </div>
    </section>
  );
};
