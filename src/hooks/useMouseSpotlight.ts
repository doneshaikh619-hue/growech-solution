import { useState, useCallback } from 'react';

export function useMouseSpotlight() {
  const [coords, setCoords] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return {
    coords,
    handleMouseMove,
    handleMouseLeave,
    spotlightStyle: {
      background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(255, 85, 0, 0.12), transparent 70%)`,
      opacity: coords.opacity,
      transition: 'opacity 0.25s ease-out',
    },
  };
}
