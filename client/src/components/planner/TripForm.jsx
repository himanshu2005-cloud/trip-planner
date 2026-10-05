import React, { useState } from 'react';

const POPULAR_INDIAN_DESTINATIONS = [
  { name: 'Varanasi, Uttar Pradesh', label: 'Varanasi', icon: '🛕' },
  { name: 'Jaipur, Rajasthan', label: 'Jaipur', icon: '🏰' },
  { name: 'Alleppey & Munnar, Kerala', label: 'Kerala Backwaters', icon: '🌴' },
  { name: 'Udaipur, Rajasthan', label: 'Udaipur', icon: '🌊' },
  { name: 'Leh & Nubra Valley, Ladakh', label: 'Ladakh', icon: '🏔️' },
  { name: 'Old Goa & South Beaches', label: 'Goa', icon: '⛵' },
  { name: 'Hampi, Karnataka', label: 'Hampi', icon: '🏛️' },
  { name: 'Rishikesh, Uttarakhand', label: 'Rishikesh', icon: '🧘' },
];

const DURATION_PRESETS = [
  { days: 3, title: '3 Days', subtitle: 'Weekend Escape' },
  { days: 5, title: '5 Days', subtitle: 'Classic Circuit' },
  { days: 7, title: '7 Days', subtitle: 'Deep Heritage' },
  { days: 10, title: '10 Days', subtitle: 'Grand Expedition' },
];

const BUDGET_PRESETS = [
  { amount: 15000, label: '₹15,000', tier: 'Budget Explorer', note: 'Hostels, autos, street thalis' },
  { amount: 35000, label: '₹35,000', tier: 'Heritage Haveli', note: 'AC cabs, boutique stays, tickets' },
  { amount: 75000, label: '₹75,000', tier: 'Royal Palace Dossier', note: 'Palace resorts, private chauffeur' },
];

const INDIAN_INTERESTS = [
  'Heritage & Fortresses',
  'Spiritual & River Ghats',
  'Misty Tea & Backwaters',
  'High Himalayan Passes',
  'Regional Cuisine & Street Food',
  'Ancient Stepwells & Temple Art',
  'Artisan Silk & Handlooms',
  'Wildlife & Bird Sanctuaries',
];

export const TripForm = ({ onSubmit, initialValues = {}, isLoading = false }) => {
  const [destination, setDestination] = useState(
    initialValues.destination || 'Jaipur, Rajasthan'
  );
  const [numberOfDays, setNumberOfDays] = useState(
    initialValues.numberOfDays || 4
  );
  const [budget, setBudget] = useState(initialValues.budget || 28000);
  const [selectedInterests, setSelectedInterests] = useState(
    initialValues.interests || [
      'Heritage & Fortresses',
      'Regional Cuisine & Street Food',
      'Ancient Stepwells & Temple Art',
    ]
  );
  const [transitMode, setTransitMode] = useState('Vande Bharat / Express');
  const [errors, setErrors] = useState({});

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validate = () => {
    const errs = {};
    if (!destination.trim()) {
      errs.destination = 'Please provide an Indian destination';
    }
    if (!numberOfDays || numberOfDays < 1 || numberOfDays > 14) {
      errs.numberOfDays = 'Duration must be between 1 and 14 days';
    }
    if (!budget || budget <= 0) {
      errs.budget = 'Specify a target trip budget';
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
        interests: selectedInterests.length > 0 ? selectedInterests : ['General Indian Heritage'],
        transitMode,
      });
    }
  };

  const perDayCost = Math.round(budget / (numberOfDays || 1));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* ── 01 / Destination Section ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="destination"
            className="font-mono text-[11px] tracking-[0.22em] text-[#cebfdf] uppercase font-semibold flex items-center gap-2"
          >
            <span>01 / TARGET REGION OR CITY (INDIA)</span>
          </label>
          <span className="text-[11px] text-[#5c5851] font-mono">
            India only · Verified geographic coordinates
          </span>
        </div>

        <div className="relative">
          <input
            id="destination"
            type="text"
            placeholder="e.g. Varanasi, Uttar Pradesh or Munnar, Kerala"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="editorial-input text-lg sm:text-xl bg-[#0c0c0f] border-[#23232c] focus:border-[#7a5293] py-4 px-5 text-[#f5f2eb]"
            required
          />
        </div>
        {errors.destination && (
          <span className="text-xs font-mono text-red-400">
            {errors.destination}
          </span>
        )}

        {/* Quick Destination Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {POPULAR_INDIAN_DESTINATIONS.map((city) => {
            const isSelected = destination.toLowerCase().includes(city.label.toLowerCase());
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => setDestination(city.name)}
                className={`font-mono text-xs px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#432357] text-[#f5f2eb] border-[#7a5293]'
                    : 'bg-[#141418] text-[#9e9a91] border-[#23232c] hover:border-[#32323e] hover:text-[#f5f2eb]'
                }`}
              >
                <span>{city.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 02 & 03 / Duration & Budget Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 border-t border-[#1c1c23]">
        {/* Left: Duration Selector (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-[11px] tracking-[0.22em] text-[#cebfdf] uppercase font-semibold">
              02 / DURATION ({numberOfDays} DAYS)
            </label>
            <span className="text-[11px] text-[#5c5851] font-mono">
              1 — 14 days
            </span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            {DURATION_PRESETS.map((p) => {
              const isSelected = numberOfDays === p.days;
              return (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setNumberOfDays(p.days)}
                  className={`p-3 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                      : 'bg-[#141418] border-[#23232c] text-[#9e9a91] hover:border-[#32323e]'
                  }`}
                >
                  <span className="block font-semibold text-sm">{p.title}</span>
                  <span className="text-[10px] text-[#5c5851]">{p.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper / Direct numeric input */}
          <div className="flex items-center gap-3 mt-1 bg-[#141418] border border-[#23232c] p-2">
            <span className="text-xs font-mono text-[#5c5851] uppercase ml-2">CUSTOM DAYS:</span>
            <input
              type="number"
              min="1"
              max="14"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Number(e.target.value))}
              className="bg-transparent text-sm font-mono text-[#f5f2eb] outline-none w-16 text-center border-b border-[#7a5293]"
            />
            <span className="text-xs font-mono text-[#9e9a91]">days scheduled</span>
          </div>
          {errors.numberOfDays && (
            <span className="text-xs font-mono text-red-400">
              {errors.numberOfDays}
            </span>
          )}
        </div>

        {/* Right: Budget Selector (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-[11px] tracking-[0.22em] text-[#cebfdf] uppercase font-semibold">
              03 / ESTIMATED EXPEDITION BUDGET
            </label>
            <span className="text-xs font-mono text-[#cebfdf] font-semibold">
              ₹{budget.toLocaleString()} (₹{perDayCost.toLocaleString()} / day)
            </span>
          </div>

          {/* Budget Presets */}
          <div className="grid grid-cols-1 gap-2 font-mono text-xs">
            {BUDGET_PRESETS.map((b) => {
              const isSelected = budget === b.amount;
              return (
                <button
                  key={b.amount}
                  type="button"
                  onClick={() => setBudget(b.amount)}
                  className={`p-2.5 text-left border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                      : 'bg-[#141418] border-[#23232c] text-[#9e9a91] hover:border-[#32323e]'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{b.label}</span>
                    <span className="text-[11px] text-[#cebfdf]">— {b.tier}</span>
                  </div>
                  <span className="text-[10px] text-[#5c5851] hidden sm:inline">{b.note}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Budget Stepper */}
          <div className="flex items-center gap-3 mt-1 bg-[#141418] border border-[#23232c] p-2">
            <span className="text-xs font-mono text-[#5c5851] uppercase ml-2">CUSTOM BUDGET: ₹</span>
            <input
              type="number"
              min="2000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="bg-transparent text-sm font-mono text-[#f5f2eb] outline-none flex-1 border-b border-[#7a5293]"
            />
            <span className="text-xs font-mono text-[#9e9a91]">INR</span>
          </div>
          {errors.budget && (
            <span className="text-xs font-mono text-red-400">{errors.budget}</span>
          )}
        </div>
      </div>

      {/* ── 04 / Travel Themes & Cadence in India ─────────────────────────── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#1c1c23]">
        <div className="flex items-baseline justify-between">
          <label className="font-mono text-[11px] tracking-[0.22em] text-[#cebfdf] uppercase font-semibold">
            04 / TRAVEL CADENCE & EXPERIENCES IN INDIA
          </label>
          <span className="text-[11px] text-[#5c5851] font-mono">
            {selectedInterests.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          {INDIAN_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#432357] text-[#f5f2eb] border-[#7a5293]'
                    : 'bg-[#141418] text-[#9e9a91] border-[#23232c] hover:border-[#32323e] hover:text-[#f5f2eb]'
                }`}
              >
                <span className="text-[11px] font-medium leading-snug block">
                  {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 05 / Transit Mode Selection ──────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#1c1c23]">
        <label className="font-mono text-[11px] tracking-[0.22em] text-[#cebfdf] uppercase font-semibold">
          05 / PREFERRED TRANSIT MODE IN INDIA
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { id: 'Vande Bharat / Express', title: 'Vande Bharat / IRCTC Express', desc: 'Comfortable rail travel between Indian heritage hubs' },
            { id: 'Private AC Chauffeur', title: 'Private AC Chauffeur', desc: 'Door-to-door flexibility with luggage assistance' },
            { id: 'Self-Drive SUV / Enfield', title: 'Self-Drive SUV / Enfield', desc: 'Independent exploration across highway passes' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setTransitMode(mode.id)}
              className={`p-3 text-left border transition-all cursor-pointer ${
                transitMode === mode.id
                  ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                  : 'bg-[#141418] border-[#23232c] text-[#9e9a91] hover:border-[#32323e]'
              }`}
            >
              <span className="font-semibold block">{mode.title}</span>
              <span className="text-[10px] text-[#5c5851] block mt-1">{mode.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 06 / BIGGER AND BETTER PLACED CTA ─────────────────────────────── */}
      <div className="mt-4 pt-6 border-t border-[#23232c] bg-[#111116] border border-[#23232c] p-6 sm:p-8 flex flex-col gap-6 shadow-editorial">
        {/* Real-time calculation summary strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#23232c] gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shrink-0" />
            <span className="text-[#f5f2eb] font-semibold text-sm">
              {destination}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#9e9a91]">
            <span>{numberOfDays} Days</span>
            <span>·</span>
            <span>₹{budget.toLocaleString()} Total</span>
            <span>·</span>
            <span className="text-[#cebfdf]">₹{perDayCost.toLocaleString()} / day</span>
          </div>
        </div>

        {/* Large Prominent CTA Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7a5293]">
              READY TO COMPOSE
            </span>
            <span className="font-serif italic text-sm text-[#9e9a91]">
              Applies geographic clustering, opening windows & local pacing.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-10 bg-[#432357] hover:bg-[#572e70] active:scale-[0.99] border-2 border-[#7a5293] hover:border-[#cebfdf] text-[#f5f2eb] font-mono text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer shadow-editorial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {isLoading ? 'COMPOSING INDIAN ITINERARY...' : 'GENERATE OPTIMIZED INDIAN ITINERARY'}
            </span>
            <span className="text-lg font-serif">→</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default TripForm;
