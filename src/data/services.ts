export interface ServiceDetail {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  iconName: string;
  problem: string;
  solution: string;
  whatWeBuild: string[];
  manualWorkReduction: string;
  responseTimeImprovement: string;
  customerExperience: string;
  businessImpact: string;
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'business-websites',
    title: 'Bespoke Websites & High-Converting Web Platforms',
    shortDescription: 'High-performance business websites, conversion-focused landing pages, and modern web architectures engineered for brand authority, sub-second speeds, and automated lead capture.',
    category: 'Web Development & Platforms',
    iconName: 'Layout',
    problem: 'Generic website templates with bloated code load sluggishly, suffer from poor mobile responsiveness, fail search rankings, and lose potential leads before they even inquire.',
    solution: 'Custom-coded, responsive modern web architecture designed with semantic structure, sub-second load speeds, conversion psychology, and seamless integration with WhatsApp and AI lead handling.',
    whatWeBuild: [
      'Custom modern business websites & high-converting landing pages (React, Next.js, Vite, Tailwind)',
      'Headless e-commerce storefronts with frictionless mobile checkout',
      'Integrated lead capture forms and automated WhatsApp trigger funnels',
      'Advanced semantic HTML5 layout for Google & AI search engine indexing (99+ Lighthouse)'
    ],
    manualWorkReduction: 'Automated lead qualification forms, interactive booking widgets, and self-service customer exploration.',
    responseTimeImprovement: 'Sub-second page navigation and instant asset delivery via global CDN caches.',
    customerExperience: 'Frictionless, visually commanding browsing experience that builds immediate authority and trust.',
    businessImpact: 'Transforms your web presence into an active 24/7 lead acquisition engine that feeds directly into automated follow-ups.'
  },
  {
    id: 'whatsapp-automation',
    title: 'Official WhatsApp Automation & CRM Sync',
    shortDescription: 'Instant customer inquiry capture, multi-agent inbox routing, interactive catalog checkout, and verified WhatsApp Business Cloud API workflows.',
    category: 'Conversational Operations',
    iconName: 'MessageSquare',
    problem: 'Inbound inquiries via WhatsApp often sit unanswered for hours outside business shifts, leading to lost customer interest and overburdened support staff manually answering repeated questions.',
    solution: 'Engineered automated multi-step conversation funnels that respond within seconds, qualify lead intent, route complex queries to staff, and sync conversation records directly with your CRM.',
    whatWeBuild: [
      'Official WhatsApp Cloud API verification and architecture',
      'Intelligent FAQ & inquiry triage auto-responders',
      'Interactive catalog browsing & appointment booking flows',
      'Live bi-directional CRM integration (HubSpot, Zoho, Google Sheets)'
    ],
    manualWorkReduction: 'Can reduce repetitive initial inquiry screening and manual copy-pasting of customer details by up to 80%.',
    responseTimeImprovement: 'Can decrease initial customer response lag from several hours to under 3 seconds 24/7.',
    customerExperience: 'Customers receive instantaneous, accurate assistance inside their preferred daily messaging app without waiting on hold.',
    businessImpact: 'Prevents customer drop-off during off-peak hours and frees staff to focus on high-touch closing and service fulfillment.'
  },
  {
    id: 'ai-agents',
    title: 'Autonomous AI Agents',
    shortDescription: 'Custom task-oriented AI agents trained on your proprietary company knowledge base, operational rules, and operational guidelines.',
    category: 'Applied AI',
    iconName: 'Bot',
    problem: 'Standard rule-based chatbots fail whenever queries deviate slightly from rigid decision trees, resulting in user frustration and escalated ticket volume.',
    solution: 'Domain-trained autonomous AI agents equipped with retrieval-augmented generation (RAG) and strict business guardrails that understand nuance, verify facts against internal documents, and trigger authorized tools.',
    whatWeBuild: [
      'Proprietary RAG knowledge bases with zero data-leakage safeguards',
      'Multi-modal agents capable of reading PDFs, invoices, and product specs',
      'Tool-calling integrations (database lookups, booking calendar reservations)',
      'Deterministic fallback systems to human team members'
    ],
    manualWorkReduction: 'Can minimize routine Level-1 customer and internal operational queries without adding headcount.',
    responseTimeImprovement: 'Delivers immediate context-aware responses with citations from your documented guidelines.',
    customerExperience: 'Natural conversational interactions that directly solve customer requests without frustrating dead ends.',
    businessImpact: 'Enables consistent, high-accuracy customer and team support at scale while maintaining corporate brand standards.'
  },
  {
    id: 'ai-workflows',
    title: 'AI Business Workflow Orchestration',
    shortDescription: 'End-to-end automation of document processing, client onboarding, data extraction, and internal operational handoffs.',
    category: 'Enterprise Automation',
    iconName: 'Cpu',
    problem: 'Teams waste valuable working hours manually processing incoming client intake forms, sorting unstructured emails, entering spreadsheet data, and chasing approvals.',
    solution: 'Unified AI-powered workflow pipelines that automatically parse inbound documents, summarize key parameters, update internal databases, and notify stakeholders with actionable summaries.',
    whatWeBuild: [
      'Automated PDF, contract, and invoice extraction pipelines',
      'Automated email classification and CRM record creation',
      'Cross-platform webhook event triggers and notification channels',
      'Human-in-the-loop validation dashboards for sensitive operations'
    ],
    manualWorkReduction: 'Eliminates hours of manual data entry, file renaming, and multi-app copy-pasting across departments.',
    responseTimeImprovement: 'Triggers instant downstream actions as soon as a client or partner submits information.',
    customerExperience: 'Swift onboarding, expedited project kickoffs, and zero lost customer documents.',
    businessImpact: 'Streamlines operational bottlenecks and allows your business to handle 5x transaction volume with existing staff.'
  },
  {
    id: 'ecommerce-development',
    title: 'E-commerce Website & Storefront Engineering',
    shortDescription: 'Robust digital shopping platforms built for frictionless checkout, high catalog volumes, inventory synchronization, and automated abandoned cart recovery.',
    category: 'Commerce Platforms',
    iconName: 'ShoppingCart',
    problem: 'Standard storefronts often struggle with slow mobile checkouts, complicated payment gateways, and lack of real-time inventory management across sales channels.',
    solution: 'High-converting custom commerce storefronts with optimized one-click checkout flows, localized payment methods, dynamic product search, and automated stock alerts.',
    whatWeBuild: [
      'Headless & modern commerce storefronts with blazing performance',
      'Custom checkout optimizations and local payment gateway integrations',
      'Automated WhatsApp and email abandoned cart recovery sequences',
      'Real-time inventory and shipping carrier webhook integrations'
    ],
    manualWorkReduction: 'Automates customer order confirmation notices, shipping tracking, and inventory count deductions.',
    responseTimeImprovement: 'Instant order confirmations and automated delivery updates sent directly to buyer devices.',
    customerExperience: 'Fast, secure checkout on mobile with transparent delivery updates and clear payment options.',
    businessImpact: 'Minimizes cart drop-offs, drives repeat buyer retention, and simplifies store fulfillment management.'
  },
  {
    id: 'lead-generation-automation',
    title: 'Lead Generation & Qualification Automation',
    shortDescription: 'Multi-channel acquisition pipelines that capture, verify, score, and nurture prospective clients before routing qualified opportunities to sales.',
    category: 'Growth Systems',
    iconName: 'Zap',
    problem: 'Sales professionals spend 60% of their day contacting unqualified leads who lack purchasing authority, budget, or genuine intent.',
    solution: 'Smart interactive lead forms and conversational qualification funnels that evaluate lead fit, verify phone numbers and emails, and route hot prospects to sales calendars.',
    whatWeBuild: [
      'Interactive qualification multi-step forms with dynamic logic',
      'Automated email/SMS verification and instant data enrichment',
      'Lead scoring engines tailored to your ideal customer profile',
      'Direct automated meeting scheduler with automatic calendar invites'
    ],
    manualWorkReduction: 'Removes the need for sales reps to manually dial unverified or dead lead submissions.',
    responseTimeImprovement: 'Engages inbound leads within 30 seconds of form submission via instant messaging or email.',
    customerExperience: 'Prospects get immediate scheduling confirmation without back-and-forth email tagging.',
    businessImpact: 'Maximizes sales rep efficiency, increases meeting show-up rates, and accelerates deal velocity.'
  },
  {
    id: 'ai-creative',
    title: 'AI Creative & Advertising Solutions',
    shortDescription: 'Data-informed creative asset generation, localized advertising variations, and automated marketing collateral at scale.',
    category: 'Creative Tech',
    iconName: 'Sparkles',
    problem: 'Producing continuous ad variations, multi-language social banners, and promotional campaign materials creates major production bottlenecks and high agency overhead.',
    solution: 'Structured creative generation pipelines that produce brand-consistent visual assets, copy variations, and promotional templates adapted for multi-channel digital campaigns.',
    whatWeBuild: [
      'Brand-consistent design template pipelines with dynamic image replacement',
      'Algorithmic copy generation tailored to distinct audience segments',
      'Automated multi-format asset resizing (Stories, Feeds, Banners)',
      'Performance tracking dashboards for creative iteration'
    ],
    manualWorkReduction: 'Reduces manual graphic resizing and repetitive copy drafting cycles from days to minutes.',
    responseTimeImprovement: 'Enables rapid launch of timely marketing campaigns and product promotions.',
    customerExperience: 'Consistent, polished visual storytelling across all digital touchpoints.',
    businessImpact: 'Enables agile marketing experimentation across ad channels without ballooning creative design costs.'
  },
  {
    id: 'digital-business-solutions',
    title: 'Digital Business Solutions & System Integration',
    shortDescription: 'Connecting disparate legacy software, customer portals, cloud databases, and bespoke internal tool suites into a coherent digital ecosystem.',
    category: 'Systems Architecture',
    iconName: 'Layers',
    problem: 'Businesses suffer from fragmented software tools where accounting, sales, inventory, and customer support operate in siloed data islands with no sync.',
    solution: 'Engineered custom APIs, central data hubs, and responsive administrative dashboards that unite your company data in real time with high reliability.',
    whatWeBuild: [
      'Custom internal portals and operational management dashboards',
      'Secure REST and GraphQL API middleware connecting legacy systems',
      'Automated backup, auditing, and role-based access control systems',
      'Cloud deployment infrastructure optimized for 99.9% uptime'
    ],
    manualWorkReduction: 'Eliminates manual file exports, reconciliation spreadsheets, and cross-system data updates.',
    responseTimeImprovement: 'Real-time synchronization ensures all team members have immediate access to current records.',
    customerExperience: 'Smooth, integrated service delivery where customer records are unified across all departments.',
    businessImpact: 'Builds a resilient, scalable operational backbone that supports ongoing business expansion.'
  }
];
