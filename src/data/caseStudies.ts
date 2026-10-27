export interface CaseStudy {
  id: string;
  badgeType: 'DEMO PROJECT' | 'CONCEPT PROJECT' | 'SAMPLE WORK';
  title: string;
  industry: string;
  overview: string;
  problem: string;
  solution: string;
  whatWasBuilt: string[];
  automationHighlights: string[];
  businessImpact: string[];
  technologies: string[];
  liveDemoUrl?: string;
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'restaurant-demo',
    badgeType: 'DEMO PROJECT',
    title: 'Growech Dine — Offline-First Restaurant POS & Kitchen Display Suite',
    industry: 'Hospitality, Dining & QSR Chains',
    liveDemoUrl: './dine/',
    overview: 'An enterprise-grade, offline-first restaurant management and touch POS system engineered by Growech Solution. Built with local LAN resilience for 100% zero downtime during peak rush hours, multi-station Kitchen Display (KDS), table floor maps, and automated WhatsApp guest notifications.',
    problem: 'Restaurants lose 15-30% revenue to third-party delivery aggregators, pay recurring monthly cloud POS SaaS subscriptions, and suffer complete operational shutdowns when their cloud POS loses internet connection during peak dinner service.',
    solution: 'Engineered an offline-first, local-server POS ecosystem running on local restaurant hardware with zero cloud dependencies for billing and kitchen ticketing, coupled with contactless QR menus and WhatsApp automated order tracking.',
    whatWasBuilt: [
      'Touch-Optimized Billing & Dine-In POS Terminal (Split checks, combos, modifiers, thermal printing)',
      'Digital Kitchen Display System (KDS) routing food orders with live prep timers across stations',
      'Interactive Graphical Table & Floor Map showing real-time dining, vacant, and billing status',
      'Contactless Table QR Menu with instant guest mobile ordering',
      'Ingredient-Level Inventory Management & Recipe Costing to eliminate kitchen pilferage',
      'Staff Role-Based Access Control (RBAC) with secure 4-digit PIN authentication',
      'Automated WhatsApp Table Reservation bot with instant guest confirmation receipts'
    ],
    automationHighlights: [
      '100% Offline LAN operation: Billing and kitchen order tickets (KOT) function without internet',
      'Automated table status updates synchronization between hostess station, waiters, and kitchen',
      'Automated WhatsApp reservation reminders and direct digital receipt delivery to guest phones',
      'Zero monthly SaaS recurring fee trap: 100% client code and database ownership'
    ],
    businessImpact: [
      'Cuts table checkout and order punching time by 50% during peak service',
      'Eliminates lost orders and paper kitchen ticket clutter with color-coded KDS screens',
      'Saves restaurants thousands of dollars annually in aggregator commissions and SaaS subscriptions',
      'Guarantees zero operational downtime even during total ISP or internet outages'
    ],
    technologies: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Offline LAN Engine', 'Prisma ORM', 'WhatsApp Cloud API', 'WebSockets', 'Thermal Print Esc/POS']
  },
  {
    id: 'real-estate-concept',
    badgeType: 'CONCEPT PROJECT',
    title: 'Luxury Property Investor Lead Qualification & Dossier Dispatcher',
    industry: 'Real Estate & Development',
    overview: 'A showcase concept showing how real estate brokerages can instantly engage high-net-worth property inquiries from international ad campaigns with zero response latency.',
    problem: 'Digital ad campaigns generate hundreds of inquiries, but sales brokers waste hours calling unverified leads or sending repetitive PDF brochures manually.',
    solution: 'Engineered an interactive developer showcase landing page coupled with a multi-step WhatsApp qualification agent that collects investment budget, unit preferences, and residency goals before delivering high-resolution brochures.',
    whatWasBuilt: [
      'Immersive 3D architectural showcase with interactive floor plan viewing',
      'Intelligent WhatsApp qualification dialogue with budget-tier sorting',
      'Dynamic PDF brochure delivery directly within the messaging window',
      'Direct CRM integration assigning VIP qualified leads to designated senior brokers'
    ],
    automationHighlights: [
      'Sub-5-second lead engagement 24/7 across all global time zones',
      'Automated qualification scoring separates qualified investors from casual tire-kickers',
      'Automated calendar booking for VIP private viewing appointments'
    ],
    businessImpact: [
      'Accelerates initial contact response speed from hours to seconds',
      'Maximizes broker productivity by focusing high-value sales talent exclusively on qualified prospects',
      'Maintains complete audit trails of client interactions inside the central CRM'
    ],
    technologies: ['Next.js', 'Framer Motion', 'CRM Webhooks', 'WhatsApp API', 'PostgreSQL']
  },
  {
    id: 'clinic-sample',
    badgeType: 'SAMPLE WORK',
    title: 'Specialized Healthcare Clinic 24/7 Triage & Smart Scheduling System',
    industry: 'Medical & Healthcare',
    overview: 'A reference architecture illustrating how private healthcare practices and dental centers can streamline patient appointments and pre-visit intake.',
    problem: 'Front-desk medical receptionists were overwhelmed with repeated inquiries about doctor schedules, accepted insurance networks, and treatment consultation pricing.',
    solution: 'Implemented a clean, accessible patient portal integrated with an automated medical receptionist that answers verified clinic FAQs and assists patients in scheduling appointments with appropriate specialists.',
    whatWasBuilt: [
      'Accessible, multilingual patient clinic website with doctor directory',
      'Conversational intake agent providing verified answers from clinic clinical guidelines',
      'Automated appointment calendar synchronization with doctor availability rules',
      'Secure digital pre-visit registration form eliminating waiting room clipboard delays'
    ],
    automationHighlights: [
      'Continuous 24/7 appointment scheduling capability even during weekends and holidays',
      'Automated appointment preparation guidelines (e.g. fasting requirements before blood panels)',
      'Automated follow-up reminders 24 hours prior to consultation'
    ],
    businessImpact: [
      'Relieves front-desk staff from answering routine repetitive telephone inquiries',
      'Can noticeably decrease patient no-show rates via proactive messaging reminders',
      'Enhances patient perception through prompt, professional, and discreet digital communication'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Calendar APIs', 'Meta Cloud API']
  },
  {
    id: 'ecommerce-demo',
    badgeType: 'DEMO PROJECT',
    title: 'Headless D2C Storefront with WhatsApp Cart Recovery & Order Tracking',
    industry: 'E-commerce & Retail',
    overview: 'A live demonstration architecture for online retailers seeking to recapture abandoned carts and provide automated parcel tracking without support tickets.',
    problem: 'High cart abandonment rates on mobile devices and a steady volume of "Where is my order?" tickets draining customer service bandwidth.',
    solution: 'Engineered a modern headless storefront with instant page loads, one-click checkout, and an automated WhatsApp messaging trigger for cart recovery and real-time shipping tracking.',
    whatWasBuilt: [
      'Blazing-fast mobile storefront with optimistic UI and instant search',
      'Automated abandoned checkout webhook sequence triggering conversational recovery',
      'Courier tracking webhook bot providing instant order updates upon reference number entry',
      'Automated post-purchase review collection and VIP loyalty incentives'
    ],
    automationHighlights: [
      'Automated recovery messages delivered directly to WhatsApp with 70%+ open rates',
      'Self-service order tracking resolving WISMO inquiries without human intervention',
      'Automated inventory restock notifications for previously sold-out items'
    ],
    businessImpact: [
      'Recovers lost e-commerce revenue that standard email sequences miss',
      'Reduces post-purchase customer support ticket load substantially',
      'Delivers an ultra-slick, modern buying experience matching world-class enterprise brands'
    ],
    technologies: ['Vite', 'Tailwind CSS', 'Shopify Storefront API', 'WhatsApp API', 'Cloudflare']
  }
];
