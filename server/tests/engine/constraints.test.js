'use strict';

/**
 * Tests for engine/constraints.js
 *
 * Covers:
 *  - All attractions included when no constraints are violated
 *  - Budget: over-budget attractions are skipped
 *  - Budget: cumulative cost never exceeds dayBudget
 *  - Opening hours: attraction not yet open — wait ≤ MAX_WAIT is allowed
 *  - Opening hours: wait > MAX_WAIT causes skip
 *  - Opening hours: would extend past closing — skipped
 *  - Day window: attraction ending after dayEnd is skipped
 *  - Stop numbering is 1-indexed and sequential
 *  - travelToNext is null on the last stop, populated on all others
 *  - Travel time correctly advances the internal clock (later stop starts later)
 *  - droppedCount accurately reflects skipped attractions
 *  - estimateTravel: walking mode for short distance
 *  - estimateTravel: transit mode for long distance
 *  - Missing dayBudget throws
 */

const { fitConstraints, estimateTravel } = require('../../src/engine/constraints');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/**
 * Build a minimal attraction.
 * @param {string} id
 * @param {number} lat
 * @param {number} lng
 * @param {object} overrides - any field overrides
 */
function makeAttr(id, lat, lng, overrides = {}) {
  return {
    placeId: id,
    name: `Place ${id}`,
    coordinates: { lat, lng },
    category: [],
    rating: 4,
    durationMin: 60,
    cost: 200,
    openingHours: { open: '09:00', close: '20:00' },
    isOutdoor: false,
    ...overrides,
  };
}

/** Three collinear attractions spaced 0.01° lat apart — all affordable, all open */
const AFFORDABLE = [
  makeAttr('A', 28.60, 77.10, { cost: 100 }),
  makeAttr('B', 28.61, 77.10, { cost: 150 }),
  makeAttr('C', 28.62, 77.10, { cost: 200 }),
];

// ─── fitConstraints ───────────────────────────────────────────────────────────

describe('fitConstraints', () => {
  // ── Happy path ─────────────────────────────────────────────────────────────

  test('includes all attractions when no constraints are violated', () => {
    const { scheduledStops, droppedCount } = fitConstraints(AFFORDABLE, {
      dayBudget: 10_000,
    });
    expect(scheduledStops).toHaveLength(3);
    expect(droppedCount).toBe(0);
  });

  test('totalCost equals sum of included stop costs', () => {
    const { scheduledStops, totalCost } = fitConstraints(AFFORDABLE, {
      dayBudget: 10_000,
    });
    const expected = scheduledStops.reduce((s, stop) => s + stop.cost, 0);
    expect(totalCost).toBeCloseTo(expected, 2);
  });

  // ── Budget constraint ──────────────────────────────────────────────────────

  test('drops attractions whose individual cost exceeds remaining budget', () => {
    const attrs = [
      makeAttr('Cheap', 28.60, 77.10, { cost: 100 }),
      makeAttr('Expensive', 28.61, 77.10, { cost: 50_000 }),
    ];
    const { scheduledStops, droppedCount } = fitConstraints(attrs, {
      dayBudget: 500,
    });
    const ids = scheduledStops.map((s) => s.placeId);
    expect(ids).toContain('Cheap');
    expect(ids).not.toContain('Expensive');
    expect(droppedCount).toBe(1);
  });

  test('cumulative cost never exceeds dayBudget', () => {
    const attrs = [
      makeAttr('A', 28.60, 77.10, { cost: 300 }),
      makeAttr('B', 28.61, 77.10, { cost: 300 }),
      makeAttr('C', 28.62, 77.10, { cost: 300 }),
    ];
    const { totalCost } = fitConstraints(attrs, { dayBudget: 500 });
    expect(totalCost).toBeLessThanOrEqual(500);
  });

  test('zero-cost attractions are always included (budget-wise)', () => {
    const attrs = [
      makeAttr('Free1', 28.60, 77.10, { cost: 0 }),
      makeAttr('Free2', 28.61, 77.10, { cost: 0 }),
    ];
    const { scheduledStops } = fitConstraints(attrs, { dayBudget: 0 });
    expect(scheduledStops).toHaveLength(2);
  });

  // ── Opening hours constraint ───────────────────────────────────────────────

  test('waits for an attraction not yet open (wait ≤ 60 min)', () => {
    // Day starts at 09:00; this attraction opens at 09:30 — 30-min wait is OK
    const attrs = [
      makeAttr('LateOpener', 28.60, 77.10, {
        openingHours: { open: '09:30', close: '20:00' },
        durationMin: 60,
      }),
    ];
    const { scheduledStops } = fitConstraints(attrs, { dayBudget: 10_000 });
    expect(scheduledStops).toHaveLength(1);
    expect(scheduledStops[0].startTime).toBe('09:30');
  });

  test('skips attraction when wait would exceed 60 min', () => {
    // Day starts at 09:00; attraction opens at 11:30 — 150-min wait, skip
    const attrs = [
      makeAttr('VeryLate', 28.60, 77.10, {
        openingHours: { open: '11:30', close: '20:00' },
      }),
    ];
    const { scheduledStops, droppedCount } = fitConstraints(attrs, {
      dayBudget: 10_000,
    });
    expect(scheduledStops).toHaveLength(0);
    expect(droppedCount).toBe(1);
  });

  test('skips attraction when visit would extend past closing time', () => {
    // Closes at 10:00; visit starts at 09:30 + 90 min = 11:00 — too late
    const attrs = [
      makeAttr('EarlyClose', 28.60, 77.10, {
        openingHours: { open: '08:00', close: '10:00' },
        durationMin: 90,
      }),
    ];
    // Day starts at 09:30
    const { scheduledStops, droppedCount } = fitConstraints(attrs, {
      dayBudget: 10_000,
      dayStart: '09:30',
    });
    expect(scheduledStops).toHaveLength(0);
    expect(droppedCount).toBe(1);
  });

  test('includes attraction with null openingHours (always open)', () => {
    const attrs = [
      makeAttr('AlwaysOpen', 28.60, 77.10, { openingHours: null }),
    ];
    const { scheduledStops } = fitConstraints(attrs, { dayBudget: 10_000 });
    expect(scheduledStops).toHaveLength(1);
  });

  // ── Day window constraint ──────────────────────────────────────────────────

  test('skips attraction whose visit would end after dayEnd', () => {
    // Day ends at 19:00; visit starts at 18:30 and lasts 90 min = 20:00 — over
    const attrs = [
      makeAttr('TooLate', 28.60, 77.10, { durationMin: 90 }),
    ];
    const { scheduledStops, droppedCount } = fitConstraints(attrs, {
      dayBudget: 10_000,
      dayStart: '18:30',
      dayEnd: '19:00',
    });
    expect(scheduledStops).toHaveLength(0);
    expect(droppedCount).toBe(1);
  });

  test('includes attraction that fits exactly within dayEnd', () => {
    // Starts at 18:00, lasts 60 min = 19:00 exactly — should fit
    const attrs = [
      makeAttr('ExactFit', 28.60, 77.10, { durationMin: 60 }),
    ];
    const { scheduledStops } = fitConstraints(attrs, {
      dayBudget: 10_000,
      dayStart: '18:00',
      dayEnd: '19:00',
    });
    expect(scheduledStops).toHaveLength(1);
    expect(scheduledStops[0].endTime).toBe('19:00');
  });

  // ── Stop numbering ─────────────────────────────────────────────────────────

  test('stopNumbers are sequential starting from 1', () => {
    const { scheduledStops } = fitConstraints(AFFORDABLE, { dayBudget: 10_000 });
    scheduledStops.forEach((stop, i) => {
      expect(stop.stopNumber).toBe(i + 1);
    });
  });

  // ── travelToNext ──────────────────────────────────────────────────────────

  test('last stop has travelToNext === null', () => {
    const { scheduledStops } = fitConstraints(AFFORDABLE, { dayBudget: 10_000 });
    const last = scheduledStops[scheduledStops.length - 1];
    expect(last.travelToNext).toBeNull();
  });

  test('non-last stops have travelToNext populated', () => {
    const { scheduledStops } = fitConstraints(AFFORDABLE, { dayBudget: 10_000 });
    scheduledStops.slice(0, -1).forEach((stop) => {
      expect(stop.travelToNext).not.toBeNull();
      expect(stop.travelToNext).toHaveProperty('distanceKm');
      expect(stop.travelToNext).toHaveProperty('durationMin');
      expect(stop.travelToNext).toHaveProperty('mode');
    });
  });

  test('travel time advances the schedule (later stop starts later)', () => {
    const attrs = [
      makeAttr('First', 28.60, 77.10, { durationMin: 60 }),
      makeAttr('Second', 28.80, 77.10, { durationMin: 60 }), // ~22 km away
    ];
    const { scheduledStops } = fitConstraints(attrs, { dayBudget: 10_000 });
    expect(scheduledStops).toHaveLength(2);

    const { parseTime } = require('../../src/utils/timeUtils');
    const start1 = parseTime(scheduledStops[0].startTime);
    const end1 = parseTime(scheduledStops[0].endTime);
    const start2 = parseTime(scheduledStops[1].startTime);

    // Second stop must start strictly after first stop ends
    expect(start2).toBeGreaterThan(end1);
  });

  // ── droppedCount ──────────────────────────────────────────────────────────

  test('droppedCount reflects the number of skipped attractions', () => {
    const attrs = [
      makeAttr('OK', 28.60, 77.10, { cost: 100 }),
      makeAttr('TooExp', 28.61, 77.10, { cost: 99_999 }),
      makeAttr('OK2', 28.62, 77.10, { cost: 100 }),
    ];
    const { droppedCount } = fitConstraints(attrs, { dayBudget: 500 });
    expect(droppedCount).toBe(1);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  test('throws when dayBudget is not provided', () => {
    expect(() => fitConstraints(AFFORDABLE, {})).toThrow();
  });
});

// ─── estimateTravel ───────────────────────────────────────────────────────────

describe('estimateTravel', () => {
  test('walking mode for distance ≤ 1.5 km', () => {
    // ~0.5 km apart
    const from = { coordinates: { lat: 28.60, lng: 77.10 } };
    const to   = { coordinates: { lat: 28.604, lng: 77.10 } };
    const result = estimateTravel(from, to);
    expect(result.mode).toBe('walking');
    expect(result.distanceKm).toBeLessThanOrEqual(1.5);
  });

  test('transit mode for distance > 1.5 km', () => {
    // ~22 km apart
    const from = { coordinates: { lat: 28.60, lng: 77.10 } };
    const to   = { coordinates: { lat: 28.80, lng: 77.10 } };
    const result = estimateTravel(from, to);
    expect(result.mode).toBe('transit');
  });

  test('durationMin is always at least 2 (minimum buffer)', () => {
    // Same point — distance 0
    const pt = { coordinates: { lat: 28.60, lng: 77.10 } };
    const result = estimateTravel(pt, pt);
    expect(result.durationMin).toBeGreaterThanOrEqual(2);
  });

  test('distanceKm is non-negative', () => {
    const from = { coordinates: { lat: 28.60, lng: 77.10 } };
    const to   = { coordinates: { lat: 28.70, lng: 77.20 } };
    expect(estimateTravel(from, to).distanceKm).toBeGreaterThan(0);
  });

  test('travel is symmetric (A→B ≈ B→A)', () => {
    const A = { coordinates: { lat: 28.60, lng: 77.10 } };
    const B = { coordinates: { lat: 28.70, lng: 77.20 } };
    const ab = estimateTravel(A, B);
    const ba = estimateTravel(B, A);
    expect(ab.distanceKm).toBeCloseTo(ba.distanceKm, 3);
    expect(ab.durationMin).toBe(ba.durationMin);
  });
});
