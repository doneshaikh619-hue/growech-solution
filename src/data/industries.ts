export interface IndustryDetail {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  commonProblems: string[];
  growechSolution: string;
  automatedWorkflows: string[];
  essentialWebsiteFeatures: string[];
  leadHandlingImprovement: string;
  customerExperienceElevation: string;
}

export const industriesData: IndustryDetail[] = [
  {
    id: 'restaurants-cafes',
    name: 'Restaurants & Cafes',
    tagline: 'Automated table reservations, WhatsApp digital menus, and streamlined order routing.',
    badge: 'Hospitality & Dining',
    commonProblems: [
      'Phone lines constantly busy during rush hours leading to lost table reservations',
      'Third-party delivery platforms charging heavy commission fees up to 30%',
      'Manual management of dietary questions, opening hours, and location requests',
      'No structured customer database for returning guest loyalty promotions'
    ],
    growechSolution: 'We build direct-ordering, high-speed mobile web menus combined with an automated WhatsApp reservation bot that confirms bookings, sends automated reminders, and collects direct feedback without staff intervention.',
    automatedWorkflows: [
      'WhatsApp automated table booking with instant seat availability checking',
      'Automated reservation reminder notifications 2 hours prior to seating to reduce no-shows',
      'Digital QR contactless menu with direct WhatsApp order dispatch',
      'Post-dining review capture and automated Google Maps review routing'
    ],
    essentialWebsiteFeatures: [
      'Visual interactive menu with dietary tags (Halal, Vegan, Gluten-Free)',
      'Direct table reservation engine synced with restaurant management systems',
      'Location finder with one-tap directions and live operating hours indicator',
      'Catering and private event inquiry qualification forms'
    ],
    leadHandlingImprovement: 'Converts casual Instagram and Google Maps visitors directly into confirmed table reservations or direct take-out orders within 3 taps.',
    customerExperienceElevation: 'Guests reserve seats in seconds via their everyday WhatsApp app, receiving instant booking confirmation and personalized event updates.'
  },
  {
    id: 'clinics-healthcare',
    name: 'Clinics & Specialized Healthcare',
    tagline: '24/7 patient triage, automated doctor scheduling, and confidential appointment management.',
    badge: 'Medical & Wellness',
    commonProblems: [
      'Front desk staff overwhelmed with routine inquiries about doctor availability, pricing, and services',
      'High patient appointment no-show rates disrupting doctor clinic schedules',
      'Lack of after-hours appointment booking when patients are searching late in the evening',
      'Repetitive manual intake paperwork causing waiting room congestion'
    ],
    growechSolution: 'We deploy compliant patient communication portals and automated WhatsApp clinic receptionists that answer treatment questions, verify doctor schedules, book appointments 24/7, and send pre-visit preparation instructions.',
    automatedWorkflows: [
      '24/7 automated appointment booking synced with clinic practice management software',
      'Automated WhatsApp appointment confirmations and 24-hour reminder triggers with one-click rescheduling',
      'Digital pre-visit patient intake forms sent automatically prior to arrival',
      'Post-consultation medication instruction guides and follow-up check-ins'
    ],
    essentialWebsiteFeatures: [
      'Doctor credential profiles, specialty focus areas, and schedule transparency',
      'Treatment procedure guides with transparent recovery details and FAQs',
      'Secure appointment booking with calendar slot selection',
      'Emergency contact guidance and tele-consultation request triggers'
    ],
    leadHandlingImprovement: 'Captures urgent patient inquiries outside clinic working hours and confirms bookings immediately instead of waiting until next morning.',
    customerExperienceElevation: 'Patients enjoy dignified, prompt, and confidential scheduling without being placed on telephone hold during busy morning shifts.'
  },
  {
    id: 'real-estate',
    name: 'Real Estate Agencies & Developers',
    tagline: 'Instant property brochure dispatch, buyer qualification, and viewing tour scheduling.',
    badge: 'Property & Development',
    commonProblems: [
      'Agents inundated with casual tire-kickers asking for price sheets and floor plans',
      'Delayed response times to portal leads (PropertyFinder, Bayut, Zillow) leading to lost buyer interest',
      'Disorganized lead records scattered across individual agents WhatsApp chats',
      'Manual scheduling of viewing appointments leading to double-bookings'
    ],
    growechSolution: 'We engineer dedicated high-impact development showcase websites and automated conversational property bots that qualify buyer budget, timeline, and financing status before instantly sending PDF brochures and booking viewing tours.',
    automatedWorkflows: [
      'Instant automated WhatsApp delivery of property floor plans and brochures upon inquiry',
      'Automated qualification bot filtering buyer budget, preferred unit size, and investment timeline',
      'Direct synchronization of verified buyer contacts into central agency CRM',
      'Agent viewing tour booking with automated Google Calendar coordination and location pins'
    ],
    essentialWebsiteFeatures: [
      'High-definition architectural project portfolios with floor plan interactive viewers',
      'Interactive mortgage and ROI estimation calculators',
      'Virtual 3D tour embeds and neighborhood amenity mapping',
      'Exclusive developer pre-launch registration landing funnels'
    ],
    leadHandlingImprovement: 'Engages ad and portal leads within 5 seconds, separates serious buyers with capital from casual browsers, and assigns verified appointments to top brokers.',
    customerExperienceElevation: 'High-net-worth investors and buyers receive comprehensive property dossiers immediately on mobile without awaiting broker callbacks.'
  },
  {
    id: 'travel-visa',
    name: 'Travel & Visa Agencies',
    tagline: 'Automated visa requirement checks, package inquiries, and document verification pipelines.',
    badge: 'Travel & Mobility',
    commonProblems: [
      'Repetitive queries regarding visa requirements, document checklists, and processing times',
      'Clients submitting incomplete document scans leading to application rejection delays',
      'Manual calculation of tour package quotes across multiple travel dates',
      'Unorganized tracking of client passport and visa status updates'
    ],
    growechSolution: 'We create dynamic visa requirement search engines and automated WhatsApp travel advisors that guide applicants through required document lists, receive PDF submissions, and provide automated status notifications.',
    automatedWorkflows: [
      'Interactive visa eligibility checker matching nationality with destination guidelines',
      'Automated document submission checklist with WhatsApp attachment verification',
      'Application progress status query bot where travelers enter their reference number',
      'Automated seasonal holiday package promotions sent to previous travel clientele'
    ],
    essentialWebsiteFeatures: [
      'Searchable visa requirements database by country and travel purpose',
      'Curated holiday and Umrah / flight package itineraries with clear inclusions',
      'Direct booking request forms with instant quote generation',
      'Multi-currency pricing reference and customer travel guide blog'
    ],
    leadHandlingImprovement: 'Filters inquiries by travel date and visa urgency, ensuring consultants prioritize imminent travel deadlines.',
    customerExperienceElevation: 'Travelers get absolute clarity on visa documentation requirements without waiting for office consultations.'
  },
  {
    id: 'trade-contractors',
    name: 'Trade Businesses & Contractors',
    tagline: 'Automated quote estimation, service dispatch, and professional portfolio credibility.',
    badge: 'Trades & Field Services',
    commonProblems: [
      'Contractors on job sites unable to answer incoming calls, losing urgent service requests',
      'Clients requesting quotes without providing basic photos, dimensions, or job details',
      'Unprofessional web presence failing to convey licensed authority and reliability',
      'Delayed quote follow-ups resulting in competitors securing the contract'
    ],
    growechSolution: 'We deploy professional contractor web platforms integrated with an automated job intake bot that collects project photos, site location, and job specifications before generating a preliminary service consultation.',
    automatedWorkflows: [
      'WhatsApp photo and scope-of-work intake for immediate remote job estimation',
      'Automated scheduling of on-site measurement consultations with automated confirmation',
      'Post-job invoice delivery and automated customer satisfaction check',
      'Automated warranty and annual service maintenance reminder alerts'
    ],
    essentialWebsiteFeatures: [
      'Detailed before-and-after project gallery with zoom capabilities',
      'License, insurance, and safety certification trust badges',
      'Interactive quote request form with image upload capability',
      'Service area coverage map and verified emergency contact button'
    ],
    leadHandlingImprovement: 'Collects all required project details upfront, allowing contractors to assess profitability before visiting the job site.',
    customerExperienceElevation: 'Homeowners and property managers receive prompt, professional communication and clear project scheduling without phone tag.'
  },
  {
    id: 'ecommerce-retail',
    name: 'E-commerce & Direct-to-Consumer Brands',
    tagline: 'High-converting headless storefronts, abandoned cart recovery, and VIP customer retention.',
    badge: 'Retail & Commerce',
    commonProblems: [
      'High mobile checkout drop-off rates due to slow page speeds and clunky navigation',
      'Customer support teams flooded with "Where is my order?" (WISMO) inquiries',
      'High shopping cart abandonment with standard email recovery getting lost in spam',
      'Difficulty personalizing product recommendations across wide catalogs'
    ],
    growechSolution: 'We build blazing-fast modern storefronts coupled with automated WhatsApp abandoned cart recovery sequences and automated shipping tracking bots that resolve 90% of delivery questions.',
    automatedWorkflows: [
      'Automated WhatsApp cart abandonment recovery offering personalized incentives',
      'Instant order status tracking bot linked to courier tracking APIs',
      'Automated post-delivery product care guides and re-order reminders',
      'Customer review collection triggers with photo submission incentives'
    ],
    essentialWebsiteFeatures: [
      'Sub-second mobile catalog filtering and lightning-fast search',
      'One-click checkout integrations with localized payment gateways (Apple Pay, Tabby, Tamara)',
      'Dynamic size guides, customer video reviews, and bundle builder tools',
      'Real-time inventory alerts ("Only 3 left in stock")'
    ],
    leadHandlingImprovement: 'Recovers up to 25% of abandoned carts through high-open-rate WhatsApp messaging compared to low-engagement generic emails.',
    customerExperienceElevation: 'Shoppers enjoy instantaneous mobile purchasing and proactive shipment status alerts directly on their phones.'
  }
];
