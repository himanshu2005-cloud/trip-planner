import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  ArrowRight,
  Clock,
  Star,
  Send,
  Navigation,
  Compass,
  Check,
  Flame,
  MessageSquare,
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import { getItineraryForDestination } from '../utils/mockItinerary';

// Trending Indian itineraries for Layla-style cards
const TRENDING_TRIPS = [
  {
    id: 'jaipur',
    destination: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    category: 'Royal Heritage',
    days: 4,
    budget: 24000,
    rating: 4.9,
    reviews: 1420,
    tagline: 'Amber hill fortresses, pink sandstone jharokhas & royal stepwells.',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Panna Meena Kund'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'TripPilot AI Verified',
  },
  {
    id: 'varanasi',
    destination: 'Varanasi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    category: 'Spiritual & Ghats',
    days: 3,
    budget: 15000,
    rating: 4.9,
    reviews: 1890,
    tagline: 'Ancient stone ghats, dawn boat rides on the Ganges & evening Maha Aarti.',
    highlights: ['Assi Ghat Dawn', 'Kashi Vishwanath', 'Sarnath Stupa', 'Dashashwamedh Aarti'],
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'Top Cultural Pick',
  },
  {
    id: 'kerala',
    destination: 'Alleppey & Munnar, Kerala',
    state: 'Kerala',
    category: 'Backwaters & Hills',
    days: 5,
    budget: 38000,
    rating: 4.9,
    reviews: 980,
    tagline: 'Private wooden kettuvallam houseboats, tea estate mist & spice trails.',
    highlights: ['Vembanad Backwaters', 'Munnar Tea Hills', 'Eravikulam Park', 'Fort Kochi Nets'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'Slow Travel Choice',
  },
  {
    id: 'udaipur',
    destination: 'Udaipur, Rajasthan',
    state: 'Rajasthan',
    category: 'Lakes & Palaces',
    days: 4,
    budget: 28000,
    rating: 4.8,
    reviews: 1120,
    tagline: 'The City of Lakes: marble palaces, sunset cruises over Pichola & havelis.',
    highlights: ['City Palace Complex', 'Lake Pichola Cruise', 'Jag Mandir', 'Saheliyon-ki-Bari'],
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'Romantic Heritage',
  },
  {
    id: 'ladakh',
    destination: 'Leh & Nubra Valley, Ladakh',
    state: 'Ladakh',
    category: 'Himalayan Adventures',
    days: 6,
    budget: 45000,
    rating: 4.9,
    reviews: 750,
    tagline: 'High mountain passes, cliffside monasteries & azure Pangong Tso.',
    highlights: ['Thiksey Monastery', 'Pangong Tso', 'Khardung La Pass', 'Hunder Dunes'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'High Altitude Expedition',
  },
  {
    id: 'hampi',
    destination: 'Hampi, Karnataka',
    state: 'Karnataka',
    category: 'Ancient Ruins',
    days: 3,
    budget: 16000,
    rating: 4.8,
    reviews: 840,
    tagline: 'Vijayanagara empire boulders, stone chariots & Tungabhadra coracles.',
    highlights: ['Virupaksha Temple', 'Vittala Stone Chariot', 'Matanga Sunrise', 'Coracle Ride'],
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c05?q=80&w=1200&auto=format&fit=crop',
    curatedBy: 'Archaeology Special',
  },
];

// Quick inspiration prompts for Layla-style input
const INSPIRATION_PROMPTS = [
  { label: '🏰 4 Days in Jaipur Forts', dest: 'Jaipur, Rajasthan', days: 4, budget: 24000, theme: 'Royal Forts' },
  { label: '🛕 3 Days in Varanasi & Ghats', dest: 'Varanasi, Uttar Pradesh', days: 3, budget: 15000, theme: 'Spiritual' },
  { label: '🌴 5 Days Kerala Houseboat & Tea', dest: 'Alleppey & Munnar, Kerala', days: 5, budget: 38000, theme: 'Backwaters' },
  { label: '🏔️ 6 Days Ladakh High Passes', dest: 'Leh & Nubra Valley, Ladakh', days: 6, budget: 45000, theme: 'Himalayas' },
  { label: '🌊 4 Days Udaipur Lakes & Havelis', dest: 'Udaipur, Rajasthan', days: 4, budget: 28000, theme: 'Lakes' },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  // Layla-style conversational prompt bar state
  const [chatPrompt, setChatPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState('All India');

  // Interactive AI Assistant chat preview state
  const [activeDemoPrompt, setActiveDemoPrompt] = useState('food'); // 'food' | 'heat' | 'budget'
  const [activePreviewCity, setActivePreviewCity] = useState('jaipur');
  const [activePreviewDay, setActivePreviewDay] = useState(1);

  const previewTrip =
    TRENDING_TRIPS.find((t) => t.id === activePreviewCity) || TRENDING_TRIPS[0];
  const previewItinerary = getItineraryForDestination(previewTrip.destination);
  const currentDayData =
    previewItinerary.find((d) => d.dayNumber === activePreviewDay) ||
    previewItinerary[0] || { stops: [] };

  const handlePromptSubmit = (e) => {
    e?.preventDefault();
    const query = chatPrompt.trim();
    let matchedDest = 'Jaipur, Rajasthan';
    let matchedDays = 4;
    let matchedBudget = 25000;

    const qLower = query.toLowerCase();
    if (qLower.includes('varanasi') || qLower.includes('banaras') || qLower.includes('kashi')) {
      matchedDest = 'Varanasi, Uttar Pradesh';
      matchedDays = 3;
      matchedBudget = 15000;
    } else if (qLower.includes('kerala') || qLower.includes('munnar') || qLower.includes('alleppey')) {
      matchedDest = 'Alleppey & Munnar, Kerala';
      matchedDays = 5;
      matchedBudget = 38000;
    } else if (qLower.includes('udaipur')) {
      matchedDest = 'Udaipur, Rajasthan';
      matchedDays = 4;
      matchedBudget = 28000;
    } else if (qLower.includes('ladakh') || qLower.includes('leh')) {
      matchedDest = 'Leh & Nubra Valley, Ladakh';
      matchedDays = 6;
      matchedBudget = 45000;
    } else if (qLower.includes('hampi')) {
      matchedDest = 'Hampi, Karnataka';
      matchedDays = 3;
      matchedBudget = 16000;
    }

    navigate('/itinerary', {
      state: {
        criteria: {
          destination: matchedDest,
          numberOfDays: matchedDays,
          budget: matchedBudget,
          interests: ['Curated Exploration', 'Local Culture'],
        },
        generatedData: {
          destination: matchedDest,
          numberOfDays: matchedDays,
          budget: matchedBudget,
          interests: ['Curated Exploration', 'Local Culture'],
          itinerary: getItineraryForDestination(matchedDest),
        },
      },
    });
  };

  const handleLaunchTrip = (trip) => {
    navigate('/itinerary', {
      state: {
        criteria: {
          destination: trip.destination,
          numberOfDays: trip.days,
          budget: trip.budget,
          interests: trip.highlights,
        },
        generatedData: {
          destination: trip.destination,
          numberOfDays: trip.days,
          budget: trip.budget,
          interests: trip.highlights,
          itinerary: getItineraryForDestination(trip.destination),
        },
      },
    });
  };

  const filteredTrips =
    activeCategory === 'All India'
      ? TRENDING_TRIPS
      : TRENDING_TRIPS.filter((t) =>
          t.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          t.state.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="w-full flex flex-col bg-[#0c0c0f] text-[#f5f2eb]">
      {/* ── 1. LAYLA-STYLE CONVERSATIONAL HERO ─────────────────────────────── */}
      <section className="relative w-full pt-16 pb-20 px-6 sm:px-12 lg:px-16 flex flex-col items-center text-center overflow-hidden border-b border-[#1c1c23]">
        {/* Subtle Background Radial Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#6D3FD9]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181822] border border-[#7a5293]/60 text-xs font-mono text-[#cebfdf] mb-8 shadow-sm">
          <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
            <img src="/favicon.svg" alt="TripPilot" className="w-full h-full object-cover scale-[1.3]" />
          </div>
          <span>AI-POWERED TRIP PLANNER FOR INDIA</span>
        </div>

        {/* Large Modern Headline */}
        <h1 className="font-serif-headline text-4xl sm:text-6xl lg:text-7xl text-[#f5f2eb] max-w-4xl tracking-tight leading-[1.08] mb-6">
          Plan Your Dream Trip to India in Seconds.
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#9e9a91] max-w-2xl leading-relaxed mb-10">
          Ask TripPilot anything: destinations, pacing, budget in ₹, and local hidden gems. We sequence every hour with verified Indian coordinates and zero dead mileage.
        </p>

        {/* Sleek Conversational Prompt Bar (Centerpiece like Layla.ai) */}
        <div className="w-full max-w-3xl mb-8">
          <form
            onSubmit={handlePromptSubmit}
            className="w-full bg-[#131317] border border-[#2d2d38] hover:border-[#7a5293] focus-within:border-[#8b5cf6] p-2 sm:p-2.5 rounded-2xl shadow-editorial flex flex-col sm:flex-row items-center gap-2 transition-all duration-200"
          >
            <div className="flex items-center gap-3 w-full px-3 py-2 sm:py-0">
              <Sparkles size={18} className="text-[#a78bfa] shrink-0 animate-pulse" />
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Ask TripPilot: e.g. 4 days in Jaipur with hill forts, stepwells and street food..."
                className="w-full bg-transparent text-[#f5f2eb] placeholder-[#6e6b66] text-sm sm:text-base outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#6D3FD9] hover:bg-[#7c3aed] active:scale-[0.98] text-white font-medium text-xs tracking-wider uppercase transition-all duration-150 shrink-0 shadow-sm cursor-pointer"
            >
              <span>Generate Trip</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Clickable Inspiration Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs font-mono text-[#5c5851] mr-1">TRY:</span>
            {INSPIRATION_PROMPTS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setChatPrompt(`Plan ${p.label.replace(/^[^\s]+\s/, '')}`);
                  handleLaunchTrip({
                    destination: p.dest,
                    days: p.days,
                    budget: p.budget,
                    highlights: [p.theme, 'Heritage', 'Local Transit'],
                  });
                }}
                className="px-3 py-1.5 rounded-full bg-[#16161c] hover:bg-[#1f1f28] border border-[#23232c] hover:border-[#7a5293] text-xs font-sans text-[#cebfdf] transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. LAYLA-STYLE INTERACTIVE CHAT & ITINERARY ASSISTANT WIDGET ────── */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23] bg-[#0f0f14]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] mb-12 gap-3">
            <div>
              <span className="eyebrow block text-[#7a5293]">
                AI CONVERSATIONAL ASSISTANT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
                Refine Your Itinerary Like a Conversation
              </h2>
            </div>
            <span className="font-mono text-xs text-[#9e9a91]">
              NATURAL LANGUAGE · REAL-TIME RE-PACING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Simulated Chat Box (5 cols) */}
            <div className="lg:col-span-5 bg-[#131317] border border-[#23232c] rounded-2xl p-6 flex flex-col justify-between shadow-editorial min-h-[460px]">
              <div className="flex flex-col gap-4">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#1c1c23]">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-900/60 border border-[#7a5293]">
                    <img src="/favicon.svg" alt="TripPilot" className="w-full h-full object-cover scale-[1.3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#f5f2eb]">TripPilot AI Assistant</h4>
                    <span className="text-[10px] text-[#4ade80] flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Online · India Engine
                    </span>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#432357] text-[#f5f2eb] px-4 py-2.5 rounded-2xl rounded-tr-sm text-xs max-w-[85%] font-sans leading-relaxed">
                    "I want 4 days in Jaipur on ₹24,000 budget. Keep mornings slow and add the best street food."
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-[#181820] text-[#e7e3da] border border-[#272733] px-4 py-3 rounded-2xl rounded-tl-sm text-xs max-w-[90%] font-sans leading-relaxed flex flex-col gap-2">
                    <span className="text-[11px] text-[#a78bfa] font-mono font-semibold">
                      ✓ Jaipur 4-Day Itinerary Configured
                    </span>
                    <p>
                      I’ve scheduled Amber Fort at 08:30 to beat tour buses, grouped Jantar Mantar with City Palace, and added an authentic kachori stop at Rawat Mishtan Bhandar.
                    </p>
                  </div>
                </div>

                {/* Prompt modification chips */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-[#5c5851] uppercase">TAP TO TEST RE-PACING:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveDemoPrompt('food')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeDemoPrompt === 'food'
                          ? 'bg-[#6D3FD9] text-white border-[#8b5cf6]'
                          : 'bg-[#181820] text-[#9e9a91] border-[#272733]'
                      }`}
                    >
                      🍽️ Add Street Food Trail
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoPrompt('heat')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeDemoPrompt === 'heat'
                          ? 'bg-[#6D3FD9] text-white border-[#8b5cf6]'
                          : 'bg-[#181820] text-[#9e9a91] border-[#272733]'
                      }`}
                    >
                      ☀️ Avoid Midday 40°C Heat
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoPrompt('budget')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeDemoPrompt === 'budget'
                          ? 'bg-[#6D3FD9] text-white border-[#8b5cf6]'
                          : 'bg-[#181820] text-[#9e9a91] border-[#272733]'
                      }`}
                    >
                      💰 Under ₹18,000 Budget
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="mt-4 pt-3 border-t border-[#1c1c23] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about this trip..."
                  className="w-full bg-[#181820] border border-[#272733] text-xs text-[#f5f2eb] px-3 py-2 rounded-lg outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePromptSubmit();
                  }}
                />
                <button
                  type="button"
                  onClick={handlePromptSubmit}
                  className="p-2 rounded-lg bg-[#6D3FD9] text-white hover:bg-[#7c3aed] transition-colors shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>

            {/* Right: Dynamic Live Result Preview Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#131317] border border-[#23232c] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-editorial">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#23232c] mb-6">
                  <div>
                    <span className="font-mono text-[10px] text-[#7a5293] uppercase tracking-wider font-semibold">
                      LIVE ITINERARY PREVIEW
                    </span>
                    <h3 className="font-serif text-2xl text-[#f5f2eb] mt-0.5">
                      Jaipur: Forts & Havelis Circuit
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#181820] border border-[#272733] text-xs font-mono text-[#cebfdf]">
                    4 Days · ₹24,000 Total
                  </span>
                </div>

                {/* Day Switcher */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setActivePreviewDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        activePreviewDay === d
                          ? 'bg-[#6D3FD9] text-white font-semibold'
                          : 'bg-[#181820] text-[#9e9a91] hover:text-[#f5f2eb]'
                      }`}
                    >
                      Day 0{d}
                    </button>
                  ))}
                </div>

                {/* Stops List */}
                <div className="flex flex-col gap-3 font-sans">
                  {currentDayData.stops?.slice(0, 3).map((stop, idx) => (
                    <div
                      key={stop.name}
                      className="p-3.5 rounded-xl bg-[#181820] border border-[#272733] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#432357] text-[#cebfdf] flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-[#a78bfa]">{stop.startTime}</span>
                            <span className="text-[10px] font-mono text-[#5c5851]">· {stop.duration}m</span>
                          </div>
                          <h5 className="text-sm font-semibold text-[#f5f2eb]">{stop.name}</h5>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-[#4ade80]">
                          {stop.cost === 0 ? 'Free' : `₹${stop.cost?.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-[#1c1c23] flex items-center justify-between">
                <span className="text-xs font-mono text-[#5c5851]">
                  Geographic clustering saves ~3.5 hours transit in Jaipur
                </span>
                <button
                  type="button"
                  onClick={() => handleLaunchTrip(previewTrip)}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#6D3FD9] hover:bg-[#7c3aed] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                >
                  <span>Open Full Itinerary</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TRENDING CURATED ITINERARIES (LAYLA-STYLE VISUAL REEL) ──────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23]">
        <div className="max-w-7xl mx-auto">
          {/* Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#23232c] mb-10 gap-6">
            <div>
              <span className="eyebrow block text-[#7a5293]">
                CURATED EXPEDITIONS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
                Trending Itineraries Across India
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9e9a91] mt-1">
                Handcrafted day-by-day itineraries pre-computed with geographic clustering and verified timings.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {['All India', 'Rajasthan', 'Kerala', 'Himalayas', 'Spiritual'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#6D3FD9] text-white font-medium border border-[#8b5cf6]'
                      : 'bg-[#141418] text-[#9e9a91] border border-[#23232c] hover:border-[#32323e]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => handleLaunchTrip(trip)}
                className="bg-[#131317] border border-[#23232c] hover:border-[#7a5293] rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-editorial cursor-pointer hover:shadow-xl"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#181820]">
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f]/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#0c0c0f]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#f5f2eb]">
                        {trip.days} DAYS
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#0c0c0f]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#facc15] flex items-center gap-1">
                        <Star size={10} className="fill-[#facc15]" /> {trip.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-mono text-[#a78bfa] tracking-wider uppercase font-semibold">
                        {trip.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-serif text-2xl text-[#f5f2eb] group-hover:text-[#cebfdf] transition-colors">
                      {trip.destination}
                    </h3>
                    <p className="font-sans text-xs text-[#9e9a91] leading-relaxed line-clamp-2">
                      {trip.tagline}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {trip.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181820] text-[#9e9a91] border border-[#272733]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-5 pt-3 border-t border-[#1c1c23] flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[9px] text-[#5c5851] uppercase block">BUDGET EST.</span>
                    <span className="text-sm font-semibold text-[#f5f2eb]">
                      ₹{trip.budget.toLocaleString()}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs text-[#cebfdf] group-hover:text-white transition-colors font-semibold">
                    <span>Plan Trip</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY TRIPPILOT / ENGINE HIGHLIGHTS ─────────────────────────────── */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23] bg-[#0f0f14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow block text-[#7a5293] mb-2">PRECISION LOGISTICS</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
              Built Specifically for How Travel Works in India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#131317] border border-[#23232c] p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/40 text-[#a78bfa] flex items-center justify-center mb-1">
                <Navigation size={18} />
              </div>
              <h4 className="font-serif text-xl text-[#f5f2eb]">Algorithmic Clustering</h4>
              <p className="text-xs text-[#9e9a91] leading-relaxed">
                We group nearby monuments geographically to eliminate chaotic rickshaw and cab back-and-forth across crowded Indian cities.
              </p>
            </div>

            <div className="bg-[#131317] border border-[#23232c] p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/40 text-[#a78bfa] flex items-center justify-center mb-1">
                <Clock size={18} />
              </div>
              <h4 className="font-serif text-xl text-[#f5f2eb]">Heat & Monsoon Aware</h4>
              <p className="text-xs text-[#9e9a91] leading-relaxed">
                Automatically adjusts outdoor visits away from intense midday 40°C heat in Rajasthan and swaps monsoon rain for covered palaces in Kerala.
              </p>
            </div>

            <div className="bg-[#131317] border border-[#23232c] p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/40 text-[#a78bfa] flex items-center justify-center mb-1">
                <IndianRupee size={18} />
              </div>
              <h4 className="font-serif text-xl text-[#f5f2eb]">Accurate ₹ INR Budgeting</h4>
              <p className="text-xs text-[#9e9a91] leading-relaxed">
                Calculates real monument passes (ASI tickets), regional thalis, auto-rickshaw fares, and boatmen rates without surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL INVITATION CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 text-center bg-[#0c0c0f]">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <Logo size="lg" className="mb-6" />

          <h2 className="font-serif-headline text-3xl sm:text-5xl text-[#f5f2eb] mb-4">
            Ready to plan your trip across India?
          </h2>
          <p className="text-sm text-[#9e9a91] mb-8 max-w-md leading-relaxed">
            Create an optimized, stress-free day-by-day itinerary tailored to your exact budget and travel style.
          </p>

          <button
            type="button"
            onClick={() => navigate('/plan')}
            className="inline-flex items-center gap-3 py-3.5 px-8 rounded-xl bg-[#6D3FD9] hover:bg-[#7c3aed] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-editorial cursor-pointer"
          >
            <span>Start Planning Your Trip</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
