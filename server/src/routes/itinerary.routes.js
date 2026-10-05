'use strict';

const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  regenerateDay,
} = require('../controllers/itinerary.controller');

router.post('/generate', generateItinerary);
router.post('/regenerate-day', regenerateDay);

module.exports = router;
