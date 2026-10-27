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
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'restaurant-demo',
    badgeType: 'DEMO PROJECT',
    title: 'Multi-Location Restaurant Reservation & WhatsApp Order Dispatcher',
    industry: 'Hospitality & Dining',
    overview: 'An interactive demonstration demonstrating how high-volume eateries can eliminate telephone reservation bottlenecks and bypass commission-heavy food delivery aggregators.',
    problem: 'Peak-hour phone lines often resulted in unanswered calls, lost table reservations, and 20-30% aggregator platform commissions on everyday takeaway orders.',
    solution: 'Designed an interactive mobile-optimized digital menu web application integrated directly with the official WhatsApp Business Cloud API for automated table reservations and takeaway order coordination.',
    whatWasBuilt: [
      'Sub-second mobile responsive menu with real-time dietary filtering',
      'Automated WhatsApp reservation bot with dynamic table slot verification',
      'Kitchen order dispatch webhook feeding orders directly to kitchen thermal printers',
      'Automated SMS / WhatsApp reservation reminders with one-tap cancellation'
    ],
    automationHighlights: [
      'Zero manual staff handling required for standard table reservation confirmations',
      'Automated reminder sent 2 hours before dining, significantly reducing empty table no-shows',
      'Direct order receipts and Google Maps location pins dispatched instantly to guest phones'
    ],
    businessImpact: [
      'Can eliminate telephone congestion during dinner peak hours',
      'Protects profit margins by routing repeat loyal diners to direct ordering channels',
      'Builds an owned, compliant guest contact database for future seasonal announcements'
    ],
    technologies: ['React', 'Tailwind CSS', 'WhatsApp Cloud API', 'Webhooks', 'Node.js']
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
