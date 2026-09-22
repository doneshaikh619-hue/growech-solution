import { useCallback } from 'react';

/**
 * High-Performance Mouse Spotlight Hook
 * 
 * Bypasses React state re-rendering completely by setting CSS custom properties
 * directly on the DOM element's style. This enables buttery 60/120fps GPU-composited
 * radial gradient tracking without triggering React virtual DOM diffing.
 */
export function useMouseSpotlight() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-opacity', '1');
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--spotlight-opacity', '0');
  }, []);

  return {
    handleMouseMove,
    handleMouseLeave,
    spotlightStyle: {
      background: 'radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.14), transparent 70%)',
      opacity: 'var(--spotlight-opacity, 0)' as unknown as number,
      transition: 'opacity 0.25s ease-out',
      willChange: 'background, opacity',
    },
  };
}
