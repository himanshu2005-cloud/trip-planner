import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, IndianRupee, Trash2, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
    <div className="flex flex-col gap-6 py-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            My Saved Trips
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Access, view, and re-optimize your planned journeys
          </p>
        </div>

        <Link to="/plan">
          <Button size="sm" variant="primary">
            <Compass size={16} />
            <span>Plan New Trip</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-muted flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-purple-400" />
          <span className="text-xs">Loading saved trips...</span>
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
          {trips.map((trip) => {
            const tripId = trip._id || trip.id;
            const stopCount = (trip.itinerary || []).reduce(
              (acc, d) => acc + (d.stops?.length || 0),
              0
            );

            return (
              <Card
                key={tripId}
                hoverable
                className="p-5 flex flex-col justify-between"
                onClick={() => handleOpenTrip(trip)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple">{trip.days || trip.numberOfDays} Days</Badge>
                    <span className="text-[11px] text-text-muted">
                      {trip.createdAt
                        ? new Date(trip.createdAt).toLocaleDateString()
                        : 'Recent'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight mb-1">
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-text-muted mb-4">
                    {stopCount > 0 ? `${stopCount} curated stops · ` : ''}
                    {trip.interests?.slice(0, 3).join(', ') || 'Custom'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted block">
                      Budget
                    </span>
                    <span className="text-sm font-semibold text-text-primary">
                      ₹{trip.budget?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      title="Delete trip"
                      disabled={deletingId === tripId}
                      onClick={(e) => handleDeleteTrip(tripId, e)}
                      className="p-2 text-text-muted hover:text-danger rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                      {deletingId === tripId ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenTrip(trip)}
                    >
                      <span>Open</span>
                      <ArrowUpRight size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center border-white/[0.08] max-w-md mx-auto my-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            No saved trips yet
          </h3>
          <p className="text-xs text-text-muted mb-6">
            {!isAuthenticated
              ? 'Sign in to access your saved trips across devices.'
              : 'Generate an itinerary and click "Save Itinerary" to keep it here.'}
          </p>
          <Link to={!isAuthenticated ? '/login' : '/plan'}>
            <Button size="sm" variant="primary">
              <span>{!isAuthenticated ? 'Sign In' : 'Plan a Trip'}</span>
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default MyTripsPage;
