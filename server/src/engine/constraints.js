'use strict';

/**
 * engine/constraints.js
 *
 * Greedy knapsack-style constraint fitting for a single day.
 *
 * ALGORITHM
 * ─────────
 * Given a route-optimised list of attractions for one day, iterate through
 * them in order and include each attraction only if ALL three constraints pass:
 *
 *   1. BUDGET  — attraction cost ≤ remaining daily budget
 *   2. OPENING HOURS — the planned visit window falls within opening hours.
 *      If the attraction hasn't opened yet AND the wait is ≤ MAX_WAIT_MIN,
 *      the scheduler waits (adjusts visitStart); otherwise, skip.
 *   3. TIME WINDOW — the visit ends before the end of the day (default 19:00).
 *
 * Travel time between consecutive *scheduled* stops is estimated from
 * Haversine distance using a simple speed model:
 *   - distance ≤ 1.5 km  → walking  @ 5 km/h
 *   - distance  > 1.5 km  → transit  @ 20 km/h + 5 min boarding
 *
 * Travel time is computed in a forward-looking manner: when considering stop j,
 * we look at where the last *scheduled* stop was (not j-1 in the original list,
 * which may have been skipped) and compute travel from there.  This ensures
 * that skipping a stop doesn't introduce phantom travel time.
 *
 * @module engine/constraints
 */

const { haversine } = require('../utils/haversine');
const { parseTime, formatTime } = require('../utils/timeUtils');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default operating window for a day */
const DEFAULT_DAY_START = '09:00';
const DEFAULT_DAY_END = '19:00';

/** Speed model */
const WALKING_SPEED_KMH = 5;
const TRANSIT_SPEED_KMH = 20;
const TRANSIT_BOARDING_MIN = 5;
const WALKING_THRESHOLD_KM = 1.5;

/** Minimum time allowed between any two consecutive stops */
const MIN_BUFFER_MIN = 2;

/** Maximum time we'll wait for a not-yet-open attraction */
const MAX_WAIT_MIN = 60;

/** Default estimated visit duration when the attraction has no duration data */
const DEFAULT_DURATION_MIN = 60;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Estimate travel time and mode between two attractions using the distance
 * and a simplified speed model.
 *
 * @param {{ coordinates: { lat: number, lng: number } }} from
 * @param {{ coordinates: { lat: number, lng: number } }} to
 * @returns {{ distanceKm: number, durationMin: number, mode: 'walking' | 'transit' }}
 */
function estimateTravel(from, to) {
  const distanceKm = haversine(
    from.coordinates.lat,
    from.coordinates.lng,
    to.coordinates.lat,
    to.coordinates.lng
  );

  let durationMin;
  let mode;

  if (distanceKm <= WALKING_THRESHOLD_KM) {
    durationMin = (distanceKm / WALKING_SPEED_KMH) * 60;
    mode = 'walking';
  } else {
    durationMin = (distanceKm / TRANSIT_SPEED_KMH) * 60 + TRANSIT_BOARDING_MIN;
    mode = 'transit';
  }

  durationMin = Math.max(Math.ceil(durationMin), MIN_BUFFER_MIN);

  return {
    distanceKm: parseFloat(distanceKm.toFixed(3)),
    durationMin,
    mode,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Apply time, opening-hour, and budget constraints to an ordered list of
 * attractions and return a scheduled itinerary for one day.
 *
 * @param {Attraction[]} orderedAttractions
 *   Route-optimised attraction array for this day (output of `optimizeRoute`).
 *
 * @param {object} options
 * @param {number}  options.dayBudget          - Maximum spend for the day (INR)
 * @param {string} [options.dayStart='09:00']  - Start of available window "HH:MM"
 * @param {string} [options.dayEnd='19:00']    - End of available window "HH:MM"
 *
 * @returns {{
 *   scheduledStops: ScheduledStop[],
 *   totalCost: number,
 *   totalTravelTimeMin: number,
 *   totalDistanceKm: number,
 *   droppedCount: number
 * }}
 *
 * @typedef {object} ScheduledStop
 * @property {string}  startTime        - "HH:MM" visit start
 * @property {string}  endTime          - "HH:MM" visit end
 * @property {number}  cost             - Actual cost scheduled
 * @property {number}  stopNumber       - 1-indexed, matches map marker
 * @property {{ distanceKm, durationMin, mode } | null} travelToNext
 *   Travel segment to the next scheduled stop; null for the last stop.
 */
function fitConstraints(orderedAttractions, options = {}) {
  const { dayBudget, dayStart = DEFAULT_DAY_START, dayEnd = DEFAULT_DAY_END } = options;

  if (dayBudget == null) {
    throw new Error('fitConstraints: options.dayBudget is required');
  }

  const dayEndMin = parseTime(dayEnd);

  let currentTimeMin = parseTime(dayStart); // time we're free to begin travel
  let remainingBudget = dayBudget;

  let totalCost = 0;
  let totalTravelTimeMin = 0;
  let totalDistanceKm = 0;
  let droppedCount = 0;

  const scheduledStops = [];

  for (const attr of orderedAttractions) {
    const duration = attr.durationMin ?? DEFAULT_DURATION_MIN;
    const cost = attr.cost ?? 0;

    // ── 1. Budget check ───────────────────────────────────────────────────
    if (cost > remainingBudget) {
      droppedCount++;
      continue;
    }

    // ── 2. Compute arrival at this stop from the last scheduled stop ──────
    let travel = null;
    let arrivalTime = currentTimeMin;

    if (scheduledStops.length > 0) {
      travel = estimateTravel(scheduledStops[scheduledStops.length - 1], attr);
      arrivalTime = currentTimeMin + travel.durationMin;
    }

    let visitStart = arrivalTime;

    // ── 3. Opening hours check ────────────────────────────────────────────
    if (attr.openingHours) {
      const openMin = parseTime(attr.openingHours.open);
      const closeMin = parseTime(attr.openingHours.close);

      if (visitStart < openMin) {
        const waitMin = openMin - visitStart;
        if (waitMin <= MAX_WAIT_MIN) {
          // Wait for it to open
          visitStart = openMin;
        } else {
          // Too long to wait — skip
          droppedCount++;
          continue;
        }
      }

      // Check visit ends before closing
      if (visitStart + duration > closeMin) {
        droppedCount++;
        continue;
      }
    }

    // ── 4. Day window check ───────────────────────────────────────────────
    if (visitStart + duration > dayEndMin) {
      droppedCount++;
      continue;
    }

    // ── All constraints passed — schedule this stop ───────────────────────
    //
    // Attach travel info to the *previous* scheduled stop now that we know
    // this stop will actually be visited.
    if (scheduledStops.length > 0 && travel !== null) {
      scheduledStops[scheduledStops.length - 1].travelToNext = travel;
      totalTravelTimeMin += travel.durationMin;
      totalDistanceKm += travel.distanceKm;
    }

    scheduledStops.push({
      ...attr,
      startTime: formatTime(visitStart),
      endTime: formatTime(visitStart + duration),
      cost,
      travelToNext: null, // filled in when the next stop is confirmed
      stopNumber: scheduledStops.length + 1,
    });

    totalCost += cost;
    remainingBudget -= cost;
    currentTimeMin = visitStart + duration; // free after the visit ends
  }

  return {
    scheduledStops,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalTravelTimeMin,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(3)),
    droppedCount,
  };
}

module.exports = { fitConstraints, estimateTravel };
