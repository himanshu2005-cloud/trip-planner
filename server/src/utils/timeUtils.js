'use strict';

/**
 * Time utilities for the itinerary engine.
 *
 * All internal time representations use "minutes from midnight" (integer).
 * All external-facing times use "HH:MM" strings (e.g., "09:30").
 */

/**
 * Parse an "HH:MM" string into minutes from midnight.
 *
 * @param {string} timeStr - e.g. "09:30"
 * @returns {number} e.g. 570
 * @throws {RangeError} If the string is not a valid "HH:MM" time
 */
function parseTime(timeStr) {
  if (typeof timeStr !== 'string' || !/^\d{1,2}:\d{2}$/.test(timeStr)) {
    throw new RangeError(`parseTime: invalid time string "${timeStr}"`);
  }
  const [h, m] = timeStr.split(':').map(Number);
  if (h > 23 || m > 59) {
    throw new RangeError(`parseTime: out-of-range time "${timeStr}"`);
  }
  return h * 60 + m;
}

/**
 * Format minutes from midnight into an "HH:MM" string.
 *
 * @param {number} totalMinutes - e.g. 570
 * @returns {string} e.g. "09:30"
 */
function formatTime(totalMinutes) {
  const normalised = ((totalMinutes % 1440) + 1440) % 1440; // clamp to 0–1439
  const h = Math.floor(normalised / 60);
  const m = normalised % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Add a number of minutes to an "HH:MM" string and return a new "HH:MM" string.
 *
 * @param {string} timeStr
 * @param {number} mins
 * @returns {string}
 */
function addMinutes(timeStr, mins) {
  return formatTime(parseTime(timeStr) + mins);
}

/**
 * Check whether a visit window [visitStart, visitEnd) falls within [openMin, closeMin].
 * All parameters are minutes-from-midnight integers.
 *
 * @param {number} visitStart
 * @param {number} visitEnd
 * @param {number} openMin
 * @param {number} closeMin
 * @returns {boolean}
 */
function fitsWithinHours(visitStart, visitEnd, openMin, closeMin) {
  return visitStart >= openMin && visitEnd <= closeMin;
}

/**
 * Return the total number of minutes between two "HH:MM" strings.
 * Result is always non-negative (wraps around midnight if needed).
 *
 * @param {string} from
 * @param {string} to
 * @returns {number}
 */
function minutesBetween(from, to) {
  const diff = parseTime(to) - parseTime(from);
  return diff >= 0 ? diff : diff + 1440;
}

module.exports = { parseTime, formatTime, addMinutes, fitsWithinHours, minutesBetween };
