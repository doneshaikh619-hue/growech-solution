export interface InboundLead {
  name: string;
  company: string;
  contactValue: string;
  service: string;
  industry: string;
  notes?: string;
  source?: string;
  createdAt?: string;
}

/**
 * 24/7 Cloud Lead Capture Engine for Growech Solution
 * Sends lead to Google Sheets & Instant Gmail Notification + Saves Local Backup
 */
export const submitInboundLead = async (lead: InboundLead): Promise<{ success: boolean; message?: string }> => {
  const timestamp = new Date().toISOString();
  const enrichedLead: InboundLead = {
    ...lead,
    source: lead.source || 'growech.site Official Modal',
    createdAt: timestamp
  };

  // 1. Local Storage Safe Fallback (Persistent in browser)
  try {
    const existing: InboundLead[] = JSON.parse(localStorage.getItem('growech_captured_leads') || '[]');
    existing.unshift(enrichedLead);
    localStorage.setItem('growech_captured_leads', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Local lead storage note:', err);
  }

  // 2. Cloud Webhook Dispatch (Google Sheets Webhook / Serverless API)
  const webhookUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LEAD_WEBHOOK_URL) ||
    'https://script.google.com/macros/s/AKfycbyuXIVQGuUqyTbaeuNm8hRx8TJGvM4IEr0UgxdmadZIdyjv0JqdqGCbz-p2B6d-mQ/exec';

  if (webhookUrl && webhookUrl.trim() !== '') {
    try {
      // Use no-cors for Google Apps Script webhooks to prevent CORS blockage
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(enrichedLead)
      });
    } catch (err) {
      console.error('Cloud webhook error:', err);
    }
  }

  return { success: true };
};

/**
 * Retrieve cached offline leads
 */
export const getCachedLeads = (): InboundLead[] => {
  try {
    return JSON.parse(localStorage.getItem('growech_captured_leads') || '[]');
  } catch {
    return [];
  }
};
