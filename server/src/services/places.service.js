'use strict';

/**
 * services/places.service.js
 *
 * Google Places API Integration Service.
 * - Queries Google Places TextSearch API based on destination and user interests.
 * - Normalizes external Google Places responses into internal Attraction type.
 * - Never exposes GOOGLE_PLACES_API_KEY to frontend.
 * - Provides graceful fallback to curated destination data when API key is unset
 *   or external API quota is exceeded.
 */

const axios = require('axios');
const { GOOGLE_PLACES_API_KEY } = require('../config/env');

const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// ─── Interest to Google Places query mapping ─────────────────────────────────

const INTEREST_KEYWORDS = {
  History: ['historical landmark', 'monument', 'museum', 'heritage'],
  Food: ['restaurant', 'bakery', 'market', 'local cuisine', 'cafe'],
  Nature: ['park', 'garden', 'natural feature', 'nature reserve'],
  Architecture: ['architectural building', 'palace', 'cathedral', 'tower'],
  Shopping: ['shopping mall', 'bazaar', 'market', 'boutique'],
  Nightlife: ['night club', 'bar', 'lounge'],
  Culture: ['art gallery', 'cultural center', 'theater', 'museum'],
  Adventure: ['amusement park', 'hiking area', 'viewpoint'],
};

// Types considered predominantly outdoors
const OUTDOOR_TYPES = new Set([
  'park',
  'campground',
  'zoo',
  'amusement_park',
  'natural_feature',
  'beach',
  'hiking_area',
]);

// Typical visit duration in minutes based on place type
function estimateDuration(types = []) {
  if (types.some((t) => ['museum', 'art_gallery'].includes(t))) return 120;
  if (types.some((t) => ['zoo', 'amusement_park'].includes(t))) return 180;
  if (types.some((t) => ['restaurant', 'cafe', 'bar'].includes(t))) return 60;
  if (types.some((t) => ['park', 'garden', 'natural_feature'].includes(t))) return 60;
  if (types.some((t) => ['place_of_worship', 'church', 'hindu_temple', 'mosque'].includes(t))) return 45;
  return 60;
}

// Estimate entrance/activity cost in INR based on Google's price_level (0-4)
function estimateCost(priceLevel, types = []) {
  if (priceLevel !== undefined && priceLevel !== null) {
    switch (priceLevel) {
      case 0:
        return 0; // Free
      case 1:
        return 350; // Inexpensive
      case 2:
        return 900; // Moderate
      case 3:
        return 1800; // Expensive
      case 4:
        return 3500; // Very expensive
      default:
        return 500;
    }
  }

  // Type-based estimation when price_level is omitted by Google Places
  if (types.some((t) => ['park', 'garden', 'place_of_worship'].includes(t))) return 0;
  if (types.some((t) => ['museum', 'art_gallery'].includes(t))) return 800;
  if (types.some((t) => ['restaurant'].includes(t))) return 1200;
  if (types.some((t) => ['cafe'].includes(t))) return 450;
  return 400;
}

/**
 * Normalize Google Places API opening_hours into internal format
 *
 * @param {object} openingHours
 * @returns {{ open: string, close: string }}
 */
function normalizeOpeningHours(openingHours) {
  if (!openingHours) {
    return { open: '09:00', close: '18:00' };
  }

  // If Google provides periods
  if (Array.isArray(openingHours.periods) && openingHours.periods.length > 0) {
    const period = openingHours.periods[0];
    const openTime = period.open?.time
      ? `${period.open.time.slice(0, 2)}:${period.open.time.slice(2)}`
      : '09:00';
    const closeTime = period.close?.time
      ? `${period.close.time.slice(0, 2)}:${period.close.time.slice(2)}`
      : '18:00';
    return { open: openTime, close: closeTime };
  }

  return { open: '09:00', close: '18:00' };
}

/**
 * Normalize raw Google Place object into internal Attraction format.
 *
 * @param {object} place - Raw place from Google Places API
 * @returns {object} Normalized Attraction
 */
function normalizePlace(place) {
  const types = place.types || [];
  const isOutdoor = types.some((t) => OUTDOOR_TYPES.has(t));
  const durationMin = estimateDuration(types);
  const cost = estimateCost(place.price_level, types);
  const openingHours = normalizeOpeningHours(place.opening_hours);

  // Filter out generic google types to extract clean category tags
  const cleanCategories = types
    .filter(
      (t) =>
        ![
          'point_of_interest',
          'establishment',
          'premise',
          'geocode',
        ].includes(t)
    )
    .map((t) => t.replace(/_/g, ' '));

  return {
    placeId: place.place_id,
    attractionId: place.place_id,
    name: place.name,
    attraction: place.name,
    coordinates: {
      lat: place.geometry?.location?.lat || 0,
      lng: place.geometry?.location?.lng || 0,
    },
    category: cleanCategories.length > 0 ? cleanCategories : ['Attraction'],
    rating: typeof place.rating === 'number' ? place.rating : 4.5,
    userRatingsTotal: place.user_ratings_total || 0,
    cost,
    durationMin,
    duration: durationMin,
    openingHours,
    isOutdoor,
    address: place.formatted_address || place.vicinity || '',
    photos: Array.isArray(place.photos)
      ? place.photos.map((p) => p.photo_reference)
      : [],
    weather: 'clear',
  };
}

/**
 * Fetch attractions from Google Places Text Search.
 *
 * @param {string} destination - City / Region
 * @param {string[]} interests - User selected interests
 * @param {object} [options]
 * @returns {Promise<Array<object>>} Normalized attractions array
 */
async function fetchAttractions(destination, interests = [], options = {}) {
  const { limit = 20, minRating = 4.0 } = options;

  // If no Google API key is configured, utilize curated fallback data
  if (!GOOGLE_PLACES_API_KEY) {
    return getFallbackAttractions(destination, interests, limit);
  }

  try {
    const attractionPool = [];
    const seenPlaceIds = new Set();

    // Generate search queries based on interests or fallback to top sights
    const queryCategories =
      Array.isArray(interests) && interests.length > 0
        ? interests
        : ['sights', 'culture', 'monuments'];

    for (const interest of queryCategories) {
      const keywordList = INTEREST_KEYWORDS[interest] || [interest];
      const primaryKeyword = keywordList[0];
      const query = `${primaryKeyword} in ${destination}`;

      const res = await axios.get(`${GOOGLE_PLACES_BASE_URL}/textsearch/json`, {
        params: {
          query,
          key: GOOGLE_PLACES_API_KEY,
        },
        timeout: 10000,
      });

      if (res.data?.status === 'OK' && Array.isArray(res.data.results)) {
        for (const rawPlace of res.data.results) {
          if (!seenPlaceIds.has(rawPlace.place_id)) {
            seenPlaceIds.add(rawPlace.place_id);
            const normalized = normalizePlace(rawPlace);
            if (normalized.rating >= minRating) {
              attractionPool.push(normalized);
            }
          }
        }
      }
    }

    if (attractionPool.length === 0) {
      return getFallbackAttractions(destination, interests, limit);
    }

    // Sort by rating & review count descending and slice
    attractionPool.sort((a, b) => b.rating - a.rating || b.userRatingsTotal - a.userRatingsTotal);

    return attractionPool.slice(0, limit);
  } catch (err) {
    console.warn(`[PlacesService] Google Places API call failed: ${err.message}. Falling back to curated data.`);
    return getFallbackAttractions(destination, interests, limit);
  }
}

/**
 * Curated destination dataset for fallback and deterministic development/testing.
 */
function getFallbackAttractions(destination, interests = [], limit = 20) {
  const destLower = (destination || '').toLowerCase();

  const curatedData = {
    paris: [
      {
        placeId: 'fr-paris-louvre',
        name: 'Louvre Museum',
        coordinates: { lat: 48.8606, lng: 2.3376 },
        category: ['museum', 'art', 'history'],
        rating: 4.8,
        cost: 1800,
        durationMin: 150,
        openingHours: { open: '09:00', close: '18:00' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-palais-royal',
        name: 'Palais-Royal Gardens',
        coordinates: { lat: 48.8648, lng: 2.3378 },
        category: ['park', 'nature', 'architecture'],
        rating: 4.6,
        cost: 0,
        durationMin: 60,
        openingHours: { open: '08:30', close: '20:30' },
        isOutdoor: true,
      },
      {
        placeId: 'fr-paris-sainte-chapelle',
        name: 'Sainte-Chapelle',
        coordinates: { lat: 48.8554, lng: 2.345 },
        category: ['architecture', 'place of worship', 'history'],
        rating: 4.7,
        cost: 950,
        durationMin: 75,
        openingHours: { open: '09:00', close: '17:00' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-notre-dame',
        name: 'Notre-Dame Cathedral Parvis',
        coordinates: { lat: 48.8529, lng: 2.3499 },
        category: ['monument', 'history', 'architecture'],
        rating: 4.8,
        cost: 0,
        durationMin: 75,
        openingHours: { open: '08:00', close: '18:45' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-musee-orsay',
        name: 'Musée d’Orsay',
        coordinates: { lat: 48.8599, lng: 2.3265 },
        category: ['museum', 'art'],
        rating: 4.8,
        cost: 1600,
        durationMin: 120,
        openingHours: { open: '09:30', close: '18:00' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-tuileries',
        name: 'Tuileries Garden',
        coordinates: { lat: 48.8638, lng: 2.3275 },
        category: ['park', 'nature'],
        rating: 4.6,
        cost: 0,
        durationMin: 60,
        openingHours: { open: '07:00', close: '21:00' },
        isOutdoor: true,
      },
      {
        placeId: 'fr-paris-eiffel',
        name: 'Eiffel Tower',
        coordinates: { lat: 48.8584, lng: 2.2945 },
        category: ['monument', 'architecture', 'viewpoint'],
        rating: 4.7,
        cost: 2600,
        durationMin: 120,
        openingHours: { open: '09:00', close: '23:45' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-champ-mars',
        name: 'Champ de Mars',
        coordinates: { lat: 48.8556, lng: 2.2986 },
        category: ['park', 'nature'],
        rating: 4.6,
        cost: 0,
        durationMin: 45,
        openingHours: { open: '00:00', close: '23:59' },
        isOutdoor: true,
      },
      {
        placeId: 'fr-paris-rodin',
        name: 'Musée Rodin',
        coordinates: { lat: 48.8553, lng: 2.3158 },
        category: ['museum', 'sculpture', 'garden'],
        rating: 4.7,
        cost: 600,
        durationMin: 90,
        openingHours: { open: '10:00', close: '18:30' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-sacre-coeur',
        name: 'Sacré-Cœur Basilica',
        coordinates: { lat: 48.8867, lng: 2.3431 },
        category: ['place of worship', 'architecture', 'viewpoint'],
        rating: 4.7,
        cost: 0,
        durationMin: 90,
        openingHours: { open: '06:30', close: '22:30' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-place-tertre',
        name: 'Place du Tertre',
        coordinates: { lat: 48.8865, lng: 2.3408 },
        category: ['culture', 'art', 'market'],
        rating: 4.5,
        cost: 0,
        durationMin: 60,
        openingHours: { open: '09:00', close: '20:00' },
        isOutdoor: true,
      },
      {
        placeId: 'fr-paris-pantheon',
        name: 'Panthéon de Paris',
        coordinates: { lat: 48.8462, lng: 2.3464 },
        category: ['monument', 'history'],
        rating: 4.7,
        cost: 1150,
        durationMin: 90,
        openingHours: { open: '10:00', close: '18:00' },
        isOutdoor: false,
      },
      {
        placeId: 'fr-paris-luxembourg',
        name: 'Jardin du Luxembourg',
        coordinates: { lat: 48.8462, lng: 2.3372 },
        category: ['park', 'nature', 'garden'],
        rating: 4.8,
        cost: 0,
        durationMin: 75,
        openingHours: { open: '07:30', close: '21:30' },
        isOutdoor: true,
      },
    ],
    jaipur: [
      {
        placeId: 'in-jai-amber',
        name: 'Amber Palace',
        coordinates: { lat: 26.9855, lng: 75.8513 },
        category: ['fort', 'history', 'architecture'],
        rating: 4.8,
        cost: 500,
        durationMin: 150,
        openingHours: { open: '08:00', close: '17:30' },
        isOutdoor: false,
      },
      {
        placeId: 'in-jai-hawa-mahal',
        name: 'Hawa Mahal (Palace of Winds)',
        coordinates: { lat: 26.9239, lng: 75.8267 },
        category: ['monument', 'history', 'architecture'],
        rating: 4.6,
        cost: 200,
        durationMin: 60,
        openingHours: { open: '09:00', close: '16:30' },
        isOutdoor: false,
      },
      {
        placeId: 'in-jai-city-palace',
        name: 'City Palace & Courtyards',
        coordinates: { lat: 26.9258, lng: 75.8236 },
        category: ['palace', 'history', 'museum'],
        rating: 4.7,
        cost: 700,
        durationMin: 120,
        openingHours: { open: '09:30', close: '17:00' },
        isOutdoor: false,
      },
      {
        placeId: 'in-jai-jantar-mantar',
        name: 'Jantar Mantar Royal Observatory',
        coordinates: { lat: 26.9248, lng: 75.8246 },
        category: ['heritage', 'history', 'science'],
        rating: 4.5,
        cost: 200,
        durationMin: 75,
        openingHours: { open: '09:00', close: '17:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-jai-nahargarh',
        name: 'Nahargarh Fort & Sunset Point',
        coordinates: { lat: 26.9373, lng: 75.8155 },
        category: ['fort', 'viewpoint', 'history'],
        rating: 4.7,
        cost: 200,
        durationMin: 90,
        openingHours: { open: '10:00', close: '17:30' },
        isOutdoor: true,
      },
      {
        placeId: 'in-jai-jal-mahal',
        name: 'Jal Mahal (Water Palace)',
        coordinates: { lat: 26.9534, lng: 75.8462 },
        category: ['monument', 'lake', 'photography'],
        rating: 4.5,
        cost: 0,
        durationMin: 45,
        openingHours: { open: '06:00', close: '22:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-jai-albert-hall',
        name: 'Albert Hall State Museum',
        coordinates: { lat: 26.9116, lng: 75.8195 },
        category: ['museum', 'art', 'history'],
        rating: 4.6,
        cost: 300,
        durationMin: 90,
        openingHours: { open: '09:00', close: '17:00' },
        isOutdoor: false,
      },
      {
        placeId: 'in-jai-patrika-gate',
        name: 'Patrika Gate at Jawahar Circle',
        coordinates: { lat: 26.8528, lng: 75.8058 },
        category: ['architecture', 'photography', 'art'],
        rating: 4.7,
        cost: 0,
        durationMin: 45,
        openingHours: { open: '06:00', close: '21:00' },
        isOutdoor: true,
      },
    ],
    varanasi: [
      {
        placeId: 'in-vns-assi-ghat',
        name: 'Assi Ghat (Subah-e-Banaras Dawn)',
        coordinates: { lat: 25.2885, lng: 83.0068 },
        category: ['ghat', 'spiritual', 'culture'],
        rating: 4.9,
        cost: 0,
        durationMin: 90,
        openingHours: { open: '05:00', close: '22:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-vns-dashashwamedh',
        name: 'Dashashwamedh Ghat & Evening Ganga Aarti',
        coordinates: { lat: 25.3076, lng: 83.0104 },
        category: ['ghat', 'ceremony', 'spiritual'],
        rating: 4.9,
        cost: 250,
        durationMin: 120,
        openingHours: { open: '05:00', close: '23:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-vns-kashi-vishwanath',
        name: 'Kashi Vishwanath Corridor & Temple',
        coordinates: { lat: 25.3109, lng: 83.0107 },
        category: ['temple', 'spiritual', 'history'],
        rating: 4.8,
        cost: 0,
        durationMin: 120,
        openingHours: { open: '04:00', close: '21:00' },
        isOutdoor: false,
      },
      {
        placeId: 'in-vns-manikarnika',
        name: 'Manikarnika Ghat Heritage Walk',
        coordinates: { lat: 25.3113, lng: 83.0139 },
        category: ['ghat', 'culture', 'heritage'],
        rating: 4.7,
        cost: 0,
        durationMin: 60,
        openingHours: { open: '00:00', close: '23:59' },
        isOutdoor: true,
      },
      {
        placeId: 'in-vns-sarnath',
        name: 'Sarnath Deer Park & Dhamek Stupa',
        coordinates: { lat: 25.3811, lng: 83.0214 },
        category: ['heritage', 'buddhist', 'history'],
        rating: 4.8,
        cost: 300,
        durationMin: 150,
        openingHours: { open: '08:00', close: '17:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-vns-ramnagar',
        name: 'Ramnagar Fort & Museum',
        coordinates: { lat: 25.2678, lng: 83.0251 },
        category: ['fort', 'palace', 'history'],
        rating: 4.5,
        cost: 150,
        durationMin: 90,
        openingHours: { open: '10:00', close: '17:00' },
        isOutdoor: false,
      },
    ],
    kerala: [
      {
        placeId: 'in-ker-alleppey-backwaters',
        name: 'Alleppey Backwaters & Wooden Kettuvallam',
        coordinates: { lat: 9.4981, lng: 76.3388 },
        category: ['nature', 'cruise', 'slow-travel'],
        rating: 4.9,
        cost: 2500,
        durationMin: 180,
        openingHours: { open: '06:00', close: '18:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-ker-munnar-tea',
        name: 'Munnar KDHP Tea Plantation & Estate',
        coordinates: { lat: 10.0889, lng: 77.0595 },
        category: ['nature', 'hills', 'plantation'],
        rating: 4.8,
        cost: 200,
        durationMin: 120,
        openingHours: { open: '09:00', close: '17:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-ker-eravikulam',
        name: 'Eravikulam National Park (Rajamalai)',
        coordinates: { lat: 10.1518, lng: 77.0608 },
        category: ['wildlife', 'nature', 'viewpoint'],
        rating: 4.7,
        cost: 400,
        durationMin: 150,
        openingHours: { open: '07:30', close: '16:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-ker-fort-kochi',
        name: 'Fort Kochi Chinese Nets & Colonial Quarter',
        coordinates: { lat: 9.9658, lng: 76.2421 },
        category: ['heritage', 'coastal', 'culture'],
        rating: 4.6,
        cost: 50,
        durationMin: 90,
        openingHours: { open: '06:00', close: '20:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-ker-mattancherry',
        name: 'Mattancherry Dutch Palace & Jew Town',
        coordinates: { lat: 9.9583, lng: 76.2592 },
        category: ['museum', 'history', 'shopping'],
        rating: 4.5,
        cost: 100,
        durationMin: 75,
        openingHours: { open: '10:00', close: '17:00' },
        isOutdoor: false,
      },
    ],
    udaipur: [
      {
        placeId: 'in-udr-city-palace',
        name: 'Udaipur City Palace Complex',
        coordinates: { lat: 24.5764, lng: 73.6835 },
        category: ['palace', 'heritage', 'architecture'],
        rating: 4.8,
        cost: 400,
        durationMin: 150,
        openingHours: { open: '09:00', close: '17:30' },
        isOutdoor: false,
      },
      {
        placeId: 'in-udr-lake-pichola',
        name: 'Lake Pichola Sunset Boat Cruise',
        coordinates: { lat: 24.5738, lng: 73.6766 },
        category: ['lake', 'sunset', 'slow-travel'],
        rating: 4.8,
        cost: 500,
        durationMin: 75,
        openingHours: { open: '09:00', close: '18:30' },
        isOutdoor: true,
      },
      {
        placeId: 'in-udr-saheliyon',
        name: 'Saheliyon-ki-Bari (Courtyard of Maidens)',
        coordinates: { lat: 24.6033, lng: 73.6872 },
        category: ['garden', 'fountain', 'heritage'],
        rating: 4.5,
        cost: 100,
        durationMin: 60,
        openingHours: { open: '08:00', close: '19:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-udr-jag-mandir',
        name: 'Jag Mandir Island Palace',
        coordinates: { lat: 24.5676, lng: 73.6781 },
        category: ['palace', 'island', 'architecture'],
        rating: 4.7,
        cost: 450,
        durationMin: 90,
        openingHours: { open: '10:00', close: '18:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-udr-bagore',
        name: 'Bagore Ki Haveli & Dharohar Folk Dance',
        coordinates: { lat: 24.5796, lng: 73.6806 },
        category: ['culture', 'dance', 'haveli'],
        rating: 4.8,
        cost: 150,
        durationMin: 90,
        openingHours: { open: '10:00', close: '20:00' },
        isOutdoor: false,
      },
    ],
    ladakh: [
      {
        placeId: 'in-ldk-thiksey',
        name: 'Thiksey Monastery (Mini Potala)',
        coordinates: { lat: 34.0567, lng: 77.6667 },
        category: ['monastery', 'spiritual', 'himalayan'],
        rating: 4.9,
        cost: 100,
        durationMin: 120,
        openingHours: { open: '06:00', close: '18:00' },
        isOutdoor: false,
      },
      {
        placeId: 'in-ldk-shanti-stupa',
        name: 'Shanti Stupa Sunrise Viewpoint',
        coordinates: { lat: 34.1729, lng: 77.5744 },
        category: ['stupa', 'viewpoint', 'spiritual'],
        rating: 4.8,
        cost: 0,
        durationMin: 60,
        openingHours: { open: '05:00', close: '21:00' },
        isOutdoor: true,
      },
      {
        placeId: 'in-ldk-leh-palace',
        name: 'Leh Royal Palace',
        coordinates: { lat: 34.1662, lng: 77.5861 },
        category: ['palace', 'heritage', 'history'],
        rating: 4.6,
        cost: 250,
        durationMin: 90,
        openingHours: { open: '08:00', close: '17:30' },
        isOutdoor: false,
      },
      {
        placeId: 'in-ldk-pangong',
        name: 'Pangong Tso Azure Lake',
        coordinates: { lat: 33.7595, lng: 78.6674 },
        category: ['lake', 'high-altitude', 'nature'],
        rating: 4.9,
        cost: 500,
        durationMin: 240,
        openingHours: { open: '06:00', close: '18:00' },
        isOutdoor: true,
      },
    ],
  };

  const pool =
    destLower.includes('varanasi') || destLower.includes('banaras') || destLower.includes('kashi')
      ? curatedData.varanasi
      : destLower.includes('kerala') || destLower.includes('alleppey') || destLower.includes('munnar') || destLower.includes('kochi')
      ? curatedData.kerala
      : destLower.includes('udaipur')
      ? curatedData.udaipur
      : destLower.includes('ladakh') || destLower.includes('leh')
      ? curatedData.ladakh
      : curatedData.jaipur; // default to rich Jaipur Indian dataset

  return pool.map((item) => ({
    ...item,
    attractionId: item.placeId,
    attraction: item.name,
    duration: item.durationMin,
    weather: 'clear',
    userRatingsTotal: 1500,
    address: `${item.name}, ${destination}`,
  })).slice(0, limit);
}

module.exports = {
  fetchAttractions,
  normalizePlace,
  normalizeOpeningHours,
  estimateDuration,
  estimateCost,
};
