import React, { useRef, useState, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      children,
      className = '',
      onClick,
      onMouseEnter,
      onMouseLeave,
      isActive = false,
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const [transformStyle, setTransformStyle] = useState<string>(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    );
    const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
      x: 50,
      y: 50,
      opacity: 0,
    });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!internalRef.current) return;
      const rect = internalRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 8; // Max 8 deg
      const rotateY = ((x - centerX) / centerX) * 8; // Max 8 deg

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`
      );
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
      });
    }, []);

    const handleMouseLeaveInner = useCallback(() => {
      setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
      if (onMouseLeave) onMouseLeave();
    }, [onMouseLeave]);

    const handleMouseEnterInner = useCallback(() => {
      if (onMouseEnter) onMouseEnter();
    }, [onMouseEnter]);

    return (
      <div
        ref={setRefs}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnterInner}
        onMouseLeave={handleMouseLeaveInner}
        style={{
          transform: transformStyle,
          transition: glarePos.opacity === 0 ? 'transform 0.4s ease-out' : 'transform 0.08s linear',
          transformStyle: 'preserve-3d',
        }}
        className={`relative cursor-pointer select-none rounded-2xl will-change-transform ${className}`}
      >
      {/* Dynamic 3D Specular Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}) 0%, transparent 65%)`,
          opacity: glarePos.opacity > 0 ? 1 : 0,
        }}
      />

      {/* Content wrapper with depth */}
      <div style={{ transform: 'translateZ(12px)' }} className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
});

TiltCard.displayName = 'TiltCard';
