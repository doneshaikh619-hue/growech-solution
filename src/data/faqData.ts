export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    category: 'WhatsApp & Automation',
    question: 'How does WhatsApp Automation integrate with our existing business number?',
    answer: 'We integrate with the official Meta WhatsApp Business Cloud API. You can either use an existing business landline/mobile number or set up a dedicated virtual number. Unlike unauthorized third-party scrapers, official Cloud API integration guarantees verified business identity, high message throughput, multi-agent simultaneous access, and complete protection against account bans.'
  },
  {
    category: 'AI & Safety',
    question: 'How do you ensure AI Agents do not provide inaccurate information or "hallucinate"?',
    answer: 'We build strict deterministic guardrails and Retrieval-Augmented Generation (RAG) frameworks. The AI agent is grounded exclusively in your approved internal knowledge base (PDFs, spreadsheets, website URLs, and standard operating procedures). If a customer asks a question outside your defined documentation, the agent is programmed to acknowledge the query gracefully and seamlessly route the inquiry to your human team.'
  },
  {
    category: 'Implementation & Timeline',
    question: 'What is the typical deployment timeline for a custom website or automation suite?',
    answer: 'Timelines depend on project scope. A focused business website or WhatsApp automated booking flow typically launches within 2 to 3 weeks. Comprehensive enterprise architectures—such as custom e-commerce storefronts, multi-agent AI workflows, and bespoke CRM synchronizations—generally take 4 to 6 weeks from initial architecture design to final testing and go-live.'
  },
  {
    category: 'Technology & Hosting',
    question: 'What technology stack does GROWECH SOLUTION utilize?',
    answer: 'We architect modern, high-performance solutions using React, Vite, Next.js, Tailwind CSS, TypeScript, Node.js, and Python for backend agent orchestration. Websites are deployed to global content delivery networks (CDNs) for instantaneous loading, extreme security, 99.9% uptime, and zero bloated server overhead.'
  },
  {
    category: 'Integration & Legacy Systems',
    question: 'Can GROWECH connect with our existing CRM, booking software, or database?',
    answer: 'Yes. We engineer bi-directional webhooks and custom API connectors for popular platforms including HubSpot, Zoho, Google Sheets, Salesforce, Shopify, WooCommerce, Airtable, and custom SQL/NoSQL databases. When an automation triggers, your internal systems update in real time with zero manual double-entry.'
  },
  {
    category: 'Pricing & Scoping',
    question: 'How are projects scoped and priced?',
    answer: 'Because every business has distinct operational requirements, workflows, and database complexities, we provide transparent, custom architecture proposals following an initial discovery consultation. We do not use rigid one-size-fits-all package tiers; you only pay for the exact systems and business outcomes your operation requires.'
  },
  {
    category: 'Support & Maintenance',
    question: 'What ongoing maintenance and support does GROWECH provide post-launch?',
    answer: 'Every deployment includes a comprehensive warranty period, staff training sessions, and detailed documentation. We also offer dedicated ongoing SLA support covering API version updates (such as Meta WhatsApp changes), server monitoring, continuous AI prompt optimization, and quarterly security audits.'
  }
];
