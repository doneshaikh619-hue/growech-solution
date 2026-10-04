import React from 'react';
import { LogoMark } from './LogoMark';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface ThreeDHoloCoreProps {
  onReset: () => void;
  focusedNode: number | null;
  circleRef?: React.RefObject<HTMLDivElement>;
}

export const ThreeDHoloCore: React.FC<ThreeDHoloCoreProps> = ({ onReset, focusedNode, circleRef }) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-6 select-none">
      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-pointer group"
        onClick={onReset}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        {/* Layer 1: Ambient High-Tech Plasma Aura */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-ember/30 via-tangerine/20 to-ember/30 blur-2xl pointer-events-none animate-pulse" />

        {/* Layer 2: Outer 3D Gyroscopic Ring (Rotates Clockwise) */}
        <div
          className="absolute inset-0 rounded-full border border-ember/40 border-dashed animate-spin-3d-slow pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 0 10px rgba(255, 85, 0, 0.4))',
          }}
        >
          {/* North, East, South, West Satellite Nodes */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-ember border-2 border-white shadow-[0_0_8px_#FF5500]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-ember border-2 border-white shadow-[0_0_8px_#FF5500]" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-ember border-2 border-white shadow-[0_0_8px_#FF5500]" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-ember border-2 border-white shadow-[0_0_8px_#FF5500]" />

          {/* Sci-Fi Degree Labels */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-ember/80 font-bold">000°</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-ember/80 font-bold">180°</span>
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[8px] font-mono text-ember/80 font-bold">270°</span>
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[8px] font-mono text-ember/80 font-bold">090°</span>
        </div>

        {/* Layer 3: Middle 3D Counter-Gimbal (Rotates In Reverse, Tilted) */}
        <div
          className="absolute inset-4 rounded-full border border-white/20 border-dotted animate-spin-3d-reverse pointer-events-none"
          style={{
            transform: 'rotateX(55deg) rotateY(15deg)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
          }}
        >
          {/* Orbiting High-Speed Photons */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFFFFF] animate-pulse" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ember shadow-[0_0_8px_#FF5500] animate-pulse" />
        </div>

        {/* Layer 4: Vertical 3D Meridian Ring */}
        <div
          className="absolute inset-2 rounded-full border border-ember/25 pointer-events-none"
          style={{
            transform: 'rotateY(65deg)',
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Layer 5: Central Core Quantum Chamber */}
        <div
          ref={circleRef}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-obsidian-850 via-obsidian-950 to-black border-2 border-ember shadow-[0_0_35px_rgba(255,85,0,0.55)] flex flex-col items-center justify-center p-3 transition-transform duration-300 group-hover:scale-110 z-20"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(25px)',
          }}
        >
          {/* Inner Glowing Grid & Bevel */}
          <div className="absolute inset-1 rounded-full bg-radial-hero opacity-80 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

          {/* Central LogoMark */}
          <div className="w-12 h-12 flex-shrink-0 relative z-30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <LogoMark className="w-full h-full" glow={true} />
          </div>

          {/* Central Status Chip */}
          <div className="relative z-30 flex items-center gap-1 mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-ember/40">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse shadow-[0_0_6px_#FF5500]" />
            <span className="text-[7.5px] font-mono uppercase text-white font-extrabold tracking-widest">
              CORE ENGINE
            </span>
          </div>
        </div>

        {/* Layer 6: Floating Sci-Fi Telemetry HUD Badges in 3D */}
        <div
          className="absolute -top-3 right-0 bg-obsidian-900/90 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[9px] font-mono text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] pointer-events-none hidden sm:flex items-center gap-1"
          style={{ transform: 'translateZ(35px)' }}
        >
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>FREQ: 120 FPS</span>
        </div>

        <div
          className="absolute -bottom-3 left-0 bg-obsidian-900/90 border border-ember/30 px-2 py-0.5 rounded-md text-[9px] font-mono text-ember shadow-[0_0_10px_rgba(255,85,0,0.2)] pointer-events-none hidden sm:flex items-center gap-1"
          style={{ transform: 'translateZ(35px)' }}
        >
          <Zap className="w-3 h-3 text-ember animate-pulse" />
          <span>6/6 MESH SYNC</span>
        </div>
      </div>

      {/* Orchestrator Title & Telemetry */}
      <div className="text-center mt-3 z-20">
        <div className="text-sm font-extrabold text-white tracking-wider font-display uppercase flex items-center justify-center gap-2">
          <span>GROWECH ORCHESTRATOR</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-ember/20 text-ember border border-ember/30">
            v3.2 3D CORE
          </span>
        </div>
        <div className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center justify-center gap-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
            Zero Latency
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span>Simultaneous 6-Node Laser Telemetry</span>
        </div>
      </div>
    </div>
  );
};
