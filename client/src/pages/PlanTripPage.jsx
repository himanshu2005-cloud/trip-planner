import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/planner/TripForm';
import PlanningLoader from '../components/planner/PlanningLoader';
import itineraryService from '../services/itineraryService';

export const PlanTripPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTripSubmit = async (criteria) => {
    setIsLoading(true);
    setStepIndex(0);
    setErrorMessage('');

    // Smoothly progress through animated planning stages while API executes
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      // Real API Call: fetch attractions & run optimization engine
      const result = await itineraryService.generateItinerary(criteria);

      clearInterval(stepTimer);
      setStepIndex(4); // All 5 steps completed

      setTimeout(() => {
        navigate('/itinerary', {
          state: {
            criteria,
            generatedData: result,
          },
        });
      }, 500);
    } catch (err) {
      clearInterval(stepTimer);
      setIsLoading(false);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to generate itinerary. Please verify your inputs and try again.'
      );
    }
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
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Build Your Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Specify your constraints and let the optimization engine craft your route
            </p>
          </div>

          {errorMessage && (
            <div className="max-w-xl mx-auto w-full p-4 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger text-center">
              {errorMessage}
            </div>
          )}

          <TripForm onSubmit={handleTripSubmit} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default PlanTripPage;
