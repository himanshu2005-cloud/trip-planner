import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Calendar, Share2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DayTabs from '../components/itinerary/DayTabs';
import DayTimeline from '../components/itinerary/DayTimeline';
import BudgetSummary from '../components/itinerary/BudgetSummary';
import WeatherAlert from '../components/itinerary/WeatherAlert';
import RouteMap from '../components/editorial/RouteMap';
import TravelButton from '../components/editorial/TravelButton';
import Modal from '../components/ui/Modal';
import AddStopModal from '../components/itinerary/AddStopModal';
import ShareTripModal from '../components/itinerary/ShareTripModal';
import itineraryService from '../services/itineraryService';
import { getItineraryForDestination, REALISTIC_JAIPUR_ITINERARY } from '../utils/mockItinerary';
import { downloadIcsCalendar } from '../utils/calendarExport';
import { getGoogleMapsMultiStopUrl } from '../utils/mapsNavigation';

export const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const generatedData = location.state?.generatedData;
  const initialCriteria = location.state?.criteria || {
    destination: generatedData?.destination || 'Jaipur, Rajasthan',
    numberOfDays: generatedData?.numberOfDays || 4,
    budget: generatedData?.budget || 24000,
    interests: generatedData?.interests || ['Heritage', 'Forts', 'Architecture'],
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

  // Real Days state: dynamically resolved to match the chosen destination!
  const [days, setDays] = useState(() => {
    if (generatedData?.itinerary && generatedData.itinerary.length > 0) {
      return generatedData.itinerary;
    }
    const currentDest =
      generatedData?.destination ||
      initialCriteria?.destination ||
      location.state?.criteria?.destination ||
      'Jaipur, Rajasthan';
    return getItineraryForDestination(currentDest);
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Synchronize state if navigation state changes
  useEffect(() => {
    if (location.state?.tripId) {
      setTripId(location.state.tripId);
      setIsSaved(true);
    }

    const targetDest =
      location.state?.generatedData?.destination ||
      location.state?.criteria?.destination;

    if (targetDest) {
      setDestination(targetDest);
    }

    const stateCrit = location.state?.criteria;
    if (stateCrit?.numberOfDays) {
      setNumberOfDays(stateCrit.numberOfDays);
    }
    if (stateCrit?.budget) {
      setBudget(stateCrit.budget);
    }
    if (stateCrit?.interests) {
      setInterests(stateCrit.interests);
    }

    if (location.state?.generatedData?.itinerary?.length > 0) {
      setDays(location.state.generatedData.itinerary);
      setActiveDay(1);
      setSelectedStopIndex(0);
    } else if (targetDest) {
      setDays(getItineraryForDestination(targetDest));
      setActiveDay(1);
      setSelectedStopIndex(0);
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
      showToast('Please sign in to save this trip to your profile.');
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
        showToast('Trip itinerary updated.');
      } else {
        const res = await itineraryService.saveTrip(payload);
        if (res?.data?._id) {
          setTripId(res.data._id);
        }
        setIsSaved(true);
        showToast('Saved to My Trips!');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to save itinerary.'
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
        showToast(`Day 0${activeDay} re-optimized around "${selectedReason}"`);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to re-optimize day.'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  // Add stop to current active day
  const handleAddStop = (newStop) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.dayNumber !== activeDay) return d;
        const updatedStops = [...(d.stops || []), newStop];
        const newTotalCost = updatedStops.reduce((sum, s) => sum + (s.cost || 0), 0);
        return {
          ...d,
          stops: updatedStops,
          totalCost: newTotalCost,
        };
      })
    );
    showToast(`Added "${newStop.name}" to Day 0${activeDay}`);
  };

  // Delete stop from current active day
  const handleDeleteStop = (stopIndex) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.dayNumber !== activeDay) return d;
        const updatedStops = d.stops.filter((_, idx) => idx !== stopIndex);
        const newTotalCost = updatedStops.reduce((sum, s) => sum + (s.cost || 0), 0);
        return {
          ...d,
          stops: updatedStops,
          totalCost: newTotalCost,
        };
      })
    );
    showToast(`Waypoint removed from Day 0${activeDay}`);
  };

  // Move stop up or down in current active day
  const handleMoveStop = (stopIndex, direction) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.dayNumber !== activeDay) return d;
        const stopsCopy = [...(d.stops || [])];
        const targetIndex = direction === 'up' ? stopIndex - 1 : stopIndex + 1;
        if (targetIndex < 0 || targetIndex >= stopsCopy.length) return d;

        const temp = stopsCopy[stopIndex];
        stopsCopy[stopIndex] = stopsCopy[targetIndex];
        stopsCopy[targetIndex] = temp;

        return {
          ...d,
          stops: stopsCopy,
        };
      })
    );
  };

  // Export calendar (.ics) file
  const handleExportCalendar = () => {
    downloadIcsCalendar({ destination, days });
    showToast('Downloaded .ics calendar file for Apple/Google Calendar');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 dark:bg-[#18181f] bg-white dark:text-[#f5f2eb] text-[#18181c] font-mono text-xs border border-[#7a5293] shadow-editorial flex items-center gap-3">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b dark:border-[#23232c] border-[#e2dbcd] gap-4 mb-8">
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider dark:text-[#9e9a91] text-[#635f56] dark:hover:text-[#f5f2eb] hover:text-[#18181c] uppercase transition-colors"
        >
          <span>←</span>
          <span>EDIT TRIP PARAMETERS</span>
        </Link>

        {/* Real-world Action Buttons: Maps, Calendar, Share, Save */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* 🗺️ 1-Click Google Maps Multi-Stop Navigation */}
          <a
            href={getGoogleMapsMultiStopUrl(destination, currentDayData.stops)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6D3FD9] hover:bg-[#5b2fb8] text-white text-xs font-mono font-medium tracking-wider uppercase transition-all shadow-sm cursor-pointer"
            title="Open Day in Google Maps Navigation"
          >
            <MapPin size={13} />
            <span>Open in Google Maps ↗</span>
          </a>

          {/* Calendar Sync */}
          <button
            type="button"
            onClick={handleExportCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border dark:border-[#2a2a36] border-[#ded7ca] dark:bg-[#15151c] bg-[#f6f2ea] text-xs font-mono dark:text-[#9e9a91] text-[#635f56] dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-all cursor-pointer shadow-sm"
            title="Download .ics Calendar File"
          >
            <Calendar size={13} />
            <span className="hidden sm:inline">Calendar (.ics)</span>
          </button>

          {/* WhatsApp / Public Share */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border dark:border-[#2a2a36] border-[#ded7ca] dark:bg-[#15151c] bg-[#f6f2ea] text-xs font-mono dark:text-[#9e9a91] text-[#635f56] dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-all cursor-pointer shadow-sm"
            title="Share Itinerary"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>

          <TravelButton
            variant={isSaved ? 'solid' : 'violet'}
            arrow={false}
            onClick={handleSaveTrip}
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : isSaved ? '✓ SAVED' : 'SAVE ITINERARY +'}
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
            onMoveStop={handleMoveStop}
            onDeleteStop={handleDeleteStop}
            onOpenAddModal={() => setIsAddModalOpen(true)}
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
              {isRegenerating ? 'RE-OPTIMIZING...' : 'UPDATE DAY ITINERARY'}
            </TravelButton>
          </div>
        </div>
      </Modal>
      {/* Add Custom/Recommended Stop Modal */}
      <AddStopModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStop={handleAddStop}
        dayNumber={activeDay}
        destination={destination}
      />

      {/* Share Trip Modal (WhatsApp & Public Link) */}
      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        destination={destination}
        days={days}
        budget={budget}
      />
    </div>
  );
};

export default ItineraryPage;
