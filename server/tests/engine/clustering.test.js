'use strict';

/**
 * Tests for engine/clustering.js
 *
 * Covers:
 *  - Correct number of output clusters
 *  - All attractions assigned (no orphans, no duplicates)
 *  - k > n edge case produces empty padding arrays
 *  - Determinism: same seed → same result
 *  - Different seed → (usually) different result
 *  - Geographically sensible grouping on a simple fixture
 *  - k = 1 (trivial case)
 *  - k = n (each attraction its own cluster)
 *  - Empty attraction pool
 *  - Invalid arguments throw
 */

const { clusterAttractions, mulberry32 } = require('../../src/engine/clustering');

// ─── Test fixtures ────────────────────────────────────────────────────────────

/**
 * Build a minimal attraction object.
 * @param {string} id
 * @param {number} lat
 * @param {number} lng
 * @param {string[]} [category]
 */
function makeAttr(id, lat, lng, category = []) {
  return {
    placeId: id,
    name: `Place ${id}`,
    coordinates: { lat, lng },
    category,
    rating: 4,
    durationMin: 60,
    cost: 200,
    openingHours: { open: '09:00', close: '18:00' },
    isOutdoor: false,
  };
}

/**
 * Six attractions arranged in two very tight geographic clusters:
 *   North cluster: A, B, C  (lat ~28.6, lng ~77.1)
 *   South cluster: D, E, F  (lat ~28.4, lng ~77.3)
 */
const NORTH = [
  makeAttr('A', 28.61, 77.10),
  makeAttr('B', 28.62, 77.11),
  makeAttr('C', 28.61, 77.12),
];

const SOUTH = [
  makeAttr('D', 28.41, 77.30),
  makeAttr('E', 28.42, 77.31),
  makeAttr('F', 28.41, 77.32),
];

const SIX_ATTRS = [...NORTH, ...SOUTH];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return true iff every placeId appears exactly once across all clusters */
function allAssignedOnce(clusters, attrs) {
  const seen = new Set();
  for (const cluster of clusters) {
    for (const a of cluster) {
      if (seen.has(a.placeId)) return false;
      seen.add(a.placeId);
    }
  }
  return seen.size === attrs.length;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('clusterAttractions', () => {
  // ── Basic shape ──────────────────────────────────────────────────────────────

  test('returns exactly k arrays', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 2);
    expect(clusters).toHaveLength(2);
  });

  test('all attractions appear exactly once across clusters', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 2);
    expect(allAssignedOnce(clusters, SIX_ATTRS)).toBe(true);
  });

  test('total attractions across clusters equals input length', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 3);
    const total = clusters.reduce((s, c) => s + c.length, 0);
    expect(total).toBe(SIX_ATTRS.length);
  });

  // ── Geographic correctness ──────────────────────────────────────────────────

  test('geographically tight groups cluster together (k=2)', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 2, { seed: 42, restarts: 5 });

    // Each cluster should contain either all NORTH or all SOUTH IDs
    const northIds = new Set(['A', 'B', 'C']);
    const southIds = new Set(['D', 'E', 'F']);

    const isNorthCluster = (c) => c.every((a) => northIds.has(a.placeId));
    const isSouthCluster = (c) => c.every((a) => southIds.has(a.placeId));

    const sorted = [...clusters].sort((a, b) => a.length - b.length);
    expect(clusters.some(isNorthCluster)).toBe(true);
    expect(clusters.some(isSouthCluster)).toBe(true);
  });

  // ── Trivial k cases ─────────────────────────────────────────────────────────

  test('k=1 puts all attractions in one cluster', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 1);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toHaveLength(6);
  });

  test('k=n each attraction gets its own cluster', () => {
    const clusters = clusterAttractions(SIX_ATTRS, 6);
    expect(clusters).toHaveLength(6);
    clusters.forEach((c) => expect(c).toHaveLength(1));
  });

  // ── k > n edge case ─────────────────────────────────────────────────────────

  test('k > n pads output to k with empty arrays', () => {
    const attrs = [makeAttr('X', 28.5, 77.2)];
    const clusters = clusterAttractions(attrs, 5);
    expect(clusters).toHaveLength(5);
    const totalItems = clusters.reduce((s, c) => s + c.length, 0);
    expect(totalItems).toBe(1); // only one attraction, rest are empty
  });

  // ── Empty input ──────────────────────────────────────────────────────────────

  test('empty attraction pool returns k empty arrays', () => {
    const clusters = clusterAttractions([], 3);
    expect(clusters).toHaveLength(3);
    clusters.forEach((c) => expect(c).toHaveLength(0));
  });

  // ── Determinism ─────────────────────────────────────────────────────────────

  test('same seed produces identical assignments', () => {
    const r1 = clusterAttractions(SIX_ATTRS, 2, { seed: 7 });
    const r2 = clusterAttractions(SIX_ATTRS, 2, { seed: 7 });

    const ids1 = r1.map((c) => c.map((a) => a.placeId).sort().join(','));
    const ids2 = r2.map((c) => c.map((a) => a.placeId).sort().join(','));

    expect(ids1).toEqual(ids2);
  });

  // ── Input validation ─────────────────────────────────────────────────────────

  test('throws RangeError for k=0', () => {
    expect(() => clusterAttractions(SIX_ATTRS, 0)).toThrow(RangeError);
  });

  test('throws RangeError for negative k', () => {
    expect(() => clusterAttractions(SIX_ATTRS, -1)).toThrow(RangeError);
  });

  test('throws TypeError for non-array attractions', () => {
    expect(() => clusterAttractions(null, 2)).toThrow(TypeError);
  });
});

// ─── mulberry32 ──────────────────────────────────────────────────────────────

describe('mulberry32', () => {
  test('returns values in [0, 1)', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test('same seed produces the same sequence', () => {
    const rng1 = mulberry32(123);
    const rng2 = mulberry32(123);
    const a = Array.from({ length: 10 }, () => rng1());
    const b = Array.from({ length: 10 }, () => rng2());
    expect(a).toEqual(b);
  });

  test('different seeds produce different first values', () => {
    const v1 = mulberry32(1)();
    const v2 = mulberry32(2)();
    expect(v1).not.toEqual(v2);
  });
});
