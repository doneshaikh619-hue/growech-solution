import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, Shield, Cpu, Activity, Globe } from 'lucide-react';

interface HubCity {
  name: string;
  lat: number;
  lng: number;
  code: string;
  ping: string;
}

const GLOBAL_HUBS: HubCity[] = [
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, code: 'DXB_EDGE', ping: '1.2ms' },
  { name: 'London', lat: 51.5074, lng: -0.1278, code: 'LHR_HUB', ping: '2.4ms' },
  { name: 'New York', lat: 40.7128, lng: -74.006, code: 'NYC_GATE', ping: '3.8ms' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, code: 'SIN_EDGE', ping: '2.9ms' },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587, code: 'LHE_CORE', ping: '0.9ms' },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, code: 'FRA_MESH', ping: '2.1ms' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, code: 'TYO_NODE', ping: '4.5ms' },
];

const HUB_CONNECTIONS: [number, number][] = [
  [0, 1], // Dubai <-> London
  [1, 2], // London <-> New York
  [0, 4], // Dubai <-> Lahore
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
  const [activeCity, setActiveCity] = useState<string>('Dubai');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = Math.min(width, 520));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(width, 520);
    };
    window.addEventListener('resize', handleResize);

    const numPoints = 720;
    const radius = Math.min(width, height) * 0.38;
    const points: { x: number; y: number; z: number; isHub?: boolean }[] = [];

    // Fibonacci sphere point distribution
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
        isHub: i % 24 === 0,
      });
    }

    // Convert fixed hub cities to 3D Cartesian coordinates
    const cityPoints = GLOBAL_HUBS.map((c) => ({
      ...c,
      pos: latLngToVector3(c.lat, c.lng, radius),
    }));

    // Precalculate flight arc points (elevated great-circle curves)
    const arcs = HUB_CONNECTIONS.map(([idxA, idxB]) => {
      const pA = cityPoints[idxA].pos;
      const pB = cityPoints[idxB].pos;
      const numSegments = 24;
      const curvePoints: { x: number; y: number; z: number }[] = [];

      for (let s = 0; s <= numSegments; s++) {
        const t = s / numSegments;
        // Linear interpolation
        let x = pA.x + (pB.x - pA.x) * t;
        let y = pA.y + (pB.y - pA.y) * t;
        let z = pA.z + (pB.z - pA.z) * t;

        // Project out to sphere radius + parabolic arc altitude
        const dist = Math.sqrt(x * x + y * y + z * z);
        const arcElevation = Math.sin(t * Math.PI) * (radius * 0.18);
        const targetR = radius + arcElevation;

        x = (x / dist) * targetR;
        y = (y / dist) * targetR;
        z = (z / dist) * targetR;

        curvePoints.push({ x, y, z });
      }

      return {
        curvePoints,
        speed: 0.008 + (idxA * 0.003) % 0.007,
        offset: (idxA * 0.23) % 1,
      };
    });

    let rotX = 0.22;
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
        targetRotY += delta * 0.004;
        lastMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let time = 0;
    const render = () => {
      time += 0.016;
      if (!isDragging) {
        targetRotY += 0.0025;
      }
      rotY += (targetRotY - rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Ambient Background Core Glow
      const radialGlow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.3);
      radialGlow.addColorStop(0, 'rgba(255, 85, 0, 0.14)');
      radialGlow.addColorStop(0.5, 'rgba(255, 106, 0, 0.05)');
      radialGlow.addColorStop(1, 'rgba(10, 10, 11, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Rotation matrix values
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projectPoint = (x: number, y: number, z: number) => {
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;
        const fov = 420;
        const scale = fov / (fov + z2);
        return {
          x2d: cx + x1 * scale,
          y2d: cy + y2 * scale,
          z: z2,
          scale,
        };
      };

      // 2. 3D Equatorial Scanning Orbit Ring
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.18)';
      ctx.setLineDash([4, 6]);
      const ringSteps = 48;
      const ringRadius = radius * 1.15;
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2 + time * 0.2;
        const rx = ringRadius * Math.cos(theta);
        const rz = ringRadius * Math.sin(theta);
        const ry = Math.sin(theta * 2 + time) * 10;
        const p = projectPoint(rx, ry, rz);
        if (i === 0) ctx.moveTo(p.x2d, p.y2d);
        else ctx.lineTo(p.x2d, p.y2d);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Project and Sort Fibonacci Matrix Points
      const projectedPoints = points.map((p) => {
        const proj = projectPoint(p.x, p.y, p.z);
        return {
          ...proj,
          isHub: p.isHub,
        };
      });

      projectedPoints.sort((a, b) => a.z - b.z);

      // Render Matrix Dots
      projectedPoints.forEach((p) => {
        const alpha = Math.max(0.12, (p.z + radius) / (2 * radius));
        if (p.isHub) {
          ctx.fillStyle = `rgba(255, 85, 0, ${Math.min(1, alpha + 0.35)})`;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 2.8 * p.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 106, 0, ${(Math.sin(time * 3) + 1) * 0.25 * alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 6 * p.scale, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(210, 225, 245, ${alpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 1.3 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Render 3D Flight Arcs & Traveling Photons
      arcs.forEach((arc) => {
        const projCurve = arc.curvePoints.map((pt) => projectPoint(pt.x, pt.y, pt.z));
        const avgZ = projCurve.reduce((acc, p) => acc + p.z, 0) / projCurve.length;

        // Render back-arcs faintly, front-arcs brightly
        const arcAlpha = Math.max(0.1, (avgZ + radius) / (2 * radius));

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 110, 20, ${arcAlpha * 0.6})`;
        ctx.lineWidth = 1.2;
        projCurve.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x2d, p.y2d);
          else ctx.lineTo(p.x2d, p.y2d);
        });
        ctx.stroke();

        // Traveling Photon Packet on Arc
        const t = (time * arc.speed + arc.offset) % 1;
        const sampleIdx = Math.floor(t * (projCurve.length - 1));
        const photon = projCurve[sampleIdx];

        if (photon && photon.z > -radius * 0.3) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FF5500';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(photon.x2d, photon.y2d, 3 * photon.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });

      // 5. Render Global Hub City Markers & Sci-Fi HUD Tags
      cityPoints.forEach((city) => {
        const proj = projectPoint(city.pos.x, city.pos.y, city.pos.z);
        if (proj.z > 0) {
          // Front-facing City Node
          const alpha = (proj.z / radius);

          // Glowing City Hub Dot
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(proj.x2d, proj.y2d, 4 * proj.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#FF5500';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(proj.x2d, proj.y2d, 8 * proj.scale, 0, Math.PI * 2);
          ctx.stroke();

          // Sci-Fi Crosshair Reticle & Label Tag
          ctx.save();
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillText(`[${city.code}]`, proj.x2d + 12, proj.y2d - 2);

          ctx.font = '8px monospace';
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillText(`${city.ping}`, proj.x2d + 12, proj.y2d + 9);

          // Tiny pointer line
          ctx.strokeStyle = `rgba(255, 85, 0, ${alpha * 0.8})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(proj.x2d + 4, proj.y2d);
          ctx.lineTo(proj.x2d + 10, proj.y2d);
          ctx.stroke();
          ctx.restore();
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
      {/* Background High-Tech Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-ember/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-ember border border-white/10 mb-4 shadow-glow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Global Execution Mesh &bull; 60+ FPS Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Built for Global Scale &amp; <br />
            <span className="text-gradient-orange">Instant Edge Delivery</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            From official WhatsApp cloud webhooks to distributed CDN frontends, our digital architectures deliver sub-second response times across international business hubs.
          </p>
        </div>

        {/* 3D Global Telemetry Sphere Canvas */}
        <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
          <div className="relative w-full flex justify-center">
            <canvas
              ref={canvasRef}
              className="cursor-grab active:cursor-grabbing w-full max-w-[650px] h-[390px] sm:h-[490px] touch-none"
            />

            {/* Live Status Overlay Card */}
            <div className="absolute top-4 left-4 bg-obsidian-900/90 border border-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-left hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GLOBAL MESH: SYNCHRONIZED</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">7 Edge Gateways Active</div>
            </div>

            <div className="absolute top-4 right-4 bg-obsidian-900/90 border border-ember/30 backdrop-blur-md px-3 py-2 rounded-xl text-right hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-ember flex items-center gap-1.5 justify-end">
                <span>INTER-CONTINENTAL ARCS</span>
                <Activity className="w-3 h-3 text-ember animate-pulse" />
              </div>
              <div className="text-xs font-bold text-white mt-0.5">&lt; 3.0ms Global Avg</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ember animate-ping" />
            <span>Interactive 3D Mesh Sphere &bull; Drag to rotate world model &bull; Zero Lag GPU Pipeline</span>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-white font-mono">24/7/365</div>
            <div className="text-xs text-zinc-400 mt-1">Autonomous Operations Uptime</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">&bull; SLA Guaranteed</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-ember font-mono">&lt; 3 Seconds</div>
            <div className="text-xs text-zinc-400 mt-1">Automated Inquiry Response Lag</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1">&bull; Meta Cloud Verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-white/10 text-center hover:border-ember/40 transition-colors">
            <div className="text-2xl font-bold text-white font-mono">Zero Lock-in</div>
            <div className="text-xs text-zinc-400 mt-1">Full Ownership of Your Code &amp; Data</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">&bull; Dedicated Repos</div>
          </div>
        </div>
      </div>
    </section>
  );
};
