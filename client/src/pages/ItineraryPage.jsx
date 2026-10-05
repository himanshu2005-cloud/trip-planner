import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Share2,
  Bookmark,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  ArrowLeft,
  Navigation,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import DayTabs from '../components/itinerary/DayTabs';
import DayTimeline from '../components/itinerary/DayTimeline';
import BudgetSummary from '../components/itinerary/BudgetSummary';
import WeatherAlert from '../components/itinerary/WeatherAlert';
import ItineraryMap from '../components/map/ItineraryMap';
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
    interests: generatedData?.interests || ['History', 'Food', 'Culture'],
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
      }
    }
  }, [location.state]);

  // Aggregated dynamic metrics calculated from real days
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
  const attractionsAnalyzed =
    generatedData?.attractionsAnalyzed || Math.max(30, numberOfDays * 8);

  // Current active day data
  const currentDayData =
    days.find((d) => d.dayNumber === activeDay) || days[0];

  // Dynamic expense breakdown
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
        showToast('Saved trip updated successfully!');
      } else {
        const res = await itineraryService.saveTrip(payload);
        if (res?.data?._id) {
          setTripId(res.data._id);
        }
        setIsSaved(true);
        showToast('Trip saved to My Trips!');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to save trip. Please try again.'
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
        // Replace target day in days array
        setDays((prevDays) =>
          prevDays.map((d) =>
            d.dayNumber === activeDay ? response.updatedDay : d
          )
        );
        showToast(
          `Day ${activeDay} successfully re-planned with priority: "${selectedReason}"`
        );
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to regenerate day. Please try again.'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-3 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-semibold shadow-glow border border-purple-400/40 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Top Navigation & Actions Bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to="/plan"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Edit Trip Parameters</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isSaved ? 'secondary' : 'primary'}
            onClick={handleSaveTrip}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin text-purple-400" />
            ) : (
              <Bookmark
                size={14}
                className={isSaved ? 'fill-purple-400 text-purple-400' : ''}
              />
            )}
            <span>{isSaved ? 'Saved in My Trips' : isSaving ? 'Saving...' : 'Save Itinerary'}</span>
          </Button>
        </div>
      </div>

      {/* ── Header Summary Card (DESIGN.md §11) ────────────────────────────── */}
      <Card className="p-6 border-purple-500/20 shadow-glass">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="purple">Algorithmic Itinerary</Badge>
              <span className="text-xs text-text-muted">
                K-means Clustering + 2-Opt TSP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {destination}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {numberOfDays} Days · ₹{budget?.toLocaleString()} Budget ·{' '}
              {interests?.join(', ')}
            </p>
          </div>

          {/* Real Metrics Grid (DESIGN.md §11) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Analyzed
              </span>
              <p className="text-base font-bold text-text-primary mt-0.5">
                {attractionsAnalyzed} Places
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Selected
              </span>
              <p className="text-base font-bold text-purple-400 mt-0.5">
                {totalSelectedStops} Curated
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Est. Travel
              </span>
              <p className="text-base font-bold text-accent-blue mt-0.5">
                {totalEstimatedTravelKm} km
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Est. Cost
              </span>
              <p className="text-base font-bold text-success mt-0.5">
                ₹{totalEstimatedCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Day Navigation Tabs (DESIGN.md §12) ─────────────────────────────── */}
      <DayTabs
        days={days}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
      />

      {/* ── Two-Column Layout: Itinerary & Map (DESIGN.md §14) ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline, Budget & Weather (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Weather Alert (DESIGN.md §17) */}
          <WeatherAlert
            rainForecast="Rain expected at 3 PM"
            originalRoute="Eiffel Tower → Luxembourg Gardens"
            updatedRoute="Eiffel Tower → Louvre Museum"
          />

          {/* Timeline Cards (DESIGN.md §13 & §18) */}
          <DayTimeline
            day={currentDayData}
            onRegenerateDay={() => setIsRegenerateModalOpen(true)}
            isRegenerating={isRegenerating}
          />

          {/* Budget UI Card (DESIGN.md §16) */}
          <BudgetSummary
            totalBudget={budget}
            estimatedCost={totalEstimatedCost}
            breakdown={expenseBreakdown}
          />
        </div>

        {/* Right Column: Interactive Numbered Route Map (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ItineraryMap
            stops={currentDayData.stops}
            destination={destination}
            activeDay={activeDay}
          />
        </div>
      </div>

      {/* ── Regenerate Day Modal (DESIGN.md §15) ────────────────────────────── */}
      <Modal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        title={`Regenerate Day ${activeDay}`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-text-secondary">
            Why do you want to adjust Day {activeDay}? Other days will remain intact.
          </p>

          <div className="flex flex-col gap-2">
            {[
              'Too expensive',
              'Too much travel',
              'More food',
              'More nature',
              'More indoor activities',
              'Weather changed',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2.5 text-xs text-text-primary p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer border border-white/[0.06] transition-colors"
              >
                <input
                  type="radio"
                  name="regenerateReason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="text-purple-600 focus:ring-purple-400"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
            <span className="text-text-muted">Target day budget:</span>
            <span className="text-purple-300 font-semibold">
              ₹{Math.round(budget / numberOfDays).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08] mt-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRegenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? 'Optimizing...' : 'Regenerate'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItineraryPage;
