'use strict';

const { app } = require('../../server');

describe('Server & Routes (Phase 1 Baseline)', () => {
  test('server app exports properly and has routes configured', () => {
    expect(app).toBeDefined();
    expect(typeof app.handle).toBe('function');
  });

  test('environment configuration loads properly', () => {
    const env = require('../../src/config/env');
    expect(env.PORT).toBeDefined();
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
  });
});
