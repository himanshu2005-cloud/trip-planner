'use strict';

/**
 * middleware/auth.middleware.js
 *
 * JWT authentication middleware.
 * Attach to any route that requires a logged-in user.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler);
 *
 * On success: sets req.user = { id, email }
 * On failure: responds 401 Unauthorized
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

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in.';

    return res.status(401).json({ success: false, message });
  }
}

module.exports = { authenticate };
