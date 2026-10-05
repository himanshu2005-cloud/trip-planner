import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditorialImage from '../components/editorial/EditorialImage';
import TravelButton from '../components/editorial/TravelButton';
import Logo from '../components/ui/Logo';

const INDIAN_EXPEDITIONS = [
  {
    destination: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    days: 4,
    budget: 24000,
    tagline: 'Amber hill fortresses, pink sandstone jharokhas & royal stepwells.',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Panna Meena Stepwell', 'Nahargarh Fort'],
    rating: 4.9,
    interests: ['Royal Forts', 'Architecture', 'Palaces', 'Bazaars'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
  },
  {
    destination: 'Varanasi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    days: 3,
    budget: 15000,
    tagline: 'The Eternal City: dawn boat rides on the Ganges, Kashi Vishwanath & evening Aarti.',
    highlights: ['Assi Ghat Dawn', 'Kashi Vishwanath Corridor', 'Dashashwamedh Aarti', 'Sarnath Stupa'],
    rating: 4.9,
    interests: ['Spiritual', 'Sacred Ghats', 'Silk Weavers', 'Buddhist Heritage'],
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    destination: 'Alleppey & Munnar, Kerala',
    state: 'Kerala',
    days: 5,
    budget: 38000,
    tagline: 'Misty tea plantation hills, spice trails & slow wooden backwater houseboats.',
    highlights: ['Vembanad Backwaters', 'KDHP Tea Museum', 'Eravikulam Park', 'Fort Kochi Nets'],
    rating: 4.9,
    interests: ['Slow Travel', 'Backwaters', 'Tea Hills', 'Ayurveda'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
  },
  {
    destination: 'Udaipur, Rajasthan',
    state: 'Rajasthan',
    days: 4,
    budget: 28000,
    tagline: 'The City of Lakes: Mewar marble palaces, sunset cruises & traditional havelis.',
    highlights: ['City Palace Udaipur', 'Lake Pichola Sunset', 'Jag Mandir', 'Saheliyon-ki-Bari'],
    rating: 4.8,
    interests: ['Royal Lakes', 'Palaces', 'Heritage Havelis', 'Sunset Cruises'],
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1200&auto=format&fit=crop',
  },
  {
    destination: 'Leh & Nubra Valley, Ladakh',
    state: 'Ladakh',
    days: 6,
    budget: 45000,
    tagline: 'High Himalayan passes, cliffside monasteries & the azure waters of Pangong Tso.',
    highlights: ['Thiksey Monastery', 'Pangong Tso', 'Khardung La Pass', 'Hunder Sand Dunes'],
    rating: 4.9,
    interests: ['Himalayas', 'High Passes', 'Tibetan Culture', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    destination: 'Hampi, Karnataka',
    state: 'Karnataka',
    days: 3,
    budget: 16000,
    tagline: 'The Vijayanagara Empire: balancing granite boulders, stone chariots & river coracles.',
    highlights: ['Virupaksha Temple', 'Vittala Stone Chariot', 'Matanga Hill Sunrise', 'Tungabhadra Coracle'],
    rating: 4.8,
    interests: ['UNESCO Ruins', 'Granite Boulders', 'Ancient Kingdoms', 'Coracle Boats'],
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c05?q=80&w=1200&auto=format&fit=crop',
  },
];

export const ExplorePage = () => {
  const navigate = useNavigate();

  const handleSelectTrip = (trip) => {
    navigate('/itinerary', {
      state: {
        criteria: {
          destination: trip.destination,
          numberOfDays: trip.days,
          budget: trip.budget,
          interests: trip.interests,
        },
      },
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
      {/* Editorial Header */}
      <div className="pb-8 border-b border-[#23232c] mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Logo size="sm" showWordmark={false} />
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase font-semibold">
            INDIA EXPEDITION ARCHIVE · 2027 CURATION
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif-headline text-4xl sm:text-5xl lg:text-6xl text-[#f5f2eb] tracking-tight">
              Explore India
            </h1>
            <p className="font-serif-subheadline text-lg sm:text-xl text-[#9e9a91] mt-2 max-w-2xl leading-relaxed">
              Curated day-by-day itineraries across Rajasthan, Uttar Pradesh, Kerala, Ladakh, and Karnataka — sequenced with zero dead transit time.
            </p>
          </div>

          <div className="font-mono text-xs text-[#5c5851] uppercase tracking-wider">
            <span>6 FEATURED CIRCUITS</span>
            <span className="mx-2">·</span>
            <span>ALL REGIONS VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Grid of Indian Expeditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INDIAN_EXPEDITIONS.map((trip) => (
          <article
            key={trip.destination}
            className="bg-[#131317] border border-[#23232c] hover:border-[#7a5293] transition-colors p-6 flex flex-col justify-between group shadow-editorial cursor-pointer"
            onClick={() => handleSelectTrip(trip)}
          >
            <div>
              {/* Cover Image */}
              <EditorialImage
                src={trip.image}
                caption={trip.destination}
                location={trip.state}
                aspectRatio="aspect-[16/10]"
              />

              <div className="pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="eyebrow text-[#cebfdf]">{trip.days} DAYS</span>
                  <span className="font-mono text-xs text-[#9e9a91]">★ {trip.rating}</span>
                </div>

                <h3 className="font-serif text-2xl text-[#f5f2eb] group-hover:text-[#cebfdf] transition-colors">
                  {trip.destination}
                </h3>

                <p className="font-sans text-[12px] text-[#9e9a91] mt-2 leading-relaxed">
                  {trip.tagline}
                </p>

                {/* Highlights Chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {trip.highlights.slice(0, 3).map((h) => (
                    <span
                      key={h}
                      className="font-mono text-[10px] px-2.5 py-1 bg-[#18181f] text-[#9e9a91] border border-[#23232c]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Ledger & Action CTA */}
            <div className="pt-5 border-t border-[#1c1c23] mt-6 flex items-center justify-between font-mono">
              <div>
                <span className="text-[9px] text-[#5c5851] uppercase tracking-wider block">
                  EST. BUDGET
                </span>
                <span className="text-sm font-semibold text-[#f5f2eb]">
                  ₹{trip.budget.toLocaleString()}
                </span>
              </div>

              <TravelButton variant="solid" arrow>
                VIEW JOURNAL
              </TravelButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
