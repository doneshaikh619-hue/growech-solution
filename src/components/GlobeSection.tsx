import React, { useEffect, useRef, useState } from 'react';
import { Globe, Radio, Shield, Zap, ArrowUpRight } from 'lucide-react';

interface HubCity {
  name: string;
  lat: number;
  lng: number;
  code: string;
  ping: string;
}

const GLOBAL_HUBS: HubCity[] = [
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, code: 'DXB', ping: '1.2ms' },
  { name: 'London', lat: 51.5074, lng: -0.1278, code: 'LHR', ping: '2.4ms' },
  { name: 'New York', lat: 40.7128, lng: -74.006, code: 'NYC', ping: '3.8ms' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, code: 'SIN', ping: '2.9ms' },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011, code: 'KHI', ping: '0.8ms' },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, code: 'FRA', ping: '2.1ms' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, code: 'TYO', ping: '4.5ms' },
];

const HUB_CONNECTIONS: [number, number][] = [
  [0, 1], // Dubai <-> London
  [1, 2], // London <-> New York
  [0, 4], // Dubai <-> Karachi
  [3, 0], // Singapore <-> Dubai
  [5, 2], // Frankfurt <-> New York
  [6, 3], // Tokyo <-> Singapore
];

function latLngToVector3(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return { x, y, z };
}

export const GlobeSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCity] = useState<string>('Dubai');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let radius = 0;

    // Device Pixel Ratio clamped to 1.5 to prevent mobile GPU thermal throttling
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const clientW = canvas.parentElement.clientWidth;
      width = Math.min(clientW, 640);
      height = Math.min(width * 0.78, 480);
      radius = width * 0.36;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // 220 Fibonacci sphere points for clean, lightweight 60 FPS rendering
    const numPoints = 220;
    const points: { x: number; y: number; z: number; isHub: boolean }[] = [];

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
        isHub: i % 18 === 0,
      });
    }

    // Convert city coordinates
    const cityPoints = GLOBAL_HUBS.map((c) => ({
      ...c,
      pos: latLngToVector3(c.lat, c.lng, radius),
    }));

    // Pre-calculate flight arcs
    const arcs = HUB_CONNECTIONS.map(([idxA, idxB]) => {
      const pA = cityPoints[idxA].pos;
      const pB = cityPoints[idxB].pos;
      const segments = 16;
      const curvePoints: { x: number; y: number; z: number }[] = [];

      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        let x = pA.x + (pB.x - pA.x) * t;
        let y = pA.y + (pB.y - pA.y) * t;
        let z = pA.z + (pB.z - pA.z) * t;

        const dist = Math.sqrt(x * x + y * y + z * z);
        const arcElev = Math.sin(t * Math.PI) * (radius * 0.16);
        const targetR = radius + arcElev;

        x = (x / dist) * targetR;
        y = (y / dist) * targetR;
        z = (z / dist) * targetR;

        curvePoints.push({ x, y, z });
      }

      return {
        curvePoints,
        speed: 0.007 + (idxA * 0.002) % 0.005,
        offset: (idxA * 0.25) % 1,
      };
    });

    let rotX = 0.2;
    let rotY = 0;
    let targetRotY = 0;
    let isDragging = false;
    let lastMouseX = 0;

    // Desktop mouse drag only (never interferes with mobile touch scrolling)
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

    // Enable drag only on desktop hover devices
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop) {
      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    let time = 0;

    const render = () => {
      if (!isVisible) return;

      time += 0.015;
      if (!isDragging) {
        targetRotY += 0.0022;
      }
      rotY += (targetRotY - rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Subtle Radial Ambient Glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.25);
      glow.addColorStop(0, 'rgba(255, 85, 0, 0.12)');
      glow.addColorStop(0.6, 'rgba(255, 85, 0, 0.03)');
      glow.addColorStop(1, 'rgba(10, 10, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Matrix transforms
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;
        const fov = 400;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      };

      // 2. Render Matrix Points (single batch pass)
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const proj = project(p.x, p.y, p.z);
        const alpha = Math.max(0.12, (proj.z + radius) / (2 * radius));

        ctx.beginPath();
        if (p.isHub) {
          ctx.fillStyle = `rgba(255, 85, 0, ${Math.min(0.95, alpha + 0.3)})`;
          ctx.arc(proj.x, proj.y, 2.5 * proj.scale, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(215, 225, 240, ${alpha * 0.55})`;
          ctx.arc(proj.x, proj.y, 1.2 * proj.scale, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // 3. Render Arcs
      for (let a = 0; a < arcs.length; a++) {
        const arc = arcs[a];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 95, 10, 0.35)';
        ctx.lineWidth = 1;

        for (let s = 0; s < arc.curvePoints.length; s++) {
          const pt = arc.curvePoints[s];
          const proj = project(pt.x, pt.y, pt.z);
          if (s === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();

        // Traveling Photon Marker
        const t = (time * arc.speed + arc.offset) % 1;
        const sampleIdx = Math.floor(t * (arc.curvePoints.length - 1));
        const pt = arc.curvePoints[sampleIdx];
        if (pt) {
          const photon = project(pt.x, pt.y, pt.z);
          if (photon.z > -radius * 0.2) {
            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(photon.x, photon.y, 2.4 * photon.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Render Hub City Nodes
      for (let c = 0; c < cityPoints.length; c++) {
        const city = cityPoints[c];
        const proj = project(city.pos.x, city.pos.y, city.pos.z);

        if (proj.z > 0) {
          const alpha = proj.z / radius;

          // Glowing City Marker
          ctx.beginPath();
          ctx.fillStyle = '#FFFFFF';
          ctx.arc(proj.x, proj.y, 3.5 * proj.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = '#FF5500';
          ctx.lineWidth = 1.5;
          ctx.arc(proj.x, proj.y, 6.5 * proj.scale, 0, Math.PI * 2);
          ctx.stroke();

          // Clean Monospace HUD Tag
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillText(`[${city.code}]`, proj.x + 9, proj.y - 2);

          ctx.font = '8px monospace';
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillText(`${city.ping}`, proj.x + 9, proj.y + 8);
        }
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause animation when scrolled off-screen (0% CPU consumption)
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
      if (isDesktop) {
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
    };
  }, []);

  return (
    <section id="globe" className="relative py-20 sm:py-28 bg-[#0A0A0B] text-white overflow-hidden border-t border-b border-white/5">
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-ember/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Global Infrastructure &bull; Edge Delivery</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Built for Global Scale &amp; <br />
            <span className="text-gradient-orange">Low-Latency Delivery</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            From official WhatsApp cloud webhooks to distributed CDN frontends, our digital systems maintain sub-second response times across international commercial hubs.
          </p>
        </div>

        {/* 3D Global Telemetry Sphere Canvas (Mobile Touch-Pan-Y Enabled) */}
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className="relative w-full flex justify-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[620px] h-[340px] sm:h-[450px] touch-pan-y pointer-events-none sm:pointer-events-auto cursor-grab active:cursor-grabbing"
            />

            {/* Edge Status Pills */}
            <div className="absolute top-3 left-4 bg-obsidian-900/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-left hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GLOBAL HUBS: ACTIVE</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">7 Edge Gateways Synced</div>
            </div>

            <div className="absolute top-3 right-4 bg-obsidian-900/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-right hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-ember flex items-center gap-1.5 justify-end">
                <span>LATENCY</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">&lt; 3.0ms Global Avg</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            <span>Interactive 3D Infrastructure Network &bull; Worldwide Coverage</span>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-white font-mono">24/7/365</div>
            <div className="text-xs text-zinc-400 mt-1">Autonomous Operations Uptime</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">&bull; Production Monitored</div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-ember font-mono">&lt; 3 Seconds</div>
            <div className="text-xs text-zinc-400 mt-1">Automated Inquiry Response Lag</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1">&bull; Meta Cloud Verified</div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-white font-mono">100% Owned</div>
            <div className="text-xs text-zinc-400 mt-1">Full Ownership of Your Code &amp; Data</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">&bull; Dedicated Repos</div>
          </div>
        </div>
      </div>
    </section>
  );
};
