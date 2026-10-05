'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const tripRoutes = require('./trip.routes');
const itineraryRoutes = require('./itinerary.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'trippilot-api',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/itinerary', itineraryRoutes);

module.exports = router;
