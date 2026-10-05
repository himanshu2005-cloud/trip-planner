import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TravelButton from '../components/editorial/TravelButton';
import Logo from '../components/ui/Logo';
import itineraryService from '../services/itineraryService';
import { useAuth } from '../context/AuthContext';

export const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrips() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await itineraryService.getTrips();
        if (response?.data) {
          setTrips(response.data);
        }
      } catch (err) {
        console.warn('Could not load user trips from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, [isAuthenticated]);

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await itineraryService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (err) {
      console.error('Failed to delete trip:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenTrip = (trip) => {
    navigate('/itinerary', {
      state: {
        tripId: trip._id || trip.id,
        criteria: {
          destination: trip.destination,
          numberOfDays: trip.days || trip.numberOfDays,
          budget: trip.budget,
          interests: trip.interests,
        },
        generatedData: {
          destination: trip.destination,
          numberOfDays: trip.days || trip.numberOfDays,
          budget: trip.budget,
          interests: trip.interests,
          itinerary: trip.itinerary,
        },
      },
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#23232c] mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Logo size="sm" showWordmark={false} />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase font-semibold">
              MY TRAVEL JOURNAL
            </span>
          </div>
          <h1 className="font-serif-headline text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb]">
            Archived Expeditions
          </h1>
          <p className="font-serif-subheadline text-base sm:text-lg text-[#9e9a91] mt-1">
            Access, view, and re-optimize your planned journeys across India.
          </p>
        </div>

        <Link to="/plan">
          <TravelButton variant="violet" arrow>
            + PLAN NEW INDIAN EXPEDITION
          </TravelButton>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#5c5851] font-mono text-xs">
          ACCESSING ARCHIVED JOURNALS...
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const tripId = trip._id || trip.id;
            const stopCount = (trip.itinerary || []).reduce(
              (acc, d) => acc + (d.stops?.length || 0),
              0
            );

            return (
              <article
                key={tripId}
                className="bg-[#131317] border border-[#23232c] hover:border-[#7a5293] p-6 flex flex-col justify-between group transition-colors cursor-pointer shadow-editorial"
                onClick={() => handleOpenTrip(trip)}
              >
                <div>
                  <div className="flex items-baseline justify-between mb-3 text-xs font-mono">
                    <span className="text-[#cebfdf] tracking-wider uppercase">
                      {trip.days || trip.numberOfDays} DAYS
                    </span>
                    <span className="text-[#5c5851]">
                      {trip.createdAt
                        ? new Date(trip.createdAt).toLocaleDateString()
                        : 'Recent'}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#f5f2eb] group-hover:text-[#cebfdf] transition-colors">
                    {trip.destination}
                  </h3>

                  <p className="font-sans text-xs text-[#9e9a91] mt-2">
                    {stopCount > 0 ? `${stopCount} curated waypoints · ` : ''}
                    {trip.interests?.slice(0, 3).join(', ') || 'Custom Circuit'}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#1c1c23] mt-6 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-[#5c5851] uppercase tracking-wider block">
                      BUDGET
                    </span>
                    <span className="text-[#f5f2eb] font-semibold">
                      ₹{trip.budget?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      title="Delete journal entry"
                      disabled={deletingId === tripId}
                      onClick={(e) => handleDeleteTrip(tripId, e)}
                      className="text-[#5c5851] hover:text-red-400 font-mono text-xs transition-colors p-1"
                    >
                      {deletingId === tripId ? '...' : 'DELETE'}
                    </button>

                    <TravelButton variant="solid" arrow>
                      OPEN
                    </TravelButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Editorial Empty State */
        <div className="py-24 text-center max-w-lg mx-auto flex flex-col items-center">
          <Logo size="lg" className="mb-6 opacity-75" />

          <p className="font-serif-subheadline text-2xl text-[#f5f2eb] mb-3">
            "Your next journey hasn't been written yet."
          </p>
          <p className="text-xs text-[#9e9a91] font-mono mb-8 max-w-sm">
            {!isAuthenticated
              ? 'Sign in to access your saved journeys, or start planning a new circuit.'
              : 'Choose a destination across India to craft an optimized day-by-day expedition.'}
          </p>

          <Link to={!isAuthenticated ? '/login' : '/plan'}>
            <TravelButton variant="violet" arrow>
              {!isAuthenticated ? 'SIGN IN TO JOURNAL' : 'PLAN A TRIP'}
            </TravelButton>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
