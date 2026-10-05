'use strict';

/**
 * controllers/auth.controller.js
 * Placeholder controllers for Phase 1.
 * Full auth business logic is implemented in Phase 2.
 */

exports.register = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Auth register endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Auth login endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user || null,
      message: 'Auth getMe endpoint ready (Phase 1 stub)',
    });
  } catch (err) {
    next(err);
  }
};
