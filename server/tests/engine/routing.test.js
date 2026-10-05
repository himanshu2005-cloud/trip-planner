'use strict';

/**
 * Tests for engine/routing.js
 *
 * Covers:
 *  - nearestNeighbour: returns all attractions, no duplicates
 *  - nearestNeighbour: starts from earliest-opening attraction
 *  - twoOpt: never worsens the route distance
 *  - twoOpt: improves a known suboptimal crossing route
 *  - twoOpt: handles routes shorter than 4 (no-op)
 *  - optimizeRoute: total items preserved
 *  - optimizeRoute: empty / single-item edge cases
 *  - totalRouteDistance: correct accumulation
 */

const {
  nearestNeighbour,
  twoOpt,
  optimizeRoute,
  totalRouteDistance,
} = require('../../src/engine/routing');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/**
 * Make a minimal attraction with coordinates and optional opening hours.
 */
function makeAttr(id, lat, lng, openHour = null) {
  return {
    placeId: id,
    name: `Place ${id}`,
    coordinates: { lat, lng },
    category: [],
    durationMin: 60,
    cost: 100,
    openingHours: openHour ? { open: `${String(openHour).padStart(2, '0')}:00`, close: '20:00' } : null,
    isOutdoor: false,
  };
}

/**
 * Four points forming a square.
 * A=(0,0) B=(1,0) C=(1,1) D=(0,1)
 *
 * Optimal open-path: A→B→C→D (perimeter sides) total ≈ 3 units
 * Crossing path:     A→C→B→D total ≈ 2√2 + 2 ≈ 4.83 units
 *
 * (Using lat/lng as Euclidean proxy — distances in degrees, not km,
 *  but the shape is preserved for algorithmic comparison.)
 */
const SQUARE = [
  makeAttr('A', 0, 0),
  makeAttr('B', 1, 0),
  makeAttr('C', 1, 1),
  makeAttr('D', 0, 1),
];

// ─── totalRouteDistance ──────────────────────────────────────────────────────

describe('totalRouteDistance', () => {
  test('distance of empty route is 0', () => {
    expect(totalRouteDistance([])).toBe(0);
  });

  test('distance of single-item route is 0', () => {
    expect(totalRouteDistance([SQUARE[0]])).toBe(0);
  });

  test('distance is strictly positive for two distinct points', () => {
    expect(totalRouteDistance([SQUARE[0], SQUARE[1]])).toBeGreaterThan(0);
  });

  test('distance is commutative A→B equals B→A', () => {
    const d1 = totalRouteDistance([SQUARE[0], SQUARE[1]]);
    const d2 = totalRouteDistance([SQUARE[1], SQUARE[0]]);
    expect(d1).toBeCloseTo(d2, 10);
  });

  test('A→B→C is strictly less than A→C→B→... (degenerate crossing)', () => {
    const straight = totalRouteDistance([SQUARE[0], SQUARE[1], SQUARE[2]]);
    // A→C skips B — longer diagonal
    const longer = totalRouteDistance([SQUARE[0], SQUARE[2], SQUARE[1]]);
    expect(straight).toBeLessThan(longer);
  });
});

// ─── nearestNeighbour ─────────────────────────────────────────────────────────

describe('nearestNeighbour', () => {
  test('returns empty array for empty input', () => {
    expect(nearestNeighbour([])).toEqual([]);
  });

  test('returns single-element array for single input', () => {
    const result = nearestNeighbour([SQUARE[0]]);
    expect(result).toHaveLength(1);
    expect(result[0].placeId).toBe('A');
  });

  test('returned route contains every attraction exactly once', () => {
    const route = nearestNeighbour(SQUARE);
    expect(route).toHaveLength(SQUARE.length);

    const ids = route.map((a) => a.placeId);
    const unique = new Set(ids);
    expect(unique.size).toBe(SQUARE.length);
  });

  test('starts from attraction with earliest opening hour', () => {
    const attrs = [
      makeAttr('Late', 0, 0, 12),   // opens at noon
      makeAttr('Early', 1, 0, 8),   // opens at 08:00 — should be start
      makeAttr('Mid', 1, 1, 10),
    ];
    const route = nearestNeighbour(attrs);
    expect(route[0].placeId).toBe('Early');
  });

  test('falls back to index 0 when no opening hours are set', () => {
    // All openingHours are null — tie resolved by index
    const route = nearestNeighbour(SQUARE);
    // Start should be index 0 (A) since all have Infinity opening time
    expect(route[0].placeId).toBe('A');
  });

  test('output route visits geographically nearby stops consecutively', () => {
    // Line of points: 0→1→2→3 at increasing longitude
    const line = [
      makeAttr('P0', 0, 0),
      makeAttr('P1', 0, 1),
      makeAttr('P2', 0, 2),
      makeAttr('P3', 0, 3),
    ];
    const route = nearestNeighbour(line);
    // After starting from P0 (earliest = Infinity, picks index 0), nearest is P1, then P2, P3
    const ids = route.map((a) => a.placeId);
    expect(ids).toEqual(['P0', 'P1', 'P2', 'P3']);
  });
});

// ─── twoOpt ──────────────────────────────────────────────────────────────────

describe('twoOpt', () => {
  test('returns empty array for empty input', () => {
    expect(twoOpt([])).toEqual([]);
  });

  test('returns same single-element for length 1', () => {
    const result = twoOpt([SQUARE[0]]);
    expect(result).toHaveLength(1);
  });

  test('returns copy for routes shorter than 4 (no swap possible)', () => {
    const short = SQUARE.slice(0, 3);
    const result = twoOpt(short);
    expect(result).toHaveLength(3);
  });

  test('never increases total route distance', () => {
    const before = totalRouteDistance(SQUARE);
    const improved = twoOpt(SQUARE);
    const after = totalRouteDistance(improved);
    expect(after).toBeLessThanOrEqual(before + 1e-9);
  });

  test('improves a known crossing route (square: A→C→B→D)', () => {
    // This crossing arrangement is longer than A→B→C→D
    const crossing = [SQUARE[0], SQUARE[2], SQUARE[1], SQUARE[3]]; // A C B D
    const optimal =  [SQUARE[0], SQUARE[1], SQUARE[2], SQUARE[3]]; // A B C D

    const distBefore = totalRouteDistance(crossing);
    const improved = twoOpt(crossing);
    const distAfter = totalRouteDistance(improved);

    expect(distAfter).toBeLessThan(distBefore);
    // Check it matches (or ties with) the optimal distance
    expect(distAfter).toBeCloseTo(totalRouteDistance(optimal), 6);
  });

  test('does not mutate the input route', () => {
    const input = SQUARE.slice();
    const inputCopy = input.map((a) => ({ ...a }));
    twoOpt(input);
    expect(input.map((a) => a.placeId)).toEqual(inputCopy.map((a) => a.placeId));
  });

  test('output contains every attraction exactly once', () => {
    const result = twoOpt(SQUARE);
    const ids = result.map((a) => a.placeId);
    expect(new Set(ids).size).toBe(SQUARE.length);
  });
});

// ─── optimizeRoute ────────────────────────────────────────────────────────────

describe('optimizeRoute', () => {
  test('returns empty array for empty input', () => {
    expect(optimizeRoute([])).toEqual([]);
  });

  test('returns single-element for single input', () => {
    const result = optimizeRoute([SQUARE[0]]);
    expect(result).toHaveLength(1);
  });

  test('output contains all input attractions exactly once', () => {
    const result = optimizeRoute(SQUARE);
    expect(result).toHaveLength(SQUARE.length);
    expect(new Set(result.map((a) => a.placeId)).size).toBe(SQUARE.length);
  });

  test('optimised route is no worse than nearest-neighbour alone', () => {
    const { nearestNeighbour: nn } = require('../../src/engine/routing');
    const nnRoute = nn(SQUARE);
    const optimized = optimizeRoute(SQUARE);

    expect(totalRouteDistance(optimized)).toBeLessThanOrEqual(
      totalRouteDistance(nnRoute) + 1e-9
    );
  });

  test('works correctly for a large random-ish set', () => {
    // 10 random-ish attractions in a bounded area
    const attrs = Array.from({ length: 10 }, (_, i) =>
      makeAttr(`R${i}`, i * 0.01, (i % 3) * 0.01)
    );
    const result = optimizeRoute(attrs);
    expect(result).toHaveLength(10);
    expect(new Set(result.map((a) => a.placeId)).size).toBe(10);
  });
});
