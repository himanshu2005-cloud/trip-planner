'use strict';

const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/trip.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, getTrips);
router.get('/:id', authenticate, getTripById);
router.post('/', authenticate, createTrip);
router.put('/:id', authenticate, updateTrip);
router.delete('/:id', authenticate, deleteTrip);

module.exports = router;
