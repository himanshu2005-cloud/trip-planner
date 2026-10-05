'use strict';

/**
 * middleware/auth.middleware.js
 *
 * JWT authentication middleware.
 * - authenticate: strict check, requires valid Bearer token
 * - optionalAuth: populates req.user if Bearer token present, allows through if not
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please log in.',
    });
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in.';

    return res.status(401).json({ success: false, message });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
  } catch (err) {
    req.user = null;
  }
  next();
}

module.exports = { authenticate, optionalAuth };
