import React, { useState } from 'react';
import { MapPin, Calendar, IndianRupee, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import InterestSelector from './InterestSelector';

export const TripForm = ({ onSubmit, initialValues = {}, isLoading = false }) => {
  const [destination, setDestination] = useState(initialValues.destination || '');
  const [numberOfDays, setNumberOfDays] = useState(initialValues.numberOfDays || 3);
  const [budget, setBudget] = useState(initialValues.budget || 25000);
  const [interests, setInterests] = useState(
    initialValues.interests || ['History', 'Food', 'Culture']
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
      errs.budget = 'Please enter a valid budget';
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
    <Card className="p-6 sm:p-8 max-w-xl mx-auto border-purple-500/20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Plan Your Journey
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Enter your destination and preferences for a tailored, optimized itinerary
          </p>
        </div>

        {/* Destination */}
        <Input
          id="destination"
          label="Destination"
          placeholder="Where are you going? (e.g. Paris, Tokyo, Jaipur)"
          icon={MapPin}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          error={errors.destination}
          required
        />

        {/* Duration & Budget Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="numberOfDays"
            label="Duration (Days)"
            type="number"
            min="1"
            max="14"
            icon={Calendar}
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(e.target.value)}
            error={errors.numberOfDays}
            required
          />

          <Input
            id="budget"
            label="Total Budget (₹)"
            type="number"
            min="1000"
            step="500"
            icon={IndianRupee}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            error={errors.budget}
            required
          />
        </div>

        {/* Interests Selector */}
        <InterestSelector
          selectedInterests={interests}
          onChange={setInterests}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={isLoading}
          className="mt-2 w-full"
        >
          <span>Generate My Itinerary</span>
          <ArrowRight size={18} />
        </Button>
      </form>
    </Card>
  );
};

export default TripForm;
