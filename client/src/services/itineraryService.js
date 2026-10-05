import api from './api';

export const itineraryService = {
  /**
   * Generate an optimized day-wise itinerary from user constraints
   */
  async generateItinerary({ destination, numberOfDays, budget, interests }) {
    const res = await api.post('/itinerary/generate', {
      destination,
      numberOfDays: Number(numberOfDays),
      budget: Number(budget),
      interests,
    });
    return res.data;
  },

  /**
   * Regenerate a single day with reason-based preference
   */
  async regenerateDay({
    destination,
    dayNumber,
    reason,
    budgetRemaining,
    existingDays,
    interests,
  }) {
    const res = await api.post('/itinerary/regenerate-day', {
      destination,
      dayNumber: Number(dayNumber),
      reason,
      budgetRemaining: Number(budgetRemaining),
      existingDays,
      interests,
    });
    return res.data;
  },

  /**
   * Save an itinerary to user's saved trips
   */
  async saveTrip(tripData) {
    const res = await api.post('/trips', tripData);
    return res.data;
  },

  /**
   * Get all trips for the authenticated user
   */
  async getTrips() {
    const res = await api.get('/trips');
    return res.data;
  },

  /**
   * Get single trip by ID
   */
  async getTripById(id) {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },

  /**
   * Update an existing trip by ID
   */
  async updateTrip(id, tripData) {
    const res = await api.put(`/trips/${id}`, tripData);
    return res.data;
  },

  /**
   * Delete a saved trip
   */
  async deleteTrip(id) {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },
};

export default itineraryService;
