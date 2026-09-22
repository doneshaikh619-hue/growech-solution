import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Radio, Zap, Shield } from 'lucide-react';

export const GlobeSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = Math.min(width, 500));

    // Handle resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(width, 500);
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D sphere points (Fibonacci sphere distribution)
    const numPoints = 650;
    const radius = Math.min(width, height) * 0.38;
    const points: { x: number; y: number; z: number; isHub?: boolean }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        isHub: i % 28 === 0, // Highlighted digital infrastructure hub nodes
      });
    }

    let rotX = 0.2;
    let rotY = 0;
    let targetRotY = 0;
    let isDragging = false;
    let lastMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - lastMouseX;
        targetRotY += delta * 0.005;
        lastMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      if (!isDragging) {
        targetRotY += 0.003;
      }
      rotY += (targetRotY - rotY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Radial Orange Rim Light Behind Globe
      const radialGlow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.25);
      radialGlow.addColorStop(0, 'rgba(255, 85, 0, 0.12)');
      radialGlow.addColorStop(0.7, 'rgba(255, 106, 0, 0.04)');
      radialGlow.addColorStop(1, 'rgba(10, 10, 11, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Transform and project points
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Sort points by depth (Z-buffer) for correct rendering
      const projected = points.map((p) => {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective scale
        const fov = 400;
        const scale = fov / (fov + z2);
        const x2d = cx + x1 * scale;
        const y2d = cy + y2 * scale;

        return {
          x2d,
          y2d,
          z: z2,
          scale,
          isHub: p.isHub,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      // Render dots
      projected.forEach((p) => {
        // Alpha based on depth
        const alpha = Math.max(0.12, (p.z + radius) / (2 * radius));

        if (p.isHub) {
          // Highlighted Orange Hub
          ctx.fillStyle = `rgba(255, 85, 0, ${Math.min(1, alpha + 0.3)})`;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 3.2 * p.scale, 0, Math.PI * 2);
          ctx.fill();

          // Outer pulse ring for hub
          ctx.strokeStyle = `rgba(255, 106, 0, ${(Math.sin(time * 3) + 1) * 0.3 * alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 7 * p.scale, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Standard Dot
          ctx.fillStyle = `rgba(220, 230, 245, ${alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 1.4 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <section id="globe" className="relative py-28 bg-[#0A0A0B] text-white overflow-hidden border-t border-b border-white/5">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Global Execution Mesh</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Built for Global Scale &amp; <br />
            <span className="text-gradient-orange">Instant Edge Delivery</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            From official WhatsApp cloud webhooks to distributed CDN frontends, our digital architectures deliver instantaneous responsiveness across international markets.
          </p>
        </div>

        {/* 3D Canvas Dotted Matrix Sphere */}
        <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            className="cursor-grab active:cursor-grabbing w-full max-w-[600px] h-[380px] sm:h-[480px] touch-none"
          />

          <div className="text-[11px] font-mono text-zinc-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-ping" />
            <span>Interactive 3D Sphere &bull; Drag to rotate model</span>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-2xl font-bold text-white font-mono">24/7/365</div>
            <div className="text-xs text-zinc-400 mt-1">Autonomous Operations Uptime</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-2xl font-bold text-ember font-mono">&lt; 3 Seconds</div>
            <div className="text-xs text-zinc-400 mt-1">Automated Inquiry Response Lag</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-2xl font-bold text-white font-mono">Zero Server Lock-in</div>
            <div className="text-xs text-zinc-400 mt-1">Full Ownership of Your Code &amp; Data</div>
          </div>
        </div>
      </div>
    </section>
  );
};
