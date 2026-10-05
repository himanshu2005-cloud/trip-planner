'use strict';

const mongoose = require('mongoose');
const { attractionSchema } = require('./Attraction');

const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    dayNumber: {
      type: Number,
      default: function () {
        return this.day;
      },
    },
    date: {
      type: String,
      default: '',
    },
    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTravelTime: {
      type: Number, // travel duration in minutes
      default: 0,
      min: 0,
    },
    stops: [attractionSchema],
  },
  { _id: false }
);

module.exports = {
  daySchema,
  Day: mongoose.model('Day', daySchema),
};
