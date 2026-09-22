import React, { useEffect } from 'react';
import { servicesData } from '../data/services';
import { faqData } from '../data/faqData';

export const SEO: React.FC = () => {
  useEffect(() => {
    // 1. Organization Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'GROWECH SOLUTION',
      alternateName: 'Growech',
      url: 'https://growechsolution.com',
      logo: 'https://growechsolution.com/assets/growech-logo.png',
      description:
        'GROWECH SOLUTION is a modern digital solutions agency that helps businesses improve digital presence, automate repetitive operations, generate leads, and implement AI-powered business solutions.',
      knowsAbout: [
        'Business Website Development',
        'E-commerce Website Development',
        'Official WhatsApp Business Automation',
        'Autonomous AI Agents',
        'AI Business Workflows',
        'Lead Generation Automation',
        'Meta Cloud API Integration',
        'Retrieval-Augmented Generation (RAG)',
      ],
      areaServed: 'Worldwide',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support & Sales',
        availableLanguage: ['English', 'Urdu', 'Arabic'],
      },
    };

    // 2. WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'GROWECH SOLUTION — Digital Agency & AI Automations',
      url: 'https://growechsolution.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://growechsolution.com/?q={search_term_string}',
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
