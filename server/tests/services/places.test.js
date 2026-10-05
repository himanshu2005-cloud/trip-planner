'use strict';

const axios = require('axios');
const {
  fetchAttractions,
  normalizePlace,
  normalizeOpeningHours,
  estimateDuration,
  estimateCost,
} = require('../../src/services/places.service');

jest.mock('axios');

describe('Google Places Service & Normalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normalizePlace()', () => {
    test('normalizes raw Google Places object into internal Attraction schema', () => {
      const rawGooglePlace = {
        place_id: 'ChIJLU7jZClu5kcR4PcOOO6p3I0',
        name: 'Louvre Museum',
        geometry: {
          location: {
            lat: 48.8606,
            lng: 2.3376,
          },
        },
        types: ['museum', 'tourist_attraction', 'point_of_interest', 'establishment'],
        rating: 4.7,
        user_ratings_total: 260000,
        price_level: 3,
        opening_hours: {
          open_now: true,
          periods: [
            {
              open: { day: 1, time: '0900' },
              close: { day: 1, time: '1800' },
            },
          ],
        },
        formatted_address: 'Rue de Rivoli, 75001 Paris, France',
      };

      const normalized = normalizePlace(rawGooglePlace);

      expect(normalized).toBeDefined();
      expect(normalized.placeId).toBe('ChIJLU7jZClu5kcR4PcOOO6p3I0');
      expect(normalized.attractionId).toBe('ChIJLU7jZClu5kcR4PcOOO6p3I0');
      expect(normalized.name).toBe('Louvre Museum');
      expect(normalized.attraction).toBe('Louvre Museum');
      expect(normalized.coordinates).toEqual({ lat: 48.8606, lng: 2.3376 });
      expect(normalized.category).toContain('museum');
      expect(normalized.category).not.toContain('point_of_interest');
      expect(normalized.rating).toBe(4.7);
      expect(normalized.cost).toBe(1800); // price_level 3
      expect(normalized.durationMin).toBe(120); // museum duration
      expect(normalized.openingHours).toEqual({ open: '09:00', close: '18:00' });
      expect(normalized.isOutdoor).toBe(false);
      expect(normalized.weather).toBe('clear');
    });

    test('correctly identifies outdoor places', () => {
      const parkPlace = {
        place_id: 'park-123',
        name: 'Jardin du Luxembourg',
        geometry: { location: { lat: 48.8462, lng: 2.3372 } },
        types: ['park', 'natural_feature'],
        rating: 4.8,
        price_level: 0,
      };

      const normalized = normalizePlace(parkPlace);
      expect(normalized.isOutdoor).toBe(true);
      expect(normalized.cost).toBe(0);
      expect(normalized.durationMin).toBe(60);
    });
  });

  describe('normalizeOpeningHours()', () => {
    test('returns default 09:00 to 18:00 if opening_hours is missing', () => {
      expect(normalizeOpeningHours(null)).toEqual({ open: '09:00', close: '18:00' });
      expect(normalizeOpeningHours(undefined)).toEqual({ open: '09:00', close: '18:00' });
    });

    test('extracts formatted HH:MM from period times', () => {
      const hours = {
        periods: [
          {
            open: { time: '1000' },
            close: { time: '2030' },
          },
        ],
      };
      expect(normalizeOpeningHours(hours)).toEqual({ open: '10:00', close: '20:30' });
    });
  });

  describe('estimateDuration() and estimateCost()', () => {
    test('estimates duration based on place categories', () => {
      expect(estimateDuration(['art_gallery'])).toBe(120);
      expect(estimateDuration(['zoo'])).toBe(180);
      expect(estimateDuration(['restaurant'])).toBe(60);
      expect(estimateDuration(['church'])).toBe(45);
      expect(estimateDuration([])).toBe(60);
    });

    test('estimates cost based on Google price_level', () => {
      expect(estimateCost(0)).toBe(0);
      expect(estimateCost(1)).toBe(350);
      expect(estimateCost(2)).toBe(900);
      expect(estimateCost(3)).toBe(1800);
      expect(estimateCost(4)).toBe(3500);
    });
  });

  describe('fetchAttractions()', () => {
    test('retrieves and normalizes attractions with fallback or live API mock', async () => {
      const mockGoogleResults = {
        data: {
          status: 'OK',
          results: [
            {
              place_id: 'mock-place-1',
              name: 'Eiffel Tower Mock',
              geometry: { location: { lat: 48.8584, lng: 2.2945 } },
              types: ['tourist_attraction', 'monument'],
              rating: 4.8,
              price_level: 3,
            },
            {
              place_id: 'mock-place-2',
              name: 'Musée d Orsay Mock',
              geometry: { location: { lat: 48.8599, lng: 2.3265 } },
              types: ['museum', 'art_gallery'],
              rating: 4.7,
              price_level: 2,
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(mockGoogleResults);

      const attractions = await fetchAttractions('Paris', ['History']);

      expect(Array.isArray(attractions)).toBe(true);
      expect(attractions.length).toBeGreaterThan(0);
      const first = attractions[0];
      expect(first.placeId).toBeDefined();
      expect(first.name).toBeDefined();
      expect(first.coordinates).toHaveProperty('lat');
      expect(first.coordinates).toHaveProperty('lng');
      expect(first.rating).toBeGreaterThanOrEqual(4.0);
    });

    test('falls back gracefully to curated dataset if API throws error', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network or quota error'));

      const attractions = await fetchAttractions('Paris', ['History']);
      expect(Array.isArray(attractions)).toBe(true);
      expect(attractions.length).toBeGreaterThan(0);
      expect(attractions[0].coordinates.lat).toBeGreaterThan(48.0);
      expect(attractions[0].coordinates.lat).toBeLessThan(49.0);
    });
  });
});
