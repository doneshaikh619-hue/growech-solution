import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoMark } from './LogoMark';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'rings' | 'morph' | 'done'>('rings');
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Ensure the animation sequence executes strictly ONCE
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Stage 1: Concentric pulsing rings (0 - 1000ms)
    const timer1 = setTimeout(() => {
      setPhase('morph');
    }, 1000);

    // Stage 2: Logo morph & reveal (1000 - 2200ms)
    const timer2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B] overflow-hidden select-none"
        >
          {/* Subtle Ambient Background Ember Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FF5500]/10 blur-[130px] pointer-events-none" />

          {/* Phase 1: Center Concentric Pulse Rings */}
          {phase === 'rings' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
              className="relative flex items-center justify-center"
            >
              {/* Ring 3 (Outer) */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.15, 0.45, 0.15],
                  borderColor: ['rgba(255, 85, 0, 0.2)', 'rgba(255, 106, 0, 0.5)', 'rgba(255, 85, 0, 0.2)'],
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-44 h-44 rounded-full border border-ember/30"
              />

              {/* Ring 2 (Middle dashed) */}
              <motion.div
                animate={{
                  scale: [1.1, 0.95, 1.1],
                  opacity: [0.3, 0.7, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-28 h-28 rounded-full border border-dashed border-ember/60 shadow-glow-sm"
              />

              {/* Ring 1 (Inner Glowing Core) */}
              <motion.div
                animate={{
                  scale: [0.85, 1.15, 0.85],
                  boxShadow: [
                    '0 0 20px rgba(255, 85, 0, 0.3)',
                    '0 0 45px rgba(255, 85, 0, 0.7)',
                    '0 0 20px rgba(255, 85, 0, 0.3)',
                  ],
                }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-ember to-tangerine flex items-center justify-center"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-ping opacity-75" />
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Morph into Pristine White 'G' Brand Logo Mark (Zero Text) */}
          {phase === 'morph' && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Brand G Logo Mark with layoutId for smooth header docking */}
              <motion.div
                layoutId="brand-logo"
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
              >
                {/* Radiant white/silver aura glow */}
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                <LogoMark className="w-full h-full" glow={true} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
