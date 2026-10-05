import React from 'react';
import EditorialImage from './EditorialImage';
import TravelButton from './TravelButton';

/**
 * DestinationSection
 * Magazine spread component:
 * - Editorial location typography
 * - Evocative poetic headline
 * - Curated photography
 * - Numbered narrative chapters (01 THE ESSENTIALS, 02 WHERE TO EAT, 03 WHAT TO SEE, 04 THE SLOW MOMENTS)
 */
export const DestinationSection = ({
  city = 'PARIS',
  country = 'FRANCE',
  headline = 'A city worth getting lost in.',
  description = 'Between cobblestone passages in the Marais and late dusk over the Seine, time slows down to the cadence of coffee and paperbacks.',
  imageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
  chapters = [
    { number: '01', title: 'THE ESSENTIALS', detail: 'Sainte-Chapelle morning light, Jardin du Luxembourg benches, and crossing Pont Neuf on foot.' },
    { number: '02', title: 'WHERE TO EAT', detail: 'Warm sourdough at Du Pain et des Idées, slow bistro lunch near Canal Saint-Martin.' },
    { number: '03', title: 'WHAT TO SEE', detail: 'Musée de l’Orangerie water lilies, quiet courtyards of the Palais-Royal.' },
    { number: '04', title: 'THE SLOW MOMENTS', detail: 'Bookstall browsing along Quai de la Tournelle as lamps flicker on.' },
  ],
  onExplore,
  reversed = false,
}) => {
  return (
    <section className="py-20 lg:py-28 border-b border-[#1c1c23]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Editorial Subhead Dispatch */}
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#23232c]">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase">
              DESTINATION DOSSIER
            </span>
            <span className="text-[#32323e] text-xs">/</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#9e9a91] uppercase">
              {country}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#5c5851] uppercase">
            ISSUE 03
          </span>
        </div>

        {/* Main Asymmetrical Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Typography & Storytelling Column (5 cols) */}
          <div className={`lg:col-span-5 flex flex-col justify-between ${reversed ? 'lg:order-2' : ''}`}>
            <div>
              <span className="font-sans text-[11px] font-medium tracking-[0.3em] uppercase text-[#cebfdf] block mb-2">
                {country}
              </span>
              <h2 className="font-serif-headline text-5xl sm:text-6xl text-[#f5f2eb] mb-6">
                {city}
              </h2>
              <p className="font-serif-subheadline text-2xl sm:text-3xl text-[#e7e3da] leading-snug mb-6">
                "{headline}"
              </p>
              <p className="font-sans text-[13px] leading-relaxed text-[#9e9a91] mb-10">
                {description}
              </p>
            </div>

            {/* Numbered Magazine Chapters */}
            <div className="flex flex-col gap-6 pt-6 border-t border-[#23232c]">
              {chapters.map((ch) => (
                <div key={ch.number} className="flex items-baseline gap-5 group">
                  <span className="font-mono text-[11px] tracking-widest text-[#7a5293] font-semibold">
                    {ch.number}
                  </span>
                  <div>
                    <h3 className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#f5f2eb] group-hover:text-[#cebfdf] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="font-sans text-[12px] text-[#9e9a91] mt-1 leading-relaxed">
                      {ch.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {onExplore && (
              <div className="mt-10 pt-4">
                <TravelButton variant="arrow" onClick={onExplore}>
                  VIEW {city} ITINERARY
                </TravelButton>
              </div>
            )}
          </div>

          {/* Large Atmospheric Photography Column (7 cols) */}
          <div className={`lg:col-span-7 ${reversed ? 'lg:order-1' : ''}`}>
            <EditorialImage
              src={imageUrl}
              caption={`Glimpse: Morning light across ${city}`}
              location={`${city}, ${country}`}
              figureNumber="PLATE NO. 08"
              aspectRatio="aspect-[4/3] sm:aspect-[16/11]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;
