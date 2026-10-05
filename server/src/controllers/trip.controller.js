'use strict';

const mongoose = require('mongoose');
const Trip = require('../models/Trip');

/**
 * @desc    Get all trips for the authenticated user
 * @route   GET /api/trips
 * @access  Private
 */
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single trip by ID
 * @route   GET /api/trips/:id
 * @access  Private (or public/guest if trip has no owner)
 */
exports.getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format',
      });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Check ownership if user is authenticated and trip belongs to someone
    if (trip.userId && (!req.user || trip.userId.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this trip',
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create and save a new trip
 * @route   POST /api/trips
 * @access  Private (or optional auth)
 */
exports.createTrip = async (req, res, next) => {
  try {
    const {
      destination,
      budget,
      days,
      numberOfDays,
      interests,
      itinerary,
    } = req.body;

    const tripDays = days || numberOfDays;

    if (!destination || budget === undefined || tripDays === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination, budget, and trip duration (days)',
      });
    }

    const newTrip = await Trip.create({
      userId: req.user ? req.user.id : null,
      destination: destination.trim(),
      budget: Number(budget),
      days: Number(tripDays),
      interests: Array.isArray(interests) ? interests : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
    });

    res.status(201).json({
      success: true,
      message: 'Trip saved successfully',
      data: newTrip,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
exports.updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format',
      });
    }

    let trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Check ownership
    if (trip.userId && (!req.user || trip.userId.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this trip',
      });
    }

    const {
      destination,
      budget,
      days,
      numberOfDays,
      interests,
      itinerary,
    } = req.body;

    if (destination !== undefined) trip.destination = destination.trim();
    if (budget !== undefined) trip.budget = Number(budget);
    if (days !== undefined || numberOfDays !== undefined) {
      trip.days = Number(days !== undefined ? days : numberOfDays);
    }
    if (interests !== undefined) trip.interests = interests;
    if (itinerary !== undefined) trip.itinerary = itinerary;

    const updatedTrip = await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: updatedTrip,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
exports.deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format',
      });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Check ownership
    if (trip.userId && (!req.user || trip.userId.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip',
      });
    }

    await Trip.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
