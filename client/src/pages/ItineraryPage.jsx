import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

const MOCK_DAYS = [
  {
    dayNumber: 1,
    title: 'Historic Core & Royal Heritage',
    totalCost: 2750,
    totalTravelTime: 45,
    stops: [
      {
        attractionId: 'stop-1',
        name: 'Louvre Museum',
        category: 'History & Art',
        rating: 4.8,
        startTime: '09:00',
        duration: 150,
        cost: 1800,
        openingHours: { open: '09:00', close: '18:00' },
        travelToNext: { distanceKm: 1.2, durationMinutes: 15 },
        coordinates: { lat: 48.8606, lng: 2.3376 },
      },
      {
        attractionId: 'stop-2',
        name: 'Palais-Royal Gardens',
        category: 'Nature & Architecture',
        rating: 4.6,
        startTime: '12:00',
        duration: 60,
        cost: 0,
        openingHours: { open: '08:30', close: '20:30' },
        travelToNext: { distanceKm: 0.8, durationMinutes: 10 },
        coordinates: { lat: 48.8648, lng: 2.3378 },
      },
      {
        attractionId: 'stop-3',
        name: 'Sainte-Chapelle',
        category: 'Gothic Architecture',
        rating: 4.7,
        startTime: '13:30',
        duration: 75,
        cost: 950,
        openingHours: { open: '09:00', close: '17:00' },
        travelToNext: null,
        coordinates: { lat: 48.8554, lng: 2.345 },
      },
    ],
  },
  {
    dayNumber: 2,
    title: 'Montmartre & Bohemian Quarter',
    totalCost: 1500,
    totalTravelTime: 40,
    stops: [
      {
        attractionId: 'stop-4',
        name: 'Sacré-Cœur Basilica',
        category: 'Architecture',
        rating: 4.7,
        startTime: '09:30',
        duration: 90,
        cost: 0,
        openingHours: { open: '06:30', close: '22:30' },
        travelToNext: { distanceKm: 0.5, durationMinutes: 8 },
        coordinates: { lat: 48.8867, lng: 2.3431 },
      },
      {
        attractionId: 'stop-5',
        name: 'Place du Tertre Artists Square',
        category: 'Art & Culture',
        rating: 4.5,
        startTime: '11:15',
        duration: 60,
        cost: 0,
        openingHours: { open: '09:00', close: '20:00' },
        travelToNext: { distanceKm: 1.4, durationMinutes: 20 },
        coordinates: { lat: 48.8865, lng: 2.3408 },
      },
      {
        attractionId: 'stop-6',
        name: 'Musée de la Vie Romantique',
        category: 'Art Museum',
        rating: 4.6,
        startTime: '13:00',
        duration: 75,
        cost: 1500,
        openingHours: { open: '10:00', close: '18:00' },
        travelToNext: null,
        coordinates: { lat: 48.8812, lng: 2.3338 },
      },
    ],
  },
  {
    dayNumber: 3,
    title: 'Seine River & Eiffel Views',
    totalCost: 3200,
    totalTravelTime: 50,
    stops: [
      {
        attractionId: 'stop-7',
        name: 'Eiffel Tower Summit',
        category: 'Monument',
        rating: 4.7,
        startTime: '09:00',
        duration: 120,
        cost: 2600,
        openingHours: { open: '09:00', close: '23:45' },
        travelToNext: { distanceKm: 1.1, durationMinutes: 15 },
        coordinates: { lat: 48.8584, lng: 2.2945 },
      },
      {
        attractionId: 'stop-8',
        name: 'Champ de Mars Park',
        category: 'Nature',
        rating: 4.6,
        startTime: '11:30',
        duration: 45,
        cost: 0,
        openingHours: { open: '00:00', close: '23:59' },
        travelToNext: { distanceKm: 0.9, durationMinutes: 12 },
        coordinates: { lat: 48.8556, lng: 2.2986 },
      },
      {
        attractionId: 'stop-9',
        name: 'Musée Rodin Sculpture Garden',
        category: 'Art & Sculpture',
        rating: 4.7,
        startTime: '13:00',
        duration: 90,
        cost: 600,
        openingHours: { open: '10:00', close: '18:30' },
        travelToNext: null,
        coordinates: { lat: 48.8553, lng: 2.3158 },
      },
    ],
  },
];

export const ItineraryPage = () => {
  const location = useLocation();
  const criteria = location.state?.criteria || {
    destination: 'Paris, France',
    numberOfDays: 3,
    budget: 35000,
  };

  const [activeDay, setActiveDay] = useState(1);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Too expensive');
  const [saved, setSaved] = useState(false);

  const currentDayData =
    MOCK_DAYS.find((d) => d.dayNumber === activeDay) || MOCK_DAYS[0];

  const handleRegenerate = () => {
    setIsRegenerateModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      {/* ── Top Navigation & Actions Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/plan"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Edit Parameters</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={saved ? 'secondary' : 'primary'}
            onClick={() => setSaved(!saved)}
          >
            <Bookmark size={14} className={saved ? 'fill-purple-400 text-purple-400' : ''} />
            <span>{saved ? 'Saved to My Trips' : 'Save Itinerary'}</span>
          </Button>
        </div>
      </div>

      {/* ── Header Summary Card (DESIGN.md §11) ────────────────────────────── */}
      <Card className="p-6 border-purple-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple">Optimized Schedule</Badge>
              <span className="text-xs text-text-muted">Algorithm Version 1.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {criteria.destination}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {criteria.numberOfDays} Days · ₹{criteria.budget?.toLocaleString()} Budget
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Analyzed</span>
              <p className="text-base font-bold text-text-primary">42 Places</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Selected</span>
              <p className="text-base font-bold text-purple-400">9 Stops</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Est. Travel</span>
              <p className="text-base font-bold text-accent-blue">8.4 km</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Est. Cost</span>
              <p className="text-base font-bold text-success">₹7,450</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Day Navigation Tabs (DESIGN.md §12) ─────────────────────────────── */}
      <DayTabs
        days={MOCK_DAYS}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
      />

      {/* ── Main Two-Column Layout (DESIGN.md §14: Day Itinerary + Map) ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline, Budget & Weather (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <WeatherAlert
            message="Partly sunny with light breeze — perfect conditions for outdoor walking."
            details="All outdoor stops remain safely scheduled in morning slots."
          />

          <DayTimeline
            day={currentDayData}
            onRegenerateDay={() => setIsRegenerateModalOpen(true)}
          />

          <BudgetSummary
            totalBudget={criteria.budget || 35000}
            estimatedCost={7450}
          />
        </div>

        {/* Right Column: Interactive Route Map (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ItineraryMap
            stops={currentDayData.stops}
            destination={criteria.destination}
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
            Why do you want to re-plan Day {activeDay}? Other days will not be affected.
          </p>

          <div className="flex flex-col gap-2">
            {[
              'Too expensive',
              'Too much travel',
              'More food & dining',
              'More nature & parks',
              'More indoor activities',
              'Weather changed',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2.5 text-xs text-text-primary p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer border border-white/[0.06]"
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

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08] mt-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRegenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItineraryPage;
