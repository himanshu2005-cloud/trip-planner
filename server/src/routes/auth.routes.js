'use strict';

/**
 * routes/auth.routes.js
 *
 * Auth endpoints — public (no JWT required).
 * Business logic lives in controllers/auth.controller.js (Phase 2).
 */

const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/google
router.post('/google', googleLogin);

// GET /api/auth/me  — protected
router.get('/me', authenticate, getMe);

module.exports = router;
