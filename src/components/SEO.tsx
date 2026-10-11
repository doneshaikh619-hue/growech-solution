import React, { useEffect } from 'react';
import { servicesData } from '../data/services';
import { faqData } from '../data/faqData';

export const SEO: React.FC = () => {
  useEffect(() => {
    // 1. Organization Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'ProfessionalService', 'LocalBusiness'],
      name: 'GROWECH SOLUTION',
      alternateName: 'Growech',
      url: 'https://growech.site',
      logo: 'https://growech.site/assets/growech-logo.png',
      description:
        'GROWECH SOLUTION is a premier AI automation agency and web engineering studio that builds autonomous AI workflows, official Meta WhatsApp Business API integrations, and high-performance Next.js web applications.',
      founder: {
        '@type': 'Person',
        name: 'Mustafa Shaikh',
        jobTitle: 'Founder & Principal AI Systems Architect',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Karachi',
        addressRegion: 'Sindh',
        addressCountry: 'PK',
      },
      knowsAbout: [
        'AI Automation Agency',
        'Official WhatsApp Business Automation',
        'Autonomous AI Agents',
        'n8n Workflow Engineering',
        'Meta Cloud API Integration',
        'Next.js Web Applications',
        'Lead Generation Automation',
        'Retrieval-Augmented Generation (RAG)',
      ],
      areaServed: [
        'Karachi',
        'Lahore',
        'Islamabad',
        'Pakistan',
        'United Arab Emirates',
        'Saudi Arabia',
        'United States',
        'United Kingdom',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support & Technical Sales',
        availableLanguage: ['English', 'Urdu', 'Arabic'],
      },
    };

    // 2. WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'GROWECH SOLUTION — Digital Agency & AI Automations',
      url: 'https://growech.site',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://growech.site/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };

    // 3. Service Catalog Schema
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: servicesData.map((service, index) => ({
        '@type': 'Service',
        position: index + 1,
        name: service.title,
        description: service.shortDescription,
        provider: {
          '@type': 'Organization',
          name: 'GROWECH SOLUTION',
          url: 'https://growech.site',
        },
        serviceType: service.category,
      })),
    };

    // 4. FAQPage Schema
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    // Append JSON-LD script tags to head
    const schemas = [orgSchema, websiteSchema, serviceSchema, faqSchema];
    const scriptElements: HTMLScriptElement[] = [];

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      scriptElements.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
};
