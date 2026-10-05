'use strict';

/**
 * engine/routing.js
 *
 * Route optimisation for a single day's cluster of attractions.
 *
 * ALGORITHM
 * ─────────
 * Stage 1 — Nearest-Neighbour (NN) heuristic
 *   Greedy construction: start from the attraction with the earliest opening
 *   hour (so the itinerary begins where we can enter first), then at each step
 *   append the closest unvisited attraction.  Time complexity: O(n²).
 *
 * Stage 2 — 2-opt improvement
 *   Iteratively reverse sub-segments of the route when doing so reduces total
 *   path distance.  Repeats until no improving swap is found or `maxPasses` is
 *   reached.  Operates on an open path (not a closed tour) so boundary
 *   wrapping is omitted.  Time complexity per pass: O(n²).
 *
 * Distance metric: Haversine great-circle distance (km).
 *
 * @module engine/routing
 */

const { haversine } = require('../utils/haversine');

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Compute total distance of an ordered open path (sum of consecutive distances).
 *
 * @param {Attraction[]} route
 * @returns {number} Total distance in kilometres
 */
function totalRouteDistance(route) {
  let dist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    dist += haversine(
      route[i].coordinates.lat,
      route[i].coordinates.lng,
      route[i + 1].coordinates.lat,
      route[i + 1].coordinates.lng
    );
  }
  return dist;
}

/**
 * Parse an opening-time string "HH:MM" into total minutes from midnight.
 * Returns Infinity if the attraction has no opening hours (it will not be
 * preferred as a start point but will still be reachable).
 *
 * @param {Attraction} attr
 * @returns {number}
 */
function openingMinutes(attr) {
  if (!attr.openingHours?.open) return Infinity;
  const [h, m] = attr.openingHours.open.split(':').map(Number);
  return h * 60 + m;
}

// ─── Stage 1: Nearest-Neighbour ───────────────────────────────────────────────

/**
 * Build an initial route using the nearest-neighbour greedy heuristic.
 *
 * Start node: the attraction with the earliest opening time.  This ensures
 * the first stop is accessible when the day begins.  Ties are broken by
 * index (stable).
 *
 * @param {Attraction[]} attractions
 * @returns {Attraction[]} Ordered route containing every attraction exactly once
 */
function nearestNeighbour(attractions) {
  if (attractions.length === 0) return [];
  if (attractions.length === 1) return [attractions[0]];

  const n = attractions.length;
  const visited = new Uint8Array(n); // faster than boolean[]
  const route = new Array(n);

  // Pick start: earliest opening time
  let startIdx = 0;
  let earliestOpen = openingMinutes(attractions[0]);
  for (let i = 1; i < n; i++) {
    const t = openingMinutes(attractions[i]);
    if (t < earliestOpen) {
      earliestOpen = t;
      startIdx = i;
    }
  }

  visited[startIdx] = 1;
  route[0] = attractions[startIdx];
  let current = startIdx;

  for (let step = 1; step < n; step++) {
    let nearest = -1;
    let minDist = Infinity;

    for (let j = 0; j < n; j++) {
      if (visited[j]) continue;

      const d = haversine(
        attractions[current].coordinates.lat,
        attractions[current].coordinates.lng,
        attractions[j].coordinates.lat,
        attractions[j].coordinates.lng
      );

      if (d < minDist) {
        minDist = d;
        nearest = j;
      }
    }

    visited[nearest] = 1;
    route[step] = attractions[nearest];
    current = nearest;
  }

  return route;
}

// ─── Stage 2: 2-opt ───────────────────────────────────────────────────────────

/**
 * Improve a route using the 2-opt local-search algorithm (open-path variant).
 *
 * A 2-opt swap replaces two edges (i→i+1) and (k→k+1) with (i→k) and
 * (i+1→k+1), which is equivalent to reversing the sub-segment [i+1 … k].
 *
 * The algorithm repeats until no improving swap is found, or `maxPasses`
 * is exceeded (safety guard for large inputs).
 *
 * @param {Attraction[]} route - Initial route (not mutated)
 * @param {number}       [maxPasses=50]
 * @returns {Attraction[]} Improved route (new array)
 */
function twoOpt(route, maxPasses = 50) {
  if (route.length < 4) return route.slice(); // nothing to improve

  let best = route.slice();
  let improved = true;
  let passes = 0;

  while (improved && passes < maxPasses) {
    improved = false;
    passes++;

    for (let i = 0; i < best.length - 1; i++) {
      for (let k = i + 2; k < best.length; k++) {
        // Edge costs before swap
        const edgeA = haversine(
          best[i].coordinates.lat,
          best[i].coordinates.lng,
          best[i + 1].coordinates.lat,
          best[i + 1].coordinates.lng
        );

        // k+1 may not exist (end of open path) — treat as 0-cost edge
        const edgeB =
          k + 1 < best.length
            ? haversine(
                best[k].coordinates.lat,
                best[k].coordinates.lng,
                best[k + 1].coordinates.lat,
                best[k + 1].coordinates.lng
              )
            : 0;

        // Edge costs after swap
        const newEdgeA = haversine(
          best[i].coordinates.lat,
          best[i].coordinates.lng,
          best[k].coordinates.lat,
          best[k].coordinates.lng
        );

        const newEdgeB =
          k + 1 < best.length
            ? haversine(
                best[i + 1].coordinates.lat,
                best[i + 1].coordinates.lng,
                best[k + 1].coordinates.lat,
                best[k + 1].coordinates.lng
              )
            : 0;

        // Apply swap if it reduces total distance (epsilon guard avoids float noise)
        if (newEdgeA + newEdgeB < edgeA + edgeB - 1e-10) {
          // Reverse segment [i+1 … k] in-place
          const next = [
            ...best.slice(0, i + 1),
            ...best.slice(i + 1, k + 1).reverse(),
            ...best.slice(k + 1),
          ];
          best = next;
          improved = true;
        }
      }
    }
  }

  return best;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Full routing pipeline: nearest-neighbour construction + 2-opt improvement.
 *
 * @param {Attraction[]} attractions - Unordered set of attractions for one day
 * @returns {Attraction[]} Optimised ordered route (every attraction appears once)
 */
function optimizeRoute(attractions) {
  if (attractions.length === 0) return [];
  if (attractions.length === 1) return [attractions[0]];

  const nnRoute = nearestNeighbour(attractions);
  return twoOpt(nnRoute);
}

module.exports = { optimizeRoute, nearestNeighbour, twoOpt, totalRouteDistance };
