import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { LogoMark } from './LogoMark';

interface NavbarProps {
  onOpenContact: () => void;
  isLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, isLoaded }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section tracking
      const sections = ['hero', 'solutions', 'bento', 'globe', 'playground', 'work', 'architecture', 'faq'];
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

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Capabilities', href: '#bento' },
    { name: 'AI Lab', href: '#playground' },
    { name: 'Demonstrations', href: '#work' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Ambient Orange Laser Ray (Exact Video Choreography Match) */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 0.8 }}
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
            initial={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 text-xs text-zinc-300 bg-obsidian-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ember"></span>
              </span>
              <span className="font-medium text-white">Meta Cloud API & AI Workflows</span>
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
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
            delay: isLoaded ? 0.3 : 0,
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
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs xl:text-sm font-medium text-zinc-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="relative group hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-sm hover:shadow-glow-md transition-all duration-300 transform active:scale-95"
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
            className="fixed inset-x-4 top-28 z-50 p-6 rounded-3xl bg-obsidian-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl lg:hidden flex flex-col gap-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">Navigation Menu</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Operations</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-zinc-200 hover:text-ember hover:bg-white/5 rounded-xl transition-all"
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
                href="https://wa.me/923000000000?text=Hello%20GROWECH%20SOLUTION,%20I%20would%20like%20to%20discuss%20a%20digital%20solution."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-ember" />
                <span>Direct WhatsApp Chat</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
