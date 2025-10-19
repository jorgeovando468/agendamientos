const axios = require('axios');
const config = require('../config/whatsapp');

function getWhatsappBaseUrl() {
  if (!config.phoneNumberId) return null;
  return `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;
}

async function sendWhatsAppText(toPhoneE164, message) {
  const url = getWhatsappBaseUrl();
  if (!url || !config.token) {
    return { skipped: true, reason: 'WhatsApp not configured' };
  }
  const payload = {
    messaging_product: 'whatsapp',
    to: toPhoneE164,
    type: 'text',
    text: { body: message },
  };
  const headers = { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' };
  const { data } = await axios.post(url, payload, { headers });
  return data;
}

module.exports = { sendWhatsAppText };
