/**
 * Dynamic Sitemap Generator for Growech Solution
 * Validates indexable routes against local filesystem files to ensure zero 404s.
 * Generates standards-compliant sitemap.xml with real build-time lastmod timestamps.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://growech.site';
const TODAY = new Date().toISOString().split('T')[0];

// Define candidate indexable pages and their filesystem targets relative to project root
const candidateRoutes = [
  {
    path: '',
    file: 'index.html',
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    path: 'services/ai-workflow-automation.html',
    file: 'public/services/ai-workflow-automation.html',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    path: 'services/whatsapp-business-api.html',
    file: 'public/services/whatsapp-business-api.html',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    path: 'services/nextjs-web-development.html',
    file: 'public/services/nextjs-web-development.html',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    path: 'services/ecommerce-solutions.html',
    file: 'public/services/ecommerce-solutions.html',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    path: 'services/remote-developers.html',
    file: 'public/services/remote-developers.html',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    path: 'locations/ai-automation-agency-pakistan.html',
    file: 'public/locations/ai-automation-agency-pakistan.html',
    changefreq: 'weekly',
    priority: '0.95'
  },
  {
    path: 'locations/ai-automation-agency-dubai.html',
    file: 'public/locations/ai-automation-agency-dubai.html',
    changefreq: 'weekly',
    priority: '0.95'
  },
  {
    path: 'solutions/turnkey-architects.html',
    file: 'public/solutions/turnkey-architects.html',
    changefreq: 'weekly',
    priority: '0.85'
  },
  {
    path: 'solutions/dental-aesthetic-clinics.html',
    file: 'public/solutions/dental-aesthetic-clinics.html',
    changefreq: 'weekly',
    priority: '0.85'
  },
  {
    path: 'solutions/car-detailing-ppf.html',
    file: 'public/solutions/car-detailing-ppf.html',
    changefreq: 'weekly',
    priority: '0.85'
  },
  {
    path: 'card-generator.html',
    file: 'public/card-generator.html',
    changefreq: 'monthly',
    priority: '0.7'
  }
];

function generateSitemap() {
  const projectRoot = path.resolve(__dirname, '..');
  const validEntries = [];

  for (const item of candidateRoutes) {
    const fullPath = path.join(projectRoot, item.file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const modDate = stats.mtime.toISOString().split('T')[0] || TODAY;
      const url = item.path ? `${BASE_URL}/${item.path}` : `${BASE_URL}/`;
      validEntries.push({
        url,
        lastmod: modDate,
        changefreq: item.changefreq,
        priority: item.priority
      });
      console.log(`[Sitemap] Verified file: ${item.file} -> ${url}`);
    } else {
      console.warn(`[Sitemap WARNING] File missing, excluded from sitemap: ${item.file}`);
    }
  }

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
  ];

  for (const entry of validEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.url}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  xmlLines.push('');

  const xmlContent = xmlLines.join('\n');

  // Write to public/sitemap.xml
  const publicSitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlContent, 'utf-8');
  console.log(`[Sitemap] Successfully wrote ${validEntries.length} verified URLs to ${publicSitemapPath}`);

  // Write to dist/sitemap.xml if dist directory exists
  const distDir = path.join(projectRoot, 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xmlContent, 'utf-8');
    console.log(`[Sitemap] Successfully synchronized sitemap to dist/ at ${distSitemapPath}`);
  }
}

generateSitemap();
