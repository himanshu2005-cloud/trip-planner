'use strict';

/**
 * config/db.js
 *
 * Mongoose connection factory.
 * Call connectDB() once during server startup.
 */

const mongoose = require('mongoose');
const { MONGODB_URI, isDev } = require('./env');

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // These are the recommended options for Mongoose 8+
    });

    console.log(`[db] MongoDB connected: ${conn.connection.host}`);

    if (isDev) {
      mongoose.set('debug', false); // set to true to log all queries
    }
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
    if (!isDev) {
      process.exit(1);
    } else {
      console.warn('[db] Running in offline dev mode without active database connection.');
    }
  }
}

// Graceful shutdown — close connection when process exits
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[db] Connection closed on SIGINT');
  process.exit(0);
});

module.exports = { connectDB };
