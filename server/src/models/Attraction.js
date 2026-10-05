'use strict';

const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema(
  {
    attraction: {
      type: String,
      required: [true, 'Attraction name is required'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.attraction;
      },
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
      min: 0,
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
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
    },
    travelToNext: {
      distanceKm: { type: Number, default: 0 },
      durationMinutes: { type: Number, default: 0 },
    },
    weather: {
      type: String,
      default: 'clear',
    },
    weatherStatus: {
      type: String,
      default: function () {
        return this.weather || 'clear';
      },
    },
  },
  { _id: false }
);

module.exports = {
  attractionSchema,
  Attraction: mongoose.model('Attraction', attractionSchema),
};
