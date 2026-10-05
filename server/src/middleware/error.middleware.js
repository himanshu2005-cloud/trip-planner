'use strict';

/**
 * middleware/error.middleware.js
 *
 * Global error handler — must be the last app.use() in server.js.
 * Catches anything thrown/passed to next(err) from route handlers.
 */

const { isDev } = require('../config/env');

/**
 * 404 handler — attach after all routes to catch unmatched paths.
 */
function notFound(req, res, next) {
  const err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

/**
 * Central error responder.
 * In development, the stack trace is included in the response body.
 * In production, only the message is returned.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log server errors
  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };
