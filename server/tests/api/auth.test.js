'use strict';

const request = require('supertest');
const { app } = require('../../server');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/env');

describe('Auth REST APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('returns 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/provide name, email, and password/i);
    });

    test('returns 400 if password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alex', email: 'alex@example.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/at least 6 characters/i);
    });

    test('returns 400 if email is already taken', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({ email: 'existing@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    test('registers user successfully and returns JWT', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const fakeUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Alex Mercer',
        email: 'alex@example.com',
        generateAuthToken: () =>
          jwt.sign(
            { id: '507f1f77bcf86cd799439011', email: 'alex@example.com', name: 'Alex Mercer' },
            JWT_SECRET,
            { expiresIn: '7d' }
          ),
      };

      jest.spyOn(User, 'create').mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex Mercer',
          email: 'alex@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('alex@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    test('returns 400 if credentials missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('returns 401 if user does not exist', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ghost@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('returns 401 if password does not match', async () => {
      const fakeUser = {
        comparePassword: jest.fn().mockResolvedValueOnce(false),
      };

      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(fakeUser),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('logs in successfully and returns JWT', async () => {
      const fakeUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Alex Mercer',
        email: 'alex@example.com',
        comparePassword: jest.fn().mockResolvedValueOnce(true),
        generateAuthToken: () =>
          jwt.sign(
            { id: '507f1f77bcf86cd799439011', email: 'alex@example.com', name: 'Alex Mercer' },
            JWT_SECRET,
            { expiresIn: '7d' }
          ),
      };

      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(fakeUser),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe('Alex Mercer');
    });
  });

  describe('GET /api/auth/me', () => {
    test('returns 401 if no authorization token provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('returns 401 if invalid authorization token provided', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('returns user profile when valid token provided', async () => {
      const token = jwt.sign(
        { id: '507f1f77bcf86cd799439011', email: 'alex@example.com', name: 'Alex Mercer' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '507f1f77bcf86cd799439011',
        name: 'Alex Mercer',
        email: 'alex@example.com',
        createdAt: new Date().toISOString(),
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('alex@example.com');
    });
  });
});
