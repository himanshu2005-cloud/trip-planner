import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Calendar, IndianRupee, Star, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const FEATURED_DESTINATIONS = [
  {
    destination: 'Paris, France',
    days: 5,
    budget: 40000,
    tagline: 'Art, royal palaces & romantic café boulevards',
    highlights: ['Louvre Museum', 'Eiffel Tower', 'Sainte-Chapelle', 'Montmartre'],
    rating: 4.9,
    interests: ['History', 'Food', 'Culture', 'Architecture'],
  },
  {
    destination: 'Tokyo, Japan',
    days: 6,
    budget: 65000,
    tagline: 'Neon skylines, ancient shrines & world-class ramen',
    highlights: ['Senso-ji', 'Shinjuku Gyoen', 'Meiji Jingu', 'Akihabara'],
    rating: 4.9,
    interests: ['Food', 'Culture', 'Shopping', 'Architecture'],
  },
  {
    destination: 'Jaipur, India',
    days: 3,
    budget: 20000,
    tagline: 'The Pink City: grand forts, royal palaces & vibrant bazaars',
    highlights: ['Amber Palace', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    rating: 4.8,
    interests: ['History', 'Architecture', 'Culture', 'Shopping'],
  },
  {
    destination: 'Rome, Italy',
    days: 4,
    budget: 48000,
    tagline: 'Eternal City ruins, piazzas, basilicas & authentic pasta',
    highlights: ['Colosseum', 'Vatican Museums', 'Pantheon', 'Trevi Fountain'],
    rating: 4.8,
    interests: ['History', 'Food', 'Culture', 'Architecture'],
  },
];

export const ExplorePage = () => {
  const navigate = useNavigate();

  const handleSelectTrip = (trip) => {
    navigate('/itinerary', {
      state: {
        criteria: {
          destination: trip.destination,
          numberOfDays: trip.days,
          budget: trip.budget,
          interests: trip.interests,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 py-6 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={13} className="text-purple-400" />
          <span>Curated Sample Itineraries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Explore Optimized Destinations
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-2">
          Discover hand-crafted day-by-day itineraries pre-computed with our clustering and TSP engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {FEATURED_DESTINATIONS.map((trip) => (
          <Card key={trip.destination} hoverable className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="purple">{trip.days} Days</Badge>
                <div className="flex items-center gap-1 text-xs text-warning font-semibold">
                  <Star size={13} className="fill-warning" />
                  <span>{trip.rating}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-text-primary tracking-tight mb-1">
                {trip.destination}
              </h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                {trip.tagline}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {trip.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] text-text-muted border border-white/[0.06]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-text-muted block">
                  Est. Budget
                </span>
                <span className="text-base font-bold text-text-primary">
                  ₹{trip.budget.toLocaleString()}
                </span>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => handleSelectTrip(trip)}
              >
                <span>View Itinerary</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
