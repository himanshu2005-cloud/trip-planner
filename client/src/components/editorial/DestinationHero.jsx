import React from 'react';
import { Link } from 'react-router-dom';
import TravelButton from './TravelButton';

/**
 * DestinationHero
 * Dramatic travel hero occupying viewport with minimal typographic overlay.
 * Kinfolk x Monocle style: let imagery and editorial typography do the work.
 */
export const DestinationHero = ({
  city = 'KYOTO',
  country = 'JAPAN',
  tagline = 'Three days between temples, tea houses and quiet streets.',
  dates = '12 — 16 MAY 2027',
  imageUrl = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
  ctaText = 'EXPLORE ITINERARY',
  ctaLink = '/plan',
  coordinates = '35.0116° N, 135.7681° E',
  issueNumber = 'VOL. IV',
}) => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden">
      {/* Background Photography with atmospheric treatment */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05] transition-transform duration-1000 scale-[1.01]"
        />
        {/* Editorial Gradients & Grain Wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-[#0c0c0f]/40 to-[#0c0c0f]/30" />
        <div className="absolute inset-0 bg-[#0c0c0f]/20 backdrop-brightness-[0.95]" />
      </div>

      {/* Top Editorial Dispatch Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.12] pb-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#e7e3da] uppercase">
            {issueNumber} · DISPATCH
          </span>
          <span className="hidden sm:inline text-white/30 text-xs font-mono">/</span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] text-[#9e9a91]">
            {coordinates}
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.25em] text-[#cebfdf] uppercase">
          {dates}
        </div>
      </div>

      {/* Center / Lower Editorial Typography Overlay */}
      <div className="relative z-10 max-w-4xl mt-auto pt-24 pb-6">
        <div className="flex items-baseline gap-3 mb-2 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.3em] uppercase text-[#cebfdf]">
          <span>{country}</span>
          <span className="text-[#5c5851]">—</span>
          <span className="text-[#9e9a91]">FEATURED ITINERARY</span>
        </div>

        <h1 className="font-serif-headline text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#f5f2eb] mb-6">
          {city}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <p className="md:col-span-8 font-serif-subheadline text-xl sm:text-2xl lg:text-3xl text-[#e7e3da] leading-relaxed max-w-2xl">
            "{tagline}"
          </p>

          <div className="md:col-span-4 flex md:justify-end">
            <Link to={ctaLink}>
              <TravelButton variant="solid" arrow className="border-white/20 hover:border-[#7a5293]">
                {ctaText}
              </TravelButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle bottom border line */}
      <div className="relative z-10 w-full h-[1px] bg-white/[0.12]" />
    </section>
  );
};

export default DestinationHero;
