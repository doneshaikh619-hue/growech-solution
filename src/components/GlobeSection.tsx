import React, { useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';
import * as THREE from 'three';

export const GlobeSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();

    const parent = canvas.parentElement;
    const initialWidth = parent ? Math.min(parent.clientWidth, 520) : 460;
    const initialHeight = Math.min(initialWidth * 0.78, 380);

    const camera = new THREE.PerspectiveCamera(50, initialWidth / initialHeight, 0.1, 1000);
    // Camera distance keeps globe compact ("chota type ka, not over-zoomed")
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialWidth, initialHeight, false);

    // 2. Audio Context & Analyser (Safe Audio Pipeline)
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Demo oscillators from user snippet
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(analyser);

        // Keep gain muted so browser autoplay policies never block page & no buzzing sounds
        gainNode.gain.setValueAtTime(0.0, audioContext.currentTime);

        oscillator1.start();
        oscillator2.start();
      }
    } catch {
      // Graceful fallback for environments without audio
    }

    // 3. Create 3D Spherical Particle Globe ("duniya type ka, gol particle globe")
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Base spherical coordinates to preserve round globe shape
    const normX = new Float32Array(particleCount);
    const normY = new Float32Array(particleCount);
    const normZ = new Float32Array(particleCount);
    const baseRadii = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    const globeRadius = 9.2; // Compact, perfectly proportioned radius

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Fibonacci sphere distribution for uniform 3D planetary shell
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      // Radial variation gives depth to the particle sphere
      const rJitter = globeRadius + (Math.random() - 0.5) * 0.8;
      baseRadii[i] = rJitter;
      phases[i] = Math.random() * Math.PI * 2;

      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);

      normX[i] = nx;
      normY[i] = ny;
      normZ[i] = nz;

      positions[i3] = nx * rJitter;
      positions[i3 + 1] = ny * rJitter;
      positions[i3 + 2] = nz * rJitter;

      // Small ambient drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.04;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.04;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;

      // Initial Brand Colors: Growech Ember (#FF5500) to Gold (#FFAA00)
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.35 + Math.random() * 0.25;
      colors[i3 + 2] = 0.05 + Math.random() * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a circular particle texture for smooth glow dots
    const createCircleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.35, 'rgba(255, 140, 20, 0.9)');
        grad.addColorStop(0.8, 'rgba(255, 85, 0, 0.3)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pCtx.fillStyle = grad;
        pCtx.beginPath();
        pCtx.arc(16, 16, 16, 0, Math.PI * 2);
        pCtx.fill();
      }
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createCircleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.38,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Interactive Mouse Drag for desktop exploration
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.15;
    let curRotY = 0;
    let curRotX = 0.15;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      // Clamp vertical tilt
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop) {
      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // 5. Responsive Resize Listener
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const clientW = canvas.parentElement.clientWidth;
      const w = Math.min(clientW, 520);
      const h = Math.min(w * 0.78, 380);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 6. Animation Loop with Audio Frequency Dynamics
    const clock = new THREE.Clock();

    function animate() {
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Audio data extraction + smooth continuous harmonic rhythm
      const rhythmicBass = 0.35 + 0.45 * Math.sin(elapsed * 2.2) * Math.sin(elapsed * 1.1);
      const rhythmicMid = 0.28 + 0.35 * Math.cos(elapsed * 3.4 + 1.2);
      const rhythmicTreble = 0.2 + 0.3 * Math.sin(elapsed * 5.2 + 2.5);

      let bassAvg = Math.max(0.1, rhythmicBass);
      let midAvg = Math.max(0.1, rhythmicMid);
      let trebleAvg = Math.max(0.1, rhythmicTreble);

      // If Web Audio analyser has active frequency data, blend it in
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
        const liveBass = dataArray.slice(0, 32).reduce((a, b) => a + b, 0) / 32 / 255;
        const liveMid = dataArray.slice(32, 128).reduce((a, b) => a + b, 0) / 96 / 255;
        const liveTreble = dataArray.slice(128, 256).reduce((a, b) => a + b, 0) / 128 / 255;

        if (liveBass > 0.05 || liveMid > 0.05) {
          bassAvg = Math.max(bassAvg, liveBass);
          midAvg = Math.max(midAvg, liveMid);
          trebleAvg = Math.max(trebleAvg, liveTreble);
        }
      }

      // Audio Force calculation matching user snippet
      const audioForce = bassAvg * 2 + midAvg * 1.5 + trebleAvg;

      // Update particle positions on the 3D globe
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const colArray = colAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Radial pulsation along the sphere surface
        const pulse = Math.sin(elapsed * 2.0 + phases[i]) * audioForce * 0.32;
        const currentR = baseRadii[i] + pulse;

        posArray[i3] = normX[i] * currentR + velocities[i3] * Math.sin(elapsed + i);
        posArray[i3 + 1] = normY[i] * currentR + velocities[i3 + 1] * Math.cos(elapsed + i);
        posArray[i3 + 2] = normZ[i] * currentR + velocities[i3 + 2] * Math.sin(elapsed + i);

        // Website Color Scheme: Growech Ember (#FF5500) to Warm Amber Gold (#FFAA00)
        colArray[i3] = 1.0; // Red foundation
        colArray[i3 + 1] = Math.min(1.0, 0.28 + midAvg * 0.48 + bassAvg * 0.22); // Green shift creates ember-gold
        colArray[i3 + 2] = Math.min(1.0, 0.02 + trebleAvg * 0.32); // Subtle sparkling highlight
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Smooth globe rotation
      if (!isDragging) {
        targetRotY += 0.003;
      }
      curRotY += (targetRotY - curRotY) * 0.06;
      curRotX += (targetRotX - curRotX) * 0.06;

      particles.rotation.y = curRotY;
      particles.rotation.x = curRotX;

      renderer.render(scene, camera);

      if (isVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    // 7. Intersection Observer for 0% CPU consumption off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    animate();

    // Cleanup on unmount
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (isDesktop) {
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="globe" className="relative py-20 sm:py-28 bg-[#0A0A0B] text-white overflow-hidden border-t border-b border-white/5">
      {/* Background Ambient Glow */}
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

        {/* 3D Global Particle Sphere Canvas (Compact, Gol/Duniya Type, Responsive) */}
        <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center">
          <div className="relative w-full flex justify-center items-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[460px] h-[300px] sm:h-[360px] touch-pan-y cursor-grab active:cursor-grabbing rounded-2xl"
            />

            {/* Edge Status Pills */}
            <div className="absolute top-2 left-2 bg-obsidian-900/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-left hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GLOBAL TELEMETRY: ACTIVE</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">3,000 Particle Nodes Synced</div>
            </div>

            <div className="absolute top-2 right-2 bg-obsidian-900/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-right hidden sm:block pointer-events-none">
              <div className="text-[10px] font-mono text-ember flex items-center gap-1.5 justify-end">
                <span>LATENCY</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">&lt; 3.0ms Global Avg</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            <span>Interactive 3D Harmonic Particle Globe &bull; Drag to Rotate</span>
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
