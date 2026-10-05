'use strict';

const request = require('supertest');
const { app } = require('../../server');

describe('Itinerary Generation REST APIs', () => {
  describe('POST /api/itinerary/generate', () => {
    test('returns 400 if destination or budget is missing', async () => {
      const res = await request(app)
        .post('/api/itinerary/generate')
        .send({ destination: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/destination is required/i);
    });

    test('returns 400 if days is out of range', async () => {
      const res = await request(app)
        .post('/api/itinerary/generate')
        .send({ destination: 'Paris', days: 20, budget: 50000 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/between 1 and 14 days/i);
    });

    test('generates full structured itinerary from parameters', async () => {
      const res = await request(app)
        .post('/api/itinerary/generate')
        .send({
          destination: 'Paris, France',
          numberOfDays: 3,
          budget: 35000,
          interests: ['History', 'Food', 'Culture'],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.destination).toBe('Paris, France');
      expect(res.body.numberOfDays).toBe(3);
      expect(res.body.itinerary).toHaveLength(3);
      expect(res.body.attractionsAnalyzed).toBeGreaterThan(0);
      expect(res.body.totalSelectedStops).toBeGreaterThan(0);
      expect(res.body.totalEstimatedCost).toBeLessThanOrEqual(35000);

      const day1 = res.body.itinerary[0];
      expect(day1.dayNumber).toBe(1);
      expect(day1.stops.length).toBeGreaterThan(0);
      expect(day1.stops[0].stopNumber).toBe(1);
      expect(day1.stops[0].startTime).toBeDefined();
    });
  });

  describe('POST /api/itinerary/regenerate-day', () => {
    test('returns 400 if required parameters are missing', async () => {
      const res = await request(app)
        .post('/api/itinerary/regenerate-day')
        .send({ destination: 'Paris' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('regenerates single day successfully', async () => {
      const generateRes = await request(app)
        .post('/api/itinerary/generate')
        .send({
          destination: 'Paris, France',
          numberOfDays: 3,
          budget: 30000,
          interests: ['History', 'Food'],
        });

      const existingDays = generateRes.body.itinerary;

      const regenRes = await request(app)
        .post('/api/itinerary/regenerate-day')
        .send({
          destination: 'Paris, France',
          dayNumber: 2,
          reason: 'More food',
          budgetRemaining: 10000,
          existingDays,
          interests: ['Food'],
        });

      expect(regenRes.status).toBe(200);
      expect(regenRes.body.success).toBe(true);
      expect(regenRes.body.dayNumber).toBe(2);
      expect(regenRes.body.updatedDay).toBeDefined();
      expect(regenRes.body.updatedDay.dayNumber).toBe(2);
    });
  });
});
