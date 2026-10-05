'use strict';

/**
 * engine/itineraryBuilder.js
 *
 * Pipeline orchestrator: clusters → routes → constraints → structured itinerary.
 *
 * PIPELINE
 * ────────
 * buildItinerary(attractions, tripParams):
 *   Stage 1 → clusterAttractions(attractions, k)        [clustering.js]
 *   Stage 2 → optimizeRoute(cluster)    per day          [routing.js]
 *   Stage 3 → fitConstraints(route, {dayBudget, …})      [constraints.js]
 *   Post    → generate day theme, compute day-level aggregates
 *
 * regenerateDay(pool, existingDays, dayNumber, options):
 *   - Excludes attractions already in other days
 *   - Applies a preference reordering based on user-provided reason
 *   - Runs Stage 2 + 3 for that day only (Stage 1 is not re-run)
 *   - Does NOT touch other days
 *
 * @module engine/itineraryBuilder
 */

const { clusterAttractions } = require('./clustering');
const { optimizeRoute } = require('./routing');
const { fitConstraints } = require('./constraints');

// ─── Theme generation ─────────────────────────────────────────────────────────

/**
 * Map from raw attraction category keywords to human-readable theme labels.
 * Matching is case-insensitive and partial.
 */
const THEME_MAP = [
  { keywords: ['history', 'heritage', 'fort', 'palace', 'ruins'], label: 'Historic' },
  { keywords: ['museum', 'gallery', 'art'], label: 'Museum & Arts' },
  { keywords: ['food', 'restaurant', 'cafe', 'market', 'cuisine'], label: 'Food & Culture' },
  { keywords: ['nature', 'park', 'garden', 'forest', 'wildlife'], label: 'Nature & Parks' },
  { keywords: ['beach', 'coast', 'sea', 'waterfront'], label: 'Coastal' },
  { keywords: ['architecture', 'monument', 'temple', 'church', 'mosque'], label: 'Architectural' },
  { keywords: ['shopping', 'bazaar', 'mall'], label: 'Shopping' },
  { keywords: ['nightlife', 'bar', 'club'], label: 'Nightlife' },
  { keywords: ['adventure', 'trek', 'hike', 'sport'], label: 'Adventure' },
  { keywords: ['culture', 'festival', 'performance'], label: 'Cultural' },
];

/**
 * Generate a human-readable theme for a day based on its stops' dominant categories.
 *
 * @param {Array<{ category?: string[] }>} stops
 * @returns {string}
 */
function generateDayTheme(stops) {
  if (!stops || stops.length === 0) return 'City Tour';

  // Count category occurrences across all stops
  const counts = {};
  for (const stop of stops) {
    for (const cat of stop.category ?? []) {
      const key = cat.toLowerCase();
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }

  // Find the best matching theme by summing keyword hits
  let bestLabel = 'City Tour';
  let bestScore = 0;

  for (const { keywords, label } of THEME_MAP) {
    const score = keywords.reduce((s, kw) => s + (counts[kw] ?? 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return `${bestLabel} Day`;
}

// ─── Reason-based preference reordering ──────────────────────────────────────

/**
 * Reorder (not hard-filter) the available attraction pool so that attractions
 * matching the user's regeneration reason appear first.  The full pool is
 * preserved — preferred attractions just get visited first, giving them
 * priority under the time and budget constraints.
 *
 * @param {Attraction[]} attractions
 * @param {string} reason - User-selected reason from the Regenerate Day modal
 * @returns {Attraction[]}
 */
function applyReasonPreference(attractions, reason) {
  /** @type {((a: Attraction) => boolean) | null} */
  const preferFn = {
    'Too expensive': (a) => (a.cost ?? 0) < 300,
    'Too much travel': null, // Routing naturally reduces travel after re-optimising
    'More food': (a) => matchesKeywords(a, ['food', 'restaurant', 'cafe', 'cuisine', 'market']),
    'More nature': (a) => matchesKeywords(a, ['nature', 'park', 'garden', 'wildlife', 'forest']),
    'More indoor activities': (a) => a.isOutdoor === false,
    'Weather changed': (a) => a.isOutdoor === false,
  }[reason] ?? null;

  if (!preferFn) return attractions.slice();

  const preferred = attractions.filter(preferFn);
  const rest = attractions.filter((a) => !preferFn(a));
  return [...preferred, ...rest];
}

/**
 * Check whether an attraction's categories match any of the given keywords.
 */
function matchesKeywords(attr, keywords) {
  return (attr.category ?? []).some((cat) =>
    keywords.some((kw) => cat.toLowerCase().includes(kw))
  );
}

// ─── Empty day placeholder ────────────────────────────────────────────────────

/**
 * @param {number} dayNumber
 * @returns {ItineraryDay}
 */
function buildEmptyDay(dayNumber) {
  return {
    dayNumber,
    theme: 'Rest Day',
    startTime: '09:00',
    endTime: '19:00',
    totalCost: 0,
    totalTravelTimeMin: 0,
    totalDistanceKm: 0,
    attractionsConsidered: 0,
    attractionsDropped: 0,
    stops: [],
    weatherForecast: { condition: null, alertMessage: null, adjustedStops: false },
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a complete day-wise itinerary from a pool of normalized attractions.
 *
 * @param {Attraction[]} attractions
 *   Full normalized attraction pool for the destination.
 *   Each must have: placeId, name, coordinates, category, durationMin, cost,
 *   openingHours (or null), isOutdoor.
 *
 * @param {object} tripParams
 * @param {number}   tripParams.numberOfDays
 * @param {number}   tripParams.budget       - Total trip budget in INR
 * @param {string}  [tripParams.dayStart='09:00']
 * @param {string}  [tripParams.dayEnd='19:00']
 *
 * @param {object}  [engineOptions]
 * @param {number}  [engineOptions.seed=42]      - Clustering PRNG seed
 * @param {number}  [engineOptions.restarts=3]   - k-means restarts
 *
 * @returns {ItineraryDay[]}
 *
 * @typedef {object} ItineraryDay
 * @property {number}   dayNumber
 * @property {string}   theme
 * @property {string}   startTime
 * @property {string}   endTime
 * @property {number}   totalCost
 * @property {number}   totalTravelTimeMin
 * @property {number}   totalDistanceKm
 * @property {number}   attractionsConsidered
 * @property {number}   attractionsDropped
 * @property {ScheduledStop[]} stops
 * @property {{ condition, alertMessage, adjustedStops }} weatherForecast
 */
function buildItinerary(attractions, tripParams, engineOptions = {}) {
  const {
    numberOfDays,
    budget,
    dayStart = '09:00',
    dayEnd = '19:00',
  } = tripParams;

  const { seed = 42, restarts = 3 } = engineOptions;

  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    throw new RangeError('buildItinerary: numberOfDays must be a positive integer');
  }
  if (typeof budget !== 'number' || budget <= 0) {
    throw new RangeError('buildItinerary: budget must be a positive number');
  }

  // Empty attraction pool — return empty days
  if (!attractions || attractions.length === 0) {
    return Array.from({ length: numberOfDays }, (_, i) => buildEmptyDay(i + 1));
  }

  const dailyBudget = budget / numberOfDays;

  // ── Stage 1: Geographic clustering ───────────────────────────────────────
  const clusters = clusterAttractions(attractions, numberOfDays, { seed, restarts });

  // ── Stage 2 + 3: Route + constrain each day ───────────────────────────────
  return clusters.map((cluster, idx) => {
    const dayNumber = idx + 1;

    if (cluster.length === 0) return buildEmptyDay(dayNumber);

    // Stage 2: optimise route
    const optimizedRoute = optimizeRoute(cluster);

    // Stage 3: apply constraints
    const { scheduledStops, totalCost, totalTravelTimeMin, totalDistanceKm, droppedCount } =
      fitConstraints(optimizedRoute, { dayBudget: dailyBudget, dayStart, dayEnd });

    const theme = generateDayTheme(scheduledStops.length > 0 ? scheduledStops : cluster);
    const firstStop = scheduledStops[0];
    const lastStop = scheduledStops[scheduledStops.length - 1];

    return {
      dayNumber,
      theme,
      startTime: firstStop?.startTime ?? dayStart,
      endTime: lastStop?.endTime ?? dayEnd,
      totalCost,
      totalTravelTimeMin,
      totalDistanceKm,
      attractionsConsidered: cluster.length,
      attractionsDropped: droppedCount,
      stops: scheduledStops,
      weatherForecast: { condition: null, alertMessage: null, adjustedStops: false },
    };
  });
}

/**
 * Regenerate a single day without affecting any other day.
 *
 * CONTRACT
 * ────────
 * - Attractions already scheduled in other days are excluded from consideration.
 * - The `reason` parameter reorders the available pool (preference boost, not
 *   hard-filter) so the reason-aligned attractions are prioritised under the
 *   existing constraint logic.
 * - Only Stage 2 + Stage 3 are re-run; clustering is NOT re-run.
 *
 * @param {Attraction[]} fullAttractionPool
 *   All attractions fetched for the destination (same pool used for the original trip).
 *
 * @param {ItineraryDay[]} existingDays
 *   The current full itinerary (all days, including the one being replaced).
 *
 * @param {number} dayNumber
 *   1-indexed day to regenerate.
 *
 * @param {object} options
 * @param {string} options.reason           - User-selected reason string
 * @param {number} options.budgetRemaining  - Remaining budget allocated to this day
 * @param {string} [options.dayStart='09:00']
 * @param {string} [options.dayEnd='19:00']
 *
 * @returns {ItineraryDay}
 */
function regenerateDay(fullAttractionPool, existingDays, dayNumber, options = {}) {
  const { reason = '', budgetRemaining, dayStart = '09:00', dayEnd = '19:00' } = options;

  if (budgetRemaining == null) {
    throw new Error('regenerateDay: options.budgetRemaining is required');
  }

  // Collect placeIds locked in by OTHER days
  const lockedIds = new Set();
  for (const day of existingDays) {
    if (day.dayNumber === dayNumber) continue;
    for (const stop of day.stops) {
      if (stop.placeId) lockedIds.add(stop.placeId);
    }
  }

  // Build pool: exclude locked attractions
  const available = fullAttractionPool.filter(
    (a) => !lockedIds.has(a.placeId)
  );

  if (available.length === 0) return buildEmptyDay(dayNumber);

  // Apply reason-based preference reordering
  const preferenceOrdered = applyReasonPreference(available, reason);

  // Stage 2: optimise route
  const optimizedRoute = optimizeRoute(preferenceOrdered);

  // Stage 3: apply constraints
  const { scheduledStops, totalCost, totalTravelTimeMin, totalDistanceKm, droppedCount } =
    fitConstraints(optimizedRoute, { dayBudget: budgetRemaining, dayStart, dayEnd });

  const theme = generateDayTheme(scheduledStops.length > 0 ? scheduledStops : available);
  const firstStop = scheduledStops[0];
  const lastStop = scheduledStops[scheduledStops.length - 1];

  return {
    dayNumber,
    theme,
    startTime: firstStop?.startTime ?? dayStart,
    endTime: lastStop?.endTime ?? dayEnd,
    totalCost,
    totalTravelTimeMin,
    totalDistanceKm,
    attractionsConsidered: available.length,
    attractionsDropped: droppedCount,
    stops: scheduledStops,
    weatherForecast: { condition: null, alertMessage: null, adjustedStops: false },
    regenerationReason: reason,
  };
}

module.exports = { buildItinerary, regenerateDay, generateDayTheme, applyReasonPreference };
