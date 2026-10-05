'use strict';

const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'MISSING_CLIENT_ID');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create user (password is automatically hashed via pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email, explicitly including password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password with bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private (JWT required)
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate user via Google Login
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'MISSING_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create user without password since they use Google Sign In
      user = await User.create({
        name: payload.name || 'Google User',
        email: normalizedEmail,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
      });
    }

    const authToken = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully with Google',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Google verification error:', err.message);
    res.status(401).json({ success: false, message: 'Failed to verify Google token' });
  }
};
