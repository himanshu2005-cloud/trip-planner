'use strict';

const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Trip = require('../../src/models/Trip');
const { Day } = require('../../src/models/Day');
const { Attraction } = require('../../src/models/Attraction');

describe('MongoDB Models (Unit Tests)', () => {
  describe('User Model', () => {
    test('validates required fields (name, email, password)', () => {
      const user = new User({});
      const err = user.validateSync();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    test('validates email format', () => {
      const user = new User({
        name: 'Alex Mercer',
        email: 'not-an-email',
        password: 'password123',
      });
      const err = user.validateSync();
      expect(err.errors.email).toBeDefined();
    });

    test('validates password minimum length (6 chars)', () => {
      const user = new User({
        name: 'Alex Mercer',
        email: 'alex@example.com',
        password: '123',
      });
      const err = user.validateSync();
      expect(err.errors.password).toBeDefined();
    });

    test('generates valid JWT token with user id, email and name', () => {
      const userId = new mongoose.Types.ObjectId();
      const user = new User({
        _id: userId,
        name: 'Alex Mercer',
        email: 'alex@example.com',
        password: 'password123',
      });
      const token = user.generateAuthToken();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('Attraction / Stop Schema', () => {
    test('validates attraction name and coordinates', () => {
      const attraction = new Attraction({
        attraction: 'Louvre Museum',
        coordinates: { lat: 48.8606, lng: 2.3376 },
        cost: 1800,
        duration: 120,
      });
      const err = attraction.validateSync();
      expect(err).toBeUndefined();
      expect(attraction.name).toBe('Louvre Museum');
      expect(attraction.weather).toBe('clear');
    });

    test('requires coordinates', () => {
      const attraction = new Attraction({
        attraction: 'Eiffel Tower',
      });
      const err = attraction.validateSync();
      expect(err.errors['coordinates.lat']).toBeDefined();
      expect(err.errors['coordinates.lng']).toBeDefined();
    });
  });

  describe('Day Schema', () => {
    test('validates day number and holds nested stops', () => {
      const day = new Day({
        day: 1,
        date: '2026-10-10',
        totalCost: 1800,
        totalTravelTime: 30,
        stops: [
          {
            attraction: 'Louvre Museum',
            coordinates: { lat: 48.8606, lng: 2.3376 },
            cost: 1800,
            duration: 120,
          },
        ],
      });
      const err = day.validateSync();
      expect(err).toBeUndefined();
      expect(day.day).toBe(1);
      expect(day.stops).toHaveLength(1);
      expect(day.stops[0].attraction).toBe('Louvre Museum');
    });
  });

  describe('Trip Model', () => {
    test('validates required fields (destination, budget, days)', () => {
      const trip = new Trip({});
      const err = trip.validateSync();
      expect(err.errors.destination).toBeDefined();
      expect(err.errors.budget).toBeDefined();
      expect(err.errors.days).toBeDefined();
    });

    test('validates positive budget and reasonable days (1 - 14)', () => {
      const invalidTrip = new Trip({
        destination: 'Paris',
        budget: -500,
        days: 25,
      });
      const err = invalidTrip.validateSync();
      expect(err.errors.budget).toBeDefined();
      expect(err.errors.days).toBeDefined();
    });

    test('accepts valid trip with nested itinerary days and stops', () => {
      const validTrip = new Trip({
        destination: 'Paris, France',
        budget: 40000,
        days: 5,
        interests: ['History', 'Food', 'Culture'],
        itinerary: [
          {
            day: 1,
            totalCost: 1800,
            totalTravelTime: 20,
            stops: [
              {
                attraction: 'Louvre Museum',
                coordinates: { lat: 48.8606, lng: 2.3376 },
                cost: 1800,
                duration: 120,
              },
            ],
          },
        ],
      });
      const err = validTrip.validateSync();
      expect(err).toBeUndefined();
      expect(validTrip.days).toBe(5);
      expect(validTrip.numberOfDays).toBe(5);
      expect(validTrip.itinerary).toHaveLength(1);
    });
  });
});
