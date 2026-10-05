import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, IndianRupee, Trash2, ArrowUpRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SAMPLE_TRIPS = [
  {
    id: 'trip-1',
    destination: 'Paris, France',
    numberOfDays: 5,
    budget: 40000,
    placesCount: 18,
    updatedAt: '2 days ago',
  },
  {
    id: 'trip-2',
    destination: 'Kyoto, Japan',
    numberOfDays: 4,
    budget: 65000,
    placesCount: 14,
    updatedAt: '1 week ago',
  },
  {
    id: 'trip-3',
    destination: 'Jaipur, India',
    numberOfDays: 3,
    budget: 20000,
    placesCount: 11,
    updatedAt: '2 weeks ago',
  },
];

export const MyTripsPage = () => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
        {SAMPLE_TRIPS.map((trip) => (
          <Card key={trip.id} hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="purple">{trip.numberOfDays} Days</Badge>
                <span className="text-[11px] text-text-muted">{trip.updatedAt}</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight mb-1">
                {trip.destination}
              </h3>
              <p className="text-xs text-text-muted mb-4">
                {trip.placesCount} curated attractions · Optimized route
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-text-muted block">
                  Budget
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  ₹{trip.budget.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  title="Delete trip"
                  className="p-2 text-text-muted hover:text-danger rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <Link to="/itinerary">
                  <Button size="sm" variant="secondary">
                    <span>Open</span>
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyTripsPage;
