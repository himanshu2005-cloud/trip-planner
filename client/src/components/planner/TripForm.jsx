import React, { useState } from 'react';
import { MapPin, Calendar, IndianRupee, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import InterestSelector from './InterestSelector';

const POPULAR_DESTINATIONS = [
  'Paris, France',
  'Tokyo, Japan',
  'Jaipur, India',
  'Rome, Italy',
  'Barcelona, Spain',
];

export const TripForm = ({ onSubmit, initialValues = {}, isLoading = false }) => {
  const [destination, setDestination] = useState(initialValues.destination || 'Paris, France');
  const [numberOfDays, setNumberOfDays] = useState(initialValues.numberOfDays || 5);
  const [budget, setBudget] = useState(initialValues.budget || 40000);
  const [interests, setInterests] = useState(
    initialValues.interests || ['History', 'Food', 'Culture', 'Architecture']
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!destination.trim()) {
      errs.destination = 'Please enter a destination';
    }
    if (!numberOfDays || numberOfDays < 1 || numberOfDays > 14) {
      errs.numberOfDays = 'Trip duration must be between 1 and 14 days';
    }
    if (!budget || budget <= 0) {
      errs.budget = 'Please enter a valid budget amount';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit) {
      onSubmit({
        destination: destination.trim(),
        numberOfDays: Number(numberOfDays),
        budget: Number(budget),
        interests,
      });
    }
  };

  return (
    <Card className="p-6 sm:p-8 max-w-xl mx-auto border-purple-500/20 shadow-glass">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Smart Planning Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Plan Your Journey
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Specify your parameters and let our optimization engine craft a balanced day-wise route.
          </p>
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-1.5">
          <Input
            id="destination"
            label="Destination"
            placeholder="Where are you going?"
            icon={MapPin}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            error={errors.destination}
            required
          />
          {/* Quick Destination Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider mr-1">
              Popular:
            </span>
            {POPULAR_DESTINATIONS.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setDestination(city)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                  destination === city
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                    : 'bg-white/[0.03] text-text-muted hover:text-text-primary border-white/[0.06]'
                }`}
              >
                {city.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Budget Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              id="numberOfDays"
              label="Trip Duration (Days)"
              type="number"
              min="1"
              max="14"
              icon={Calendar}
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              error={errors.numberOfDays}
              required
            />
            {/* Quick Days presets */}
            <div className="flex items-center gap-1.5 mt-1">
              {[3, 5, 7, 10].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setNumberOfDays(days)}
                  className={`text-[11px] flex-1 py-1 rounded-lg border text-center transition-all ${
                    Number(numberOfDays) === days
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40 font-semibold'
                      : 'bg-white/[0.03] text-text-muted hover:text-text-primary border-white/[0.06]'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              id="budget"
              label="Total Budget (₹)"
              type="number"
              min="1000"
              step="1000"
              icon={IndianRupee}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              error={errors.budget}
              required
            />
            <div className="flex items-center justify-between text-[11px] text-text-muted px-1 mt-1">
              <span>Approx. per day:</span>
              <span className="text-purple-300 font-medium">
                ₹{numberOfDays > 0 ? Math.round(budget / numberOfDays).toLocaleString() : 0}/day
              </span>
            </div>
          </div>
        </div>

        {/* Interests Selector */}
        <InterestSelector
          selectedInterests={interests}
          onChange={setInterests}
        />

        {/* Primary CTA Button (DESIGN.md §9: linear-gradient(135deg, #7C3AED, #A855F7)) */}
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={isLoading}
          className="mt-2 w-full shadow-glow"
        >
          <span>Generate My Itinerary</span>
          <ArrowRight size={18} />
        </Button>
      </form>
    </Card>
  );
};

export default TripForm;
