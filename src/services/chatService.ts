import { AGENCY_KNOWLEDGE, AgencyKnowledgeBase } from '../data/chatbotKnowledge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'open_contact' | 'open_whatsapp' | 'quick_reply';
  label: string;
  payload?: string;
}

export interface LeadContext {
  name?: string;
  company?: string;
  service?: string;
  contact?: string;
  step?: 'idle' | 'awaiting_name' | 'awaiting_company' | 'awaiting_service' | 'awaiting_contact';
}

const SANITIZE_PROMPT_INJECTIONS = [
  'ignore previous instructions',
  'ignore all previous',
  'system prompt',
  'reveal secret',
  'api key',
  'hidden prompt',
  'developer mode',
  'jailbreak',
  'you are now',
  'roleplay as'
];

/**
 * Clean and normalize incoming query text
 */
function normalizeQuery(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s\-\+]/g, ' ');
}

/**
 * Format current time in 12-hour AM/PM format
 */
export function getCurrentTimestamp(): string {
  const date = new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Dual-Layer Response Engine:
 * 1. Checks for configured backend/edge API endpoint (VITE_AI_API_ENDPOINT or /api/chat).
 * 2. Seamlessly falls back to the deterministic grounded knowledge matcher.
 */
export async function processUserMessage(
  userText: string,
  history: ChatMessage[],
  leadContext: LeadContext
): Promise<{ reply: string; actions?: ChatAction[]; updatedLead: LeadContext }> {
  const normalized = normalizeQuery(userText);

  // 1. Guard against prompt injection attempts
  for (const injection of SANITIZE_PROMPT_INJECTIONS) {
    if (normalized.includes(injection)) {
      return {
        reply: `I am **GROWECH SOLUTION's** AI Architecture Assistant. My primary function is to provide verified information regarding our sub-second web platforms, official Meta WhatsApp Cloud automation, and autonomous AI systems.\n\nHow can I help engineer a custom digital solution for your business?`,
        actions: [
          { type: 'quick_reply', label: '⚡ Explore Services', payload: 'What services do you build?' },
          { type: 'open_contact', label: '📅 Request Consultation' }
        ],
        updatedLead: leadContext
      };
    }
  }

  // 2. Check if a real server-side AI API endpoint is configured in environment
  const apiEndpoint =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_ENDPOINT) ||
    null;

  if (apiEndpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: userText,
          history: history.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
          leadContext,
          groundingContext: AGENCY_KNOWLEDGE
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          return {
            reply: data.reply,
            actions: data.actions || [
              { type: 'open_contact', label: '📅 Request Technical Consultation' },
              {
                type: 'open_whatsapp',
                label: '💬 Chat on WhatsApp',
                payload: `https://wa.me/${AGENCY_KNOWLEDGE.officialWhatsAppNumber}?text=${encodeURIComponent(
                  `Hello GROWECH SOLUTION, I have a project inquiry.`
                )}`
              }
            ],
            updatedLead: data.updatedLead || leadContext
          };
        }
      }
    } catch {
      // Backend request failed or timed out — fallback safely to grounded deterministic knowledge engine
      console.warn('API endpoint unreachable or unconfigured. Activating built-in grounded knowledge engine.');
    }
  }

  // 3. Built-in Grounded Knowledge Engine (Client-Side Deterministic Retrieval)
  return executeGroundedKnowledgeEngine(normalized, userText, leadContext);
}

/**
 * Built-in Grounded Knowledge Engine
 * Matches queries against verified agency documentation with zero hallucination.
 */
function executeGroundedKnowledgeEngine(
  normalized: string,
  rawText: string,
  lead: LeadContext
): { reply: string; actions?: ChatAction[]; updatedLead: LeadContext } {
  const k = AGENCY_KNOWLEDGE;
  const defaultWhatsAppUrl = `https://wa.me/${k.officialWhatsAppNumber}?text=${encodeURIComponent(
    `Hello GROWECH SOLUTION, I am contacting you from the official website regarding a project consultation.`
  )}`;

  // --- Conversational Lead Capture State Machine ---
  if (lead.step === 'awaiting_name') {
    const updatedLead: LeadContext = { ...lead, name: rawText.trim(), step: 'awaiting_company' };
    return {
      reply: `Pleased to meet you, **${updatedLead.name}**! What is the name of your business or organization?`,
      updatedLead
    };
  }

  if (lead.step === 'awaiting_company') {
    const updatedLead: LeadContext = { ...lead, company: rawText.trim(), step: 'awaiting_service' };
    return {
      reply: `Got it, **${updatedLead.company}**. Which primary system or service does your operation require?\n\n- **1.** Modern Business Website or E-Commerce Store\n- **2.** Official WhatsApp Cloud Automation\n- **3.** Autonomous AI Agent or Document Workflow\n- **4.** End-to-End Custom Integration`,
      actions: [
        { type: 'quick_reply', label: '🌐 Website / E-Commerce', payload: 'Modern Business Website or E-Commerce Store' },
        { type: 'quick_reply', label: '💬 WhatsApp Automation', payload: 'Official WhatsApp Cloud Automation' },
        { type: 'quick_reply', label: '🤖 AI Agents & Workflows', payload: 'Autonomous AI Agent or Document Workflow' },
        { type: 'quick_reply', label: '⚡ Custom Architecture', payload: 'End-to-End Custom Integration' }
      ],
      updatedLead
    };
  }

  if (lead.step === 'awaiting_service') {
    const updatedLead: LeadContext = { ...lead, service: rawText.trim(), step: 'awaiting_contact' };
    return {
      reply: `Excellent. Lastly, please share your preferred contact detail (**WhatsApp number** or **Email**) so our solutions engineering team can dispatch your architecture proposal:`,
      updatedLead
    };
  }

  if (lead.step === 'awaiting_contact') {
    const updatedLead: LeadContext = { ...lead, contact: rawText.trim(), step: 'idle' };
    const leadWaUrl = `https://wa.me/${k.officialWhatsAppNumber}?text=${encodeURIComponent(
      `Hello GROWECH SOLUTION,\n\nName: ${updatedLead.name || 'Client'}\nCompany: ${updatedLead.company || 'Not Specified'}\nService Required: ${updatedLead.service || 'System Architecture'}\nContact: ${updatedLead.contact}\nSource: Website AI Chatbot`
    )}`;

    return {
      reply: `Thank you, **${updatedLead.name}**! Your project inquiry has been formatted:\n\n` +
        `• **Client:** ${updatedLead.name}\n` +
        `• **Organization:** ${updatedLead.company}\n` +
        `• **Target System:** ${updatedLead.service}\n` +
        `• **Contact Method:** ${updatedLead.contact}\n\n` +
        `You can finalize and dispatch this directly to our senior team on WhatsApp right now:`,
      actions: [
        { type: 'open_whatsapp', label: '💬 Send to Official WhatsApp', payload: leadWaUrl },
        { type: 'open_contact', label: '📅 Open Website Discovery Form' }
      ],
      updatedLead
    };
  }

  // --- Lead Intent Detection ---
  const isStartProjectIntent =
    normalized.includes('start a project') ||
    normalized.includes('hire') ||
    normalized.includes('quote') ||
    normalized.includes('book consultation') ||
    normalized.includes('consultation') ||
    normalized.includes('contact you') ||
    normalized.includes('talk to sales') ||
    normalized.includes('get in touch');

  if (isStartProjectIntent) {
    return {
      reply: `We would be excited to engineer your business architecture! We evaluate your operational bottlenecks and deliver a tailored proposal.\n\nWould you like to start a structured discovery right here, schedule a consultation, or connect directly on WhatsApp?`,
      actions: [
        { type: 'quick_reply', label: '📝 Start Discovery Here', payload: 'I want to share my project requirements' },
        { type: 'open_contact', label: '📅 Open Consultation Form' },
        { type: 'open_whatsapp', label: '💬 Message on WhatsApp', payload: defaultWhatsAppUrl }
      ],
      updatedLead: lead
    };
  }

  if (normalized.includes('share my project requirements') || normalized.includes('i want to share my project')) {
    return {
      reply: `Great! Let's get the essentials so our team can evaluate your requirements. **What is your full name?**`,
      updatedLead: { ...lead, step: 'awaiting_name' }
    };
  }

  // --- Greeting Intent ---
  const isGreeting =
    /^(hi|hello|hey|salam|good morning|good afternoon|good evening|greeting)/.test(normalized) ||
    normalized === 'hi' ||
    normalized === 'hello';

  if (isGreeting) {
    return {
      reply: `Hello! I am the **${k.agencyName}** AI Assistant.\n\nWe specialize in **custom high-performance websites**, **official Meta WhatsApp Cloud API automation**, and **autonomous AI agents** with strict deterministic safety.\n\nHow can I help optimize or scale your business today?`,
      actions: [
        { type: 'quick_reply', label: '⚡ What services do you build?', payload: 'What services do you build?' },
        { type: 'quick_reply', label: '💬 WhatsApp Automation', payload: 'How does WhatsApp Automation work?' },
        { type: 'quick_reply', label: '🤖 Autonomous AI Agents', payload: 'Tell me about Autonomous AI Agents' },
        { type: 'quick_reply', label: '⏱️ Project Timelines', payload: 'What are your deployment timelines?' }
      ],
      updatedLead: lead
    };
  }

  // --- WhatsApp Automation Intent ---
  if (normalized.includes('whatsapp') || normalized.includes('meta cloud api') || normalized.includes('chat automation')) {
    const waService = k.services.find((s) => s.id === 'whatsapp-automation');
    const waFaq = k.faqs.find((f) => f.keywords.includes('whatsapp number'));

    return {
      reply: `### ${waService?.title}\n\n` +
        `${waService?.shortDescription}\n\n` +
        `**Key Architectural Deliverables:**\n` +
        `• **Official Meta WhatsApp Cloud API:** Full verification with zero risk of account bans.\n` +
        `• **Sub-3-Second Auto-Responders:** Instant answers to common inquiries and FAQ triage 24/7.\n` +
        `• **Interactive Catalog & Booking:** Table reservations, service scheduling, and order capture.\n` +
        `• **Live CRM Sync:** Bi-directional sync with HubSpot, Zoho, Google Sheets, or custom databases.\n\n` +
        `> **Response Time:** ${waService?.responseTime}\n` +
        `> **Business Impact:** ${waService?.businessImpact}\n\n` +
        `${waFaq ? `*Integration Note:* ${waFaq.answer}` : ''}`,
      actions: [
        { type: 'open_contact', label: '📅 Request WhatsApp Integration' },
        {
          type: 'open_whatsapp',
          label: '💬 Chat on WhatsApp',
          payload: `https://wa.me/${k.officialWhatsAppNumber}?text=${encodeURIComponent(
            `Hello GROWECH SOLUTION, I am interested in implementing WhatsApp Automation for my business.`
          )}`
        }
      ],
      updatedLead: lead
    };
  }

  // --- Autonomous AI Agents & RAG Intent ---
  if (
    normalized.includes('ai agent') ||
    normalized.includes('autonomous') ||
    normalized.includes('rag') ||
    normalized.includes('hallucinat') ||
    normalized.includes('guardrail')
  ) {
    const agentService = k.services.find((s) => s.id === 'ai-agents');
    const ragFaq = k.faqs.find((f) => f.keywords.includes('rag'));

    return {
      reply: `### ${agentService?.title}\n\n` +
        `${agentService?.shortDescription}\n\n` +
        `**How We Ensure High Reliability & Zero Hallucination:**\n` +
        `• **Proprietary RAG Knowledge Base:** Grounded exclusively in your approved internal files (PDFs, spreadsheets, SOPs).\n` +
        `• **Zero Data-Leakage:** Your private business data is protected and never used to train public models.\n` +
        `• **Tool Calling Integrations:** Agents can query databases, verify calendars, or trigger webhooks with human-in-the-loop validation.\n` +
        `• **Deterministic Fallback:** If an inquiry falls outside approved parameters, the agent gracefully acknowledges and routes to your team.\n\n` +
        `${ragFaq ? `*Safety Architecture:* ${ragFaq.answer}` : ''}`,
      actions: [
        { type: 'open_contact', label: '📅 Consult on AI Agents' },
        { type: 'quick_reply', label: '⚡ Document Workflows', payload: 'Tell me about AI Business Workflows' }
      ],
      updatedLead: lead
    };
  }

  // --- AI Workflow Orchestration Intent ---
  if (
    normalized.includes('workflow') ||
    normalized.includes('document') ||
    normalized.includes('invoice') ||
    normalized.includes('extraction') ||
    normalized.includes('pipeline')
  ) {
    const wfService = k.services.find((s) => s.id === 'ai-workflows');
    return {
      reply: `### ${wfService?.title}\n\n` +
        `${wfService?.shortDescription}\n\n` +
        `**What We Automate:**\n` +
        `• Automated PDF, contract, and invoice data extraction pipelines.\n` +
        `• Inbound email classification and automated CRM customer record creation.\n` +
        `• Cross-platform webhook triggers connecting disparate departmental tools.\n` +
        `• Human-in-the-loop verification dashboards for sensitive financial or operational flows.\n\n` +
        `> **Business Impact:** ${wfService?.businessImpact}`,
      actions: [
        { type: 'open_contact', label: '📅 Automate Our Workflows' },
        { type: 'quick_reply', label: '💬 WhatsApp Sync', payload: 'How does WhatsApp Automation work?' }
      ],
      updatedLead: lead
    };
  }

  // --- E-Commerce & Storefronts Intent ---
  if (
    normalized.includes('ecommerce') ||
    normalized.includes('e-commerce') ||
    normalized.includes('store') ||
    normalized.includes('shop') ||
    normalized.includes('cart') ||
    normalized.includes('checkout')
  ) {
    const ecomService = k.services.find((s) => s.id === 'ecommerce-development');
    const demo = k.caseStudies.find((c) => c.id === 'ecommerce-demo');

    return {
      reply: `### ${ecomService?.title}\n\n` +
        `${ecomService?.shortDescription}\n\n` +
        `**Core Capabilities:**\n` +
        `• **Headless High-Speed Storefronts:** Instant product searches and sub-second page transitions.\n` +
        `• **Frictionless Mobile Checkout:** Custom checkout funnels with local payment gateways.\n` +
        `• **Automated Cart Recovery:** WhatsApp sequences boasting 70%+ open rates to recapture lost revenue.\n` +
        `• **Live Order Tracking Bot:** Instant parcel status directly on messaging channels without support tickets.\n\n` +
        `*Verified Demonstration:* ${demo?.title} (${demo?.impact})`,
      actions: [
        { type: 'open_contact', label: '📅 Plan E-Commerce Project' },
        {
          type: 'open_whatsapp',
          label: '💬 Speak with E-Commerce Specialist',
          payload: `https://wa.me/${k.officialWhatsAppNumber}?text=${encodeURIComponent(
            `Hello GROWECH SOLUTION, I am looking to engineer an E-Commerce storefront.`
          )}`
        }
      ],
      updatedLead: lead
    };
  }

  // --- Custom Websites & Web Development Intent ---
  if (
    normalized.includes('website') ||
    normalized.includes('landing page') ||
    normalized.includes('web development') ||
    normalized.includes('frontend') ||
    normalized.includes('speed') ||
    normalized.includes('lighthouse')
  ) {
    const webService = k.services.find((s) => s.id === 'business-websites');
    return {
      reply: `### ${webService?.title}\n\n` +
        `${webService?.shortDescription}\n\n` +
        `**Architectural Standards:**\n` +
        `• **Zero Bloated Templates:** Bespoke React, Vite, Next.js, and Tailwind CSS code.\n` +
        `• **Sub-Second Performance:** 99+ Lighthouse performance scores for superior Google and AI search visibility.\n` +
        `• **Integrated Conversion Triggers:** Lead forms coupled with instant WhatsApp and CRM routing.\n` +
        `• **Responsive Choreography:** Flawless visual ergonomics across mobile, tablet, laptop, and ultra-wide screens.`,
      actions: [
        { type: 'open_contact', label: '📅 Start Website Project' },
        { type: 'quick_reply', label: '⏱️ Project Timelines', payload: 'What are your deployment timelines?' }
      ],
      updatedLead: lead
    };
  }

  // --- Lead Generation Funnels Intent ---
  if (normalized.includes('lead gen') || normalized.includes('funnel') || normalized.includes('scoring') || normalized.includes('intake')) {
    const leadService = k.services.find((s) => s.id === 'lead-generation-automation');
    return {
      reply: `### ${leadService?.title}\n\n` +
        `${leadService?.shortDescription}\n\n` +
        `**System Components:**\n` +
        `• Interactive multi-step qualification forms with dynamic conditional logic.\n` +
        `• Real-time phone/email verification and enrichment before reaching sales.\n` +
        `• Lead scoring engines matching your exact Ideal Customer Profile (ICP).\n` +
        `• Automated meeting scheduling with bi-directional calendar invites.\n\n` +
        `> **Impact:** ${leadService?.businessImpact}`,
      actions: [
        { type: 'open_contact', label: '📅 Build Lead Funnel' }
      ],
      updatedLead: lead
    };
  }

  // --- Creative & Advertising Intent ---
  if (
    normalized.includes('creative') ||
    /\b(ads?|advertising|advertisement|marketing collateral)\b/.test(normalized) ||
    normalized.includes('banner')
  ) {
    const creativeService = k.services.find((s) => s.id === 'ai-creative');
    return {
      reply: `### ${creativeService?.title}\n\n` +
        `${creativeService?.shortDescription}\n\n` +
        `**Capabilities:**\n` +
        `• Brand-consistent asset generation pipelines with programmatic variant creation.\n` +
        `• Multi-format auto-resizing for Stories, Feeds, and Display Banners.\n` +
        `• Algorithmic copywriting tailored to distinct customer audience segments.\n` +
        `• Performance tracking integration for continuous marketing iteration.`,
      actions: [
        { type: 'open_contact', label: '📅 Discuss Creative Pipelines' }
      ],
      updatedLead: lead
    };
  }

  // --- All Services List Intent ---
  if (normalized.includes('services') || normalized.includes('what do you build') || normalized.includes('what do you offer') || normalized.includes('what do you do')) {
    return {
      reply: `**GROWECH SOLUTION** engineers 8 core digital and automation architectures:\n\n` +
        `1. 🌐 **Bespoke Websites & High-Speed Platforms:** React/Next.js platforms with 99+ Lighthouse performance.\n` +
        `2. 💬 **Official WhatsApp Automation & CRM:** Meta Cloud API with sub-3-second responses.\n` +
        `3. 🤖 **Autonomous AI Agents:** Domain-trained RAG systems with deterministic safety guardrails.\n` +
        `4. ⚡ **AI Business Workflow Orchestration:** Automated document extraction and CRM updates.\n` +
        `5. 🛒 **E-Commerce Storefront Engineering:** Headless checkout with automated WhatsApp cart recovery.\n` +
        `6. 🎯 **Lead Generation & Qualification Funnels:** Scoring engines and automated calendar booking.\n` +
        `7. 🎨 **AI Creative & Advertising Solutions:** Scalable marketing variations and template automation.\n` +
        `8. 🔗 **Digital Systems & Legacy Integration:** Custom REST/GraphQL APIs and central data hubs.\n\n` +
        `Which area aligns closest with your current business priorities?`,
      actions: [
        { type: 'quick_reply', label: '💬 WhatsApp Automation', payload: 'How does WhatsApp Automation work?' },
        { type: 'quick_reply', label: '🤖 AI Agents', payload: 'Tell me about Autonomous AI Agents' },
        { type: 'quick_reply', label: '🌐 Websites & E-Com', payload: 'Tell me about Bespoke Websites' },
        { type: 'open_contact', label: '📅 Request Consultation' }
      ],
      updatedLead: lead
    };
  }

  // --- Pricing & Scoping Intent ---
  if (
    normalized.includes('price') ||
    normalized.includes('pricing') ||
    normalized.includes('cost') ||
    normalized.includes('how much') ||
    /\b(fees?)\b/.test(normalized)
  ) {
    return {
      reply: `### Transparent Discovery-Based Scoping\n\n` +
        `${k.pricingPolicy}\n\n` +
        `To give you a precise and accurate proposal without arbitrary tier markups, our solutions engineers evaluate:\n` +
        `• Your target integrations (CRM, payment gateways, messaging APIs)\n` +
        `• Anticipated inquiry volume and data pipelines\n` +
        `• Exact operational workflows to automate\n\n` +
        `We provide an obligation-free discovery session to map out your architecture.`,
      actions: [
        { type: 'open_contact', label: '📅 Book Architectural Discovery' },
        {
          type: 'open_whatsapp',
          label: '💬 Inquire on WhatsApp',
          payload: `https://wa.me/${k.officialWhatsAppNumber}?text=${encodeURIComponent(
            `Hello GROWECH SOLUTION, I would like to request an architectural proposal for my business.`
          )}`
        }
      ],
      updatedLead: lead
    };
  }

  // --- Timelines & Delivery Intent ---
  if (normalized.includes('timeline') || normalized.includes('how long') || normalized.includes('turnaround') || normalized.includes('weeks') || normalized.includes('duration')) {
    return {
      reply: `### Deployment Timelines\n\n` +
        `${k.timelinePolicy}\n\n` +
        `Every build follows a structured engineering lifecycle:\n` +
        `• **Week 1:** Architectural discovery, technical specifications & wireframes\n` +
        `• **Weeks 2–3:** Core development, API integration & automated test suites\n` +
        `• **Weeks 4+ (Enterprise):** Knowledge base RAG ingestion, end-to-end load testing & staff training`,
      actions: [
        { type: 'open_contact', label: '📅 Discuss Your Timeline' },
        { type: 'quick_reply', label: '⚡ Explore Tech Stack', payload: 'What technology stack do you use?' }
      ],
      updatedLead: lead
    };
  }

  // --- Tech Stack Intent ---
  if (normalized.includes('tech stack') || normalized.includes('technology') || normalized.includes('stack') || normalized.includes('react') || normalized.includes('python')) {
    return {
      reply: `### Our Technical Stack\n\n` +
        `We architect high-concurrency, sub-second systems using industry-leading modern technologies:\n\n` +
        `• **Frontend & Platforms:** React 18, Next.js, Vite, TypeScript, Tailwind CSS, Framer Motion\n` +
        `• **Backend & AI Orchestration:** Node.js, Python, Retrieval-Augmented Generation (RAG), Vector Embeddings\n` +
        `• **Messaging & CRM:** Official Meta WhatsApp Business Cloud API, Webhooks, HubSpot, Zoho, Salesforce\n` +
        `• **Infrastructure & Databases:** Global Edge CDNs (Cloudflare), PostgreSQL, 99.9% uptime SLA`,
      actions: [
        { type: 'open_contact', label: '📅 Schedule Technical Call' }
      ],
      updatedLead: lead
    };
  }

  // --- Case Studies & Proof of Work Intent ---
  if (
    normalized.includes('case study') ||
    normalized.includes('portfolio') ||
    normalized.includes('demo') ||
    normalized.includes('examples') ||
    /\b(past works?|sample works?|proof of work|showcase)\b/.test(normalized) ||
    normalized.includes('sample')
  ) {
    return {
      reply: `Here are 4 verified demonstration architectures built by **GROWECH SOLUTION**:\n\n` +
        `1. 🍽️ **Restaurant Reservation & WhatsApp Order Dispatcher:** Sub-second digital menu with direct kitchen thermal webhooks and 2-hour reminder triggers.\n` +
        `2. 🏢 **Luxury Property Investor Qualification:** 3D architectural landing page + multi-step WhatsApp agent delivering instant PDF investor brochures.\n` +
        `3. 🏥 **Specialized Healthcare Clinic 24/7 Triage:** Compliant patient portal with doctor calendar booking and digital pre-visit intake forms.\n` +
        `4. 🛍️ **Headless D2C Storefront with Cart Recovery:** Blazing checkout with automated 70%+ open rate WhatsApp recovery funnels.\n\n` +
        `Which case study would you like to explore deeper?`,
      actions: [
        { type: 'quick_reply', label: '🍽️ Restaurant Demo', payload: 'Tell me about the Restaurant Reservation demo' },
        { type: 'quick_reply', label: '🏢 Real Estate Demo', payload: 'Tell me about the Real Estate Investor demo' },
        { type: 'quick_reply', label: '🏥 Healthcare Clinic Demo', payload: 'Tell me about the Clinic Triage demo' },
        { type: 'quick_reply', label: '🛍️ E-Commerce Demo', payload: 'Tell me about the E-Commerce Storefront demo' }
      ],
      updatedLead: lead
    };
  }

  // --- Specific Case Studies Inquiries ---
  if (normalized.includes('restaurant')) {
    const cs = k.caseStudies.find((c) => c.id === 'restaurant-demo');
    return {
      reply: `### ${cs?.title}\n\n` +
        `**Solution:** ${cs?.solution}\n\n` +
        `**Technologies:** ${cs?.technologies.join(', ')}\n\n` +
        `**Business Impact:** ${cs?.impact}`,
      actions: [
        { type: 'open_contact', label: '📅 Plan Hospitality Solution' },
        { type: 'quick_reply', label: '💬 WhatsApp Automation', payload: 'How does WhatsApp Automation work?' }
      ],
      updatedLead: lead
    };
  }

  if (normalized.includes('real estate') || normalized.includes('property')) {
    const cs = k.caseStudies.find((c) => c.id === 'real-estate-concept');
    return {
      reply: `### ${cs?.title}\n\n` +
        `**Solution:** ${cs?.solution}\n\n` +
        `**Technologies:** ${cs?.technologies.join(', ')}\n\n` +
        `**Business Impact:** ${cs?.impact}`,
      actions: [
        { type: 'open_contact', label: '📅 Plan Real Estate Solution' }
      ],
      updatedLead: lead
    };
  }

  if (normalized.includes('clinic') || normalized.includes('healthcare') || normalized.includes('doctor')) {
    const cs = k.caseStudies.find((c) => c.id === 'clinic-sample');
    return {
      reply: `### ${cs?.title}\n\n` +
        `**Solution:** ${cs?.solution}\n\n` +
        `**Technologies:** ${cs?.technologies.join(', ')}\n\n` +
        `**Business Impact:** ${cs?.impact}`,
      actions: [
        { type: 'open_contact', label: '📅 Plan Healthcare Solution' }
      ],
      updatedLead: lead
    };
  }

  // --- Industry Inquiries ---
  if (normalized.includes('industry') || normalized.includes('sectors') || normalized.includes('who do you work with')) {
    return {
      reply: `**GROWECH SOLUTION** engineers custom platforms for high-growth sectors:\n\n` +
        `• **Restaurants & Hospitality:** Table bookings, digital menus, automated reminders.\n` +
        `• **Clinics & Healthcare:** 24/7 patient triage, appointment scheduling, digital intake.\n` +
        `• **Real Estate & Brokers:** Instant buyer qualification and dynamic brochure dispatch.\n` +
        `• **E-Commerce & D2C Brands:** Headless speed, cart recovery, live parcel tracking.\n` +
        `• **Professional Services & Trade:** Lead verification, automated quotes, calendar synchronization.\n\n` +
        `Tell me about your industry to see our specific workflow recommendations!`,
      actions: [
        { type: 'open_contact', label: '📅 Discuss Your Industry' }
      ],
      updatedLead: lead
    };
  }

  // --- Support & Maintenance Intent ---
  if (normalized.includes('support') || normalized.includes('maintenance') || normalized.includes('warranty') || normalized.includes('sla')) {
    const supFaq = k.faqs.find((f) => f.keywords.includes('maintenance'));
    return {
      reply: `### Ongoing SLA & Warranty Support\n\n` +
        `${supFaq?.answer}\n\n` +
        `We believe in long-term engineering partnerships, ensuring your systems adapt as your business and APIs evolve.`,
      actions: [
        { type: 'open_contact', label: '📅 Request Architecture Consultation' }
      ],
      updatedLead: lead
    };
  }

  // --- Contact & Location Inquiries ---
  if (normalized.includes('phone') || normalized.includes('email') || normalized.includes('number') || normalized.includes('contact info')) {
    return {
      reply: `You can reach **${k.agencyName}** through our verified direct channels:\n\n` +
        `• **Official WhatsApp:** ${k.officialWhatsAppDisplay}\n` +
        `• **Website Consultation:** Use our online discovery modal to schedule an architecture review.\n\n` +
        `Our team provides direct technical communication without bureaucratic delays.`,
      actions: [
        {
          type: 'open_whatsapp',
          label: '💬 Open WhatsApp Directly',
          payload: defaultWhatsAppUrl
        },
        { type: 'open_contact', label: '📅 Schedule Discovery Call' }
      ],
      updatedLead: lead
    };
  }

  // --- Fallback for queries outside known documentation ---
  return {
    reply: `I do not have verified specifications regarding that particular query in our published architectural documentation.\n\n` +
      `Because **GROWECH SOLUTION** engineers custom enterprise platforms and workflows, our engineering team can discuss custom requirements during an initial discovery session.\n\n` +
      `Would you like to connect directly on WhatsApp or submit your project details for an evaluation?`,
    actions: [
      {
        type: 'open_whatsapp',
        label: `💬 Message on WhatsApp (${k.officialWhatsAppDisplay})`,
        payload: defaultWhatsAppUrl
      },
      { type: 'open_contact', label: '📅 Request Technical Consultation' },
      { type: 'quick_reply', label: '⚡ View All Services', payload: 'What services do you build?' }
    ],
    updatedLead: lead
  };
}
