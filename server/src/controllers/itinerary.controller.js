'use strict';

/**
 * controllers/itinerary.controller.js
 *
 * Coordinates Google Places attraction retrieval and the 3-stage optimization engine.
 * Returns day-wise itinerary strictly matching the database schema:
 *
 * Trip
 *  ├── destination
 *  ├── budget
 *  ├── days
 *  ├── interests
 *  └── itinerary[]
 *        ├── day
 *        ├── date
 *        ├── totalCost
 *        ├── totalTravelTime
 *        └── stops[]
 *              ├── attraction
 *              ├── startTime
 *              ├── duration
 *              ├── cost
 *              ├── coordinates
 *              ├── travelToNext
 *              └── weather
 */

const { fetchAttractions } = require('../services/places.service');
const { buildItinerary, regenerateDay } = require('../engine/itineraryBuilder');

/**
 * Normalizes day and stop objects into the approved MongoDB schema structure.
 */
function formatDayForSchema(day) {
  return {
    day: day.dayNumber || day.day,
    dayNumber: day.dayNumber || day.day,
    date: day.date || '',
    theme: day.theme || 'City Exploration',
    totalCost: day.totalCost || 0,
    totalTravelTime: day.totalTravelTimeMin || day.totalTravelTime || 0,
    totalTravelTimeMin: day.totalTravelTimeMin || day.totalTravelTime || 0,
    totalDistanceKm: day.totalDistanceKm || 0,
    stops: (day.stops || []).map((stop, sIdx) => ({
      attractionId: stop.placeId || stop.attractionId || `stop-${sIdx + 1}`,
      attraction: stop.name || stop.attraction,
      name: stop.name || stop.attraction,
      startTime: stop.startTime || '09:00',
      endTime: stop.endTime || '10:00',
      duration: stop.durationMin || stop.duration || 60,
      durationMin: stop.durationMin || stop.duration || 60,
      cost: stop.cost || 0,
      coordinates: {
        lat: stop.coordinates?.lat || 0,
        lng: stop.coordinates?.lng || 0,
      },
      category: stop.category || ['Attraction'],
      rating: stop.rating || 4.5,
      openingHours: stop.openingHours || { open: '09:00', close: '18:00' },
      travelToNext: stop.travelToNext || null,
      weather: stop.weather || 'clear',
      weatherStatus: stop.weather || 'clear',
      stopNumber: sIdx + 1,
    })),
  };
}

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

    // 2. Execute 3-stage optimization engine
    const rawDays = buildItinerary(
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

    // 3. Format days to match schema 1:1
    const schemaDays = rawDays.map(formatDayForSchema);

    // Compute aggregated trip statistics
    let totalSelectedStops = 0;
    let totalEstimatedTravelKm = 0;
    let totalEstimatedCost = 0;

    schemaDays.forEach((day) => {
      totalSelectedStops += (day.stops || []).length;
      totalEstimatedTravelKm += day.totalDistanceKm || 0;
      totalEstimatedCost += day.totalCost || 0;
    });

    res.status(200).json({
      success: true,
      destination: destination.trim(),
      budget: tripBudget,
      days: tripDays,
      numberOfDays: tripDays,
      interests: userInterests,
      attractionsAnalyzed: attractions.length,
      totalSelectedStops,
      totalEstimatedTravelKm: Number(totalEstimatedTravelKm.toFixed(1)),
      totalEstimatedCost,
      itinerary: schemaDays,
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

    const attractions = await fetchAttractions(destination.trim(), interests, {
      limit: 30,
      minRating: 4.0,
    });

    const rawUpdatedDay = regenerateDay(attractions, existingDays, targetDay, {
      reason,
      budgetRemaining: dayBudget,
      dayStart: '09:00',
      dayEnd: '19:00',
    });

    const updatedDay = formatDayForSchema(rawUpdatedDay);

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
