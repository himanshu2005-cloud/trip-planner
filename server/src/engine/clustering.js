'use strict';

/**
 * engine/clustering.js
 *
 * Geographic k-means clustering for day-bucket assignment.
 *
 * ALGORITHM
 * ─────────
 * 1. Run k-means on (lat, lng) coordinates using Euclidean distance.
 *    Euclidean is a good approximation of Haversine at city scale (< 100 km).
 * 2. Use the Mulberry32 seeded PRNG so that the same trip parameters always
 *    produce the same clusters (deterministic for testing and debugging).
 * 3. Perform `restarts` independent runs and keep the result with the lowest
 *    inertia (sum of squared distances to centroids).
 * 4. Handle degenerate cases:
 *    - k > n: cap effective k at n; remaining day-slots are empty arrays.
 *    - Empty cluster after assignment: reinitialize to the attraction
 *      farthest from all other centroids (avoids dead-cluster stagnation).
 *
 * @module engine/clustering
 */

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────

/**
 * Mulberry32 seeded pseudo-random number generator.
 * Produces uniformly distributed floats in [0, 1).
 *
 * @param {number} seed - 32-bit integer seed
 * @returns {() => number}
 */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Euclidean distance on (lat, lng) — fine for city-scale clustering.
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number}
 */
function euclidean(a, b) {
  return Math.sqrt((a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2);
}

/**
 * Assign each attraction to the index of the nearest centroid.
 *
 * @param {Attraction[]} attractions
 * @param {{ lat: number, lng: number }[]} centroids
 * @returns {number[]} assignments — parallel array to `attractions`
 */
function assignClusters(attractions, centroids) {
  return attractions.map((attr) => {
    let minDist = Infinity;
    let assigned = 0;

    for (let j = 0; j < centroids.length; j++) {
      const d = euclidean(attr.coordinates, centroids[j]);
      if (d < minDist) {
        minDist = d;
        assigned = j;
      }
    }

    return assigned;
  });
}

/**
 * Recompute centroids as the mean (lat, lng) of their members.
 * If a cluster is empty, reinitialise its centroid to the attraction that is
 * farthest from all other (non-empty) centroids — avoids dead clusters.
 *
 * @param {Attraction[]} attractions
 * @param {number[]} assignments
 * @param {number} k
 * @returns {{ lat: number, lng: number }[]}
 */
function recomputeCentroids(attractions, assignments, k) {
  const buckets = Array.from({ length: k }, () => ({ latSum: 0, lngSum: 0, count: 0 }));

  for (let i = 0; i < attractions.length; i++) {
    const c = assignments[i];
    buckets[c].latSum += attractions[i].coordinates.lat;
    buckets[c].lngSum += attractions[i].coordinates.lng;
    buckets[c].count++;
  }

  // Build an intermediate centroid list (non-empty clusters resolved now)
  const resolved = buckets.map((b) =>
    b.count > 0 ? { lat: b.latSum / b.count, lng: b.lngSum / b.count } : null
  );

  const nonEmptyCentroids = resolved.filter(Boolean);

  return resolved.map((c, j) => {
    if (c !== null) return c;

    // Empty cluster — pick farthest attraction from any non-empty centroid
    let maxDist = -Infinity;
    let farthest = attractions[0].coordinates;

    for (const attr of attractions) {
      const minD = nonEmptyCentroids.reduce(
        (acc, nc) => Math.min(acc, euclidean(attr.coordinates, nc)),
        Infinity
      );
      if (minD > maxDist) {
        maxDist = minD;
        farthest = attr.coordinates;
      }
    }

    return { lat: farthest.lat, lng: farthest.lng };
  });
}

/**
 * Sum of squared distances from each attraction to its assigned centroid.
 *
 * @param {Attraction[]} attractions
 * @param {number[]} assignments
 * @param {{ lat: number, lng: number }[]} centroids
 * @returns {number}
 */
function computeInertia(attractions, assignments, centroids) {
  return attractions.reduce(
    (sum, attr, i) => sum + euclidean(attr.coordinates, centroids[assignments[i]]) ** 2,
    0
  );
}

/**
 * Run a single k-means trial with a given RNG instance.
 *
 * @param {Attraction[]} attractions
 * @param {number} k
 * @param {() => number} rng
 * @param {number} maxIter
 * @returns {{ assignments: number[], centroids: object[], inertia: number }}
 */
function kMeansTrial(attractions, k, rng, maxIter) {
  // Partial Fisher-Yates shuffle to pick k unique starting indices
  const indices = Array.from({ length: attractions.length }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (indices.length - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  let centroids = indices.slice(0, k).map((i) => ({ ...attractions[i].coordinates }));
  let assignments = [];

  for (let iter = 0; iter < maxIter; iter++) {
    const next = assignClusters(attractions, centroids);

    // Convergence: assignments unchanged
    if (assignments.length > 0 && next.every((a, i) => a === assignments[i])) {
      assignments = next;
      break;
    }

    assignments = next;
    centroids = recomputeCentroids(attractions, assignments, k);
  }

  return {
    assignments,
    centroids,
    inertia: computeInertia(attractions, assignments, centroids),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Cluster attractions into `k` geographic groups using k-means with random restarts.
 *
 * @param {Attraction[]} attractions
 *   Normalised attraction objects — must each have a `coordinates: { lat, lng }` field.
 * @param {number} k
 *   Number of clusters (equals the number of trip days).
 * @param {object}  [options]
 * @param {number}  [options.seed=42]     - PRNG seed for reproducibility
 * @param {number}  [options.restarts=3]  - Independent runs; best inertia wins
 * @param {number}  [options.maxIter=100] - Max iterations per run
 * @returns {Attraction[][]}
 *   Array of `k` arrays. Each inner array holds the attractions assigned to that day.
 *   Some arrays may be empty if there are fewer attractions than days.
 */
function clusterAttractions(attractions, k, options = {}) {
  if (!Array.isArray(attractions)) throw new TypeError('attractions must be an array');
  if (!Number.isInteger(k) || k < 1) throw new RangeError('k must be a positive integer');

  const { seed = 42, restarts = 3, maxIter = 100 } = options;

  // If there are no attractions, return k empty arrays
  if (attractions.length === 0) return Array.from({ length: k }, () => []);

  // Cap k so we never ask for more clusters than we have points
  const effectiveK = Math.min(k, attractions.length);

  let best = null;

  for (let r = 0; r < restarts; r++) {
    // Each restart gets a different but deterministic seed offset
    const rng = mulberry32(seed + r * 1_000_003);
    const result = kMeansTrial(attractions, effectiveK, rng, maxIter);

    if (best === null || result.inertia < best.inertia) {
      best = result;
    }
  }

  // Build output: group attractions by cluster index
  const clusters = Array.from({ length: effectiveK }, () => []);
  attractions.forEach((attr, i) => clusters[best.assignments[i]].push(attr));

  // Pad output to the requested k (empty arrays for extra days)
  while (clusters.length < k) clusters.push([]);

  return clusters;
}

module.exports = { clusterAttractions, kMeansTrial, mulberry32 };
