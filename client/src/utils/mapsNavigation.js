/**
 * mapsNavigation.js
 * Generates verified Google Maps multi-stop navigation URLs and transit estimates for India.
 */

export const getGoogleMapsMultiStopUrl = (destination = '', stops = []) => {
  if (!stops || stops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination || 'India')}`;
  }

  const cleanDest = destination.split(',')[0].trim();

  // If only 1 stop
  if (stops.length === 1) {
    const target = `${stops[0].name}, ${cleanDest}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}&travelmode=driving`;
  }

  const origin = encodeURIComponent(`${stops[0].name}, ${cleanDest}`);
  const dest = encodeURIComponent(`${stops[stops.length - 1].name}, ${cleanDest}`);

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;

  if (stops.length > 2) {
    const waypoints = stops
      .slice(1, stops.length - 1)
      .map((s) => encodeURIComponent(`${s.name}, ${cleanDest}`))
      .join('|');
    url += `&waypoints=${waypoints}`;
  }

  return url;
};

/**
 * Direct navigation link for a single specific attraction/stop
 */
export const getGoogleMapsStopUrl = (destination = '', stopName = '') => {
  const cleanDest = destination.split(',')[0].trim();
  const query = encodeURIComponent(`${stopName}, ${cleanDest}, India`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Calculates realistic Indian transit estimates (Auto-rickshaw, Uber/Ola, and Metro)
 */
export const calculateDayTransitEstimates = (stops = []) => {
  if (!stops || stops.length <= 1) {
    return {
      totalDistanceKm: 0,
      totalDurationMin: 0,
      autoFareRange: '₹50 - ₹80',
      cabFareRange: '₹120 - ₹180',
    };
  }

  let totalDistanceKm = 0;
  let totalDurationMin = 0;

  stops.forEach((stop, idx) => {
    if (idx < stops.length - 1) {
      const transit = stop.travelToNext;
      if (transit) {
        totalDistanceKm += transit.distanceKm || 2.5;
        totalDurationMin += transit.durationMinutes || 15;
      } else {
        totalDistanceKm += 3.2;
        totalDurationMin += 18;
      }
    }
  });

  const roundedDistance = Math.round(totalDistanceKm * 10) / 10;
  // Indian auto-rickshaw standard base ₹30 + ₹12/km
  const autoMin = Math.max(60, Math.round(30 + roundedDistance * 11));
  const autoMax = Math.max(90, Math.round(45 + roundedDistance * 15));

  // Cab (Uber Go / Ola Mini) base ₹60 + ₹16/km
  const cabMin = Math.max(120, Math.round(60 + roundedDistance * 16));
  const cabMax = Math.max(180, Math.round(90 + roundedDistance * 22));

  return {
    totalDistanceKm: roundedDistance,
    totalDurationMin,
    autoFareRange: `₹${autoMin} – ₹${autoMax}`,
    cabFareRange: `₹${cabMin} – ₹${cabMax}`,
  };
};
