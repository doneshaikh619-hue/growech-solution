import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  UtensilsCrossed,
  Building2,
  Server,
  Layers,
} from 'lucide-react';
import { LogoMark } from './LogoMark';

interface NavbarProps {
  onOpenContact: () => void;
  isLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, isLoaded }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section tracking
      const sections = ['hero', 'services', 'solutions', 'bento', 'globe', 'playground', 'work', 'architecture', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setSolutionsDropdownOpen(false);
      setMobileMenuOpen(false);

      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string, options?: { offset?: number }) => void } }).__lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(targetEl, { offset: -90 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.history.pushState(null, '', href);
      }
    }
  };

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Solutions', href: '#solutions', isDropdown: true },
    { name: 'Capabilities', href: '#bento' },
    { name: 'AI Lab', href: '#playground' },
    { name: 'Demonstrations', href: '#work' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Ambient Orange Laser Ray */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-40 h-[2px] overflow-hidden pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF5500] to-transparent opacity-80 animate-laser-ray" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Announcement Pill Bar */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 text-xs text-zinc-300 bg-obsidian-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ember"></span>
              </span>
              <span className="font-medium text-white">Meta Cloud API &amp; Web Systems</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 hidden sm:inline">Now accepting Q3/Q4 engineering client deployments</span>
              <button
                onClick={onOpenContact}
                className="ml-1 text-ember hover:text-white transition-colors flex items-center gap-0.5 font-semibold"
              >
                Inquire <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Glassmorphic Pill Navigation Bar */}
      <header
        className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 flex justify-center px-4 sm:px-6 pointer-events-none`}
      >
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0,
          }}
          className={`pointer-events-auto w-full max-w-6xl flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-black/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
              : 'bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl'
          }`}
        >
          {/* Brand Logo & Logotype with layoutId spring docking */}
          <a href="#" className="flex items-center gap-3 group">
            {isLoaded ? (
              <motion.div
                layoutId="brand-logo"
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                }}
                className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0"
              >
                <LogoMark className="w-full h-full" glow={true} />
              </motion.div>
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9" />
            )}

            {/* Brand Logotype reveals horizontally upon docking */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col"
            >
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display leading-tight group-hover:text-ember transition-colors">
                growech
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-mono -mt-1">
                solution
              </span>
            </motion.div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={link.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setSolutionsDropdownOpen(true)}
                    onMouseLeave={() => setSolutionsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
                      className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
                        solutionsDropdownOpen || activeSection === 'solutions'
                          ? 'text-white bg-white/10'
                          : 'text-zinc-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Solutions</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          solutionsDropdownOpen ? 'rotate-180 text-ember' : 'text-zinc-400'
                        }`}
                      />
                    </button>

                    {/* Single Sleek Solutions Dropdown */}
                    <AnimatePresence>
                      {solutionsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-84 sm:w-[410px] p-3.5 rounded-2xl bg-[#07090E] border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 z-50 flex flex-col gap-2 text-left"
                        >
                          <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-mono text-zinc-300 border-b border-white/10 flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-white">Enterprise Solutions &bull; 2026</span>
                            <span className="text-ember font-extrabold tracking-wider">Client Owned</span>
                          </div>

                          {/* 1. Growech Dine POS & KDS (Highlighted with Live Demo Button) */}
                          <div className="p-3 rounded-xl bg-gradient-to-r from-ember/30 via-ember/15 to-white/[0.04] border border-ember/50 flex items-center justify-between gap-3 shadow-md group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-ember/30 border border-ember/50 flex items-center justify-center flex-shrink-0 group-hover:bg-ember/40 transition-colors shadow-inner">
                                <UtensilsCrossed className="w-5 h-5 text-ember" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                                    Growech Dine POS
                                  </span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400/50">
                                    LIVE DEMO
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-200 truncate mt-0.5">
                                  Offline LAN billing &amp; kitchen KDS OS
                                </p>
                              </div>
                            </div>

                            <a
                              href="./dine/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-ember hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-ember/40 flex items-center gap-1 flex-shrink-0 transition-transform hover:scale-105"
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {/* 2. Hospital & Clinic Management Suite */}
                          <a
                            href="#solutions"
                            onClick={(e) => handleNavClick(e, '#solutions')}
                            className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-500/50 transition-all flex items-start gap-3 group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-400 group-hover:bg-cyan-500/25 transition-colors">
                              <Building2 className="w-4 h-4 text-cyan-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  Hospital &amp; Clinic Management
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold">
                                  ENTERPRISE
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-200 truncate mt-0.5">
                                Patient EHR, OPD triage, appointments &amp; pharmacy billing
                              </p>
                            </div>
                          </a>

                          {/* 3. BaaS & Custom Enterprise Softwares */}
                          <a
                            href="#solutions"
                            onClick={(e) => handleNavClick(e, '#solutions')}
                            className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-purple-500/50 transition-all flex items-start gap-3 group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:border-purple-400 group-hover:bg-purple-500/25 transition-colors">
                              <Server className="w-4 h-4 text-purple-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                                  BaaS &amp; Custom Enterprise SaaS
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/50 font-bold">
                                  BaaS / SaaS
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-200 truncate mt-0.5">
                                Backend-as-a-service, edge APIs &amp; custom workflow systems
                              </p>
                            </div>
                          </a>

                          {/* 4. Turnkey Industry Portals */}
                          <a
                            href="#solutions"
                            onClick={(e) => handleNavClick(e, '#solutions')}
                            className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-amber-500/50 transition-all flex items-start gap-3 group"
                          >
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:border-amber-400 group-hover:bg-amber-500/25 transition-colors">
                              <Layers className="w-4 h-4 text-amber-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                  Turnkey Industry Portals
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold">
                                  TURNKEY
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-200 truncate mt-0.5">
                                Lead intake engines &amp; automated VIP client portals
                              </p>
                            </div>
                          </a>

                          <div className="pt-2 mt-0.5 border-t border-white/15 flex items-center justify-between px-2">
                            <a
                              href="#solutions"
                              onClick={(e) => handleNavClick(e, '#solutions')}
                              className="text-xs font-bold text-white hover:text-ember flex items-center gap-1.5 transition-colors"
                            >
                              <Layers className="w-3.5 h-3.5 text-ember" />
                              <span>Jump to Solutions Section</span>
                            </a>
                            <span className="text-[11px] text-zinc-300 font-mono font-medium">
                              Zero SaaS Lock-in
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-white bg-white/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="relative group hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm hover:shadow-glow-md transition-all duration-300 transform active:scale-95 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to GROWECH</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-28 z-50 p-6 rounded-3xl bg-[#07090E] border-2 border-white/20 shadow-2xl lg:hidden flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-semibold">Navigation Menu</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Studio</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <a
                href="#services"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#services');
                }}
                className="px-3 py-2 text-sm font-semibold text-white hover:text-ember hover:bg-white/5 rounded-xl transition-all"
              >
                Services
              </a>

              {/* Solutions & Software Suites Container in Mobile Drawer */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  <span>Solutions &amp; Softwares</span>
                  <span className="text-ember font-bold">Live Demo Inside</span>
                </div>

                {/* 1. Growech Dine POS Highlighted Live Demo */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-ember/30 via-ember/15 to-white/[0.04] border border-ember/50 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UtensilsCrossed className="w-5 h-5 text-ember flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">Growech Dine POS</div>
                      <div className="text-[11px] text-zinc-200 truncate">Restaurant POS &amp; KDS</div>
                    </div>
                  </div>
                  <a
                    href="./dine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-ember hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 2. Hospital & Clinic Management */}
                <a
                  href="#solutions"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, '#solutions');
                  }}
                  className="px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-xs text-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-300" />
                    <span className="font-semibold text-white">Hospital Management (HMS)</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold">ENTERPRISE</span>
                </a>

                {/* 3. BaaS & Custom Enterprise SaaS */}
                <a
                  href="#solutions"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, '#solutions');
                  }}
                  className="px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-xs text-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-300" />
                    <span className="font-semibold text-white">BaaS &amp; Custom Softwares</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/50 font-bold">BaaS</span>
                </a>
              </div>

              {/* Standard Remaining Nav Links */}
              {[
                { name: 'Capabilities', href: '#bento' },
                { name: 'AI Lab', href: '#playground' },
                { name: 'Demonstrations', href: '#work' },
                { name: 'Architecture', href: '#architecture' },
                { name: 'FAQ', href: '#faq' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  className="px-3 py-2 text-sm font-semibold text-white hover:text-ember hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-ember to-tangerine shadow-glow-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss Your Project</span>
              </button>

              <a
                href="https://wa.me/923098178527?text=Hello%20GROWECH%20SOLUTION,%20I%20would%20like%20to%20discuss%20a%20digital%20solution."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-ember" />
                <span>Direct WhatsApp Chat</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
