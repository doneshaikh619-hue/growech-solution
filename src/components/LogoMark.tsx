import React from 'react';

interface LogoMarkProps {
  className?: string;
  glow?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-full h-full', glow = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-lg pointer-events-none" />
      )}
      <img
        src="./assets/growech-logo.png"
        alt="GROWECH Brand Logo Mark"
        className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_4px_14px_rgba(255,140,0,0.45)] select-none"
      />
    </div>
  );
};
