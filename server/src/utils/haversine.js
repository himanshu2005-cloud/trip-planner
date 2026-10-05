'use strict';

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians.
 * @param {number} deg
 * @returns {number}
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Compute the great-circle (Haversine) distance between two geographic coordinates.
 *
 * This is used throughout the engine for cluster distance, route ordering, and
 * travel-time estimation. Haversine is accurate to ≈0.3% at city scale, which
 * is more than sufficient for itinerary planning.
 *
 * @param {number} lat1 - Latitude of point A in decimal degrees
 * @param {number} lng1 - Longitude of point A in decimal degrees
 * @param {number} lat2 - Latitude of point B in decimal degrees
 * @param {number} lng2 - Longitude of point B in decimal degrees
 * @returns {number} Distance in kilometres
 */
function haversine(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

module.exports = { haversine };
