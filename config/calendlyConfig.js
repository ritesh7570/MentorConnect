// calendlyConfig.js

require('dotenv').config();

const calendlyConfig = {
  CALENDLY_CLIENT_ID: process.env.CALENDLY_CLIENT_ID,
  CALENDLY_CLIENT_SECRET: process.env.CALENDLY_CLIENT_SECRET,
  CALENDLY_WEBHOOK_SIGNING_KEY: process.env.CALENDLY_WEBHOOK_SIGNING_KEY,
  REDIRECT_URI: process.env.REDIRECT_URI,
};

module.exports = calendlyConfig;
