import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InvertedSection } from './components/InvertedSection';
import { BentoGrid } from './components/BentoGrid';
import { GlobeSection } from './components/GlobeSection';
import { InteractivePlayground } from './components/InteractivePlayground';
import { WorkShowcase } from './components/WorkShowcase';
import { ArchitectureTiers } from './components/ArchitectureTiers';
import { FAQSection } from './components/FAQSection';
import { HorizonCTA } from './components/HorizonCTA';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { Chatbot } from './components/Chatbot';
import { SEO } from './components/SEO';

export function App() {
  // Initialize Lenis smooth scrolling globally with exact choreography physics
  useLenis();

  // Guard against duplicate loading screen execution
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('growech_preloaded_once'));
    }
    return false;
  });

  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleComplete = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('growech_preloaded_once', 'true');
    }
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-ember selection:text-white relative">
      {/* Schema.org Structured Data Injector */}
      <SEO />

      {/* Branded Pre-loader: Strictly Single Execution */}
      {!isLoaded && <Preloader onComplete={handleComplete} />}

      {/* Floating Pill Glassmorphism Navigation Bar */}
      <Navbar
        isLoaded={isLoaded}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 1: Hero (Dark with AI Edge Node Diagram) */}
        <Hero onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 2: Inverted High-Contrast Ivory White Section */}
        <InvertedSection onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 3: Dark Bento Grid ("Unleash Potential") */}
        <BentoGrid onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 4: Center Globe Highlight (3D Dotted Matrix Particle Sphere) */}
        <GlobeSection />

        {/* Section 5: White Interactive Playground ("Discover the Realm" - AI Simulator) */}
        <InteractivePlayground onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 6: Verified Demonstrations & Concept Projects */}
        <WorkShowcase onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 7: Scalable Solution Architecture Tiers (Strictly Zero Pricing) */}
        <ArchitectureTiers onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 8: FAQ Accordion */}
        <FAQSection onOpenContact={() => setIsContactOpen(true)} />

        {/* Section 9: Ambient Orange Horizon Bottom CTA */}
        <HorizonCTA onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* Section 10: Multi-column Dark Footer & System Telemetry */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Contact & Consultation Booking Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Floating AI Agency Chatbot */}
      <Chatbot
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}

export default App;
