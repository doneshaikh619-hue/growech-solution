import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, CheckCircle, Sparkles, Building, Mail, Phone, User } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactValue: '',
    service: 'WhatsApp Automation & CRM',
    industry: 'Hospitality / Restaurant',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const services = [
    'WhatsApp Automation & CRM',
    'Autonomous AI Agents',
    'Custom High-Speed Website',
    'E-commerce Engineering',
    'AI Business Workflows',
    'Lead Generation Automation',
    'Digital System Integration',
  ];

  const industries = [
    'Restaurants & Cafes',
    'Clinics & Healthcare',
    'Real Estate & Brokerage',
    'Travel & Visa Services',
    'Trade Businesses & Field Services',
    'E-commerce & D2C Brands',
    'Professional Services & Startups',
    'Other Service-Based Business',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Format WhatsApp message
    const message = encodeURIComponent(
      `Hello GROWECH SOLUTION,\n\nName: ${formData.name}\nCompany: ${formData.company}\nContact: ${formData.contactValue}\nService Required: ${formData.service}\nIndustry: ${formData.industry}\nProject Details: ${formData.notes || 'Inquiry from official website.'}`
    );

    // Open WhatsApp in new tab after brief confirmation
    setTimeout(() => {
      window.open(`https://wa.me/923000000000?text=${message}`, '_blank');
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xl bg-obsidian-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
          >
            {/* Top Ember Ambient Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-ember/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-ember font-bold">
                    Architectural Discovery
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-display text-white">
                  Discuss Your Business Solution
                </h3>
                <p className="text-xs text-zinc-400 mt-1 mb-6 leading-relaxed">
                  Tell us about your operational requirements. We evaluate your workflow bottlenecks and prepare a tailored technical solution architecture.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Your Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full bg-obsidian-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-ember"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Business / Organization *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Skyline Properties"
                          className="w-full bg-obsidian-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-ember"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      WhatsApp or Email Address *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.contactValue}
                        onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                        placeholder="+1 (555) 000-0000 or email@company.com"
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Primary Service Needed
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-ember"
                      >
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-obsidian-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                        Industry / Sector
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-ember"
                      >
                        {industries.map((ind) => (
                          <option key={ind} value={ind} className="bg-obsidian-900 text-white">
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                      Brief Operational Bottleneck / Goals
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. We spend 3 hours daily answering WhatsApp table reservations during peak shifts..."
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-ember resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit &amp; Open WhatsApp Conversation</span>
                    </button>
                    <div className="text-center text-[10px] text-zinc-500 font-mono mt-2">
                      Zero Spam &bull; 100% Confidential Discovery &bull; No Obligation
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your details have been formatted. We are opening WhatsApp now to connect directly with our solutions engineering team.
                </p>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
