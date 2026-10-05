import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/planner/TripForm';
import PlanningLoader from '../components/planner/PlanningLoader';
import itineraryService from '../services/itineraryService';
import Logo from '../components/ui/Logo';

export const PlanTripPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTripSubmit = async (criteria) => {
    setIsLoading(true);
    setStepIndex(0);
    setErrorMessage('');

    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await itineraryService.generateItinerary(criteria);

      clearInterval(stepTimer);
      setStepIndex(4);

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
    <div className="w-full min-h-[90vh] bg-[#0c0c0f] text-[#f5f2eb] py-12 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="py-20">
            <PlanningLoader currentStepIndex={stepIndex} />
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Top Dossier Header */}
            <div className="pb-6 border-b border-[#23232c]">
              <div className="flex items-center gap-3 mb-3">
                <Logo size="sm" showWordmark={false} />
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase font-semibold">
                  TRIPPILOT · INDIAN EXPEDITION DOSSIER
                </span>
              </div>

              <h1 className="font-serif-headline text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] mb-3">
                Trip Planning Parameters
              </h1>
              <p className="font-serif-subheadline text-lg sm:text-xl text-[#9e9a91] max-w-2xl leading-relaxed">
                Configure your destination, duration, budget, and cadence across India. Our geographic clustering and 2-opt routing engine organizes your journey with zero dead transit time.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-950/20 border border-red-800/40 text-xs font-mono text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Trip Form Container */}
            <div className="bg-[#131317] border border-[#23232c] p-6 sm:p-10 shadow-editorial">
              <TripForm onSubmit={handleTripSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTripPage;
