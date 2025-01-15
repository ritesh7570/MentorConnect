// calendlyService.js

const axios = require('axios');
const crypto = require('crypto');
const calendlyConfig = require('./calendlyConfig');

// Function to handle OAuth authorization request
function getCalendlyAuthorizationUrl() {
  const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${calendlyConfig.CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${calendlyConfig.REDIRECT_URI}`;
  return authUrl;
}

// Function to exchange the authorization code for an access token
async function getAccessToken(authCode) {
  try {
    const response = await axios.post('https://auth.calendly.com/oauth/token', {
      client_id: calendlyConfig.CALENDLY_CLIENT_ID,
      client_secret: calendlyConfig.CALENDLY_CLIENT_SECRET,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: calendlyConfig.REDIRECT_URI,
    });

    return response.data.access_token; // Access token
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

// Function to verify the webhook signature
function verifyWebhookSignature(req) {
  const receivedSignature = req.headers['x-cal-webhook-signature'];
  const requestBody = JSON.stringify(req.body); // Ensure you're sending the body as a string
  const computedSignature = crypto
    .createHmac('sha256', calendlyConfig.CALENDLY_WEBHOOK_SIGNING_KEY)
    .update(requestBody)
    .digest('hex');

  // Check if the received signature matches the computed signature
  if (receivedSignature === computedSignature) {
    return true;
  } else {
    console.log('Webhook signature verification failed.');
    return false;
  }
}

// Function to handle incoming webhook events from Calendly
function handleWebhookEvent(req) {
  if (verifyWebhookSignature(req)) {
    // Handle the event here, e.g., booking creation, update, or deletion
    const event = req.body;
    console.log('Received valid webhook event:', event);
    // Further processing based on event type
  } else {
    console.log('Invalid webhook signature, ignoring event.');
  }
}

// Example: Get user events from Calendly
async function getUserEvents(accessToken) {
  try {
    const response = await axios.get('https://api.calendly.com/users/me/events', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  getCalendlyAuthorizationUrl,
  getAccessToken,
  verifyWebhookSignature,
  handleWebhookEvent,
  getUserEvents,
};
