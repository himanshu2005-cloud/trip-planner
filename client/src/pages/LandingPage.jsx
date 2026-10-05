import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorialImage from '../components/editorial/EditorialImage';
import TravelButton from '../components/editorial/TravelButton';
import Logo from '../components/ui/Logo';

// Curated authentic Indian preview datasets for live home page exploration
const INDIAN_DESTINATIONS = [
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    tagline: 'Ancient ghats, dawn boat rides, silk weavers & evening Ganga Aarti.',
    days: 3,
    budget: 15000,
    bestSeason: 'OCTOBER — MARCH',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000&auto=format&fit=crop',
    waypoints: ['Assi Ghat', 'Kashi Vishwanath', 'Sarnath Stupa', 'Dashashwamedh'],
    interests: ['Spiritual', 'Heritage', 'Silk Weaving', 'Ghats'],
    previewStops: [
      {
        time: '05:30',
        name: 'Assi Ghat & Subah-e-Banaras',
        category: 'Spiritual Sunrise',
        cost: 'Free',
        duration: '90 mins',
        desc: 'Vedic chants and classical morning sitar ragas as the dawn mist lifts over the holy Ganges.',
        photo: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '08:00',
        name: 'Ram Bhandar Traditional Breakfast',
        category: 'Heritage Food',
        cost: '₹150',
        duration: '45 mins',
        desc: 'Freshly fried Banarasi kachori sabzi and hot jalebis served on sal leaf plates in Thatheri Bazaar.',
      },
      {
        time: '10:30',
        name: 'Kashi Vishwanath Sacred Corridor',
        category: 'Ancient Sanctum',
        cost: '₹300',
        duration: '120 mins',
        desc: 'The newly constructed marble corridor linking the river ghats directly to the Jyotirlinga sanctum.',
        photo: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '18:15',
        name: 'Dashashwamedh Ghat Maha Aarti',
        category: 'Evening Spectacle',
        cost: '₹250 (Boat)',
        duration: '90 mins',
        desc: 'Witnessing the grand synchronized brass lamp ceremony from a wooden boat on the river.',
        photo: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'Amber hill fortresses, pink sandstone jharokhas & royal stepwells.',
    days: 4,
    budget: 24000,
    bestSeason: 'NOVEMBER — FEBRUARY',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop',
    waypoints: ['Amber Palace', 'Hawa Mahal', 'City Palace', 'Nahargarh Fort'],
    interests: ['Forts', 'Architecture', 'Royal History', 'Bazaars'],
    previewStops: [
      {
        time: '08:30',
        name: 'Amber Palace (Amer Fort)',
        category: 'UNESCO Royal Fort',
        cost: '₹500',
        duration: '150 mins',
        desc: 'Opulent Rajput fortress overlooking Maota Lake, famous for the mirror-inlaid Sheesh Mahal.',
        photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '11:30',
        name: 'Panna Meena ka Kund Stepwell',
        category: 'Ancient Engineering',
        cost: 'Free',
        duration: '45 mins',
        desc: '16th-century geometric stepwell with interlocking criss-cross yellow sandstone steps.',
      },
      {
        time: '14:00',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Iconic Monument',
        cost: '₹200',
        duration: '60 mins',
        desc: '953 carved sandstone windows capturing natural desert breezes in the heart of the walled city.',
        photo: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '17:00',
        name: 'Nahargarh Fort Sunset Point',
        category: 'Panoramic Ridge',
        cost: '₹200',
        duration: '90 mins',
        desc: 'Sunset over the entire Pink City viewed from the defensive stone ramparts of the Aravalli hills.',
      },
    ],
  },
  {
    id: 'kerala',
    name: 'Alleppey & Munnar',
    state: 'Kerala',
    tagline: 'Misty tea estates, spice trails & slow wooden backwater houseboats.',
    days: 5,
    budget: 38000,
    bestSeason: 'SEPTEMBER — MARCH',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop',
    waypoints: ['Vembanad Lake', 'Munnar Tea Hills', 'Eravikulam', 'Fort Kochi'],
    interests: ['Backwaters', 'Tea Plantations', 'Nature', 'Ayurveda'],
    previewStops: [
      {
        time: '09:00',
        name: 'Private Kettuvallam Houseboat Embarkation',
        category: 'Slow Backwaters',
        cost: '₹4,500',
        duration: '180 mins',
        desc: 'Gliding silently through narrow palm-shaded canals bordered by paddy fields and village life.',
        photo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '13:00',
        name: 'Traditional Karimeen & Rice Thali Lunch',
        category: 'Coastal Feast',
        cost: '₹600',
        duration: '60 mins',
        desc: 'Pearl spot fish cooked in banana leaf with unpolished red matta rice and coconut curries.',
      },
      {
        time: '15:30',
        name: 'Kumarakom Bird Sanctuary Nature Walk',
        category: 'Wetlands',
        cost: '₹150',
        duration: '90 mins',
        desc: 'Walking under canopies of rubber trees and spotting migratory Siberian egrets and kingfishers.',
      },
      {
        time: '18:30',
        name: 'Backwater Sunset over Vembanad Lake',
        category: 'Twilight Golden Hour',
        cost: 'Free',
        duration: '60 mins',
        desc: 'Watching Chinese fishing nets silhouette against violet dusk reflections on the open lake.',
      },
    ],
  },
  {
    id: 'ladakh',
    name: 'Leh & Nubra Valley',
    state: 'Ladakh',
    tagline: 'High Himalayan mountain passes, cliffside monasteries & sand dunes.',
    days: 6,
    budget: 45000,
    bestSeason: 'MAY — SEPTEMBER',
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop',
    waypoints: ['Thiksey Monastery', 'Khardung La Pass', 'Hunder Sand Dunes', 'Pangong Tso'],
    interests: ['Himalayas', 'Monasteries', 'High Altitude', 'Trekking'],
    previewStops: [
      {
        time: '06:00',
        name: 'Thiksey Monastery Morning Puja',
        category: 'Tibetan Chanting',
        cost: '₹100',
        duration: '120 mins',
        desc: 'Deep brass horns echo across the Indus valley during dawn prayers at the 12-storey cliff monastery.',
        photo: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
      },
      {
        time: '10:30',
        name: 'Shey Palace & Giant Shakyamuni Buddha',
        category: 'Historic Kingdom',
        cost: '₹50',
        duration: '75 mins',
        desc: 'Former summer retreat of the Ladakhi kings housing a 12-meter copper and gold Buddha.',
      },
      {
        time: '14:00',
        name: 'Shanti Stupa Panoramic Viewpoint',
        category: 'Peace Stupa',
        cost: 'Free',
        duration: '60 mins',
        desc: 'White-domed Buddhist chorten perched on a steep hill overlooking snowcapped Stok Kangri.',
      },
      {
        time: '17:30',
        name: 'Leh Old Town Heritage Walk & Momos',
        category: 'Bazaar & Food',
        cost: '₹250',
        duration: '90 mins',
        desc: 'Mud-brick alleyways beneath Leh Palace, steaming bowls of Thukpa and butter tea.',
      },
    ],
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  // Quick Trip Planner Form State
  const [selectedCity, setSelectedCity] = useState('Varanasi, Uttar Pradesh');
  const [tripDays, setTripDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState(15000);
  const [travelTheme, setTravelTheme] = useState('Spiritual & Heritage');
  const [transitMode, setTransitMode] = useState('Vande Bharat / Express');

  // Live Itinerary Preview State
  const [previewCityId, setPreviewCityId] = useState('varanasi');
  const [activePreviewDay, setActivePreviewDay] = useState(1);

  // Weather Contingency Simulator State
  const [weatherScenario, setWeatherScenario] = useState('monsoon'); // 'monsoon' | 'summer-heat'

  const activeCityData =
    INDIAN_DESTINATIONS.find((d) => d.id === previewCityId) ||
    INDIAN_DESTINATIONS[0];

  const handleLaunchPlan = () => {
    navigate('/itinerary', {
      state: {
        criteria: {
          destination: selectedCity,
          numberOfDays: tripDays,
          budget: budgetTier,
          interests: [travelTheme, 'Cultural Immersion', 'Local Transit'],
        },
      },
    });
  };

  const handleOpenPreviewTrip = (dest) => {
    navigate('/itinerary', {
      state: {
        criteria: {
          destination: `${dest.name}, ${dest.state}`,
          numberOfDays: dest.days,
          budget: dest.budget,
          interests: dest.interests,
        },
      },
    });
  };

  return (
    <div className="w-full flex flex-col bg-[#0c0c0f] text-[#f5f2eb]">
      {/* ── 1. CINEMATIC HERO: VARANASI / THE SACRED GHATS ────────────────── */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background Atmospheric Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2200&auto=format&fit=crop"
            alt="Varanasi Ghats at Dawn"
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.08] transition-transform duration-1000 scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-[#0c0c0f]/45 to-[#0c0c0f]/30" />
          <div className="absolute inset-0 bg-[#0c0c0f]/20 backdrop-brightness-[0.95]" />
        </div>

        {/* Top Editorial Dispatch Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.12] pb-4 pt-2">
          <div className="flex items-center gap-4">
            {/* Favicon Logo Icon */}
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-purple-900/60 shrink-0">
              <img src="/favicon.svg" alt="TripPilot" className="w-full h-full object-cover scale-[1.3]" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#e7e3da] uppercase">
              INDIA TRAVEL JOURNAL · VOL. I
            </span>
            <span className="hidden sm:inline text-white/30 text-xs font-mono">/</span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] text-[#9e9a91]">
              25.3176° N, 82.9739° E
            </span>
          </div>

          <div className="font-mono text-[10px] tracking-[0.22em] text-[#cebfdf] uppercase">
            BEST EXPEDITION SEASON: OCT — MARCH
          </div>
        </div>

        {/* Center / Hero Typography & Quick Dispatch */}
        <div className="relative z-10 max-w-4xl mt-auto pt-20 pb-8">
          <div className="flex items-baseline gap-3 mb-2 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase text-[#cebfdf]">
            <span>UTTAR PRADESH, INDIA</span>
            <span className="text-[#5c5851]">—</span>
            <span className="text-[#9e9a91]">FEATURED EXPEDITION</span>
          </div>

          <h1 className="font-serif-headline text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#f5f2eb] mb-5">
            Varanasi
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <p className="md:col-span-8 font-serif-subheadline text-xl sm:text-2xl lg:text-3xl text-[#e7e3da] leading-relaxed max-w-2xl">
              "Three days between ancient stone ghats, dawn boat rides, silk weavers, and evening Ganga Aarti."
            </p>

            <div className="md:col-span-4 flex md:justify-end gap-3">
              <TravelButton
                variant="violet"
                arrow
                onClick={() =>
                  navigate('/itinerary', {
                    state: {
                      criteria: {
                        destination: 'Varanasi, Uttar Pradesh',
                        numberOfDays: 3,
                        budget: 15000,
                        interests: ['Spiritual', 'Heritage', 'Silk Weavers'],
                      },
                    },
                  })
                }
              >
                OPEN VARANASI JOURNAL
              </TravelButton>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full h-[1px] bg-white/[0.12]" />
      </section>

      {/* ── 2. INTERACTIVE INDIAN TRIP COMPOSER (ALL OPTIONS & DETAILS DIRECTLY ON MAIN PAGE) ── */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23] bg-[#0f0f14]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Logo Emblem */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] mb-10 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-900/50 border border-[#7a5293]">
                <img src="/favicon.svg" alt="TripPilot" className="w-full h-full object-cover scale-[1.3]" />
              </div>
              <div>
                <span className="eyebrow block text-[#7a5293]">
                  01 / INTERACTIVE PLANNER
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb]">
                  Compose Your Indian Itinerary
                </h2>
              </div>
            </div>
            <span className="font-mono text-[11px] text-[#9e9a91] tracking-wider uppercase">
              ALGORITHMIC ROUTING · ZERO DEAD MILEAGE
            </span>
          </div>

          {/* Complete Options Dashboard Container */}
          <div className="bg-[#131317] border border-[#23232c] p-6 sm:p-10 flex flex-col gap-8 shadow-editorial">
            {/* Row A: Target Destination Selection with Quick Pills */}
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#cebfdf]">
                  TARGET DESTINATION (INDIA ONLY)
                </label>
                <span className="text-[11px] text-[#5c5851] font-mono">
                  Select popular circuit or type custom
                </span>
              </div>

              {/* Direct Input */}
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan or Munnar, Kerala"
                className="editorial-input text-base sm:text-lg bg-[#0c0c0f] border-[#23232c] focus:border-[#7a5293] py-3.5 px-4 text-[#f5f2eb]"
              />

              {/* Quick Destination Pills for India */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Jaipur, Rajasthan',
                  'Varanasi, Uttar Pradesh',
                  'Alleppey & Munnar, Kerala',
                  'Udaipur, Rajasthan',
                  'Leh, Ladakh',
                  'Old Goa & South Beaches',
                  'Hampi, Karnataka',
                  'Rishikesh, Uttarakhand',
                ].map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setSelectedCity(dest)}
                    className={`font-mono text-[11px] px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCity === dest
                        ? 'bg-[#432357] text-[#f5f2eb] border-[#7a5293]'
                        : 'bg-[#18181f] text-[#9e9a91] border-[#23232c] hover:border-[#32323e] hover:text-[#f5f2eb]'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Row B: 3 Columns (Duration, Indian Budget Tier in ₹, Transit Mode) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1c1c23]">
              {/* Duration Options */}
              <div className="flex flex-col gap-2.5">
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9e9a91]">
                  DURATION
                </label>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {[
                    { label: '3 Days', desc: 'Weekend Escape', val: 3 },
                    { label: '5 Days', desc: 'Classic Circuit', val: 5 },
                    { label: '7 Days', desc: 'Deep Heritage', val: 7 },
                    { label: '10 Days', desc: 'Grand Tour', val: 10 },
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => setTripDays(d.val)}
                      className={`p-2.5 text-left border transition-all cursor-pointer ${
                        tripDays === d.val
                          ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                          : 'bg-[#18181f] border-[#23232c] text-[#9e9a91] hover:border-[#32323e]'
                      }`}
                    >
                      <span className="block font-semibold">{d.label}</span>
                      <span className="text-[10px] text-[#5c5851]">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Indian Budget Tiers (₹) */}
              <div className="flex flex-col gap-2.5">
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9e9a91]">
                  BUDGET ESTIMATE (₹ INR)
                </label>
                <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                  {[
                    { label: '₹15,000', tier: 'Backpacker / Budget', desc: 'Hostels, autos, street thalis' },
                    { label: '₹35,000', tier: 'Heritage Haveli Comfort', desc: 'AC cabs, boutique stays, entry passes' },
                    { label: '₹75,000+', tier: 'Royal Luxury Dossier', desc: 'Palace stays, private chauffeur, fine dining' },
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setBudgetTier(parseInt(b.label.replace(/[^\d]/g, '')))}
                      className={`p-2 border text-left flex items-baseline justify-between transition-all cursor-pointer ${
                        budgetTier === parseInt(b.label.replace(/[^\d]/g, ''))
                          ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                          : 'bg-[#18181f] border-[#23232c] text-[#9e9a91] hover:border-[#32323e]'
                      }`}
                    >
                      <div>
                        <span className="font-semibold mr-2">{b.label}</span>
                        <span className="text-[11px] text-[#9e9a91]">{b.tier}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Theme & Transit Mode */}
              <div className="flex flex-col gap-2.5">
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9e9a91]">
                  PRIMARY VIBE & TRANSIT IN INDIA
                </label>
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <select
                    value={travelTheme}
                    onChange={(e) => setTravelTheme(e.target.value)}
                    className="editorial-input bg-[#0c0c0f] border-[#23232c] text-xs py-2.5"
                  >
                    <option value="Spiritual & Ghats">Spiritual, Ghats & Morning Aarti</option>
                    <option value="Royal Forts & Palaces">Royal Forts, Havelis & Stepwells</option>
                    <option value="Backwaters & Spice Hills">Backwaters, Tea Hills & Coast</option>
                    <option value="Himalayan Passes & Monasteries">Himalayan Passes & Monasteries</option>
                    <option value="Culinary & Street Food Bazaars">Culinary, Street Food & Bazaars</option>
                  </select>

                  <select
                    value={transitMode}
                    onChange={(e) => setTransitMode(e.target.value)}
                    className="editorial-input bg-[#0c0c0f] border-[#23232c] text-xs py-2.5"
                  >
                    <option value="Vande Bharat / Express">Vande Bharat Express / Train</option>
                    <option value="Private AC Chauffeur">Private AC Chauffeur / Cab</option>
                    <option value="Self-Drive Royal Enfield">Self-Drive Royal Enfield / SUV</option>
                    <option value="Local Auto & Ferries">Local Auto-Rickshaws & Ferries</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#1c1c23] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs font-mono text-[#5c5851]">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                <span>
                  Estimated: {tripDays} Days · ₹{budgetTier.toLocaleString()} · {transitMode}
                </span>
              </div>

              <TravelButton
                variant="violet"
                arrow
                onClick={handleLaunchPlan}
                className="py-3 px-6 text-xs tracking-[0.16em]"
              >
                GENERATE LIVE INDIAN ITINERARY
              </TravelButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LIVE DAY-BY-DAY ITINERARY PREVIEW DECK (INTERACTIVE ON HOME PAGE) ── */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] mb-10 gap-3">
            <div>
              <span className="eyebrow block text-[#7a5293]">
                02 / LIVE ITINERARY PREVIEW
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
                Explore Curated Indian Days
              </h2>
            </div>

            <TravelButton
              variant="arrow"
              onClick={() => handleOpenPreviewTrip(activeCityData)}
            >
              VIEW FULL {activeCityData.name.toUpperCase()} JOURNAL
            </TravelButton>
          </div>

          {/* Destination Tabs (Varanasi, Jaipur, Kerala, Ladakh) */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 border-b border-[#1c1c23] mb-8 scrollbar-none">
            {INDIAN_DESTINATIONS.map((dest) => {
              const isSelected = previewCityId === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => {
                    setPreviewCityId(dest.id);
                    setActivePreviewDay(1);
                  }}
                  className={`px-4 py-2 border font-mono text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#432357] text-[#f5f2eb] border-[#7a5293]'
                      : 'bg-[#141418] text-[#9e9a91] border-[#23232c] hover:border-[#32323e]'
                  }`}
                >
                  <span>{dest.name}</span>
                  <span className="text-[10px] text-[#5c5851] ml-2">({dest.days}D)</span>
                </button>
              );
            })}
          </div>

          {/* Active Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Visual Journal Stops (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Waypoint Track strip */}
              <div className="p-3.5 bg-[#141418] border border-[#23232c] mb-6 flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-[#9e9a91]">
                <span className="text-[#7a5293] font-semibold uppercase mr-1">WAYPOINTS:</span>
                {activeCityData.waypoints.map((wp, idx) => (
                  <React.Fragment key={wp}>
                    <span className="text-[#f5f2eb] whitespace-nowrap">{`0${idx + 1} ${wp}`}</span>
                    {idx < activeCityData.waypoints.length - 1 && (
                      <span className="text-[#32323e]">───</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Day Header */}
              <div className="flex items-baseline justify-between pb-3 border-b border-[#23232c] mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-[#cebfdf] tracking-widest">
                    DAY 01
                  </span>
                  <span className="text-[#5c5851] font-mono">/</span>
                  <h3 className="font-serif text-2xl text-[#f5f2eb]">
                    {activeCityData.name}, {activeCityData.state}
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-[#9e9a91] uppercase">
                  EST. ₹{Math.round(activeCityData.budget / activeCityData.days).toLocaleString()} / DAY
                </span>
              </div>

              {/* Stops List */}
              <div className="flex flex-col gap-6">
                {activeCityData.previewStops.map((stop, idx) => (
                  <article key={stop.name} className="flex flex-col group">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                      <div className="sm:col-span-3 flex sm:flex-col items-baseline justify-between sm:justify-start gap-1 font-mono">
                        <span className="text-xs text-[#cebfdf] font-semibold">{stop.time}</span>
                        <span className="text-[10px] text-[#5c5851]">{stop.duration} · {stop.cost}</span>
                      </div>

                      <div className="sm:col-span-9 flex flex-col gap-1">
                        <span className="font-sans text-[10px] tracking-wider uppercase text-[#7a5293] font-semibold">
                          {stop.category}
                        </span>
                        <h4 className="font-serif text-xl text-[#f5f2eb] group-hover:text-[#cebfdf] transition-colors">
                          {stop.name}
                        </h4>
                        <p className="font-sans text-[12px] text-[#9e9a91] leading-relaxed">
                          {stop.desc}
                        </p>

                        {stop.photo && (
                          <div className="mt-3 max-w-md">
                            <EditorialImage
                              src={stop.photo}
                              caption={`Impression: ${stop.name}`}
                              location={activeCityData.name}
                              aspectRatio="aspect-[16/9]"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {idx < activeCityData.previewStops.length - 1 && (
                      <div className="w-full h-[1px] bg-[#1c1c23] my-4" />
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Right Column: Destination Cover & Quick Dispatch Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <EditorialImage
                src={activeCityData.heroImage}
                caption={`${activeCityData.name}, ${activeCityData.state}`}
                location={activeCityData.bestSeason}
                figureNumber="PLATE NO. 01"
                aspectRatio="aspect-[4/3] sm:aspect-[4/5]"
              />

              <div className="bg-[#131317] border border-[#23232c] p-6 flex flex-col gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a5293] uppercase font-semibold">
                  EXPEDITION DOSSIER
                </span>
                <p className="font-serif text-lg text-[#f5f2eb]">
                  "{activeCityData.tagline}"
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1c1c23] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#5c5851] uppercase block">OPTIMAL DURATION</span>
                    <span className="text-[#f5f2eb]">{activeCityData.days} Days / {activeCityData.days - 1} Nights</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5c5851] uppercase block">ESTIMATED BUDGET</span>
                    <span className="text-[#cebfdf]">₹{activeCityData.budget.toLocaleString()}</span>
                  </div>
                </div>

                <TravelButton
                  variant="solid"
                  arrow
                  onClick={() => handleOpenPreviewTrip(activeCityData)}
                  className="w-full mt-2 justify-center border-[#7a5293] hover:bg-[#1f1629]"
                >
                  PLAN {activeCityData.name.toUpperCase()} JOURNEY
                </TravelButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WEATHER & MONSOON CONTINGENCY ENGINE (INDIAN CLIMATES) ──────── */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23] bg-[#0f0f14]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] mb-10 gap-3">
            <div>
              <span className="eyebrow block text-[#7a5293]">
                03 / METEOROLOGICAL ENGINE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
                Intelligent Climate Adaptation
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#9e9a91] tracking-wider uppercase">
              MONSOON CONTINGENCIES · SUMMER NOON PEAKS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Scenario Switcher (4 cols) */}
            <div className="lg:col-span-4 bg-[#131317] border border-[#23232c] p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#9e9a91] uppercase block mb-3">
                  SIMULATE INDIAN WEATHER CONTINGENCY
                </span>
                <p className="font-sans text-[13px] text-[#9e9a91] leading-relaxed mb-6">
                  Indian travel often collides with torrential monsoon showers or intense midday heat. TripPilot automatically isolates affected hours and swaps outdoor exposures for covered heritage spaces without ruining the day.
                </p>

                <div className="flex flex-col gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setWeatherScenario('monsoon')}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      weatherScenario === 'monsoon'
                        ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                        : 'bg-[#18181f] border-[#23232c] text-[#9e9a91]'
                    }`}
                  >
                    <span className="block font-semibold">14:00 Kerala Monsoon Downpour</span>
                    <span className="text-[10px] text-[#5c5851]">Western Ghats heavy cloudburst</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeatherScenario('summer-heat')}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      weatherScenario === 'summer-heat'
                        ? 'bg-[#432357] border-[#7a5293] text-[#f5f2eb]'
                        : 'bg-[#18181f] border-[#23232c] text-[#9e9a91]'
                    }`}
                  >
                    <span className="block font-semibold">12:30 Rajasthan Peak Summer Noon (41°C)</span>
                    <span className="text-[10px] text-[#5c5851]">Aravalli open-air stone heatwave</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1c1c23] text-[11px] font-mono text-[#cebfdf]">
                ✓ Live adaptation active across all trip days
              </div>
            </div>

            {/* Simulated Route Change Card (8 cols) */}
            <div className="lg:col-span-8 bg-[#131317] border border-[#23232c] p-6 sm:p-8 flex flex-col justify-between">
              {weatherScenario === 'monsoon' ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#23232c] mb-6">
                    <span className="font-mono text-xs font-semibold text-[#7a5293] uppercase">
                      CASE: ALLEPPEY / FORT KOCHI RAIN SYSTEM
                    </span>
                    <span className="font-mono text-[11px] text-[#4ade80]">
                      AUTO-ADAPTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#18181f] border border-[#23232c]">
                      <span className="font-mono text-[10px] text-[#5c5851] uppercase tracking-wider block mb-2">
                        ORIGINAL OUTDOOR EXPOSURE
                      </span>
                      <h4 className="font-serif text-lg text-[#9e9a91] line-through">
                        Open Canoe Canal Cruise & Village Trek
                      </h4>
                      <p className="text-xs text-[#5c5851] mt-2">
                        Heavy rain forecast would drench travelers in open wooden canoes.
                      </p>
                    </div>

                    <div className="p-4 bg-[#1e1329] border border-[#7a5293]">
                      <span className="font-mono text-[10px] text-[#cebfdf] uppercase tracking-wider block mb-2">
                        OPTIMIZED INDOOR REPLACEMENT
                      </span>
                      <h4 className="font-serif text-lg text-[#f5f2eb]">
                        Mattancherry Dutch Palace & Jew Town Antique Corridors
                      </h4>
                      <p className="text-xs text-[#cebfdf] mt-2">
                        Covered historical murals, museum galleries & sheltered spice warehouse cafes.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#23232c] mb-6">
                    <span className="font-mono text-xs font-semibold text-[#7a5293] uppercase">
                      CASE: JAIPUR DESERT SUN PROTECTION
                    </span>
                    <span className="font-mono text-[11px] text-[#4ade80]">
                      AUTO-ADAPTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#18181f] border border-[#23232c]">
                      <span className="font-mono text-[10px] text-[#5c5851] uppercase tracking-wider block mb-2">
                        UNOPTIMIZED MIDDAY EXPOSURE
                      </span>
                      <h4 className="font-serif text-lg text-[#9e9a91] line-through">
                        Nahargarh Fort Outdoor Ramparts at 13:00
                      </h4>
                      <p className="text-xs text-[#5c5851] mt-2">
                        Exposed stone reflects intense 41°C sunlight with zero tree cover.
                      </p>
                    </div>

                    <div className="p-4 bg-[#1e1329] border border-[#7a5293]">
                      <span className="font-mono text-[10px] text-[#cebfdf] uppercase tracking-wider block mb-2">
                        OPTIMIZED TIMELINE PACING
                      </span>
                      <h4 className="font-serif text-lg text-[#f5f2eb]">
                        Sunrise Nahargarh 06:30 → Noon in City Palace Museum
                      </h4>
                      <p className="text-xs text-[#cebfdf] mt-2">
                        Cool morning breeze on the fort ramparts; noon sheltered in shaded marble courtyards.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-[#1c1c23] flex items-center justify-between text-xs font-mono text-[#5c5851]">
                <span>Pacing engine prevents fatigue across multi-day Indian circuits</span>
                <span className="text-[#cebfdf]">TRIPPILOT EXCLUSIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CURATED INDIAN DESTINATION LIBRARY (DISPATCHES) ────────────── */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 border-b border-[#1c1c23]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] mb-12 gap-3">
            <div>
              <span className="eyebrow block text-[#7a5293]">
                04 / INDIAN DESTINATION LIBRARY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f2eb]">
                Selected Indian Dispatches
              </h2>
            </div>
            <TravelButton variant="arrow" onClick={() => navigate('/explore')}>
              VIEW ALL 28 INDIAN EXPEDITIONS
            </TravelButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDIAN_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="bg-[#131317] border border-[#23232c] hover:border-[#7a5293] p-5 flex flex-col justify-between transition-colors group cursor-pointer"
                onClick={() => handleOpenPreviewTrip(dest)}
              >
                <div>
                  <EditorialImage
                    src={dest.heroImage}
                    caption={dest.name}
                    location={dest.state}
                    aspectRatio="aspect-[4/3]"
                  />
                  <div className="pt-4">
                    <span className="eyebrow text-[#cebfdf]">{dest.state}</span>
                    <h3 className="font-serif text-2xl text-[#f5f2eb] mt-1 group-hover:text-[#cebfdf] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-[12px] text-[#9e9a91] mt-2 line-clamp-2 leading-relaxed">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1c1c23] mt-4 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-[#5c5851] uppercase block">BUDGET</span>
                    <span className="text-[#f5f2eb]">₹{dest.budget.toLocaleString()}</span>
                  </div>
                  <TravelButton variant="arrow">
                    PLAN →
                  </TravelButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL EDITORIAL INVITATION WITH LOGO ──────────────────────── */}
      <section className="py-24 px-6 sm:px-12 text-center bg-[#0a0a0d] border-b border-[#1c1c23]">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <Logo size="lg" className="mb-6" />

          <span className="eyebrow text-[#7a5293] mb-3">
            COMMENCE YOUR INDIAN EXPEDITION
          </span>
          <h2 className="font-serif-headline text-4xl sm:text-5xl text-[#f5f2eb] mb-6">
            Where across India will your next chapter unfold?
          </h2>
          <p className="font-serif-subheadline text-xl text-[#9e9a91] mb-10 max-w-lg">
            From the high passes of Ladakh to the sacred river ghats of Varanasi and Kerala backwaters.
          </p>

          <TravelButton
            variant="violet"
            arrow
            onClick={() => navigate('/plan')}
            className="py-3 px-8 text-xs tracking-[0.18em]"
          >
            START PLANNING YOUR INDIAN TRIP
          </TravelButton>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
