import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/planner/TripForm';
import PlanningLoader from '../components/planner/PlanningLoader';

export const PlanTripPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const handleTripSubmit = (criteria) => {
    setIsLoading(true);
    setStepIndex(0);

    // Mock progress simulation for Phase 1 UI preview
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/itinerary', { state: { criteria } });
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="py-6 animate-fade-in max-w-4xl mx-auto">
      {isLoading ? (
        <div className="py-16">
          <PlanningLoader currentStepIndex={stepIndex} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-text-primary">
              Build Your Itinerary
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Specify your constraints and let the optimization engine craft your route
            </p>
          </div>

          <TripForm onSubmit={handleTripSubmit} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default PlanTripPage;
