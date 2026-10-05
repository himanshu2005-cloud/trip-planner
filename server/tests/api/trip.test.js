'use strict';

const request = require('supertest');
const { app } = require('../../server');
const Trip = require('../../src/models/Trip');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/env');

describe('Trip REST APIs', () => {
  const userId = '507f1f77bcf86cd799439011';
  const otherUserId = '507f1f77bcf86cd799439099';
  const tripId = '507f1f77bcf86cd799439022';

  const userToken = jwt.sign(
    { id: userId, email: 'user@example.com', name: 'User 1' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/trips', () => {
    test('returns 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/trips');
      expect(res.status).toBe(401);
    });

    test('returns trips list for authenticated user', async () => {
      const mockTrips = [
        {
          _id: tripId,
          userId,
          destination: 'Paris, France',
          budget: 40000,
          days: 5,
        },
      ];

      jest.spyOn(Trip, 'find').mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(mockTrips),
      });

      const res = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].destination).toBe('Paris, France');
    });
  });

  describe('GET /api/trips/:id', () => {
    test('returns 400 on invalid mongo ObjectId', async () => {
      const res = await request(app).get('/api/trips/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid trip ID/i);
    });

    test('returns 404 if trip not found', async () => {
      jest.spyOn(Trip, 'findById').mockResolvedValueOnce(null);

      const res = await request(app).get(`/api/trips/${tripId}`);
      expect(res.status).toBe(404);
    });

    test('returns 403 if trip belongs to another user and requester has different token', async () => {
      jest.spyOn(Trip, 'findById').mockResolvedValueOnce({
        _id: tripId,
        userId: otherUserId,
        destination: 'Tokyo, Japan',
      });

      const res = await request(app)
        .get(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    test('returns trip if authorized', async () => {
      jest.spyOn(Trip, 'findById').mockResolvedValueOnce({
        _id: tripId,
        userId,
        destination: 'Paris, France',
        budget: 40000,
      });

      const res = await request(app)
        .get(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.destination).toBe('Paris, France');
    });
  });

  describe('POST /api/trips', () => {
    test('returns 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ destination: 'Paris' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/provide destination, budget, and trip duration/i);
    });

    test('creates and returns new trip', async () => {
      const newTripData = {
        _id: tripId,
        userId,
        destination: 'Paris, France',
        budget: 40000,
        days: 5,
        interests: ['History', 'Food'],
        itinerary: [],
      };

      jest.spyOn(Trip, 'create').mockResolvedValueOnce(newTripData);

      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          destination: 'Paris, France',
          budget: 40000,
          days: 5,
          interests: ['History', 'Food'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.destination).toBe('Paris, France');
    });
  });

  describe('PUT /api/trips/:id', () => {
    test('returns 401 if unauthenticated', async () => {
      const res = await request(app)
        .put(`/api/trips/${tripId}`)
        .send({ budget: 45000 });

      expect(res.status).toBe(401);
    });

    test('returns 403 if trip belongs to someone else', async () => {
      jest.spyOn(Trip, 'findById').mockResolvedValueOnce({
        _id: tripId,
        userId: otherUserId,
      });

      const res = await request(app)
        .put(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ budget: 45000 });

      expect(res.status).toBe(403);
    });

    test('updates trip successfully for owner', async () => {
      const mockTrip = {
        _id: tripId,
        userId,
        destination: 'Paris, France',
        budget: 40000,
        save: jest.fn().mockResolvedValueOnce({
          _id: tripId,
          userId,
          destination: 'Paris, France',
          budget: 45000,
        }),
      };

      jest.spyOn(Trip, 'findById').mockResolvedValueOnce(mockTrip);

      const res = await request(app)
        .put(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ budget: 45000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.budget).toBe(45000);
    });
  });

  describe('DELETE /api/trips/:id', () => {
    test('returns 401 if unauthenticated', async () => {
      const res = await request(app).delete(`/api/trips/${tripId}`);
      expect(res.status).toBe(401);
    });

    test('deletes trip successfully for owner', async () => {
      jest.spyOn(Trip, 'findById').mockResolvedValueOnce({
        _id: tripId,
        userId,
      });
      jest.spyOn(Trip, 'findByIdAndDelete').mockResolvedValueOnce({});

      const res = await request(app)
        .delete(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });
  });
});
