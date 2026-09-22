import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  Layout,
  CheckCircle2,
  Workflow,
  ShoppingCart,
  Cpu,
} from 'lucide-react';
import { LogoMark } from './LogoMark';

interface HeroProps {
  onOpenContact: () => void;
}

interface CoreSystem {
  id: string;
  name: string;
  badge: string;
  activeStatus: string;
  icon: React.ElementType;
  description: string;
  side: 'left' | 'right';
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  // Turn-by-turn sequential energy cycle across all 6 nodes (0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0)
  const [activeCycle, setActiveCycle] = useState<number>(0);
  const [manualSelect, setManualSelect] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const portRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [connections, setConnections] = useState<
    { pathD: string; startX: number; startY: number; endX: number; endY: number }[]
  >([]);

  // 6 Core Systems (Modern Web, E-Commerce, WhatsApp Automation, AI Workflows, AI Agents, Lead Gen)
  const coreSystems: CoreSystem[] = [
    {
      id: 'websites',
      name: 'Modern Business Websites',
      badge: '99+ Lighthouse Vitals',
      activeStatus: 'STREAMING WEB ASSETS',
      icon: Layout,
      description:
        'Bespoke, high-converting digital platforms and responsive web systems engineered for brand authority and sub-second load times.',
      side: 'left',
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Storefronts',
      badge: 'Frictionless Checkout',
      activeStatus: 'COMMERCE ENGINE READY',
      icon: ShoppingCart,
      description:
        'Custom headless storefronts, automated multi-currency checkout, real-time inventory sync, and conversion-optimized sales funnels.',
      side: 'right',
    },
    {
      id: 'whatsapp',
      name: 'Official WhatsApp Automation',
      badge: 'Meta Cloud API Verified',
      activeStatus: '24/7 INQUIRY TRIAGE',
      icon: MessageSquare,
      description:
        'Official Meta Cloud API workflows for instant 24/7 customer inquiry triage, dynamic product catalogs, and bi-directional CRM sync.',
      side: 'left',
    },
    {
      id: 'ai-workflows',
      name: 'AI Automation & Operations',
      badge: 'Zero Manual Friction',
      activeStatus: 'PIPELINE EXECUTING',
      icon: Cpu,
      description:
        'Autonomous back-office operations, intelligent document & invoice OCR, automated cross-department handoffs, and error-free data flows.',
      side: 'right',
    },
    {
      id: 'agents',
      name: 'Autonomous AI Agents',
      badge: 'Deterministic RAG',
      activeStatus: 'RAG REASONING ACTIVE',
      icon: Bot,
      description:
        'Task-oriented intelligent agents trained on internal SOPs and product manuals, delivering precise reasoning with zero hallucination.',
      side: 'left',
    },
    {
      id: 'growth',
      name: 'Lead Generation & Funnels',
      badge: 'Instant Qualification',
      activeStatus: 'LEAD SCORING ACTIVE',
      icon: Zap,
      description:
        'Multi-channel inbound acquisition systems that capture, qualify, and score high-intent prospects before scheduling calls with your team.',
      side: 'right',
    },
  ];

  // Automatic rhythmic sequential rotation (2.2 seconds per node)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCycle((prev) => (prev + 1) % 6);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Handle manual interaction with auto-resume
  useEffect(() => {
    if (manualSelect === null) return;
    const timer = setTimeout(() => {
      setManualSelect(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [manualSelect]);

  const currentActive = manualSelect !== null ? manualSelect : activeCycle;

  // Calculate clean direct straight lines from Core Hub to all 6 cards on desktop
  const updatePaths = useCallback(() => {
    const containerEl = containerRef.current;
    const circleEl = circleRef.current;
    if (!containerEl || !circleEl) return;

    const cRect = containerEl.getBoundingClientRect();
    const circRect = circleEl.getBoundingClientRect();

    // The EXACT geometric center of the engine circle
    const hubCx = circRect.left + circRect.width / 2 - cRect.left;
    const hubCy = circRect.top + circRect.height / 2 - cRect.top;
    const hubRadius = circRect.width / 2;

    const newConns = coreSystems.map((sys, idx) => {
      const portEl = portRefs.current[idx];
      const cardEl = cardRefs.current[idx];
      if (!cardEl) return { pathD: '', startX: 0, startY: 0, endX: 0, endY: 0 };

      let endX: number;
      let endY: number;

      if (portEl) {
        const pRect = portEl.getBoundingClientRect();
        endX = pRect.left + pRect.width / 2 - cRect.left;
        endY = pRect.top + pRect.height / 2 - cRect.top;
      } else {
        const cardRect = cardEl.getBoundingClientRect();
        const isLeft = sys.side === 'left';
        endX = isLeft ? cardRect.right - cRect.left : cardRect.left - cRect.left;
        endY = cardRect.top + cardRect.height / 2 - cRect.top;
      }

      // Calculate direction angle from Hub circle center to the Card port
      const angle = Math.atan2(endY - hubCy, endX - hubCx);

      // Start point precisely at the circular Hub boundary
      const startX = hubCx + Math.cos(angle) * hubRadius;
      const startY = hubCy + Math.sin(angle) * hubRadius;

      // Clean, laser-straight direct connecting line
      const pathD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      return { pathD, startX, startY, endX, endY };
    });

    setConnections(newConns);
  }, [coreSystems]);

  // Robust path recalculation on mount, layout changes, and resize
  useEffect(() => {
    updatePaths();
    const ro = new ResizeObserver(() => {
      updatePaths();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    const t1 = setTimeout(updatePaths, 60);
    const t2 = setTimeout(updatePaths, 200);
    const t3 = setTimeout(updatePaths, 600);
    const t4 = setTimeout(updatePaths, 1200);

    window.addEventListener('resize', updatePaths);
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', updatePaths);
    };
  }, [updatePaths]);

  // Separate cards into left and right groups for desktop 3-column symmetry
  const leftIndices = [0, 2, 4];
  const rightIndices = [1, 3, 5];

  return (
    <section id="hero" className="relative min-h-screen pt-32 sm:pt-36 pb-20 overflow-hidden flex flex-col justify-center bg-[#0A0A0B]">
      {/* Ambient Glowing Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[500px] bg-gradient-to-b from-[#FF5500]/15 via-[#FF6A00]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center text-center z-10">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glow-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-ember shadow-[0_0_8px_#FF5500]" />
          <span className="text-zinc-300 font-mono tracking-wide uppercase text-[11px]">
            Websites &bull; AI Automation &bull; E-Commerce &bull; Lead Systems
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-ember/20 text-ember font-bold">2026 Ready</span>
        </motion.div>

        {/* Primary Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-4xl leading-[1.1]"
        >
          Architecting High-Converting <br className="hidden sm:block" />
          <span className="text-gradient-orange">Websites &amp; AI Systems</span>
        </motion.h1>

        {/* Integrated Positioning Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed px-2"
        >
          <strong className="text-white font-semibold">GROWECH SOLUTION</strong> builds bespoke high-performance websites, e-commerce storefronts, official WhatsApp automation pipelines, and autonomous AI workflows designed to capture visitors, eliminate repetitive manual operations, and accelerate business growth.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenContact}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine shadow-glow-md flex items-center justify-center gap-2 group transition-all"
          >
            <span>Build Your Website &amp; Automation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#solutions"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Web &amp; AI Capabilities</span>
          </motion.a>
        </motion.div>

        {/* Credibility Trust Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400 px-2"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-ember flex-shrink-0" />
            <span>High-Speed Web Platforms (99+ Lighthouse)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-ember flex-shrink-0" />
            <span>Official Meta Cloud API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-ember flex-shrink-0" />
            <span>Deterministic AI Safeguards</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* CORE ENGINE SECTION: 6-Node Architecture with Direct Laser Connections    */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-14 sm:mt-16 w-full max-w-6xl rounded-3xl glass-card-dark p-4 sm:p-8 overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Circuit Grid Background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Section Sub-Header */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between pb-4 sm:pb-6 border-b border-white/10 mb-6 gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ember shadow-[0_0_8px_#FF5500]" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold">
                GROWECH CORE ENGINE &bull; 6-NODE UNIFIED ARCHITECTURE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-400">Active Node:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-ember/20 text-ember border border-ember/30 font-bold">
                0{currentActive + 1} &bull; {coreSystems[currentActive].name.split('&')[0]}
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* DESKTOP VIEW: Center Hub Symmetrically Connected to 6 Boxes (3L, 3R) */}
          {/* =================================================================== */}
          <div
            ref={containerRef}
            className="hidden lg:block relative min-h-[560px] py-4"
          >
            {/* SVG Connecting Lines: Direct Laser Straight from Engine Circle into all 6 Boxes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="activeLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5500" />
                  <stop offset="100%" stopColor="#FFAA00" />
                </linearGradient>
              </defs>

              {connections.map((conn, idx) => {
                if (!conn.pathD) return null;
                const isActive = currentActive === idx;

                return (
                  <g key={`conn-${idx}`}>
                    {/* 1. Permanent Base Circuit Line */}
                    <path
                      d={conn.pathD}
                      stroke="rgba(255, 85, 0, 0.22)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      fill="none"
                    />

                    {/* 2. Engine Perimeter Anchor Bead */}
                    <circle
                      cx={conn.startX}
                      cy={conn.startY}
                      r="3"
                      fill={isActive ? '#FF5500' : 'rgba(255, 85, 0, 0.45)'}
                      stroke="#0A0A0B"
                      strokeWidth="1"
                    />

                    {/* 3. Card Port Anchor Bead */}
                    <circle
                      cx={conn.endX}
                      cy={conn.endY}
                      r="3.5"
                      fill={isActive ? '#FF5500' : 'rgba(255, 255, 255, 0.3)'}
                      stroke="#0A0A0B"
                      strokeWidth="1"
                    />

                    {/* 4. Active Laser Beam with Sleek Flowing Photon */}
                    {isActive && (
                      <>
                        <path
                          d={conn.pathD}
                          stroke="url(#activeLaserGrad)"
                          strokeWidth="2.5"
                          fill="none"
                          className="circuit-line"
                          style={{ filter: 'drop-shadow(0 0 5px rgba(255, 85, 0, 0.85))' }}
                        />
                        {/* Crisp 3px photon particle gliding along path without any ballooning */}
                        <circle
                          key={`photon-${idx}`}
                          r="3"
                          fill="#FFFFFF"
                          stroke="#FF5500"
                          strokeWidth="1.5"
                        >
                          <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={conn.pathD}
                          />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Symmetrical 3-Column Grid: Left 3 Cards | Center Engine Hub | Right 3 Cards */}
            <div className="grid grid-cols-12 items-center gap-y-6 relative z-20 min-h-[540px]">
              {/* Left Column (Nodes 0, 2, 4) */}
              <div className="col-span-4 flex flex-col justify-between gap-6 items-end">
                {leftIndices.map((idx) => {
                  const item = coreSystems[idx];
                  const Icon = item.icon;
                  const isActive = currentActive === idx;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (cardRefs.current[idx] = el)}
                      onClick={() => setManualSelect(idx)}
                      className={`w-full max-w-[305px] p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                        isActive
                          ? 'bg-obsidian-850/95 border-ember shadow-[0_0_24px_rgba(255,85,0,0.22)] ring-1 ring-ember/50'
                          : 'bg-obsidian-900/90 border-white/10 hover:border-white/25 opacity-75'
                      }`}
                    >
                      {/* Explicit Connection Port Dot on Right Border */}
                      <div
                        ref={(el) => (portRefs.current[idx] = el)}
                        className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-obsidian-950 border border-ember flex items-center justify-center z-20"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white shadow-[0_0_6px_#FF5500]' : 'bg-ember'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-gradient-to-r from-ember to-tangerine text-white shadow-glow-sm'
                              : 'bg-white/5 text-zinc-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{item.name}</div>
                          <div className="text-[10px] font-mono text-ember flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
                                isActive ? 'bg-ember shadow-[0_0_6px_#FF5500]' : 'bg-zinc-500'
                              }`}
                            />
                            <span className="truncate font-semibold">
                              {isActive ? item.activeStatus : item.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug break-words">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Center Column: Core Engine Hub */}
              <div className="col-span-4 flex flex-col items-center justify-center py-4">
                <div
                  ref={circleRef}
                  className="relative w-28 h-28 rounded-full bg-obsidian-900 border-2 border-ember shadow-glow-md flex flex-col items-center justify-center p-3 cursor-pointer group"
                  onClick={() => setActiveCycle((prev) => (prev + 1) % 6)}
                >
                  {/* Subtle Ambient Amber Glow */}
                  <div className="absolute -inset-3 rounded-full bg-ember/20 blur-md pointer-events-none" />
                  <div className="w-12 h-12 flex-shrink-0 relative z-10">
                    <LogoMark className="w-full h-full" glow={true} />
                  </div>
                  <span className="text-[8px] font-mono uppercase text-ember font-bold mt-1 tracking-wider relative z-10">
                    CORE ENGINE
                  </span>
                </div>
                <span className="text-xs font-bold text-white mt-3 font-display tracking-wide">
                  GROWECH ORCHESTRATOR
                </span>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  6-Node Unified Engine
                </span>
              </div>

              {/* Right Column (Nodes 1, 3, 5) */}
              <div className="col-span-4 flex flex-col justify-between gap-6 items-start">
                {rightIndices.map((idx) => {
                  const item = coreSystems[idx];
                  const Icon = item.icon;
                  const isActive = currentActive === idx;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (cardRefs.current[idx] = el)}
                      onClick={() => setManualSelect(idx)}
                      className={`w-full max-w-[305px] p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                        isActive
                          ? 'bg-obsidian-850/95 border-ember shadow-[0_0_24px_rgba(255,85,0,0.22)] ring-1 ring-ember/50'
                          : 'bg-obsidian-900/90 border-white/10 hover:border-white/25 opacity-75'
                      }`}
                    >
                      {/* Explicit Connection Port Dot on Left Border */}
                      <div
                        ref={(el) => (portRefs.current[idx] = el)}
                        className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-obsidian-950 border border-ember flex items-center justify-center z-20"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white shadow-[0_0_6px_#FF5500]' : 'bg-ember'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-gradient-to-r from-ember to-tangerine text-white shadow-glow-sm'
                              : 'bg-white/5 text-zinc-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{item.name}</div>
                          <div className="text-[10px] font-mono text-ember flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
                                isActive ? 'bg-ember shadow-[0_0_6px_#FF5500]' : 'bg-zinc-500'
                              }`}
                            />
                            <span className="truncate font-semibold">
                              {isActive ? item.activeStatus : item.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug break-words">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* MOBILE VIEW: Sequential Chain Flow (Top Engine -> 1 -> 2 -> 3 -> 4 -> 5 -> 6) */}
          {/* =================================================================== */}
          <div className="block lg:hidden relative z-20 w-full max-w-md mx-auto">
            {/* 1. Top Central Hub on Mobile */}
            <div className="flex flex-col items-center justify-center mb-1">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-ember/20 blur-md pointer-events-none" />
                <div className="relative w-20 h-20 rounded-full bg-obsidian-900 border-2 border-ember shadow-glow-sm flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 flex-shrink-0">
                    <LogoMark className="w-full h-full" glow={true} />
                  </div>
                  <span className="text-[8px] font-mono uppercase text-ember font-bold mt-1 tracking-wider">
                    CORE HUB
                  </span>

                  {/* Engine Bottom Exit Port Bead */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-obsidian-950 border border-ember flex items-center justify-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        currentActive === 0 ? 'bg-white shadow-[0_0_6px_#FF5500]' : 'bg-ember'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold text-white mt-2 font-display">GROWECH CORE ENGINE</div>
              <div className="text-[10px] text-zinc-400 font-mono">Sequential Connected Chain</div>

              {/* Connecting Conduit from Hub directly down into Card 1 */}
              <div className="flex flex-col items-center my-2 relative">
                <div
                  className={`w-[2px] h-8 transition-all duration-300 relative rounded-full ${
                    currentActive === 0
                      ? 'bg-gradient-to-b from-ember to-tangerine shadow-[0_0_8px_#FF5500]'
                      : 'bg-white/20'
                  }`}
                >
                  {currentActive === 0 && (
                    <div className="w-2 h-2 rounded-full bg-white absolute top-1/2 -translate-y-1/2 -left-[3px] shadow-[0_0_8px_#FF5500]" />
                  )}
                </div>
              </div>
            </div>

            {/* 2. Sequential Cascade of 6 Cards: Each card connects from underneath to the next card */}
            <div className="flex flex-col items-center w-full">
              {coreSystems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = currentActive === idx;
                const isNotLast = idx < coreSystems.length - 1;
                const nextIsActive = currentActive === idx + 1;

                return (
                  <React.Fragment key={item.id}>
                    {/* Card Item */}
                    <div
                      onClick={() => setManualSelect(idx)}
                      className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${
                        isActive
                          ? 'bg-obsidian-850/95 border-ember shadow-[0_0_20px_rgba(255,85,0,0.22)] ring-1 ring-ember/50'
                          : 'bg-obsidian-900/90 border-white/10 opacity-75'
                      }`}
                    >
                      {/* Top Entry Port indicator */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-obsidian-950 border border-ember flex items-center justify-center z-20">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white shadow-[0_0_6px_#FF5500]' : 'bg-ember'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
                            isActive
                              ? 'bg-gradient-to-r from-ember to-tangerine text-white shadow-glow-sm'
                              : 'bg-white/5 text-zinc-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-bold text-white break-words">
                            {item.name}
                          </div>
                          <div className="text-[10px] font-mono text-ember flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
                                isActive ? 'bg-ember shadow-[0_0_6px_#FF5500]' : 'bg-zinc-500'
                              }`}
                            />
                            <span className="break-words font-semibold">
                              {isActive ? item.activeStatus : item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed break-words">
                        {item.description}
                      </p>

                      {/* Bottom Exit Port indicator */}
                      {isNotLast && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-obsidian-950 border border-ember flex items-center justify-center z-20">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              nextIsActive ? 'bg-white shadow-[0_0_6px_#FF5500]' : 'bg-ember'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Connecting Vertical Line Between This Card and the Next Card */}
                    {isNotLast && (
                      <div className="flex flex-col items-center my-2 relative">
                        <div
                          className={`w-[2px] h-7 transition-all duration-300 relative rounded-full ${
                            nextIsActive
                              ? 'bg-gradient-to-b from-ember to-tangerine shadow-[0_0_8px_#FF5500]'
                              : 'bg-white/20'
                          }`}
                        >
                          {nextIsActive && (
                            <div className="w-2 h-2 rounded-full bg-white absolute top-1/2 -translate-y-1/2 -left-[3px] shadow-[0_0_8px_#FF5500]" />
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Integrated Flywheel Flow Footnote */}
          <div className="relative z-20 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <Workflow className="w-3.5 h-3.5 text-ember flex-shrink-0" />
              <span>Unified 6-Node Architecture: Web &bull; E-Commerce &bull; WhatsApp &bull; AI Automation &bull; Agents &bull; Leads</span>
            </div>
            <span className="text-zinc-500 hidden md:inline">24/7 Real-Time Data Sync</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
