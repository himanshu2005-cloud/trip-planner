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
  Layers,
  CheckCircle2,
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

export const REALISTIC_PARIS_ITINERARY = [
  {
    dayNumber: 1,
    title: 'Historic Core & Royal Heritage',
    endTime: '18:30',
    totalCost: 2750,
    totalTravelTime: 45,
    stops: [
      {
        attractionId: 'stop-1',
        name: 'Louvre Museum',
        category: 'History · Art',
        rating: 4.8,
        startTime: '09:00',
        duration: 150,
        cost: 1800,
        openingHours: { open: '09:00', close: '18:00' },
        travelToNext: { distanceKm: 1.2, durationMinutes: 18 },
        coordinates: { lat: 48.8606, lng: 2.3376 },
      },
      {
        attractionId: 'stop-2',
        name: 'Palais-Royal Gardens',
        category: 'Nature & Parks',
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
        name: 'Café Lunch & Sainte-Chapelle',
        category: 'Architecture',
        rating: 4.7,
        startTime: '13:30',
        duration: 75,
        cost: 950,
        openingHours: { open: '09:00', close: '17:00' },
        travelToNext: { distanceKm: 0.5, durationMinutes: 7 },
        coordinates: { lat: 48.8554, lng: 2.345 },
      },
      {
        attractionId: 'stop-4',
        name: 'Notre-Dame Cathedral Parvis',
        category: 'History & Culture',
        rating: 4.8,
        startTime: '15:00',
        duration: 90,
        cost: 0,
        openingHours: { open: '08:00', close: '18:45' },
        travelToNext: null,
        coordinates: { lat: 48.8529, lng: 2.3499 },
      },
    ],
  },
  {
    dayNumber: 2,
    title: 'Historic Paris & River Monuments',
    endTime: '19:00',
    totalCost: 3200,
    totalTravelTime: 42,
    stops: [
      {
        attractionId: 'stop-5',
        name: 'Musée d’Orsay',
        category: 'Art & Impressionism',
        rating: 4.8,
        startTime: '09:30',
        duration: 120,
        cost: 1600,
        openingHours: { open: '09:30', close: '18:00' },
        travelToNext: { distanceKm: 1.1, durationMinutes: 15 },
        coordinates: { lat: 48.8599, lng: 2.3265 },
      },
      {
        attractionId: 'stop-6',
        name: 'Tuileries Garden Stroll',
        category: 'Nature & Parks',
        rating: 4.6,
        startTime: '12:00',
        duration: 60,
        cost: 0,
        openingHours: { open: '07:00', close: '21:00' },
        travelToNext: { distanceKm: 1.4, durationMinutes: 18 },
        coordinates: { lat: 48.8638, lng: 2.3275 },
      },
      {
        attractionId: 'stop-7',
        name: 'Place de la Concorde & Tea',
        category: 'Food & Dining',
        rating: 4.5,
        startTime: '13:30',
        duration: 75,
        cost: 1600,
        openingHours: { open: '09:00', close: '20:00' },
        travelToNext: null,
        coordinates: { lat: 48.8656, lng: 2.3212 },
      },
    ],
  },
  {
    dayNumber: 3,
    title: 'Iconic Landmarks & River Views',
    endTime: '20:30',
    totalCost: 3400,
    totalTravelTime: 52,
    stops: [
      {
        attractionId: 'stop-8',
        name: 'Eiffel Tower Summit',
        category: 'Architecture',
        rating: 4.7,
        startTime: '09:00',
        duration: 120,
        cost: 2600,
        openingHours: { open: '09:00', close: '23:45' },
        travelToNext: { distanceKm: 0.9, durationMinutes: 12 },
        coordinates: { lat: 48.8584, lng: 2.2945 },
      },
      {
        attractionId: 'stop-9',
        name: 'Champ de Mars Garden Picnic',
        category: 'Nature',
        rating: 4.6,
        startTime: '11:30',
        duration: 60,
        cost: 800,
        openingHours: { open: '00:00', close: '23:59' },
        travelToNext: { distanceKm: 1.3, durationMinutes: 18 },
        coordinates: { lat: 48.8556, lng: 2.2986 },
      },
      {
        attractionId: 'stop-10',
        name: 'Musée Rodin Sculptures',
        category: 'Art & Sculpture',
        rating: 4.7,
        startTime: '13:30',
        duration: 90,
        cost: 0,
        openingHours: { open: '10:00', close: '18:30' },
        travelToNext: null,
        coordinates: { lat: 48.8553, lng: 2.3158 },
      },
    ],
  },
  {
    dayNumber: 4,
    title: 'Bohemian Montmartre & Vistas',
    endTime: '18:00',
    totalCost: 1850,
    totalTravelTime: 38,
    stops: [
      {
        attractionId: 'stop-11',
        name: 'Sacré-Cœur Basilica',
        category: 'Architecture',
        rating: 4.7,
        startTime: '09:30',
        duration: 90,
        cost: 0,
        openingHours: { open: '06:30', close: '22:30' },
        travelToNext: { distanceKm: 0.4, durationMinutes: 6 },
        coordinates: { lat: 48.8867, lng: 2.3431 },
      },
      {
        attractionId: 'stop-12',
        name: 'Place du Tertre Artists',
        category: 'Art & Culture',
        rating: 4.5,
        startTime: '11:15',
        duration: 75,
        cost: 1100,
        openingHours: { open: '09:00', close: '20:00' },
        travelToNext: { distanceKm: 0.8, durationMinutes: 12 },
        coordinates: { lat: 48.8865, lng: 2.3408 },
      },
      {
        attractionId: 'stop-13',
        name: 'Musée de la Vie Romantique',
        category: 'Culture',
        rating: 4.6,
        startTime: '13:00',
        duration: 60,
        cost: 750,
        openingHours: { open: '10:00', close: '18:00' },
        travelToNext: null,
        coordinates: { lat: 48.8812, lng: 2.3338 },
      },
    ],
  },
  {
    dayNumber: 5,
    title: 'Latin Quarter & Garden Pavilions',
    endTime: '17:30',
    totalCost: 1950,
    totalTravelTime: 35,
    stops: [
      {
        attractionId: 'stop-14',
        name: 'Panthéon de Paris',
        category: 'History',
        rating: 4.7,
        startTime: '10:00',
        duration: 90,
        cost: 1150,
        openingHours: { open: '10:00', close: '18:00' },
        travelToNext: { distanceKm: 0.6, durationMinutes: 8 },
        coordinates: { lat: 48.8462, lng: 2.3464 },
      },
      {
        attractionId: 'stop-15',
        name: 'Jardin du Luxembourg',
        category: 'Nature & Parks',
        rating: 4.8,
        startTime: '12:00',
        duration: 90,
        cost: 0,
        openingHours: { open: '07:30', close: '21:30' },
        travelToNext: { distanceKm: 0.7, durationMinutes: 10 },
        coordinates: { lat: 48.8462, lng: 2.3372 },
      },
      {
        attractionId: 'stop-16',
        name: 'Shakespeare & Company Bookstore',
        category: 'Shopping & Culture',
        rating: 4.6,
        startTime: '14:00',
        duration: 60,
        cost: 800,
        openingHours: { open: '10:00', close: '20:00' },
        travelToNext: null,
        coordinates: { lat: 48.8526, lng: 2.3471 },
      },
    ],
  },
];

export const ItineraryPage = () => {
  const location = useLocation();
  const criteria = location.state?.criteria || {
    destination: 'Paris, France',
    numberOfDays: 5,
    budget: 40000,
  };

  const [activeDay, setActiveDay] = useState(1);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Too expensive');
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const currentDayData =
    REALISTIC_PARIS_ITINERARY.find((d) => d.dayNumber === activeDay) ||
    REALISTIC_PARIS_ITINERARY[0];

  const handleSaveTrip = () => {
    setIsSaved(true);
    setToastMessage('Trip saved to My Trips!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRegenerate = () => {
    setIsRegenerateModalOpen(false);
    setToastMessage(`Day ${activeDay} regenerated with: ${selectedReason}`);
    setTimeout(() => setToastMessage(''), 3500);
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

      {/* ── Top Bar: Breadcrumb & Save Action ───────────────────────────────── */}
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
          >
            <Bookmark size={14} className={isSaved ? 'fill-purple-400 text-purple-400' : ''} />
            <span>{isSaved ? 'Saved in My Trips' : 'Save Itinerary'}</span>
          </Button>
        </div>
      </div>

      {/* ── Header Summary Card (DESIGN.md §11) ────────────────────────────── */}
      <Card className="p-6 border-purple-500/20 shadow-glass">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="purple">Algorithmic Itinerary</Badge>
              <span className="text-xs text-text-muted">K-means + 2-Opt TSP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {criteria.destination}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {criteria.numberOfDays} Days · ₹{criteria.budget?.toLocaleString()} Budget
            </p>
          </div>

          {/* Compact Glass Metrics Cards (DESIGN.md §11) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Analyzed
              </span>
              <p className="text-base font-bold text-text-primary mt-0.5">42 Places</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Selected
              </span>
              <p className="text-base font-bold text-purple-400 mt-0.5">18 Curated</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Est. Travel
              </span>
              <p className="text-base font-bold text-accent-blue mt-0.5">32.4 km</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                Est. Cost
              </span>
              <p className="text-base font-bold text-success mt-0.5">₹36,850</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Day Navigation Tabs (DESIGN.md §12) ─────────────────────────────── */}
      <DayTabs
        days={REALISTIC_PARIS_ITINERARY}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
      />

      {/* ── Two-Column Itinerary & Map Layout (DESIGN.md §14) ───────────────── */}
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
          />

          {/* Budget UI Card (DESIGN.md §16) */}
          <BudgetSummary
            totalBudget={criteria.budget || 40000}
            estimatedCost={36850}
            breakdown={{
              attractions: 22400,
              food: 9850,
              transport: 4600,
            }}
          />
        </div>

        {/* Right Column: Numbered Route Map (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ItineraryMap
            stops={currentDayData.stops}
            destination={criteria.destination}
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

          {/* Options from DESIGN.md §15 */}
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
            <span className="text-text-muted">Budget remaining for this day:</span>
            <span className="text-purple-300 font-semibold">₹8,200</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08] mt-1">
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
