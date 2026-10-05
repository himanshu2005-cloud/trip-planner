'use strict';

/**
 * controllers/itinerary.controller.js
 * Placeholder controllers for Phase 1.
 */

exports.generateItinerary = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Itinerary generation endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.regenerateDay = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Regenerate day endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};
