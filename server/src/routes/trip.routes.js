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
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// GET all trips for authenticated user
router.get('/', authenticate, getTrips);

// GET single trip by ID (supports authenticated user or guest)
router.get('/:id', optionalAuth, getTripById);

// POST create a trip (supports authenticated user or guest)
router.post('/', optionalAuth, createTrip);

// PUT update a trip
router.put('/:id', authenticate, updateTrip);

// DELETE delete a trip
router.delete('/:id', authenticate, deleteTrip);

module.exports = router;
