# GROWECH SOLUTION — Official Agency Website

> High-Performance Digital Solutions & AI Engineering Agency Platform  
> Seamless Dark/Light Dual-Mood Transitions &bull; Concentric Preloader Logo Morph &bull; Interactive 3D Dotted Globe &bull; GitHub Pages Ready

---

## Overview

**GROWECH SOLUTION** is a specialized digital solutions agency that helps modern businesses improve their digital presence, automate repetitive operations, capture and qualify leads, and implement AI-powered workflows.

This repository contains the complete frontend web application engineered with sub-second performance, responsive layouts, motion physics, and zero server-side runtime requirements.

---

## Key Features & Visual Choreography

1. **Brand Preloader & Hero Logo Morph**:
   - Initial State: Pitch dark canvas with pulsing concentric ember rings.
   - Logo Morph: Rings collapse into the metallic 'G' crest logo mark.
   - Docking Transition: Smoothly transitions into the floating header pill with spring physics (`stiffness: 120, damping: 20`), revealing logotype and top ambient orange laser ray.
2. **Dynamic Dual-Mood Dark/Light Contrast**:
   - **Section 1 (Hero - Dark)**: Central AI edge node diagram with animated glowing circuit paths and live system telemetry.
   - **Section 2 (Inverted Pure White Section)**: Split layout with live interactive workflow card and staggered tag chips.
   - **Section 3 (Dark Bento Grid)**: Interactive radial cursor spotlight (`useMouseSpotlight`), Meta Cloud API card, and speed metrics.
   - **Section 4 (Center 3D Dotted Globe)**: Interactive HTML5 Canvas/Three.js particle sphere with radiant orange rim lighting and drag rotation.
   - **Section 5 (Interactive Automation Lab - White Capsule)**: Real-time simulation of restaurant table bookings, real estate investor qualification, and clinic patient triage.
   - **Section 6 (Verified Work Demonstrations)**: Clean cards strictly demarcated as `DEMO PROJECT`, `CONCEPT PROJECT`, and `SAMPLE WORK` with zero fabricated metrics or testimonials.
   - **Section 7 (Solution Architecture Matrix)**: 3-tier capability matrix focusing on deliverables, stack, and scope with **strictly zero pricing** in full compliance with brand guidelines.
   - **Section 8 (FAQ Accordion)**: Smooth Framer Motion `AnimatePresence` height transitions answering genuine technical and operational questions.
   - **Section 9 (Bottom Horizon CTA)**: Large ambient orange curved bottom horizon/sunrise glow with direct WhatsApp and consultation triggers.
   - **Section 10 (Footer)**: Multi-column navigation, live status indicators (`99.98% SLA`, `Accepting Q3/Q4 Deployments`), and AI machine-readable index.

---

## Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom obsidian, ivory, and neon orange ember palettes
- **Animation**: Framer Motion + Lenis Smooth Scroll (`lerp: 0.08, duration: 1.2`)
- **3D Visualization**: Lightweight high-performance Canvas 3D Fibonacci particle sphere
- **Iconography**: Lucide React
- **SEO & AI Discoverability**: Schema.org JSON-LD (`Organization`, `WebSite`, `Service`, `FAQPage`, `BreadcrumbList`), semantic HTML5, `robots.txt`, and `sitemap.xml`

---

## Local Development & Build

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle (generates dist/)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 1-Click Deployment to GitHub Pages

This project is built with `base: './'` in `vite.config.ts`, generating 100% relative asset paths. It runs out of the box on any GitHub Pages repository without URL path breakages.

### Method A: Automated GitHub Actions (Included)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GROWECH SOLUTION official agency website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. In your GitHub repository settings:
   - Navigate to **Settings** &rarr; **Pages**
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**
3. The workflow file at `.github/workflows/deploy.yml` will automatically build and publish the website to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

### Method B: Deploying `dist/` Directly
You can also deploy the contents of the `dist/` directory directly to GitHub Pages, Cloudflare Pages, Vercel, or Netlify with zero configuration.
