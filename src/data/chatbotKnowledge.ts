/**
 * GROWECH SOLUTION — Official Chatbot Grounded Knowledge Base
 * 
 * Strict grounding policy: All data is derived exclusively from verified agency operations,
 * services, FAQs, demonstration projects, and technical architectures.
 * ZERO hallucinated pricing, client names, or guarantees.
 */

export interface ServiceKnowledge {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  keyDeliverables: string[];
  businessImpact: string;
  responseTime: string;
  keywords: string[];
}

export interface FAQKnowledge {
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface CaseStudyKnowledge {
  id: string;
  title: string;
  industry: string;
  badgeType: string;
  solution: string;
  technologies: string[];
  impact: string;
  keywords: string[];
}

export interface IndustryKnowledge {
  name: string;
  badge: string;
  tagline: string;
  solution: string;
  workflows: string[];
  keywords: string[];
}

export interface AgencyKnowledgeBase {
  agencyName: string;
  tagline: string;
  officialWhatsAppNumber: string;
  officialWhatsAppDisplay: string;
  mission: string;
  corePhilosophy: string;
  techStack: string[];
  services: ServiceKnowledge[];
  faqs: FAQKnowledge[];
  caseStudies: CaseStudyKnowledge[];
  industries: IndustryKnowledge[];
  pricingPolicy: string;
  timelinePolicy: string;
  safetyAndRAGPolicy: string;
}

export const AGENCY_KNOWLEDGE: AgencyKnowledgeBase = {
  agencyName: 'GROWECH SOLUTION',
  tagline: 'High-Performance Business Web Platforms, WhatsApp Cloud Automation & Autonomous AI Systems',
  officialWhatsAppNumber: '923000000000',
  officialWhatsAppDisplay: '+92 300 0000000',
  mission: 'We engineer custom digital business architectures, sub-second web platforms, official Meta WhatsApp Cloud API workflows, and domain-trained autonomous AI agents to eliminate operational bottlenecks and drive scalable growth.',
  corePhilosophy: 'No bloated generic templates, no unreliable unofficial scrapers. Every architecture is bespoke, deterministic, secure, and built for sub-second execution.',
  techStack: [
    'React',
    'Vite',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Python',
    'Meta WhatsApp Business Cloud API',
    'Retrieval-Augmented Generation (RAG)',
    'Global Edge CDNs',
    'PostgreSQL / Cloud Databases'
  ],
  pricingPolicy: 'We do not utilize generic one-size-fits-all pricing packages because operational workflows, database complexity, and integrations vary for each business. Every project receives a transparent, tailored technical architecture proposal after an initial discovery consultation. You only pay for the exact systems and verified business outcomes your operation requires.',
  timelinePolicy: 'Focused business websites or WhatsApp automated booking flows typically launch within 2 to 3 weeks. Comprehensive enterprise architectures—such as custom e-commerce storefronts, multi-agent AI workflows, and bespoke CRM synchronizations—generally take 4 to 6 weeks from initial architecture design to final testing and go-live.',
  safetyAndRAGPolicy: 'Our autonomous AI agents are equipped with strict deterministic guardrails and Retrieval-Augmented Generation (RAG). They are grounded exclusively in approved internal knowledge bases (PDFs, spreadsheets, SOPs). If a customer asks a question outside documented parameters, the agent gracefully acknowledges the request and seamlessly routes the inquiry to a human team member.',

  services: [
    {
      id: 'business-websites',
      title: 'Bespoke Websites & High-Converting Web Platforms',
      category: 'Web Development & Platforms',
      shortDescription: 'High-performance modern business websites, conversion-focused landing pages, and sub-second web platforms engineered for brand authority and automated lead capture.',
      keyDeliverables: [
        'Custom modern business websites & landing pages (React, Next.js, Vite, Tailwind)',
        'Sub-second page navigation and 99+ Lighthouse performance scores',
        'Integrated lead capture forms and automated WhatsApp trigger funnels',
        'Advanced semantic HTML5 layout optimized for Google and AI search indexing'
      ],
      businessImpact: 'Transforms your web presence into an active 24/7 lead acquisition engine that feeds directly into automated follow-ups.',
      responseTime: 'Sub-second page navigation and instant global asset delivery.',
      keywords: ['website', 'web platform', 'landing page', 'react', 'next.js', 'frontend', 'speed', 'design', 'development', 'seo', 'lighthouse', 'site']
    },
    {
      id: 'whatsapp-automation',
      title: 'Official WhatsApp Automation & CRM Sync',
      category: 'Conversational Operations',
      shortDescription: 'Instant customer inquiry capture, multi-agent inbox routing, interactive catalog checkout, and verified WhatsApp Business Cloud API workflows.',
      keyDeliverables: [
        'Official Meta WhatsApp Cloud API verification and architecture (no account ban risk)',
        'Intelligent FAQ and inquiry triage auto-responders responding in under 3 seconds',
        'Interactive catalog browsing & appointment booking flows',
        'Bi-directional live CRM integration (HubSpot, Zoho, Salesforce, Google Sheets)'
      ],
      businessImpact: 'Prevents customer drop-off during off-peak hours and frees staff to focus on high-touch closing and service fulfillment.',
      responseTime: 'Reduces initial customer response lag from hours to under 3 seconds 24/7.',
      keywords: ['whatsapp', 'meta', 'cloud api', 'crm', 'messaging', 'chat', 'hubspot', 'zoho', 'sheets', 'instant reply', 'inbox', 'support', 'booking']
    },
    {
      id: 'ai-agents',
      title: 'Autonomous AI Agents',
      category: 'Applied AI',
      shortDescription: 'Custom task-oriented AI agents trained on your proprietary company knowledge base, operational rules, and operational guidelines with zero data-leakage safeguards.',
      keyDeliverables: [
        'Proprietary RAG knowledge bases with strict deterministic guardrails',
        'Multi-modal agents capable of parsing PDFs, invoices, and product specs',
        'Tool-calling integrations (database lookups, booking calendar reservations)',
        'Deterministic fallback systems routing to human team members'
      ],
      businessImpact: 'Enables consistent, high-accuracy customer and team support at scale while maintaining corporate brand standards.',
      responseTime: 'Delivers immediate context-aware responses with verified citations.',
      keywords: ['ai agent', 'agents', 'rag', 'retrieval', 'bot', 'knowledge base', 'tool calling', 'guardrails', 'multimodal', 'autonomous', 'level-1']
    },
    {
      id: 'ai-workflows',
      title: 'AI Business Workflow Orchestration',
      category: 'Enterprise Automation',
      shortDescription: 'End-to-end automation of document processing, client onboarding, data extraction, and internal operational handoffs.',
      keyDeliverables: [
        'Automated PDF, contract, and invoice extraction pipelines',
        'Automated email classification and CRM record creation',
        'Cross-platform webhook event triggers and notification channels',
        'Human-in-the-loop validation dashboards for sensitive operations'
      ],
      businessImpact: 'Streamlines operational bottlenecks and allows your business to handle 5x transaction volume with existing staff.',
      responseTime: 'Triggers instant downstream actions as soon as information is submitted.',
      keywords: ['workflow', 'orchestration', 'documents', 'invoice', 'parsing', 'extraction', 'onboarding', 'webhooks', 'crm records', 'pipeline', 'backoffice']
    },
    {
      id: 'ecommerce-development',
      title: 'E-Commerce Website & Storefront Engineering',
      category: 'Commerce Platforms',
      shortDescription: 'Robust digital shopping platforms built for frictionless checkout, high catalog volumes, inventory synchronization, and automated abandoned cart recovery.',
      keyDeliverables: [
        'Headless & modern commerce storefronts with blazing performance',
        'Custom checkout optimizations and localized payment gateway integrations',
        'Automated WhatsApp and email abandoned cart recovery sequences',
        'Real-time inventory and shipping carrier webhook integrations'
      ],
      businessImpact: 'Minimizes cart drop-offs, drives repeat buyer retention, and simplifies store fulfillment management.',
      responseTime: 'Instant order confirmations and automated delivery updates dispatched directly to buyer devices.',
      keywords: ['ecommerce', 'e-commerce', 'store', 'shop', 'cart', 'checkout', 'shopify', 'inventory', 'storefront', 'abandoned cart', 'payment']
    },
    {
      id: 'lead-generation-automation',
      title: 'Lead Generation & Qualification Automation',
      category: 'Growth Systems',
      shortDescription: 'Multi-channel acquisition pipelines that capture, verify, score, and nurture prospective clients before routing qualified opportunities to sales.',
      keyDeliverables: [
        'Interactive qualification multi-step forms with dynamic logic',
        'Automated phone number and email verification with instant data enrichment',
        'Lead scoring engines tailored to your ideal customer profile (ICP)',
        'Direct automated meeting scheduling with automatic calendar invites'
      ],
      businessImpact: 'Maximizes sales rep efficiency, increases meeting show-up rates, and accelerates deal velocity.',
      responseTime: 'Engages inbound leads within 30 seconds of form submission.',
      keywords: ['lead gen', 'lead generation', 'qualification', 'scoring', 'calendar', 'booking', 'funnel', 'forms', 'scheduling', 'sales']
    },
    {
      id: 'ai-creative',
      title: 'AI Creative & Advertising Solutions',
      category: 'Creative Tech',
      shortDescription: 'Data-informed creative asset generation, localized advertising variations, and automated marketing collateral at scale.',
      keyDeliverables: [
        'Brand-consistent design template pipelines with dynamic image replacement',
        'Algorithmic copy generation tailored to distinct audience segments',
        'Automated multi-format asset resizing for Stories, Feeds, and Banners',
        'Performance tracking dashboards for creative iteration'
      ],
      businessImpact: 'Enables agile marketing experimentation across ad channels without ballooning creative design costs.',
      responseTime: 'Reduces graphic resizing and copy drafting cycles from days to minutes.',
      keywords: ['creative', 'advertising', 'ads', 'marketing', 'video ad', 'banners', 'content generation', 'copywriting', 'assets']
    },
    {
      id: 'digital-business-solutions',
      title: 'Digital Business Solutions & System Integration',
      category: 'Systems Architecture',
      shortDescription: 'Connecting disparate legacy software, customer portals, cloud databases, and bespoke internal tool suites into a coherent digital ecosystem.',
      keyDeliverables: [
        'Custom internal portals and operational management dashboards',
        'Secure REST and GraphQL API middleware connecting legacy systems',
        'Automated backup, auditing, and role-based access control systems',
        'Cloud deployment infrastructure optimized for 99.9% uptime'
      ],
      businessImpact: 'Builds a resilient, scalable operational backbone that supports ongoing business expansion.',
      responseTime: 'Real-time synchronization ensuring all team members have immediate access to current records.',
      keywords: ['integration', 'system', 'api', 'dashboard', 'portal', 'legacy', 'database', 'middleware', 'enterprise']
    }
  ],

  faqs: [
    {
      category: 'WhatsApp & Automation',
      question: 'How does WhatsApp Automation integrate with our existing business number?',
      answer: 'We integrate with the official Meta WhatsApp Business Cloud API. You can either use an existing business landline/mobile number or set up a dedicated virtual number. Unlike unauthorized third-party scrapers, official Cloud API integration guarantees verified business identity, high message throughput, multi-agent simultaneous access, and complete protection against account bans.',
      keywords: ['whatsapp number', 'business number', 'ban', 'cloud api', 'official', 'scraper', 'meta']
    },
    {
      category: 'AI & Safety',
      question: 'How do you ensure AI Agents do not provide inaccurate information or hallucinate?',
      answer: 'We build strict deterministic guardrails and Retrieval-Augmented Generation (RAG) frameworks. The AI agent is grounded exclusively in your approved internal knowledge base (PDFs, spreadsheets, website URLs, and SOPs). If a customer asks a question outside your defined documentation, the agent acknowledges the query gracefully and seamlessly routes the inquiry to your human team.',
      keywords: ['hallucinate', 'hallucination', 'accurate', 'safety', 'guardrails', 'rag', 'accuracy', 'trust']
    },
    {
      category: 'Implementation & Timeline',
      question: 'What is the typical deployment timeline for a custom website or automation suite?',
      answer: 'A focused business website or WhatsApp automated booking flow typically launches within 2 to 3 weeks. Comprehensive enterprise architectures—such as custom e-commerce storefronts, multi-agent AI workflows, and bespoke CRM synchronizations—generally take 4 to 6 weeks from initial architecture design to final testing and go-live.',
      keywords: ['timeline', 'how long', 'duration', 'weeks', 'turnaround', 'delivery', 'launch', 'time']
    },
    {
      category: 'Technology & Hosting',
      question: 'What technology stack does GROWECH SOLUTION utilize?',
      answer: 'We architect modern, high-performance solutions using React, Vite, Next.js, Tailwind CSS, TypeScript, Node.js, and Python for backend agent orchestration. Deployments run on global content delivery networks (CDNs) for instantaneous loading, extreme security, 99.9% uptime, and zero bloated server overhead.',
      keywords: ['tech stack', 'technology', 'stack', 'framework', 'react', 'nextjs', 'python', 'hosting', 'cdn']
    },
    {
      category: 'Integration & Legacy Systems',
      question: 'Can GROWECH connect with our existing CRM, booking software, or database?',
      answer: 'Yes. We engineer bi-directional webhooks and custom API connectors for popular platforms including HubSpot, Zoho, Google Sheets, Salesforce, Shopify, WooCommerce, Airtable, and custom SQL/NoSQL databases. When an automation triggers, your internal systems update in real time with zero manual double-entry.',
      keywords: ['crm', 'hubspot', 'zoho', 'salesforce', 'connect', 'shopify', 'sheets', 'airtable', 'integration']
    },
    {
      category: 'Pricing & Scoping',
      question: 'How are projects scoped and priced?',
      answer: 'Because every business has distinct operational requirements, workflows, and database complexities, we provide transparent, custom architecture proposals following an initial discovery consultation. We do not use rigid one-size-fits-all package tiers; you only pay for the exact systems and business outcomes your operation requires.',
      keywords: ['pricing', 'price', 'cost', 'how much', 'quote', 'package', 'rate', 'fees']
    },
    {
      category: 'Support & Maintenance',
      question: 'What ongoing maintenance and support does GROWECH provide post-launch?',
      answer: 'Every deployment includes a comprehensive warranty period, staff training sessions, and detailed documentation. We also offer dedicated ongoing SLA support covering API version updates (such as Meta WhatsApp changes), server monitoring, continuous AI prompt optimization, and quarterly security audits.',
      keywords: ['maintenance', 'support', 'warranty', 'sla', 'training', 'updates', 'monitoring']
    }
  ],

  caseStudies: [
    {
      id: 'restaurant-demo',
      title: 'Multi-Location Restaurant Reservation & WhatsApp Order Dispatcher',
      industry: 'Hospitality & Dining',
      badgeType: 'DEMO PROJECT',
      solution: 'Interactive mobile digital menu web application integrated with official WhatsApp Business Cloud API for automated table reservations, kitchen order webhooks, and 2-hour reminder triggers.',
      technologies: ['React', 'Tailwind CSS', 'WhatsApp Cloud API', 'Webhooks', 'Node.js'],
      impact: 'Eliminates telephone congestion during peak hours, prevents no-shows, and saves up to 30% aggregator platform commissions on direct orders.',
      keywords: ['restaurant', 'food', 'cafe', 'reservation', 'table', 'dining', 'menu']
    },
    {
      id: 'real-estate-concept',
      title: 'Luxury Property Investor Lead Qualification & Dossier Dispatcher',
      industry: 'Real Estate & Development',
      badgeType: 'CONCEPT PROJECT',
      solution: 'Interactive 3D developer showcase landing page coupled with a multi-step WhatsApp qualification agent that collects investment budget, unit preferences, and residency goals before delivering high-resolution brochures.',
      technologies: ['Next.js', 'Framer Motion', 'CRM Webhooks', 'WhatsApp API', 'PostgreSQL'],
      impact: 'Sub-5-second lead engagement 24/7 across all global time zones, sorting VIP qualified investors from casual inquiries.',
      keywords: ['real estate', 'property', 'investor', 'broker', 'luxury', 'brochure', 'apartments']
    },
    {
      id: 'clinic-sample',
      title: 'Specialized Healthcare Clinic 24/7 Triage & Smart Scheduling System',
      industry: 'Medical & Healthcare',
      badgeType: 'SAMPLE WORK',
      solution: 'Accessible patient clinic website with doctor directory and conversational triage agent that verifies schedules, books appointments 24/7, and sends digital pre-visit intake forms.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Calendar APIs', 'Meta Cloud API'],
      impact: 'Relieves receptionists from repetitive telephone calls and substantially reduces appointment no-shows via automated 24h WhatsApp reminders.',
      keywords: ['clinic', 'healthcare', 'doctor', 'patient', 'hospital', 'dental', 'medical', 'appointment']
    },
    {
      id: 'ecommerce-demo',
      title: 'Headless D2C Storefront with WhatsApp Cart Recovery & Order Tracking',
      industry: 'E-commerce & Retail',
      badgeType: 'DEMO PROJECT',
      solution: 'Modern headless storefront with sub-second page loads, one-click checkout, automated WhatsApp abandoned cart recovery, and instant order tracking bot.',
      technologies: ['Vite', 'Tailwind CSS', 'Shopify Storefront API', 'WhatsApp API', 'Cloudflare'],
      impact: 'Recovers lost e-commerce revenue with 70%+ WhatsApp open rates and eliminates repetitive order tracking inquiries.',
      keywords: ['storefront', 'd2c', 'cart recovery', 'wismo', 'tracking', 'order status', 'retail']
    }
  ],

  industries: [
    {
      name: 'Restaurants & Cafes',
      badge: 'Hospitality & Dining',
      tagline: 'Automated table reservations, WhatsApp digital menus, and streamlined order routing.',
      solution: 'Direct-ordering mobile web menus with automated WhatsApp table booking, 2-hour reminder notifications, and QR digital menus.',
      workflows: ['WhatsApp table reservation bot', 'Automated 2-hour reminder triggers', 'QR contactless menu with order dispatch', 'Google Maps review routing'],
      keywords: ['restaurant', 'cafe', 'dining', 'hospitality', 'food']
    },
    {
      name: 'Clinics & Specialized Healthcare',
      badge: 'Medical & Wellness',
      tagline: '24/7 patient triage, automated doctor scheduling, and confidential appointment management.',
      solution: 'Compliant patient portals and automated WhatsApp receptionists that answer treatment questions, verify doctor schedules, and dispatch pre-visit forms.',
      workflows: ['24/7 doctor appointment booking', 'Automated reminder triggers with one-tap rescheduling', 'Digital pre-visit patient intake forms', 'Post-consultation medication guides'],
      keywords: ['clinic', 'doctor', 'healthcare', 'dental', 'hospital']
    },
    {
      name: 'Real Estate & Property Development',
      badge: 'Real Estate',
      tagline: 'Instant buyer qualification, interactive architectural showcases, and automated brochure dispatch.',
      solution: 'Sub-second architectural project landing pages paired with automated WhatsApp buyer intake agents.',
      workflows: ['Sub-5-second lead engagement', 'Budget and property type qualification', 'Instant PDF brochure dispatch', 'Senior broker VIP routing'],
      keywords: ['real estate', 'property', 'developer', 'broker']
    },
    {
      name: 'E-Commerce & Direct-to-Consumer (D2C)',
      badge: 'Commerce & Retail',
      tagline: 'Headless storefronts, high-converting checkout flows, and automated WhatsApp cart recovery.',
      solution: 'Performance-engineered shopping experiences with automated cart recovery and instant order tracking bots.',
      workflows: ['WhatsApp abandoned cart recovery with 70%+ open rates', 'Real-time parcel tracking via WhatsApp', 'Automated stock restock alerts', 'Post-purchase review collection'],
      keywords: ['ecommerce', 'd2c', 'store', 'retail', 'brand']
    }
  ]
};

export const QUICK_SUGGESTIONS = [
  '⚡ What services do you build?',
  '💬 How does WhatsApp Automation work?',
  '🤖 Tell me about Autonomous AI Agents',
  '🛒 E-Commerce & Web Platforms',
  '⏱️ What are your deployment timelines?',
  '📅 I want to start a project'
];
