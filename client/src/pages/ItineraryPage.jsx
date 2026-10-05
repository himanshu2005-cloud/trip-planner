import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DayTabs from '../components/itinerary/DayTabs';
import DayTimeline from '../components/itinerary/DayTimeline';
import BudgetSummary from '../components/itinerary/BudgetSummary';
import WeatherAlert from '../components/itinerary/WeatherAlert';
import RouteMap from '../components/editorial/RouteMap';
import TravelButton from '../components/editorial/TravelButton';
import Modal from '../components/ui/Modal';
import itineraryService from '../services/itineraryService';
import { REALISTIC_PARIS_ITINERARY } from '../utils/mockItinerary';

export const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const generatedData = location.state?.generatedData;
  const initialCriteria = location.state?.criteria || {
    destination: generatedData?.destination || 'Paris, France',
    numberOfDays: generatedData?.numberOfDays || 5,
    budget: generatedData?.budget || 40000,
    interests: generatedData?.interests || ['Art', 'Architecture', 'Culture'],
  };

  // State
  const [destination, setDestination] = useState(
    generatedData?.destination || initialCriteria.destination
  );
  const [numberOfDays, setNumberOfDays] = useState(
    generatedData?.numberOfDays || initialCriteria.numberOfDays
  );
  const [budget, setBudget] = useState(
    generatedData?.budget || initialCriteria.budget
  );
  const [interests, setInterests] = useState(
    generatedData?.interests || initialCriteria.interests
  );

  const [tripId, setTripId] = useState(
    location.state?.tripId || location.state?.trip?._id || null
  );

  // Real Days state
  const [days, setDays] = useState(() => {
    if (generatedData?.itinerary && generatedData.itinerary.length > 0) {
      return generatedData.itinerary;
    }
    return REALISTIC_PARIS_ITINERARY;
  });

  const [activeDay, setActiveDay] = useState(1);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Too expensive');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(Boolean(location.state?.tripId || location.state?.trip?._id));
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize state if navigation state changes
  useEffect(() => {
    if (location.state?.tripId) {
      setTripId(location.state.tripId);
      setIsSaved(true);
    }
    if (location.state?.generatedData) {
      const data = location.state.generatedData;
      setDestination(data.destination);
      setNumberOfDays(data.numberOfDays);
      setBudget(data.budget);
      setInterests(data.interests);
      if (data.itinerary && data.itinerary.length > 0) {
        setDays(data.itinerary);
        setActiveDay(1);
        setSelectedStopIndex(0);
      }
    }
  }, [location.state]);

  // Aggregated dynamic metrics
  const totalSelectedStops = days.reduce(
    (acc, d) => acc + (d.stops?.length || 0),
    0
  );
  const totalEstimatedCost = days.reduce(
    (acc, d) => acc + (d.totalCost || 0),
    0
  );
  const totalEstimatedTravelKm = Number(
    days
      .reduce((acc, d) => acc + (d.totalDistanceKm || 0), 0)
      .toFixed(1)
  );

  // Current active day data
  const currentDayData =
    days.find((d) => d.dayNumber === activeDay) || days[0] || { stops: [] };

  const expenseBreakdown = {
    attractions: Math.round(totalEstimatedCost * 0.62),
    food: Math.round(totalEstimatedCost * 0.26),
    transport: Math.round(totalEstimatedCost * 0.12),
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Save or Update Trip action
  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to archive this journey to your journal.');
      setTimeout(() => navigate('/login', { state: { from: location } }), 1200);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      destination,
      days: numberOfDays,
      budget,
      interests,
      itinerary: days.map((d) => ({
        day: d.dayNumber,
        date: d.date || '',
        totalCost: d.totalCost || 0,
        totalTravelTime: d.totalTravelTimeMin || d.totalTravelTime || 0,
        stops: (d.stops || []).map((s) => ({
          attraction: s.name || s.attraction,
          startTime: s.startTime || '09:00',
          duration: s.durationMin || s.duration || 60,
          cost: s.cost || 0,
          coordinates: s.coordinates,
          category: Array.isArray(s.category) ? s.category[0] : s.category,
          rating: s.rating,
          openingHours: s.openingHours,
          travelToNext: s.travelToNext,
          weather: s.weather || 'clear',
        })),
      })),
    };

    try {
      if (tripId) {
        await itineraryService.updateTrip(tripId, payload);
        setIsSaved(true);
        showToast('Journal volume updated.');
      } else {
        const res = await itineraryService.saveTrip(payload);
        if (res?.data?._id) {
          setTripId(res.data._id);
        }
        setIsSaved(true);
        showToast('Archived in My Journal.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to archive journey.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Regenerate single day action
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setIsRegenerateModalOpen(false);
    setErrorMessage('');

    const dayBudgetRemaining = Math.max(
      1000,
      Math.round(budget / numberOfDays)
    );

    try {
      const response = await itineraryService.regenerateDay({
        destination,
        dayNumber: activeDay,
        reason: selectedReason,
        budgetRemaining: dayBudgetRemaining,
        existingDays: days,
        interests,
      });

      if (response?.updatedDay) {
        setDays((prevDays) =>
          prevDays.map((d) =>
            d.dayNumber === activeDay ? response.updatedDay : d
          )
        );
        showToast(`Day 0${activeDay} re-composed around "${selectedReason}"`);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to re-compose day.'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-[#18181f] text-[#f5f2eb] font-mono text-xs border border-[#7a5293] shadow-editorial flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#7a5293]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-950/20 border border-red-800/40 text-xs font-mono text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Top Dispatch Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-[#23232c] mb-8">
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#9e9a91] hover:text-[#f5f2eb] uppercase transition-colors"
        >
          <span>←</span>
          <span>EDIT PARAMETERS</span>
        </Link>

        <div className="flex items-center gap-4">
          <TravelButton
            variant={isSaved ? 'solid' : 'violet'}
            arrow={false}
            onClick={handleSaveTrip}
            disabled={isSaving}
          >
            {isSaving ? 'ARCHIVING...' : isSaved ? '✓ ARCHIVED IN JOURNAL' : 'SAVE TO JOURNAL +'}
          </TravelButton>
        </div>
      </div>

      {/* Editorial Journal Headline Section */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase font-semibold">
            EXPEDITION DOSSIER
          </span>
          <span className="text-[#32323e] text-xs">/</span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-[#9e9a91] uppercase">
            {numberOfDays} DAYS · ₹{budget?.toLocaleString()} BUDGET
          </span>
        </div>

        <h1 className="font-serif-headline text-5xl sm:text-6xl lg:text-7xl text-[#f5f2eb] mb-4">
          {destination}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#5c5851] uppercase tracking-wider pt-2 border-t border-[#1c1c23]">
          <span>{totalSelectedStops} CURATED WAYPOINTS</span>
          <span>·</span>
          <span>EST. {totalEstimatedTravelKm} KM TRANSIT</span>
          <span>·</span>
          <span>TAGS: {interests?.join(', ')}</span>
        </div>
      </section>

      {/* Day Navigation Tabs */}
      <DayTabs
        days={days}
        activeDay={activeDay}
        onSelectDay={(dayNum) => {
          setActiveDay(dayNum);
          setSelectedStopIndex(0);
        }}
      />

      {/* Two-Column Asymmetrical Grid: Journal Timeline (7 cols) + Cartographic Route (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Visual Journal Entries */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Meteorological Notice */}
          <WeatherAlert
            rainForecast="Afternoon cloud cover with scattered showers expected near 15:00"
            originalRoute="Outdoor gardens & rooftop terraces"
            updatedRoute="Covered passages, museum galleries & tea salons"
          />

          {/* Sequential Journal Stops */}
          <DayTimeline
            day={currentDayData}
            destination={destination}
            activeDay={activeDay}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={setSelectedStopIndex}
            onRegenerateDay={() => setIsRegenerateModalOpen(true)}
            isRegenerating={isRegenerating}
          />

          {/* Expedition Ledger */}
          <BudgetSummary
            totalBudget={budget}
            estimatedCost={totalEstimatedCost}
            breakdown={expenseBreakdown}
          />
        </div>

        {/* Right Column: Dark Cinematic Route Map (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <RouteMap
            stops={currentDayData.stops || []}
            destination={destination}
            activeDay={activeDay}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={setSelectedStopIndex}
          />
        </div>
      </div>

      {/* Minimal Re-compose Modal */}
      <Modal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        title={`Re-compose Day 0${activeDay}`}
      >
        <div className="flex flex-col gap-5 pt-2">
          <p className="font-serif italic text-sm text-[#9e9a91]">
            Select an intentional focus to adjust the pacing and selection of Day 0{activeDay}.
          </p>

          <div className="flex flex-col gap-2 font-mono text-xs">
            {[
              'Slower pace & more cafe culture',
              'Architecture & historic landmarks',
              'Local culinary highlights & markets',
              'Parks, gardens & quiet natural spaces',
              'Art galleries & covered passages',
              'Budget-conscious walking route',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 p-3 bg-[#141418] hover:bg-[#1a1a20] border border-[#23232c] cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="regenerateReason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-[#7a5293]"
                />
                <span className="text-[#f5f2eb]">{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c1c23]">
            <TravelButton
              variant="ghost"
              onClick={() => setIsRegenerateModalOpen(false)}
            >
              CANCEL
            </TravelButton>
            <TravelButton
              variant="solid"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? 'RE-COMPOSING...' : 'APPLY TO JOURNAL'}
            </TravelButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItineraryPage;
