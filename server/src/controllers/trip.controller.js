'use strict';

/**
 * controllers/trip.controller.js
 * Placeholder controllers for Phase 1.
 */

exports.getTrips = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: [],
      message: 'Get trips endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'Get trip by id endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.createTrip = async (req, res, next) => {
  try {
    return res.status(201).json({
      success: true,
      message: 'Create trip endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Update trip endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Delete trip endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};
