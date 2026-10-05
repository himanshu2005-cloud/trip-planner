'use strict';

const mongoose = require('mongoose');
const { daySchema } = require('./Day');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // guest trips or authenticated user trips
      index: true,
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
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Trip must be at least 1 day'],
      max: [14, 'Trip cannot exceed 14 days'],
      alias: 'numberOfDays',
    },
    interests: {
      type: [String],
      default: [],
    },
    itinerary: [daySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for numberOfDays backward/frontend compatibility
tripSchema.virtual('numberOfDays').get(function () {
  return this.days;
}).set(function (val) {
  this.days = val;
});

module.exports = mongoose.model('Trip', tripSchema);
