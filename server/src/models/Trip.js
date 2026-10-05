'use strict';

const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
  {
    attractionId: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    category: {
      type: String,
      default: 'General',
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    startTime: {
      type: String, // e.g. "09:00"
      default: '09:00',
    },
    duration: {
      type: Number, // duration in minutes
      default: 60,
    },
    cost: {
      type: Number,
      default: 0,
    },
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
    },
    travelToNext: {
      distanceKm: { type: Number, default: 0 },
      durationMinutes: { type: Number, default: 0 },
    },
    weatherStatus: {
      type: String,
      default: 'clear',
    },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      default: '',
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    totalTravelTime: {
      type: Number, // minutes
      default: 0,
    },
    stops: [stopSchema],
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // can be optional for guest generation before saving
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be non-negative'],
    },
    numberOfDays: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Trip must be at least 1 day'],
      max: [14, 'Trip cannot exceed 14 days'],
    },
    interests: {
      type: [String],
      default: [],
    },
    itinerary: [itineraryDaySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
