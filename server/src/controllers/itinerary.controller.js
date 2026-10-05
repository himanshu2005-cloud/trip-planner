'use strict';

/**
 * controllers/itinerary.controller.js
 *
 * Handles itinerary generation and single-day regeneration by coordinating
 * the Google Places data service and the 3-stage optimization engine.
 */

const { fetchAttractions } = require('../services/places.service');
const { buildItinerary, regenerateDay } = require('../engine/itineraryBuilder');

/**
 * @desc    Generate optimized day-wise itinerary
 * @route   POST /api/itinerary/generate
 * @access  Public
 */
exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, numberOfDays, days, budget, interests } = req.body;

    const tripDays = Number(days || numberOfDays);
    const tripBudget = Number(budget);

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required',
      });
    }

    if (!tripDays || tripDays < 1 || tripDays > 14) {
      return res.status(400).json({
        success: false,
        message: 'Trip duration must be between 1 and 14 days',
      });
    }

    if (!tripBudget || tripBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid budget amount',
      });
    }

    const userInterests = Array.isArray(interests) && interests.length > 0
      ? interests
      : ['History', 'Food', 'Culture'];

    // 1. Fetch attraction candidates matching destination & interests
    const attractions = await fetchAttractions(destination.trim(), userInterests, {
      limit: Math.max(25, tripDays * 8),
      minRating: 4.0,
    });

    // 2. Execute 3-stage optimization engine (k-means -> 2-opt TSP -> Constraints)
    const generatedDays = buildItinerary(
      attractions,
      {
        numberOfDays: tripDays,
        budget: tripBudget,
        dayStart: '09:00',
        dayEnd: '19:00',
      },
      {
        seed: 42,
        restarts: 3,
      }
    );

    // Compute aggregated trip statistics
    let totalSelectedStops = 0;
    let totalEstimatedTravelKm = 0;
    let totalEstimatedCost = 0;

    generatedDays.forEach((day) => {
      totalSelectedStops += (day.stops || []).length;
      totalEstimatedTravelKm += day.totalDistanceKm || 0;
      totalEstimatedCost += day.totalCost || 0;
    });

    res.status(200).json({
      success: true,
      destination: destination.trim(),
      numberOfDays: tripDays,
      days: tripDays,
      budget: tripBudget,
      interests: userInterests,
      attractionsAnalyzed: attractions.length,
      totalSelectedStops,
      totalEstimatedTravelKm: Number(totalEstimatedTravelKm.toFixed(1)),
      totalEstimatedCost,
      itinerary: generatedDays,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Regenerate a single day without altering other days
 * @route   POST /api/itinerary/regenerate-day
 * @access  Public
 */
exports.regenerateDay = async (req, res, next) => {
  try {
    const {
      destination,
      dayNumber,
      reason = '',
      budgetRemaining,
      existingDays = [],
      interests = [],
    } = req.body;

    const targetDay = Number(dayNumber);
    const dayBudget = Number(budgetRemaining);

    if (!destination || !targetDay || dayBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Destination, dayNumber, and budgetRemaining are required',
      });
    }

    // Fetch attraction pool
    const attractions = await fetchAttractions(destination.trim(), interests, {
      limit: 30,
      minRating: 4.0,
    });

    // Run isolated single-day re-plan with user reason preference
    const updatedDay = regenerateDay(attractions, existingDays, targetDay, {
      reason,
      budgetRemaining: dayBudget,
      dayStart: '09:00',
      dayEnd: '19:00',
    });

    res.status(200).json({
      success: true,
      dayNumber: targetDay,
      updatedDay,
      message: `Day ${targetDay} regenerated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
