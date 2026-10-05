'use strict';

/**
 * config/env.js
 *
 * Centralised environment variable loading and validation.
 * Import this module ONCE at the very top of server.js before anything else.
 * All other modules should read from process.env after this module runs.
 *
 * Required variables are validated at startup — the process will exit
 * with a clear error if any are missing so misconfigurations are caught
 * early rather than at runtime.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env from the server root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// ─── Required variables ───────────────────────────────────────────────────────

const REQUIRED = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`\n[env] Missing required environment variables:\n  ${missing.join('\n  ')}`);
  console.error('[env] Copy .env.example to .env and fill in the values.\n');
  process.exit(1);
}

// ─── Validated exports ────────────────────────────────────────────────────────

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // External APIs — accessed only in service layer, never sent to client
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || '',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',

  // Helpers
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
};
