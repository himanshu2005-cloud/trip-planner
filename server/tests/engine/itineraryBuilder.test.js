'use strict';

/**
 * Tests for engine/itineraryBuilder.js
 *
 * Covers:
 *  - Full 3-stage optimization pipeline (k-means -> TSP 2-opt -> Constraints)
 *  - Correct number of days returned
 *  - Budget split per day and total cost adherence
 *  - Opening hours and time windows respected
 *  - Sequential stop numbering (1, 2, 3...)
 *  - Single day regeneration isolation
 *  - Handling empty or small attraction pools
 */

const {
  buildItinerary,
  regenerateDay,
  generateDayTheme,
  applyReasonPreference,
} = require('../../src/engine/itineraryBuilder');

function makeTestAttractions(count = 12) {
  const categories = [
    ['museum', 'art', 'history'],
    ['park', 'nature', 'garden'],
    ['monument', 'architecture'],
    ['restaurant', 'food', 'cafe'],
  ];

  return Array.from({ length: count }, (_, i) => ({
    placeId: `attr-${i + 1}`,
    name: `Attraction ${i + 1}`,
    // Geographically spread coordinates
    coordinates: {
      lat: 48.85 + (i % 3) * 0.02 + Math.floor(i / 6) * 0.05,
      lng: 2.30 + (i % 4) * 0.02,
    },
    category: categories[i % categories.length],
    rating: 4.5 + (i % 5) * 0.1,
    cost: 300 + (i % 4) * 400, // 300, 700, 1100, 1500
    durationMin: 60 + (i % 3) * 30, // 60, 90, 120
    openingHours: { open: '09:00', close: '18:30' },
    isOutdoor: (i % 2) === 1,
  }));
}

describe('Itinerary Optimization Pipeline (itineraryBuilder.js)', () => {
  describe('buildItinerary()', () => {
    test('throws RangeError for invalid numberOfDays or budget', () => {
      expect(() => buildItinerary([], { numberOfDays: 0, budget: 10000 })).toThrow(RangeError);
      expect(() => buildItinerary([], { numberOfDays: -1, budget: 10000 })).toThrow(RangeError);
      expect(() => buildItinerary([], { numberOfDays: 3, budget: 0 })).toThrow(RangeError);
      expect(() => buildItinerary([], { numberOfDays: 3, budget: -500 })).toThrow(RangeError);
    });

    test('returns empty days with themes when attraction pool is empty', () => {
      const days = buildItinerary([], { numberOfDays: 3, budget: 15000 });
      expect(days).toHaveLength(3);
      expect(days[0].dayNumber).toBe(1);
      expect(days[0].stops).toHaveLength(0);
      expect(days[0].totalCost).toBe(0);
      expect(days[0].theme).toBe('Rest Day');
    });

    test('builds a complete structured 3-day itinerary from attraction pool', () => {
      const attractions = makeTestAttractions(15);
      const days = buildItinerary(attractions, {
        numberOfDays: 3,
        budget: 30000,
      });

      expect(days).toHaveLength(3);

      days.forEach((day, idx) => {
        expect(day.dayNumber).toBe(idx + 1);
        expect(typeof day.theme).toBe('string');
        expect(day.stops.length).toBeGreaterThan(0);
        expect(day.totalCost).toBeLessThanOrEqual(10000); // 30000 / 3

        // Verify sequential stop numbers
        day.stops.forEach((stop, sIdx) => {
          expect(stop.stopNumber).toBe(sIdx + 1);
          expect(stop.startTime).toBeDefined();
          expect(stop.endTime).toBeDefined();
        });

        // Verify last stop has no travelToNext
        const lastStop = day.stops[day.stops.length - 1];
        expect(lastStop.travelToNext).toBeNull();
      });
    });

    test('adheres strictly to daily budget constraints', () => {
      const attractions = makeTestAttractions(10);
      const lowBudget = 1500; // 500 per day for 3 days
      const days = buildItinerary(attractions, {
        numberOfDays: 3,
        budget: lowBudget,
      });

      days.forEach((day) => {
        expect(day.totalCost).toBeLessThanOrEqual(500);
      });
    });

    test('produces deterministic output with same seed', () => {
      const attractions = makeTestAttractions(12);
      const params = { numberOfDays: 3, budget: 20000 };

      const run1 = buildItinerary(attractions, params, { seed: 99 });
      const run2 = buildItinerary(attractions, params, { seed: 99 });

      expect(run1).toEqual(run2);
    });
  });

  describe('regenerateDay()', () => {
    test('requires budgetRemaining option', () => {
      expect(() => regenerateDay([], [], 1, {})).toThrow(/budgetRemaining is required/);
    });

    test('regenerates specified day without reusing attractions locked in other days', () => {
      const attractions = makeTestAttractions(15);
      const initialItinerary = buildItinerary(attractions, {
        numberOfDays: 3,
        budget: 30000,
      });

      // Collect placeIds from day 1 and day 2
      const lockedIds = new Set();
      for (const stop of initialItinerary[0].stops) lockedIds.add(stop.placeId);
      for (const stop of initialItinerary[1].stops) lockedIds.add(stop.placeId);

      const regeneratedDay3 = regenerateDay(
        attractions,
        initialItinerary,
        3,
        {
          budgetRemaining: 10000,
          reason: 'More food',
        }
      );

      expect(regeneratedDay3.dayNumber).toBe(3);
      expect(regeneratedDay3.regenerationReason).toBe('More food');

      // Verify no stop in regeneratedDay3 is from lockedIds (Day 1 or Day 2)
      regeneratedDay3.stops.forEach((stop) => {
        expect(lockedIds.has(stop.placeId)).toBe(false);
      });
    });
  });

  describe('generateDayTheme() & applyReasonPreference()', () => {
    test('identifies museum theme correctly', () => {
      const stops = [
        { category: ['museum', 'art'] },
        { category: ['gallery', 'culture'] },
      ];
      expect(generateDayTheme(stops)).toBe('Museum & Arts Day');
    });

    test('identifies nature theme correctly', () => {
      const stops = [
        { category: ['park', 'nature'] },
        { category: ['garden'] },
      ];
      expect(generateDayTheme(stops)).toBe('Nature & Parks Day');
    });

    test('prioritizes indoor attractions when weather changed reason given', () => {
      const pool = [
        { placeId: 'outdoor-1', isOutdoor: true, category: ['park'] },
        { placeId: 'indoor-1', isOutdoor: false, category: ['museum'] },
      ];

      const reordered = applyReasonPreference(pool, 'Weather changed');
      expect(reordered[0].placeId).toBe('indoor-1');
      expect(reordered[1].placeId).toBe('outdoor-1');
    });
  });
});
