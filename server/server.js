'use strict';

// Load and validate environment variables first
const { PORT, NODE_ENV, isDev } = require('./src/config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./src/config/db');
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet());

// Cross-origin resource sharing
app.use(
  cors({
    origin: isDev ? true : process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Logging
app.use(morgan(isDev ? 'dev' : 'combined'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (100 requests per 15 mins for standard API routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', routes);

// 404 & Central Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
let server;
if (NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      console.log(`[server] TripPilot API server running on port ${PORT} (${NODE_ENV})`);
    });
  });
}

module.exports = { app, server };
