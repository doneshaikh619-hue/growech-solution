import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Bot,
  Globe,
  ShoppingBag,
  UtensilsCrossed,
  Users,
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
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section tracking for active highlights
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
      setServicesDropdownOpen(false);
      setMobileMenuOpen(false);

      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string, options?: { offset?: number }) => void } }).__lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(targetEl, { offset: -85 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.history.pushState(null, '', href);
      }
    }
  };

  // Structured Core Services for Dropdown
  const serviceItems = [
    {
      title: 'AI Workflow Automation',
      desc: 'Autonomous n8n & LLM agent pipelines',
      href: '/services/ai-workflow-automation.html',
      icon: Sparkles,
      tag: 'HOT',
    },
    {
      title: 'WhatsApp Business API',
      desc: 'Official Meta Cloud API & bilingual bots',
      href: '/services/whatsapp-business-api.html',
      icon: Bot,
      tag: 'META VERIFIED',
    },
    {
      title: 'Next.js Web Engineering',
      desc: 'Sub-second React platforms with 100 Vitals',
      href: '/services/nextjs-web-development.html',
      icon: Globe,
      tag: 'FAST',
    },
    {
      title: 'E-Commerce & Shopify',
      desc: 'Custom storefronts & WhatsApp COD triage',
      href: '/services/ecommerce-solutions.html',
      icon: ShoppingBag,
    },
    {
      title: 'Hire Remote Engineers',
      desc: 'Top 1% vetted full-stack & AI developers',
      href: '/services/remote-developers.html',
      icon: Users,
    },
  ];

  // Top-Level Streamlined Navigation Links (Minimal & Clean, Zero Wrapping)
  const navLinks = [
    { name: 'Showcase', href: '#work' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Ambient Laser Accent */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 h-[2px] overflow-hidden pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF5500] to-transparent opacity-80 animate-laser-ray" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Announcement Pill Bar (Gently fades on scroll to avoid navbar collision) */}
      <AnimatePresence>
        {isLoaded && !scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-3 left-0 right-0 z-40 hidden md:flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1 text-xs text-zinc-300 bg-obsidian-900/85 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ember"></span>
              </span>
              <span className="font-medium text-white">Meta Cloud API &amp; Web Systems</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Accepting Q3/Q4 engineering client deployments</span>
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
        className={`fixed left-0 right-0 z-40 transition-all duration-300 flex justify-center px-4 sm:px-6 pointer-events-none ${
          scrolled ? 'top-3 sm:top-4' : 'top-3 sm:top-11'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 24,
            delay: 0,
          }}
          className={`pointer-events-auto w-full max-w-5xl flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#0A0A0B]/90 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)]'
              : 'bg-[#0A0A0B]/75 backdrop-blur-md border border-white/10 shadow-2xl'
          }`}
        >
          {/* Brand Logo & Logotype */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
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

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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

          {/* Desktop Navigation Links (Clean 4-Item Minimal Layout, No Wrapping) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 whitespace-nowrap">
            {/* Services & Solutions Dropdown Trigger */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
                  servicesDropdownOpen || activeSection === 'services' || activeSection === 'solutions'
                    ? 'text-white bg-white/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Services &amp; Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-ember' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* Animated Glassmorphic Dropdown Menu */}
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-80 sm:w-96 p-3 rounded-2xl bg-[#0D0E12]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-1 text-left"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono text-zinc-400 border-b border-white/10 flex items-center justify-between mb-1">
                      <span>Agency Capabilities &bull; 2026</span>
                      <span className="text-ember font-bold">Enterprise Ready</span>
                    </div>

                    {serviceItems.map((srv) => {
                      const Icon = srv.icon;
                      return (
                        <a
                          key={srv.title}
                          href={srv.href}
                          onClick={(e) => handleNavClick(e, srv.href)}
                          className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all flex items-start gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-ember/40 group-hover:bg-ember/10 transition-colors">
                            <Icon className="w-4 h-4 text-ember" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-white group-hover:text-ember transition-colors">
                                {srv.title}
                              </span>
                              {srv.tag && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-ember/20 text-ember border border-ember/30 font-bold">
                                  {srv.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {srv.desc}
                            </p>
                          </div>
                        </a>
                      );
                    })}

                    {/* Highlighted POS Live Demo Banner inside Dropdown */}
                    <div className="mt-1 p-2.5 rounded-xl bg-gradient-to-r from-ember/15 via-ember/5 to-transparent border border-ember/30 flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-ember/20 border border-ember/40 flex items-center justify-center flex-shrink-0">
                          <UtensilsCrossed className="w-4 h-4 text-ember" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">
                              Growech Dine POS
                            </span>
                            <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              LIVE DEMO
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate">
                            Offline LAN billing &amp; kitchen OS
                          </p>
                        </div>
                      </div>

                      <a
                        href="./dine/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-ember hover:bg-orange-600 text-white font-bold text-[10px] shadow-sm shadow-ember/30 flex items-center gap-1 flex-shrink-0 transition-transform hover:scale-105"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-2">
                      <a
                        href="#services"
                        onClick={(e) => handleNavClick(e, '#services')}
                        className="text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-ember" />
                        <span>Jump to Section Overview</span>
                      </a>
                      <a
                        href="/sitemap.xml"
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono"
                      >
                        View All (13 Pages) &rarr;
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
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
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenContact}
              className="relative group hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm hover:shadow-glow-md transition-all duration-300 transform active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to GROWECH</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
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
            transition={{ duration: 0.22 }}
            className="fixed inset-x-4 top-20 z-50 p-6 rounded-3xl bg-[#0D0E12]/98 backdrop-blur-2xl border border-white/15 shadow-2xl lg:hidden flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">GROWECH Navigation</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Studio</span>
              </div>
            </div>

            {/* Core Services Section in Mobile Drawer */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Services &amp; Architectures
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {serviceItems.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <a
                      key={srv.title}
                      href={srv.href}
                      onClick={(e) => handleNavClick(e, srv.href)}
                      className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-between text-xs font-medium text-zinc-200"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-ember" />
                        <span>{srv.title}</span>
                      </div>
                      {srv.tag && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-ember/20 text-ember font-bold">
                          {srv.tag}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Highlighted POS Live Demo Banner in Mobile Drawer */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-ember/15 via-ember/5 to-transparent border border-ember/30 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-ember/20 border border-ember/40 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-4 h-4 text-ember" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">Growech Dine POS</span>
                    <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      LIVE DEMO
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">Offline LAN billing &amp; kitchen OS</p>
                </div>
              </div>
              <a
                href="./dine/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-ember hover:bg-orange-600 text-white font-bold text-xs shadow-sm shadow-ember/30 flex items-center gap-1 flex-shrink-0"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Standard On-Page Sections */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                On-Page Sections
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-ember transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Book Direct Strategy Call</span>
              </button>

              <a
                href="https://wa.me/923098178527?text=Salam%20Growech%2C%20I%20would%20like%20to%20discuss%20a%20digital%20solution."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full text-xs font-semibold text-center bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
              >
                WhatsApp Direct: +92 309 8178527
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
